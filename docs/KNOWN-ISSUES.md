# Stratos Ventures — Known Issues & Tech Debt

**Last Updated:** 2026-07-23

Consolidated from `docs/BUG-HISTORY.md` audit findings, feedback memory, and code review.

---

## Critical / High Priority

### ~~P.4 — Worker: No Rate Limiting (FIXED 2026-07-01)~~
- **Fix applied:** Per-IP rate limiting with in-memory sliding window. Yahoo proxy: 30 req/min, D1 API: **600 req/min** (raised from 120 in `608c102` — a legit tracker load is ~55 `/api` requests, so 120 429'd on 3 rapid reloads; Cat 81), proxy: 60/min, auth: 20/min. Returns 429 with `Retry-After` header. Auto-cleanup at 1000+ tracked IPs.

### ~~P.1 — No FMP API Call Budget Tracking (FIXED 2026-07-01)~~
- **Fix applied:** localStorage-persisted daily call counter with auto-reset. Warning toast at 80% (200 calls), hard block at 250 with `rateLimited` return.

### ~~P.2 — No Client-Side Cache in Non-D1 Mode (FIXED 2026-07-01)~~
- **Fix applied:** In-memory TTL cache (`_memCache` Map) for non-D1 mode using same `CACHE_TTLS` as D1 cache. Respects `_forceRefresh` flag.

### ~~P.6 — Worker: Company DELETE Not Transaction-Safe (FIXED 2026-07-01)~~
- **Fix applied:** Notes + company DELETE wrapped in `db.batch()` for atomic execution.

### ~~P.7 — Dividend Fetch Dedup Flag Not in `finally` Block (FIXED 2026-07-01)~~
- **Fix applied:** Entire `fetchAllDividendData` body wrapped in try/finally. Flag reset and button restore in `finally` block.

### ~~P.10 — Web Crypto Without Secure-Context Guard (FIXED 2026-07-01)~~
- **Fix applied:** `deriveKey()` checks `window.isSecureContext` and `crypto.subtle` before use, throws descriptive error.

---

## Security v2 — Deferred Hardening (flagged by deep QA 2026-07-21)

These were surfaced during the Security v2 (Phase A+B) audit and consciously deferred. None is a critical/high hole; all are mitigated by server-side auth enforcement and/or the single-user threat model. Track for Phase C/D.

### SV.1 — Per-isolate in-memory rate limiting (MEDIUM, deferred)
- `checkRateLimit` uses a module-level `Map`, so the `yahoo`/`api`/`proxy` buckets reset per Cloudflare isolate and are trivially bypassed by spreading requests. Only `/auth/login` has durable KV-backed brute-force protection. Mitigation: all rate-limited routes except `/auth/*` require a valid credential, so the blast radius is a credentialed caller (single-user). Fix: back the `proxy`/`api` buckets with KV or a Durable Object. Consider in Phase D.
- **D1-quota note (Cat 81):** the `api` cap was raised 120→600/min so a legit tracker load (~55 `/api` requests) survives rapid reloads. At 600/min sustained a credentialed caller could theoretically burn the Cloudflare free-tier D1 quota faster (read loop ~9.5M reads/day > 5M cap in ~13h; write loop > 100K/day in ~2.8h). This is a self-inflicted, credential-gated risk only — and because this per-isolate limiter never enforced a hard quota-cap anyway (trivially bypassed across isolates), the raise doesn't change the security calculus. The real backstop is Cloudflare's account-level limits. A durable (KV/DO) limiter in Phase D would let a lower per-window cap coexist with the higher legit-burst tolerance.

### SV.2 — Sync key is still root; `/auth/setup` silently overwrites the verifier (LOW-MED, resolving via B3)
- While the sync key exists, a holder can call `/auth/setup` to overwrite the master-password verifier (silent account takeover) — same blast radius the sync key always had, but the password-reset capability is new. Fully resolved when the sync key is retired in **Phase B3** (unblocked — Phase C recovery key + C3 both live).
- **Progress (2026-07-23): B3a + B3b-1 landed (Cat 83).** The client no longer sends the sync key from a provisioned device (token-primary `authDataHeaders`) and the connection-string login (the sync-key entry UI) is removed. The sync key is still a valid root credential on the **Worker** until **B3c** drops the `X-Sync-Key` branch of `authenticate()`, removes `/auth/setup`, and `SYNC_SECRET` is unset. Until B3c, treat the sync key as root.

### SV.3 — No encryption at rest until Phase C (LOW/INFO, by design) — ✅ RESOLVED (C1+C2+C3)
- Was: D1 rows + KV `user_data` plaintext server-side. Resolved across Phase C: C1 envelope (DEK + recovery key), C2 a–d field-level encryption of every sensitive column on write, C3 (`d176a0a`, Cat 82) one-time in-place migration of the pre-C2 plaintext rows + orphan dup-note purge + `/migrate` 403 gate. Residual: localStorage on a trusted device stays plaintext (device-trust posture, accepted); legacy KV `user_data` is retired with the sync key in B3.

### SV.7 — Ciphertext is a CLIENT-enforced invariant; the server never verifies it (MEDIUM until B3, then LOW)
- The worker's batch/CRUD endpoints accept whatever the client sends for sensitive columns — there is no server-side "must be `enc:v1:`" check (the server can't have one for real E2EE anyway: it has no key to validate against semantic correctness, only shape). Enforcement lives in `encStr` (throws when `_encRequired && _dek==null`). Consequences: (a) a stale cached **pre-C2 client** still holding the sync key can re-write plaintext through normal saves until the sync key is retired (**B3**); (b) a device where the envelope exists server-side but `enc_active` was never set locally (never logged in post-C2) writes plaintext through savers until it logs in. The `/migrate` bulk path IS server-gated (403, Cat 82) because it's structural (the worker itself writes the columns). Track: B3 closes (a); (b) self-heals on login and C3 can be re-run (Scan shows any re-poisoned rows).
- Accepted-plaintext columns (documented decisions, not oversights): natural/queryable keys (`companies.symbol/name`, `broker_accounts.name` — conflict targets, can't encrypt without breaking upsert; note an account name like "John's Roth IRA" is mildly personal), `dividend_history.amount` (public per-share), `app_settings/dividend_settings` (customTaxRates — consistent with C2 scope, only `fi_settings` encrypted), tags/trait-checks (labels/booleans), checklist templates (app-defined structure).

### SV.8 — Encrypted restore is MERGE, not replace (C3b planned) (LOW/MEDIUM, disclosed in-app)
- With encryption active, restore-from-backup skips the plaintext `/migrate` (server 403s it anyway) and the restored data reaches D1 encrypted via the normal savers — as **upserts**. Cloud rows absent from the backup are NOT deleted and can reappear after a reload (resurrection), partially undoing a "roll back to backup" intent. The in-app toast (`sync.restoreEncBlocked`) states this. Fix = C3b: an encrypted clear-and-restore flow (authed purge + saver-driven repopulation with id remapping). Until then: for a true replace-restore, restore locally, then manually clear the affected D1 tables (backup first) and let the savers repopulate.

### SV.4 — Production CORS allowlist hardcodes localhost origins (LOW, deferred)
- `ALLOWED_ORIGINS` includes `localhost:8765/8767` + `127.0.0.1` in the production Worker. `authenticate()` still gates every data route, so this grants no data access without credentials. Recommendation: move localhost origins to a dev-only `ALLOWED_ORIGINS` env var. Cosmetic; low priority.

### SV.5 — Bearer token in localStorage (LOW/INFO, accepted)
- `auth_token` is XSS-readable like the sync key always was. Stored SHA-256-hashed server-side, never logged, never in URLs. 180-day TTL. Accepted for a single-user app; revocable via the device manager and revoked on password change.

### SV.6 — `api_cache` stored a plaintext snapshot of encrypted fields (MEDIUM, at-rest) — ✅ RESOLVED (Cat 80)
- Found during the v36 tracker-hydration QA (BUG-HISTORY Cat 79). `api_cache.data_json` for `data_source='stock_data'` was written as a snapshot of the WHOLE client stock object (`_fetchStockDataRaw` → `fetchYahooData` returns the live `tStocks[ticker]`, `cachedFetch` persisted it verbatim with no allowlist), so a cached row held **plaintext** copies of encrypted fields (thesis, notes text, checklist, override values) + client-only state — partially defeating the Security v2 C2 encryption-at-rest for those duplicated values. **Pre-existing** (the cache write path predated C2, unchanged by Cat 79).
- ✅ Read-side mitigation (`d9c4ad6`): `handleCompanyFull` STRIPS these fields from `cachedStock` before returning them in `/full` (`CACHE_STOCK_STRIP` denylist), so the plaintext no longer travels in the response.
- ✅ Write-side fix (Cat 80.1): `cachedFetch` now sanitizes the `stock_data` payload with a fail-closed **allowlist** (`STOCK_CACHE_FIELDS` / `_sanitizeStockCache`) before the `cache-upsert` PUT, so `api_cache` never STORES non-market fields at rest. Verified via node:sqlite round-trip (no private field stored; all market metrics survive store→read→hydrate). `historical_charts` (`{incData,cfData,bsData}`), `dividend_history` (raw FMP), and `insider_transactions` (raw Finnhub array) return clean API payloads — **not** whole-object snapshots — so no equivalent fix needed there.
- ✅ Companion fix (Cat 80.2, QA-caught): the manual tracker fields `moat`/`risk`/`uncertainty`/`conviction`/`expectedReturn`/`pinned` were persisting a D1 reload only *accidentally* via the polluted snapshot (they have no D1 column and were missing from the `loadTrackerStocks` `mergeKeys` rescue). Added to `mergeKeys` so the write-path sanitize doesn't wipe them — now persisted reliably same-device via localStorage merge; cross-device sync deferred to S2.
- ⏳ One-time cleanup PENDING PETER (live D1): existing polluted rows are only overwritten clean when a given stock is next refreshed. Purge all at once with `DELETE FROM api_cache WHERE data_source='stock_data';` (rows self-repopulate clean on next Refresh All — backup first per data-safety). No frontend/worker deploy is required for the cleanup, but the write-side fix itself ships in `web/index.html` (frontend deploy).

---

## Sync Audit — Deferred to S2 Cross-Device Completeness (flagged 2026-07-22)

The 2026-07-22 field-by-field sync audit closed every data-loss and D1-bloat source (see `docs/BUG-HISTORY.md` Category 71). What remains is **cross-device completeness only** — data that is correct on the device that wrote it but doesn't propagate to a second device. None causes data loss on the originating device. Tracked as the **S2** batch in ROADMAP.md.

### SA.1 — localStorage-only fields never reach D1 (MEDIUM, mostly resolved)
- ✅ **S2a-1** (`e8aacb0`): dashboard widget config + screener presets → `app_settings`.
- ✅ **S2a-2** (`aaff465`): `priceAlerts` (encrypted), custom `tags`, idealTrait/avoid checks → 4 new `companies` columns.
- ✅ **S2a-3** (`9c4e6ca`): research-note images → `note_images` table (encrypted, client-minted id upsert).
- ✅ **S2b** (`b8d5778`): RE/bond/cash position detail fields + non-stock positions (see SA.2). **SA.1 fully resolved.**
- **One-time transition caveat (accepted):** because these fields were device-local until now, if a *secondary* device holds trait-checks/tags/alerts the primary device lacks, and the primary saves a company first post-deploy, it writes `'{}'`/`'[]'` and the whole-object last-writer-wins drops the secondary's unsynced values. Mitigation: open + save the device with the richest local state first after deploy so it seeds D1. No merge/tombstone built (single-user, low risk; same class as every other localStorage→D1 migration in this project).

### SA.2 — Non-stock positions don't sync cross-device (RESOLVED → S2b, `b8d5778`)
- ✅ Fixed: real-estate/cash/bond positions now get a synthetic holder-company row (`companies.holder_type`) as their `company_id` anchor, kept in `_holderCompanies` (out of tStocks so they're auto-excluded from all tracker/screener/comparison/dividend views). Their detail fields ride the encrypted `positions.details` JSON column. Pre-existing localStorage-only positions auto-migrate on first load. A ticker can't be both a stock and a non-stock holder (UNIQUE `companies.symbol`) — `savePosition` rejects the collision.

### SA.3 — Cross-device delete-resurrection for framework/override/valuation/note-images (✅ FIXED S2c, `19faaf4`)
- `cc3c9a2` added a Worker natural-key DELETE so a delete propagates to D1, but these types were **hard** deletes (no tombstone) — a second device holding a stale copy could re-upload the row on its next sync, resurrecting it.
- ✅ Fixed: `deleted_at` soft-delete tombstones extended to `framework_entries` / `company_data_overrides` / `valuations` / `note_images` (mirrors notes/reviews). The worker's natural-key DELETE route now `UPDATE … SET deleted_at` (soft) instead of `DELETE` when the table has a `deleted_at` column; by-id deletes PUT `deleted_at`; loads filter tombstoned rows everywhere. Natural-key tables send `deleted_at:null` on live upsert so re-adding the same key un-tombstones it. Same accepted stale-writer window as notes/reviews (device saves before it loads the tombstone); no 30-day trash UI for these four (permanent tombstone). Needs 4 D1 `ALTER` before worker deploy — see BUG-HISTORY Deployment Notes.

### SA.4 — Collision-resistant ID tail (LOW, accepted)
- `_mintId` (`0fc3579`) makes client-minted IDs collision-resistant going forward, but any IDs minted by the old short-random scheme before the fix remain as-is. No migration performed; the residual collision probability on legacy IDs is negligible for a single-user dataset. Accepted.

### SA.5 — Frozen legacy `exchange_rates` rows (LOW, cosmetic)
- `1d31799` fixed the unbounded row growth by pinning `rate_date='latest'`, but historical per-date rows written before the fix are inert clutter in D1. Optional one-line cleanup after any FX refresh: `DELETE FROM exchange_rates WHERE rate_date != 'latest';`. Harmless if left.

---

## Medium Priority

### P.3 — FMP `/profile` Missing Debt/Cash Data (ACCEPTED)
- **Status:** Won't fix — external API limitation. Yahoo Finance data provides debt/cash when available. FMP free tier doesn't expose balance sheet in `/profile`. Separate API call would consume too much quota.

### ~~P.5 — Worker: Yahoo Chart Missing Crumb Auth (FIXED 2026-07-01)~~
- **Fix applied:** Chart endpoint now uses `getCrumb()` for cookie+crumb auth, with 401/403 retry (same pattern as `/quote/`).

### ~~P.8 — Service Worker `skipWaiting()` Unconditional (FIXED 2026-07-01)~~
- **Fix applied:** Removed auto-`skipWaiting()`. New SW waits in `installed` state. User sees "New version available — reload now" toast with click-to-activate.

### ~~P.9 — `chInited` Chart Flag Never Resets (FIXED 2026-07-01)~~
- **Fix applied:** Added `resetCharts()` function, called in `showSection()` when navigating away from companies.

### ~~P.11 — No File Size Limit on Import (FIXED 2026-07-01)~~
- **Fix applied:** 10MB size check added to all 4 FileReader call sites (settings import, backup restore, CSV import, tracker import).

### ~~P.13 — No `fetchStockData` Deduplication (FIXED 2026-07-01)~~
- **Fix applied:** In-flight promise map (`_fetchStockInFlight`). Concurrent calls for the same ticker share one fetch.

### ~~P.14 — `autoSave` Has No Debounce (FIXED 2026-07-01)~~
- **Fix applied:** Proper clearTimeout+setTimeout debounce (300ms) replacing overlapping 100ms setTimeout calls.

---

## Low Priority / Acceptable Risk

### ~~P.12 — Two Inconsistent `parseNum()` Functions (FIXED 2026-07-01)~~
- **Fix applied:** CSV-local version renamed to `csvNum()` (returns NaN for validation). Global `parseNum()` returns 0 for fallback. No more name collision.

### P.15 — `accent-color` Needs Safari 15.4+ (ACCEPTED)
- **Status:** Won't fix — CSS spec limitation. Custom checkbox styling would be disproportionate effort for cosmetic-only issue.

### P.19 — Click-to-Edit Metrics Have Minimal Visual Affordance (DEFERRED)
- **Where:** Company Profile > Key Metrics grid — `cp-overridable` cards are double-click editable
- **Current state:** Has `cursor:pointer` and hover background change, plus "overridden" badge when active. Trigger is double-click (long-press on mobile).
- **Possible improvement:** Add a subtle pencil icon on hover in the card corner. Not urgent — current state is acceptable.
- **Decision:** Reviewed 2026-07-03 — user confirmed current behavior is fine. Tracker table inline edit is intentionally minimal. Revisit if user feedback suggests discoverability is a problem.

### P.16 — `fetch keepalive` Ignored in Firefox 90-99 (ACCEPTED)
- **Status:** Won't fix — browser limitation on 4+ year old Firefox. `sendBeacon()` fallback incompatible with JSON API. D1 mode uses `API.flushAll()`.

### ~~P.17 — `renderPositions` NaN Propagation (FIXED 2026-07-01)~~
- **Fix applied:** `totalPnlPct` guarded with `isFinite()` check, displays '—' instead of 'NaN'.

### ~~P.18 — Screener Filter Score Cache Missing (FIXED 2026-07-01)~~
- **Fix applied:** `_screenerScoreCache` Map caches scores per ticker. Invalidated on `saveTrackerStocks()`.

---

## ~~Deep Audit Findings~~ (ALL FIXED 2026-07-01)

| ID | Problem | Fix |
|----|---------|-----|
| ~~D.1~~ | Screener filter keys in onclick not escaped | All keys/labels escaped with `escH()` |
| ~~D.2~~ | `md.label` in innerHTML without `escH()` | Fixed alongside D.1 — `def.l` → `escH(def.l)` |
| ~~D.3~~ | `parseInt` without radix in 32 locations | Added `,10` radix to all 32 calls |
| ~~D.4~~ | CSV number parsing regex backtracking | Length guard (`s.length>30`) before regex on both `csvNum` and `parseNum` |
| ~~D.5~~ | Portfolio grouping prototype pollution risk | `Object.create(null)` for both grouping Maps |

---

## Development Gotchas

Recurring patterns from past QA sessions. These aren't bugs — they're coding pitfalls that have caused bugs before.

### Visual Verification Required
DOM metrics (scrollWidth, offsetWidth) can report correct values while content is actually clipped or invisible. Browser chrome eats into visible area unpredictably. **Always take screenshots** after layout/overflow fixes rather than trusting JS measurements.

### Bottom Padding on Scrollable Containers
Last widget/item in any scrollable container gets cut off at the viewport or nav boundary without padding. **Always add `padding-bottom: 24px+`** to grid/list containers with dynamic content, especially with fixed bottom nav.

### Cascading Layout Fixes
One overflow fix can cause or mask another. Example: `overflow:hidden` for horizontal scroll (Category 11 fix) masked vertical clipping (Category 13/14). **After any overflow/layout fix, test the full chain:** scroll the entire section at multiple viewports, check both axes, check both ends (top/bottom).

### Transform ≠ Hidden (Safari)
Elements hidden with `transform: translateY(100%)` but still `display: block` render as visible bars in Safari. JS metrics pass because the element is technically displayed. Chrome doesn't render it, so QA misses it. **Use `display: none` as the primary hiding mechanism;** only use `transform` for interactive animation states.

### D1 Data Safety
Peter's D1 database is production-only with no staging environment. All investment data, research notes, and valuations are live. **Before any of these operations, stop and warn:**
- D1 schema changes
- `/api/migrate` calls
- Worker redeploy with schema changes
- Raw SQL via wrangler
- localStorage clearing code

**Safe operations:** HTML/CSS/JS edits, adding columns/tables, `wrangler deploy` (code only).

### Session Scope Discipline
Bundling too many tasks per session (e.g., 9 tasks, ~200 fields) compounds bugs and makes QA/rollback difficult. **Break feature expansions into 2-3 tasks per session max.** Commit and QA after each logical group.

---

## Summary

| Priority | Count | Top Action |
|----------|-------|------------|
| ~~CRITICAL~~ | ~~1~~ | ~~P.4 — FIXED 2026-07-01~~ |
| ~~HIGH~~ | ~~5~~ | ~~P.1/P.2/P.6/P.7/P.10 — ALL FIXED 2026-07-01~~ |
| ~~MEDIUM~~ | ~~6/7~~ | ~~P.5/P.8/P.9/P.11/P.13/P.14 FIXED, P.3 accepted~~ |
| ~~LOW~~ | ~~3/5~~ | ~~P.12/P.17/P.18 FIXED, P.15/P.16 accepted~~ |
| ~~Deep Audit~~ | ~~5~~ | ~~ALL FIXED 2026-07-01~~ |
| Dev Gotchas | 6 | Process discipline, not code fixes |

No active `TODO`, `FIXME`, or `HACK` comments found in the codebase — inline technical debt markers are clean.

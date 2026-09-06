# Stratos Ventures — Known Issues & Tech Debt

**Last Updated:** 2026-08-19

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

### SV.2 — Sync key is still root; `/auth/setup` silently overwrites the verifier — ✅ RESOLVED (B3c)
- **RESOLVED 2026-07-24 (B3c, Cat 85, `2ba0019`, v42).** The sync key is retired: the Worker's `authenticate()` accepts ONLY a master-password device token (`X-Auth-Token`), `POST /auth/setup` is removed, `X-Sync-Key` is dropped from CORS, and Peter unsets the `SYNC_SECRET` secret on deploy. There is no longer a root sync-key credential and no sync-key-gated verifier-overwrite path. Data auth = device token; password change = `/auth/change` (proves current password); lockout backstop = `/auth/recover` (recovery key). **Historical:** while the sync key existed, a holder could call `/auth/setup` to overwrite the master-password verifier (silent takeover) — that path is gone.
- **Progress (2026-07-23): B3a + B3b-1 landed (Cat 83).** The client no longer sends the sync key from a provisioned device (token-primary `authDataHeaders`) and the connection-string login (the sync-key entry UI) is removed. The sync key is still a valid root credential on the **Worker** until **B3c** drops the `X-Sync-Key` branch of `authenticate()`, removes `/auth/setup`, and `SYNC_SECRET` is unset. Until B3c, treat the sync key as root.
- **Progress (2026-07-24): B3b-2 landed (Cat 84, `681354b`, v41).** The legacy client-side encryption system and the legacy KV `/sync` client path are gone; the boot/lock gate now keys solely off the master-password token + envelope DEK. Cosmetic client guards moved from `getSyncKey()` to `hasDataAuth()`. The `X-Sync-Key` fallback in `authDataHeaders` + `/auth/setup` (client `setupMasterPassword`) are intentionally the last client uses of the sync key, retired together with the Worker branch in **B3c**.

### SV.3 — No encryption at rest until Phase C (LOW/INFO, by design) — ✅ RESOLVED (C1+C2+C3)
- Was: D1 rows + KV `user_data` plaintext server-side. Resolved across Phase C: C1 envelope (DEK + recovery key), C2 a–d field-level encryption of every sensitive column on write, C3 (`d176a0a`, Cat 82) one-time in-place migration of the pre-C2 plaintext rows + orphan dup-note purge + `/migrate` 403 gate. Residual: localStorage on a trusted device stays plaintext (device-trust posture, accepted); legacy KV `user_data` is retired with the sync key in B3.

### SV.7 — Ciphertext is a CLIENT-enforced invariant; the server never verifies it (now LOW — B3 closed the sync-key vector)
- The worker's batch/CRUD endpoints accept whatever the client sends for sensitive columns — there is no server-side "must be `enc:v1:`" check (the server can't have one for real E2EE anyway: it has no key to validate against semantic correctness, only shape). Enforcement lives in `encStr` (throws when `_encRequired && _dek==null`). **Downgraded to LOW 2026-07-24 (B3c):** vector (a) is closed — the sync key is retired, so a stale cached pre-C2 client can no longer authenticate at all (token-only), let alone re-write plaintext. Remaining (b): a device where the envelope exists server-side but `enc_active` was never set locally (never logged in post-C2) could write plaintext through savers until it logs in — but any data write now REQUIRES a token, which is obtained by logging in with the master password, which sets `enc_active` and derives the DEK; so the plaintext-writer window is effectively gone. The `/migrate` bulk path IS server-gated (403, Cat 82). Re-running C3 Scan surfaces any residual plaintext rows.
- Accepted-plaintext columns (documented decisions, not oversights): natural/queryable keys (`companies.symbol/name`, `broker_accounts.name` — conflict targets, can't encrypt without breaking upsert; note an account name like "John's Roth IRA" is mildly personal), `dividend_history.amount` (public per-share), `app_settings/dividend_settings` (customTaxRates — consistent with C2 scope, only `fi_settings` encrypted), tags/trait-checks (labels/booleans), checklist templates (app-defined structure).

### SV.8 — Encrypted restore is MERGE, not replace — ✅ RESOLVED (C3b)
- **RESOLVED 2026-07-24 (C3b, Cat 86, `feb4b4b`, v43; needs `wrangler deploy`).** Encrypted restore now REPLACES the cloud: `_c3bClearAndRestore()` calls the new token-authed `POST /api/purge` (clears user-entity tables, children cascade) then re-encrypts + re-inserts the restored local data via the savers (2-phase: companies/accounts → recapture ids → children). No rows survive that aren't in the backup, so the resurrection is gone. Design invariant: the flow never reads D1→local, so a mid-flow failure leaves the local data intact (worst case = D1 incomplete, re-syncs on next save — never data loss). **Historical:** the old behavior upserted without clearing, so cloud rows absent from the backup reappeared after a reload.

### SV.4 — Production CORS allowlist hardcodes localhost origins (LOW, deferred)
- `ALLOWED_ORIGINS` includes `localhost:8765/8767` + `127.0.0.1` in the production Worker. `authenticate()` still gates every data route, so this grants no data access without credentials. Recommendation: move localhost origins to a dev-only `ALLOWED_ORIGINS` env var. Cosmetic; low priority.

### SV.5 — Bearer token in localStorage (LOW/INFO, accepted)
- `auth_token` is XSS-readable like the sync key always was. Stored SHA-256-hashed server-side, never logged, never in URLs. 180-day TTL. Accepted for a single-user app; revocable via the device manager and revoked on password change.

### SV.6 — `api_cache` stored a plaintext snapshot of encrypted fields (MEDIUM, at-rest) — ✅ RESOLVED (Cat 80)
- Found during the v36 tracker-hydration QA (BUG-HISTORY-ARCHIVE Cat 79). `api_cache.data_json` for `data_source='stock_data'` was written as a snapshot of the WHOLE client stock object (`_fetchStockDataRaw` → `fetchYahooData` returns the live `tStocks[ticker]`, `cachedFetch` persisted it verbatim with no allowlist), so a cached row held **plaintext** copies of encrypted fields (thesis, notes text, checklist, override values) + client-only state — partially defeating the Security v2 C2 encryption-at-rest for those duplicated values. **Pre-existing** (the cache write path predated C2, unchanged by Cat 79).
- ✅ Read-side mitigation (`d9c4ad6`): `handleCompanyFull` STRIPS these fields from `cachedStock` before returning them in `/full` (`CACHE_STOCK_STRIP` denylist), so the plaintext no longer travels in the response.
- ✅ Write-side fix (Cat 80.1): `cachedFetch` now sanitizes the `stock_data` payload with a fail-closed **allowlist** (`STOCK_CACHE_FIELDS` / `_sanitizeStockCache`) before the `cache-upsert` PUT, so `api_cache` never STORES non-market fields at rest. Verified via node:sqlite round-trip (no private field stored; all market metrics survive store→read→hydrate). `historical_charts` (`{incData,cfData,bsData}`), `dividend_history` (raw FMP), and `insider_transactions` (raw Finnhub array) return clean API payloads — **not** whole-object snapshots — so no equivalent fix needed there.
- ✅ Companion fix (Cat 80.2, QA-caught): the manual tracker fields `moat`/`risk`/`uncertainty`/`conviction`/`expectedReturn`/`pinned` were persisting a D1 reload only *accidentally* via the polluted snapshot (they have no D1 column and were missing from the `loadTrackerStocks` `mergeKeys` rescue). Added to `mergeKeys` so the write-path sanitize doesn't wipe them — now persisted reliably same-device via localStorage merge; cross-device sync deferred to S2.
- ⏳ One-time cleanup PENDING PETER (live D1): existing polluted rows are only overwritten clean when a given stock is next refreshed. Purge all at once with `DELETE FROM api_cache WHERE data_source='stock_data';` (rows self-repopulate clean on next Refresh All — backup first per data-safety). No frontend/worker deploy is required for the cleanup, but the write-side fix itself ships in `web/index.html` (frontend deploy).

---

## Sync Audit — Deferred to S2 Cross-Device Completeness (flagged 2026-07-22)

The 2026-07-22 field-by-field sync audit closed every data-loss and D1-bloat source (see `docs/BUG-HISTORY-ARCHIVE.md` Category 72). What remains is **cross-device completeness only** — data that is correct on the device that wrote it but doesn't propagate to a second device. None causes data loss on the originating device. Tracked as the **S2** batch in ROADMAP.md.

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

### P.27 — Notes full-text search runs over encrypted content (functional, from Phase-D sweep 2026-07-24)
> Renumbered from P.17 on 2026-08-19 (Cat 106): that ID was already taken by the fixed
> `renderPositions` NaN issue below, and BUG-HISTORY records it under the old meaning. Two live
> entries sharing one ID is the same defect Cat 105 removed from BUG-HISTORY.
- **Status:** Open, accepted trade-off of E2EE. Since Phase C encrypted `notes.title`/`content`, the worker's FTS/LIKE search (`handleNotesSearch`) now matches **ciphertext**, so content search returns nothing useful for encrypted notes. Not a leak (the sweep confirmed no plaintext exposure) — a functionality cost of at-rest encryption. **Fix direction (future):** client-side search (decrypt in memory + filter) since the app already loads all notes, OR a client-maintained encrypted search index. Tracked with [[fmp-api-migration]]/[[backup-safety-net]] as non-security follow-ups.

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

### P.20 — Restored Historical Data Is Stamped Fresh (ACCEPTED, Batch E2 / Cat 96)
- **Where:** `_restoreHistoricalCache` → worker `cache-upsert` sets `fetched_at = datetime('now')`.
- **Effect:** history from an old backup reads as current until its TTL expires (24h charts/dividends, 12h insider). The `fetched_at` captured in the backup file is informational only. The stale-restore auto-refresh (Cat 92) refreshes `stock_data` only, so it never shortens this window.
- **Decision:** intended — the point of the opt-in snapshot is that it works while the APIs are down. Bounded and self-healing after one TTL. Revisit only if a restore is ever used to "freeze" deliberately stale data.

### P.21 — Historical Gather Is One Un-Paginated Request Per Source (LOW, Batch E2 / Cat 96)
- **Where:** `_gatherHistoricalCache` → `api_cache?filter=data_source&filter_value=…&limit=100000`.
- **Risk:** a very large `historical_charts` set could exceed the Worker's response budget → 500 → the whole gather throws.
- **Mitigation in place:** best-effort — the backup is still written, without historical, and the user is warned. Add `offset` pagination if it ever trips.

### P.25 — FMP Free Plan Caps Statements at 5 Years (EXTERNAL, Cat 98)
- **Where:** `fmpFetch` clamps `limit` to `FMP_MAX_LIMIT=5`; above that FMP returns 402 "Premium Query Parameter" and the whole request fails.
- **Effect:** the company Financials charts show 5 years instead of 10. The card title now reports the real span (`comp.historicalTrendsN`) rather than promising 10.
- **Options if 10 years is ever needed:** a paid FMP tier, or sourcing statements from Yahoo `quoteSummary` (which also typically returns ~4–5 years).

### P.26 — Some Tickers Are Unquotable on the FMP US Free Plan (EXTERNAL, Cat 98)
- **Where:** the 52-week-high dip finder. Non-US symbols (`EVO.ST`, `MC.PA`, `KSPI`, …) may return no `quote` row.
- **Mitigation in place:** those symbols are negative-cached (`high52:null`) for the day, so they don't burn one wasted API call on every refresh. The dip finder simply omits them.

### P.23 — Two Tabs Can Create Duplicate Monthly Snapshots (ACCEPTED, Batch C / Cat 97)
- **Where:** `_maybeAutoSnapshot` has no cross-tab lock — two tabs booting in the same second both see "no snapshot this month" before either has written one.
- **Effect:** one harmless duplicate row; retention prunes it eventually. Not worth a lock (a BroadcastChannel/localStorage mutex for a once-a-month background write).

### P.24 — Snapshot Metadata Is Plaintext (ACCEPTED, Batch C)
- **Where:** `backups.created_at / kind / app_version / size_bytes / chunk_count`. Only `label` and `summary` are DEK-encrypted.
- **Effect:** `size_bytes` is a rough dataset-size signal. Negligible next to what the single-tenant DB already exposes (per-table row counts), and the columns are needed unencrypted for listing, sorting and the integrity check.

### P.22 — The Plaintext Backup Has No Historical Option (BY DESIGN, Batch E2)
- **Where:** `downloadBackupPlaintext` uses `_gatherAllData()` directly; only `downloadBackup` (encrypted) offers the checkbox.
- **Decision:** the encrypted download is the default and the intended complete-snapshot path; the plaintext export exists as an escape hatch, not as the archival format.

### ~~P.28 — The Global `t()` Is Shadowed at ~110 Sites (FIXED 2026-09-06, Cat 117, v59)~~
- **Was:** 104 scopes bound a local `t` that shadowed the global i18n `t()`. Nothing broke — **none of them ever called it** — but any line added inside one that did would throw `TypeError: t is not a function`, which had already happened twice (Cat 34's three CRITICAL crashes, and a `t`→`tip` shadow QA caught in the tooltips batch).
- **Fixed by renaming the global, not the locals.** This entry used to prescribe the opposite ("rename to descriptive locals — mechanical, but 110 sites"), and that was the wrong end: it leaves `t` a free name, so the next `.filter(t=>…)` reopens the trap and the entry has to be reopened with it. The global is now **`i18n()`** — 683 sites rewritten at AST byte offsets — and the 104 locals were left untouched, because a local `t` can no longer shadow anything. The class is closed rather than emptied, so no gate check is needed to hold it.
- **The count in this entry was wrong too, in the same way P.29's was.** It said **~110**, split 15/91/4 across three grep patterns. Parsed with `acorn` and scope-resolved: **104**, split 13/90/1. A census of spellings is not a census of scopes. See BUG-HISTORY Cat 117 and CODING-LESSONS § JavaScript #7.

### ~~P.29 — Missing Rates Produce a Plausible Wrong Total, Not a Dash (FIXED 2026-08-27, Cat 116, v58)~~
- **Was:** every foreign-currency total read `convertCurrency(amt, cur, base) || amt`, so with an empty rates table the **raw foreign amount was added to a base-currency sum** — $2 000 landing in a HUF total as 2 000 Ft. It read as a real number and was wrong by the exchange rate.
- **Fixed by** a single accumulator, `baseSum(base)`, which adds only what it could convert and counts what it could not; `.total` is `null` the moment anything is missing, never a partial sum. Callers render `—` (screen) or `N/A` (PDF) and say why **in the tile**, not in a banner two panels away. `takeSnapshot()` refuses outright — it is the only site that *writes* the wrong number.
- **The count in this entry was wrong, and that is the lesson.** It said **16 sites**, measured with `grep -c 'convertCurrency(.*)||'`. The real figure was **34 across 17 functions**: `?? amt` and `isFinite(cv)?…:else if(isFinite(raw))` are the same fallback in different clothes. A further **4** sites mixed currencies without ever calling `convertCurrency()` and so were unreachable by any grep for it. See BUG-HISTORY Cat 116 and CODING-LESSONS § AI Behavioral #14.

### P.30 — Three Process Rules Have No Mechanical Evidence and Cannot Acquire Any (ACCEPTED, Cat 115)
- **Where:** CLAUDE.md § Shipping a Batch steps 5 and 6 (the QA agent ran; the app was opened in a browser) and the schema → `wrangler deploy` → push deploy ordering. `docs/check.sh` states this limit in its own header.
- **Effect:** a green gate certifies the repository, never the process around it. All three are pure self-report by the agent doing the work, so a batch can pass 13 checks while none of the three happened. Cat 115 closed the *adjacent* half — check 10 now verifies that `STATUS.md` is current, not merely correctly shaped — but currency is not truthfulness.
- **Status:** **accepted as permanently unverifiable from inside a repo**, and deliberately written down rather than left as an implied gap: an unstated limit gets read as coverage. The one mitigation that exists is structural — `STATUS.md` § Verified live records only what was actually exercised, kept apart from what was merely reviewed, so an unverified batch has to say so in the handoff. *A rejected fix, recorded so it is not re-proposed: making the docs commit state a QA finding count and having `check.sh` require it. The number would be written by the same agent the check exists to hold to account — ritual, not evidence.*


### ~~P.31 — The Lock Screen Never Follows the Language Setting (FIXED 2026-09-06, Cat 118, v60)~~
- **Was:** `applyI18n()` was called from exactly two sites, `renderDbFiTracker()` and `autoLoad()`, and **both run only after a successful sign-in** — so the sign-in gate, the first screen every user sees, was the one screen the translation system never reached. Ten keys carried complete Hungarian that could never display, the whole `mp.rec.*` recovery flow among them.
- **Fixed by** `document.addEventListener('DOMContentLoaded', applyI18n)`. `#lock-screen` ships `display:none` and is un-hidden from the `window` `load` handler, which the spec orders strictly after `DOMContentLoaded`, so the gate is painted already translated rather than flipping in front of the user.
- **Two more defects in the same function came with it** — `<html lang>` hard-coded `"hu"` against an English default, and `textContent` silently deleting all 12 widget tooltips. See BUG-HISTORY Cat 118.
- **It does not reach first-time users** — see **P.33**, which is the honest remainder of this entry.

### P.32 — `applyI18n()` Destroys the Green Highlight in `settings.d1Connected` (2026-09-06, found in Cat 118)
- **Where:** `index.html:2284`. The source markup is `<p data-i18n="settings.d1Connected"><span style="color:var(--green);font-weight:600">Connected to D1</span> — all data is stored…</p>` — the **only** `[data-i18n]` element with a child element in the source. `applyI18n()` writes `textContent`, which deletes the `<span>`.
- **Effect:** cosmetic and permanent. The paragraph renders as flat unstyled text from the first `applyI18n()` onward; the green "Connected to D1" highlight the markup describes has never been visible after boot. Pre-existing — `autoLoad()` already did this long before Cat 118 touched the function.
- **Status:** deliberately not special-cased. Cat 118 already carved out one exception (the widget tooltip) because a *runtime-injected* child had to survive; adding a second selector for a *static* child would make `applyI18n()` a list of exemptions. **Fix direction:** restructure the string — either split it into two keys (a highlighted status word and a sentence) or drop the inline `<span>` and style the whole paragraph. *An earlier draft of the Cat 118 comment described this destruction as behaviour the node "relies on"; QA caught it. It is damage, not design.*

### P.33 — Nothing on the Sign-In Gate Can Change the Language (ACCEPTED 2026-09-06, Peter's call)
- **Where:** the only two `setLang()` entry points are the sidebar toggle (`index.html:1305`) and `#lang-select` in Settings (`index.html:2351`). Both sit inside `#sidebar` / `#main-content`, which `html.app-locked` hides while the gate is up. Measured on the gate: `#sidebar` computes to `visibility:hidden`, the language button to `offsetWidth === 0`.
- **Effect:** `_lang` falls back to `'en'`, so a **first-time** user — or anyone on a new device, or after clearing site data — gets an English sign-in screen with no control on it to change that. Cat 118 reaches returning users, whose choice is already in `localStorage`, and nobody else. This is the honest limit of that batch.
- **Status: ACCEPTED, not deferred.** Peter decided on 2026-09-06 that the sign-in screen does not get a language toggle. The gate is four labels and a button; the cost of a control there is permanent visual clutter on the app's front door, against a one-time inconvenience for a first-time Hungarian user who reaches Settings within a minute of signing in anyway. **Do not re-propose it** — a fix was designed (reuse `setLang(_lang==='en'?'hu':'en')` inside `#lock-screen`, which sits outside the `app-locked` subtree, no CSS change needed) and declined on product grounds, not on cost.


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

The rows above are a 2026-07-01 snapshot, kept for the record. **Currently open** (nothing critical):
`SV.1`, `SV.4`, `SV.5`, `SV.7` (deferred security hardening) · `SA.1`, `SA.4`, `SA.5` (sync audit
remnants) · `P.3`, `P.15`, `P.16`, `P.19`, `P.20`–`P.26` (accepted or external) · `P.27` (notes
search over ciphertext) · `P.32` (a destroyed highlight) · `P.33` (no language control before
sign-in) · `P.30` (QA pass / browser check /
deploy ordering are unverifiable by any gate). **`P.29` closed 2026-08-27 (Cat 116, v58)** — no
open item can now show a wrong number in a portfolio total. Feature-shaped work lives in
ROADMAP § Technical Debt & Deferred Audit Findings, not here.

No active `TODO`, `FIXME`, or `HACK` comments found in the codebase — inline technical debt markers are clean.

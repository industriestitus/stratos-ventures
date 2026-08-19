# Roadmap — Archive (completed phases and tracks)

Phases 0-18 and the finished feature tracks. **Everything here is done; nothing in this file is a
plan** — it contains no open checkbox, and `docs/check.sh` check 12 fails if one appears. It is kept
because these per-task lists are the most precise surviving record of what each phase actually
shipped: `docs/EXPANSION-PLAN.md` has the specs for phases 11-18 and `docs/BUG-HISTORY-ARCHIVE.md`
has the QA, but the task breakdowns live only here.

The live backlog is in [`ROADMAP.md`](ROADMAP.md): the in-flight process track, § Technical Debt &
Deferred Audit Findings, the Maybe Later sets, and the decisions log.

---

## ✅ COMPLETE: Security v2 Overhaul (2026-07-24)
Goal: single master password, no sync key, server-side API keys, E2E encryption — **all achieved.**
Phases A (server-side API keys), B (master-password auth + sync-key retirement B3a/b/c), C (envelope E2EE + C3 migration + C3b clear-and-restore), D (docs + final security QA) all done. A final holistic adversarial security sweep (2026-07-24) signed off: **zero unauthenticated data routes, no live sync-key credential, fail-safe E2EE, complete endpoint auth coverage, clean secrets hygiene — no must-fix gaps.** Full plan in `memory/project_security-v2-plan.md`.

**Phase A — Server-side API keys**
- [x] A1: Worker `/proxy/fmp/*` + `/proxy/finnhub/*` routes; keys as secrets (FMP_KEY, FINNHUB_KEY); SSRF/traversal/key-injection guards; body-scrub; 60/min rate limit. QA: 3 agents, hardening applied (redirect:manual, case-insensitive strip, Object.hasOwn, body-scrub). (2026-07-21)
- [x] A2: Client FMP/Finnhub/Yahoo calls routed through Worker (proxyFetch + getWorkerUrl); default Worker URL baked in (API.init + getSyncUrl fall back to it); API key fields removed from Settings → "server-side" note; CSP tightened (removed FMP/Finnhub hosts); stale localStorage keys purged on load; proxy regex allows dots/commas for EU tickers + batch. QA: 2 agents (net security improvement, Yahoo-fallback + dotted-ticker fixes applied). localhost:8767 added to Worker CORS. (2026-07-21)

**Phase B — Master password auth, retire sync key**
- [x] B1: Auth backend — `/auth/salt|setup|login|change|devices|revoke`; PBKDF2 600k → HKDF split (authKey/encKey); device tokens (hashed, 180d TTL, revocable); dual-auth (`authenticate()` accepts sync key OR token); per-IP brute-force lockout. Additive/deploy-safe. QA: 2 agents (crypto sound, no bypass/regression); added `/auth/change` for the flagged post-B3 lockout risk. 19/19 flow tests pass; browser↔Node crypto interop verified. (2026-07-21)
- [x] B2: Client UI (a+b+c all done 2026-07-21). B2a: master-password policy (min 10, length-only per user choice) + Settings setup card. B2b: login gate on lock screen (#lock-masterlogin, boot gate, 401→re-login), data path → authDataHeaders() (token OR sync key), token-only devices enter D1 mode. B2c: change-password + device manager (list/revoke, "this device" marker). QA: 6 agents across B2, all findings fixed (incl. token-only D1 init, orphan-device-on-change). Posture: master gate is cosmetic for data access until sync key retired (B3). **Awaiting Peter: deploy Worker + set up master password.**
- [x] B3: Retire the sync key (phased; COMPLETE 2026-07-24). **B3a ✅** (`ce69164`, v39): `authDataHeaders()` token-primary — a provisioned device sends X-Auth-Token alone, sync key only as a no-token fallback; live-verified token-only auth works. **B3b-1 ✅** (`15f2577`, v40): removed the legacy connection-string login (parse/generate/share + #lock-login + loginFromDevice) — redundant with master-password login. 4 QA agents on B3a+B3b-1: all SHIP, 0 defects. **B3b-2 ✅** (`681354b`, v41): removed the legacy client-side encryption system + the legacy KV `/sync` path; boot/lock gate now keys solely off the master-password token + envelope DEK. Kept `deriveKey`/`hashKey`/`recoveryWrapKey` (envelope auth needs them) + the token-authed `/sync/meta` path. All boot paths verified in-browser (never stuck behind hidden `app-locked`); adversarial QA agent = SHIP, 0 defects. Net −521 lines. **B3c ✅** (`2ba0019`, v42): Worker `authenticate()` token-only (X-Sync-Key/SYNC_SECRET branch dropped), removed `/auth/setup` + the legacy KV `/sync/load|save|restore-backup` routes (kept `/sync/meta`), CORS dropped X-Sync-Key; client token-only `authDataHeaders`/`hasDataAuth`, removed `authSetup`/`setupMasterPassword`/`getSyncKey` + the `#st-synckey` field. Adversarial QA = SHIP, 0 defects (no lockout: /auth/login + /auth/recover public, tokens independent of SYNC_SECRET). Deploy: `wrangler deploy` then `wrangler secret delete SYNC_SECRET`. **Phase B (sync-key retirement) COMPLETE.**

**Deep QA before commit (2026-07-21):** 3 cross-cutting agents (holistic security, full-diff correctness, e2e journeys) over the whole A+B change. All journeys pass; no critical/high. 3 fixes applied+tested: `/auth/change` revokes all tokens (stolen-token remediation), worker `corsHeaders`→`cors` 413-guard typo, boot gate shows master-login (not old encryption setup) when worker unreachable on a fresh device. Deferred hardening logged in KNOWN-ISSUES.md (SV.1-SV.5).

**At-rest hardening (out-of-band):**
- [x] SV.6: `api_cache` `stock_data` write-path sanitized — fail-closed market-only allowlist (`STOCK_CACHE_FIELDS`/`_sanitizeStockCache`) before `cache-upsert`, so no plaintext copy of encrypted fields is stored at rest. Cat 80. Frontend-only. **Pending Peter: one-time `DELETE FROM api_cache WHERE data_source='stock_data'` on live D1 (backup first) + `git push`.** (2026-07-23)

**Phase C — E2E encryption (envelope + field-level)**
- [x] C1 (a+b): envelope (random DEK wrapped by encKey + recovery key, atomic in `auth_config`), recovery reset flow with key rotation. Deployed + provisioned in production 2026-07-21.
- [x] C2 (a+b+c+d): field-level encryption of every sensitive column — reviews/valuations/thesis, remaining TEXT cols, notes, REAL numerics via `decNum` — plus FI settings + todo titles (`5bc8b52`). All live in prod.
- [x] C3 (`d176a0a`, sw.js v38, 2026-07-23): one-time migration of pre-C2 plaintext D1 rows → ciphertext (Settings → Data Encryption → Scan/Encrypt, in-place upsert by id + verify pass), purge of orphaned duplicate company-note rows, and a worker 403 gate on `POST /api/migrate` while the envelope exists (plaintext import would undo encryption). 61/61 node:sqlite dry-run on the real code+schema; 2 QA agents SHIP. BUG-HISTORY Cat 82. **Deploy: worker FIRST, then push; Peter runs backup + the in-app migration.**
- [x] C3b: encrypted clear-and-restore flow (`feb4b4b`, v43; needs `wrangler deploy`). Worker `POST /api/purge` (token-authed, FK-cascade clear) + client `_c3bClearAndRestore` (cancel→purge→strip→2-phase re-save, no D1→local read). SV.8 RESOLVED. Adversarial QA = 1 CRITICAL (stale companyId strip) fixed + re-verified.

**Phase B3 — retire sync key** (UNBLOCKED — recovery key live; next after C3 is run in prod)
**Phase D — Cleanup, docs, final security QA** ✅ DONE (2026-07-24)
- [x] Security-model docs refreshed: ADR-039/040/041, ARCHITECTURE §7.1-7.3, API-REFERENCE (token-only + /api/purge, /sync retired), DEPLOYMENT (SYNC_SECRET unset), KNOWN-ISSUES SV.2/3/6/7/8 all resolved/downgraded.
- [x] Final adversarial security sweep — clean sign-off, no must-fix gaps; 4 nice-to-have stale doc/comment cleanups applied (wrangler.toml SYNC_SECRET line, api_cache write-path comment, API-REFERENCE security notes).
- Deferred (pre-existing, non-blocking): SV.1 per-isolate in-memory rate limiting (durable KV limiter is a future nice-to-have; the auth brute-force limiter IS already KV-durable). SV.4 CORS localhost origins. SV.5 bearer token in localStorage (accepted device-trust posture).

---

## Data Sync Audit & Hardening (2026-07-22 → 2026-07-23)
Goal: a field-by-field save/load/cross-device audit (5 QA agents) of every data type flowing between the app, localStorage, and D1. Found ~18 real bugs across two systemic patterns: **client-minted ID collisions** (short random ids overwrote each other cross-device) and **localStorage-only data** (fields silently wiped on reload / never synced). Full findings in `memory/project_sync-audit-2026-07-22.md`. Details of every fix in `docs/BUG-HISTORY.md` **Categories 72-81** (corrected 2026-08-19, Cat 107: this said "Category 71", which is Privacy Mode QA — an off-by-one that sent the reader to the wrong audit entirely).

**Batch 1 — Data-loss stop (all data-destroying bugs)** — COMPLETE
- [x] Reload no longer wipes client-only company fields (scenarios, valuations, DCF overrides) — `6799d0b`
- [x] Checklist content actually reaches D1 (flat-vs-`.answers` shape mismatch) + seed missing `checklist_templates` — `815857d`, `4b7db52`
- [x] Position batch-poison: one bad non-stock position no longer blocks the whole D1 sync — `d58653b`
- [x] Research-note excerpt/comment/action/tags preserved on D1 reload (needed a D1 `ALTER TABLE`, run live 2026-07-23) — `6eaf85a`
- [x] idealTrait/avoid checks + manual tracker data preserved on D1 reload — `8aea7eb`
- [x] Collision-resistant client IDs (`_mintId`) stop cross-device overwrite — `0fc3579`

**Batch 2 — Non-loss hardening (dup growth, plaintext, cross-device delete)** — COMPLETE
- [x] Encrypt FI settings + todo titles at rest (frontend-only) — `5bc8b52`
- [x] Stop duplicate-row growth for `portfolio_snapshots` + `valuations` (natural-key upsert + live D1 dedup/index) — `1231c52`
- [x] Cross-device delete no longer resurrects framework/override/valuation rows — new Worker natural-key DELETE route (`NATURAL_DELETE` allowlist); GET row cap 1000 → 100000 — `cc3c9a2`
- [x] Stop unbounded `exchange_rates` row growth + stale load (fixed `'latest'` rate_date key) — `1d31799`

**Remaining — S2 Cross-Device Completeness** (started; not data-loss, only "shows on device A, not B" gaps)
- [x] **S2a — localStorage-only fields → D1:** each needs a D1 home.
  - [x] S2a-1 (`e8aacb0`): dashboard widget config + screener presets → `app_settings` (via batch upsert; single PUT is UPDATE-only). Boot hydrators + cross-device sync.
  - [x] S2a-2 (`aaff465`, sw.js v31; needs D1 `ALTER` + worker deploy): priceAlerts (encrypted), tags, idealTrait/avoid checks → 4 new nullable TEXT columns on `companies` + batch payload + `_d1CompanyToTStock` load. Bundled the systemic single-PUT→upsert worker fix (app_settings family now works on a fresh account). NULL = never-synced (localStorage fallback); `'{}'`/`'[]'` = cross-device clear wins.
  - [x] S2a-3 (`9c4e6ca`, sw.js v32, frontend-only): research-note images → existing `note_images` D1 table. Client-minted id per image (upsert, no dup growth), image_data+filename encrypted, sort_order preserves markdown `img:N` order, deletion reconcile via `_d1ImageIds` diff. Also fixed a latent bug (D1-mode images were written to `_images` but read from `images` → vanished on reload).
  - [x] RE/bond/cash position detail fields — done as part of S2b (positions.details blob).
- [x] **S2b — non-stock positions cross-device** (`b8d5778`, sw.js v33; needs 2 D1 `ALTER` + worker deploy): RE/cash/bond positions get a synthetic holder-company row (`companies.holder_type`) kept in `_holderCompanies` (out of tStocks → auto-excluded from all tracker/screener/comparison/dividend/search/dashboard views). Position client-only fields ride a new encrypted `positions.details` JSON column (also closes the stock currentPrice/notes gap). Auto-migrates pre-existing localStorage-only non-stock positions on first load. Guard: a ticker can't be both a stock and a non-stock holder (UNIQUE symbol).
- [x] **S2c — soft-delete tombstones** (`19faaf4`, sw.js v34; needs 4 D1 `ALTER` + worker deploy): framework/override/valuation/note_images deletes converted from hard-delete to `deleted_at` tombstones (like notes/reviews) so a stale device can't resurrect them. Worker natural-key DELETE route now soft-deletes when the table has `deleted_at`; by-id deletes PUT `deleted_at`; loads filter tombstones; natural-key tables send `deleted_at:null` on live upsert for re-add. Resolves KNOWN-ISSUES SA.3. **Completes the S2 cross-device block.**
- Suggested order: ~~S2a~~ ✅ → ~~S2b~~ ✅ → ~~S2c~~ ✅ — **S2 DONE.**

**SW-update UX** (small)
- [x] Auto-reload on new Service Worker (`8803d3c`): `controllerchange` → `location.reload()` + auto-`skipWaiting()`, gated on `_swUpdatePending` (never first-install) and `_safeToAutoReload()` (typing / open overlay / lock / pending D1 save → fall back to clickable toast), with a 30s sessionStorage throttle against CDN-propagation reload loops + `visibilitychange`→`reg.update()`. No manual hard reload needed after a deploy.

---

## Completed: Phase 6 — Dividend Module
Status: COMPLETE (2026-06-26)

## Completed: Phase 5 — Dashboard
Status: COMPLETE (2026-06-26)

## Completed: Phase 4 — Portfolio Module
Status: COMPLETE (2026-06-26)

## Completed: Phase 3 — Research & Notes
Status: COMPLETE (2026-06-26)

---

## Phase 0: Foundation & Security (1-2 sessions)
> Get the basics right before building new features.

- [x] Fix security: move hardcoded sync secret to CF Worker env variable
- [x] Fix security: lock CORS to specific origins
- [x] Set up Cloudflare D1 database (replace KV for structured data)
- [x] Design D1 schema (companies, positions, accounts, notes, snapshots, settings) — see docs/d1-schema.sql
- *(not a task — moved to § Maybe Later (Security & Infrastructure), where Zero Trust is tracked as open. It was written as an unticked box with struck-through text, so it could never be ticked and never be closed.)*
- [x] Implement client-side E2E encryption (AES-256-GCM + PBKDF2)
- [x] Recovery key generation and display
- [x] Clean up duplicate files (index.html = valuation.html)
- [x] Add .claudeignore for node_modules, dist, build artifacts

## Phase 1: App Shell & Navigation (1-2 sessions)
> Mobile-responsive shell with proper routing.

- [x] Redesign navigation: sidebar (desktop) / bottom nav (mobile)
- [x] Tab routing: Dashboard, Companies, Portfolio, Research, Framework, Settings
- [x] Company profile page shell (click company → full profile)
- [x] Mobile-responsive layout (touch-friendly, swipeable)
- [x] Loading states and error handling

## Phase 2: Company Profile Page (2-3 sessions)
> The core of the app — everything about a company in one place.

- [x] Integrate existing calculator (DCF, Reverse DCF, ARIA, Money Back)
- [x] Integrate existing tracker data
- [x] Add earnings timeline (Q1, Q2... with checkboxes)
- [x] Add 10K/10Q tracking section
- [x] Add investment thesis / notes section
- [x] Pipeline status (Watchlist → Under review → Buy target → Owned)
- [x] Historical charts (10-30 year revenue, FCF, EPS, margins) from FMP
- [x] Company type tag (slow, medium, fast, cyclical, turnaround, asset)
- [x] Per-company TODO list (analysis tasks, due dates, completion tracking)
- [x] Metric tooltips: hover → definition, formula, calculation, source, benchmark
- [x] Data override: click any metric to override API value (original preserved, "overridden" badge)
- [x] Auto-fill financial thresholds from API (green = meets threshold, red = fails)

## Phase 3: Research & Notes (1-2 sessions)
> Investment journal, news notes, market journal.

- [x] Investment journal: date + ticker + text (why bought/sold)
- [x] Earnings notes: per-company, per-quarter, Markdown
- [x] News notes: date + source + excerpt + comment
- [x] Market journal: macro notes (not company-specific)
- [x] Search across all notes
- [x] Markdown editor (simple, not a full WYSIWYG)
- [x] Image support in notes (paste/upload screenshots, charts, diagrams into company analysis notes)

## Phase 4: Portfolio Module (2-3 sessions)
> Multi-broker, multi-currency portfolio tracking.

- [x] Broker accounts setup (name, currency)
- [x] Positions: ticker + account + shares + avg cost
- [x] CSV/Excel import (IBKR, Degiro formats)
- [x] Manual add/edit/delete positions
- [x] Transaction history: buy/sell/dividend logging
- [x] Multi-currency conversion (live rates)
- [x] Monthly snapshots (manual or auto)
- [x] P&L calculation per position and total
- [x] TWR (time-weighted return) for benchmark comparison
- [x] MWR/XIRR (money-weighted return) for personal performance

## Phase 5: Dashboard (2-3 sessions)
> Portfolio overview, metrics, alerts.

- [x] Portfolio total value with currency conversion
- [x] Pie charts: by ticker, account, currency, asset class, sector
- [x] Terry Smith metrics: weighted P/E, P/S, P/FCF, ROE, ROIC, margins
- [x] Benchmark comparison (S&P 500)
- [x] Red flag alerts (margin drops, debt rises, revenue slows)
- [x] Dip Finder widget
- [x] Financial Independence tracker
- [x] General TODO list (not company-specific — current tasks, reminders)
- [x] TODO summary widget ("X open tasks across Y companies")

## Phase 6: Dividend Module (1 session)
> Dividend tracking and income forecasting.

- [x] Dividend history per company (from FMP + Yahoo)
- [x] Dividend yield, payout ratio, growth rate
- [x] Payment schedule calendar
- [x] Monthly/quarterly income forecast
- [x] Portfolio total dividend income

## Phase 7: Framework & Reviews (2-3 sessions)
> Investment principles, checklists, review templates — your "investing operating system."

### Framework Tab — Your Investing Lens
- [x] Investment principles/approach (GARP, compounding, "buy good companies, don't overpay, do nothing")
- [x] Portfolio rules (sell losers, add to winners, position sizing rules)
- [x] Ideal company traits checklist (30+ traits: moat, organic growth, pricing power, etc.)
- [x] What I avoid / red flags (high R&D, commodity, dual class, acquisition-based growth, etc.)
- [x] Position scoring calculator (CAGR × Conviction × Risk multipliers)

### Per-Company Analysis Checklist (12 sections)
- [x] Company Details section (business model, TAM, revenue split, moat, competitive advantage)
- [x] Moat Analysis section (pricing power, switching costs, network effects, brand)
- [x] Management section (track record, insider ownership, capital allocation, compensation)
- [x] Industry & Competitors section (market share, concentration, barriers to entry)
- [x] Risks section (with status tags: ON TRACK / BROKEN / UNCLEAR)
- [x] Financial Analysis section (auto-fill from API: balance sheet, income, cash flow thresholds)
- [x] Valuation section (DCF, PE, PEG, reverse DCF, money back, ARIA)
- [x] Buy/Sell Decision section (thesis, CAGR, edge, 3 bear arguments, 3 sell triggers)
- [x] Research Sources section (10K, earnings call, investor pres, YouTube, Reddit — checkbox per source)
- [x] Psychology Check section (temperament, conviction, FOMO, patience)
- [x] Quarterly Follow-up section (numbers, news, thesis check, action, timeline view)
- [x] Change Tracking (auto: timestamps, quarter, position size, audit trail — never delete)

### Reviews (separate tab)
- [x] Weekly review template with pre-defined questions (7 questions)
- [x] Monthly review template (portfolio health check, 8 questions)
- [x] Quarterly review template (per-company, 10 questions)

## Phase 8: Stock Scores & Screening (1-2 sessions)
> Auto-calculated scores and filtering.

- [x] Stock Scores: valuation, growth, profitability, health (4-pillar, 0-100 composite, GARP-tuned thresholds)
- [x] Company comparison: side-by-side metrics (unlimited companies, horizontally scrollable modal, ~30 metrics)
- [x] Basic screener with filters (22 filter dimensions, min/max range, pipeline/type dropdowns)
- [x] Insider trading display (from Finnhub) — Finnhub API key in Settings with Test, Insider tab in company profile (summary, key insiders, transaction history with pagination)

## Phase 9: Export, Polish & D1 Migration (2-3 sessions)
> Full data portability, UI polish, and server-side database migration.

### Session 1 — COMPLETE (2026-06-27)
- [x] Hash-based routing with browser back/forward button support (#section + #company/TICKER)
- [x] Data versioning & migration system (SCHEMA_VERSION=8, MIGRATIONS array, auto-upgrade on load)
- [x] JSON full backup/restore (v8 format, restore=overwrite + import=merge, Data Management UI in Settings)
- [x] CSV export (5 files: positions, transactions, notes, reviews, framework — UTF-8 BOM)
- [x] Markdown export (notes + framework)
- [x] QA: 6 bugs fixed (restore rollback, back button routing, CSV escaping, dropdown close, sort mutation, URL revoke)

### Session 2 — COMPLETE (2026-06-27)
- [x] D1 migration: Worker CRUD API endpoints for all 21 tables (generic CRUD + batch upsert)
- [x] Special endpoints: /api/companies/:symbol/full (all child data), /api/notes/search (FTS5), /api/migrate (bulk import)
- [x] Auth (X-Sync-Key) + CORS (PUT/DELETE) + PRAGMA foreign_keys on all /api/* routes
- [x] QA: 8 bugs fixed (filtered count, batch text PK, FTS cascade cleanup, migration error handling, D1 bind limits, missing columns)

### Session 3 — COMPLETE (2026-06-27)
- [x] API client layer (API object with _fetch, get/post/put/del, scheduleSave, flushAll, sendBeacon)
- [x] D1 migration tool UI in Settings (test connection, one-click migrate, progress overlay)
- [x] All 16 load/save function pairs rewritten with D1 API branches
- [x] autoLoad() async: Phase 1 loads companies (builds ID map), Phase 2 loads all else in parallel
- [x] beforeunload flushAll with sendBeacon fallback for reliable page-close saves
- [x] QA: 2 rounds, 20+ bugs fixed (data loss on unload, FK violations, snapshot positions, checklist template mapping, re-migration data clearing, duplicate exchange rates, null company_id filtering)

### QA Sweep — COMPLETE (2026-06-27)
- [x] D1 deletions propagate (API.del in 8 delete functions)
- [x] Valuations/todos no longer duplicate on batch save (id tracking)
- [x] Exchange rates pair format unified for D1 round-trip
- [x] Save failures show user toast + localStorage fallback
- [x] Earnings grid ↔ earnings timeline data sync fixed
- [x] Filings nested format + 10Q mapping on D1 round-trip
- [x] flushAll uses keepalive for reliable page-close saves
- [x] Migration verifies D1 data before enabling d1Mode
- [x] P&L excludes priceless positions from totalCost
- [x] Null guards on snapshot, dividend history, currency conversion

## Completed: Phase 10a — Dark/Light Theme Toggle
Status: COMPLETE (2026-06-27)
- [x] Light theme CSS variables (`[data-theme="light"]` override on `:root`)
- [x] Toggle icon in sidebar header (moon/sun), accessible on every page
- [x] Mobile: toggle in More menu (bottom nav) with label
- [x] Theme persists in localStorage, no flash on reload (early inline script)
- [x] All Chart.js instances update on theme switch (6 registries: calculators, portfolio, dashboard, company, dividend, comparison)
- [x] QA: fixed hardcoded colors in `.st-data` (border, focus color)

## Completed: Phase 10b — PWA Support
Status: COMPLETE (2026-06-27)
- [x] Web App Manifest (manifest.json — name, icons, standalone display, theme color)
- [x] Service Worker (sw.js — cache-first static assets, network-first API calls, auto-update)
- [x] PWA meta tags (apple-touch-icon, apple-mobile-web-app-capable, theme-color)
- [x] PNG icons (192x192, 512x512) with SV branding
- [x] Dynamic theme-color update on dark/light toggle

## Completed: Phase 10c — D1 API Cache
Status: COMPLETE (2026-06-27)
- [x] D1 `api_cache` table: server-side caching of FMP/Finnhub/Yahoo API responses
- [x] Worker endpoints: `GET /api/cache-check/:company_id/:data_source`, `PUT /api/cache-upsert`
- [x] `cachedFetch()` client wrapper with TTL-based expiry (1h stock data, 24h historical/dividends, 12h insider)
- [x] Wired into fetchStockData, fetchHistoricalCharts, fetchDividendHistory, fetchInsiderTrading
- [x] Cache age indicator on company profile ("Data: X hr ago" with color coding)
- [x] Refresh button: force-refreshes all data from APIs (bypasses cache)
- [x] Service worker: caches successful GET API responses for offline fallback
- [x] Online event: auto re-syncs all data to D1 when connection returns
- [x] QA: 6 bugs fixed (clean cache data, Yahoo→stock flow, force-refresh finally block, refresh all data types, simplified online handler, cache age scoped to stock_data)

## Phases 11-18: Expansion Plan
> Deep feature expansion — see [EXPANSION-PLAN.md](EXPANSION-PLAN.md) for full details.
> Status: Phase 18 COMPLETE (2026-07-01) — ALL EXPANSION PHASES DONE
> 8 phases, 34 tasks, ~12-14 sessions

- Phase 11: Checklist deepening (Company Details, Moat, SWOT, Management, Industry, Edge, Anti-Thesis, 10K guide)
- Phase 12: Financial Analysis deepening — ALL COMPLETE ✅ (12.1 Yellow Flags, 12.2 Thresholds 6→22, 12.3 CF Deep Dive 10 metrics, 12.4 BS Deep Dive 11 metrics, 12.5 Tooltips 21 new)
- Phase 13: Valuation calculators — ALL COMPLETE ✅ (Scenario Builder, 10cap, EVA, FCFF toggle, Valuation History)
- Phase 14: Portfolio asset types — ALL COMPLETE ✅ (Real Estate, Bonds enhanced, Cash, Net Worth widget)
- Phase 15: Follow-up & Monitoring — ALL COMPLETE ✅ (Quarterly expansion, Learning Log, Follow Sources, Price Alerts, Sell Trigger dashboard)
- Phase 16: Review & Psychology — ALL COMPLETE ✅ (Psychology questions done in Ph11, Review templates +8 questions, Conviction Tracker timeline chart + badge)
- Phase 17: Expected Return calculator — ALL COMPLETE ✅ (Return breakdown with stacked bar, Position sizing with score/multipliers/Kelly/bar)
- Phase 18: External Links & Earnings Calendar — ALL COMPLETE ✅ (7 research links, FMP earnings calendar widget + per-company grid enhancements)

### Standalone Features (post-expansion)
- [x] PDF Export — per-company research report export (2026-07-01): section chooser dialog, jsPDF lazy-loaded, 10 exportable sections (profile, financials, checklist, valuations, notes, earnings, portfolio, dividends, reviews, todos), Stratos branding header/footer, continuous-flow layout
- [x] Chart PNG Export — hover download button (⤓) on all charts (2026-07-02): canvas-to-PNG with Stratos Ventures logo watermark, MutationObserver auto-injects for dynamic charts, covers DCF projections, allocation pies, benchmark, historical, net worth, dividend forecast
- [x] XLSX Export — SheetJS lazy-loaded, 5-sheet workbook (2026-07-02): Positions (with market value, P&L, P&L%), Transactions, Notes, Reviews, Framework. Auto-sized columns, async with error handling.
- [x] Portfolio Summary PDF — jsPDF portfolio overview report (2026-07-02): Stratos branding, Portfolio Overview (value/cost/P&L/TWR/XIRR), Broker Accounts, Positions table (sorted by value), Allocation by Asset Type, Recent Transactions (last 20), Dividend Income breakdown with per-ticker stats.

### External API Maintenance
- [x] **FMP `/stable` migration** (2026-08-05, v55, Cat 98) — FMP retired the v3 path style and gated `limit>5` behind a paid plan, silently breaking 5 features (company financials, portfolio value/TWR history, SPY benchmark, dividend history, earnings calendar). Endpoints probed live against the account's own key, then migrated: `historical-price-eod/light`, `dividends`, `earnings-calendar`, `quote?symbol=`, statements capped at 5 years. Shape adapters accept both the new flat array and the legacy `{historical:[…]}` wrapper so pre-migration `api_cache` rows still parse. No worker change needed.

### Backup Safety-Net (2026-07-24 → 2026-08-05)
Making the backup a complete, offline-interpretable snapshot of the whole app. One shippable batch at a time, each with an adversarial QA pass + docs.
- [x] **A — Encrypted backup** (v47, Cat 91, ADR-042): passphrase prompt → PBKDF2-600k + AES-256-GCM → `.enc.json`. Default action; plaintext kept behind its own warning. Standalone passphrase (survives a master-password change).
- [x] **B — Restore guardrails + completeness** (v48, Cat 92, ADR-043): auto pre-restore safety backup, richer restore confirm summary, market-metric rehydrate into `api_cache` (fixes the blank tracker after restore), auto-refresh when the backup is >7 days old.
- [x] **D — Awareness + UX polish** (v50, Cat 93): non-destructive "Verify backup", "last backup N days ago" indicator + stale nudge, restore danger cue, 🔒/🔓 affordances.
- [x] **E1a — Offline-readable HTML archive** (v51, Cat 94): self-contained app-styled `.html` with all data, opens in any browser without the app.
- [x] **E1b — Full-dump XLSX + unencrypted-export warning** (v52, Cat 95): 9-sheet workbook; a blocking confirm before every sensitive export.
- [x] **E2 — Opt-in historical data in the backup** (v53, Cat 96): checkbox on the encrypted-backup prompt folds the cache-only history (charts/insider/dividends) into the file and back into `api_cache` on restore — a backup that stays complete even while the APIs are down. Chart `⤓` PNG downloads gated too, so every sensitive download now warns.
- [x] **C — D1 cloud snapshots** (v54, Cat 97): `backups` + `backup_chunks` tables; a full export gzipped + DEK-encrypted + chunked into D1. Automatic monthly snapshot on a clean boot, manual "📸 Snapshot now", newest 12 kept, restore/delete from Settings. `_applyRestore` extracted so file and snapshot restores share one path. **Backup safety-net track COMPLETE.**

### UX Review & Default Tab Fix (2026-07-04)
- [x] UX/investor workflow review — comprehensive audit of user and investor workflows, scored 7.5/10 UX, 8.5/10 investor workflow, 9.5/10 feature completeness
- [x] Companies default tab changed from Calculator to Tracker — more intuitive entry point for new users, sessionStorage preserves last-used tab for returning users
- [x] Back navigation — profile "Back" button returns to originating section (Dashboard/Portfolio/Research/Reviews/Tracker) with i18n labels (EN+HU)
- [x] Dashboard hub links — widget titles link to detail sections (→ arrow, hover effect), allocation chart ticker segments clickable
- [x] Ticker autocomplete — datalist added to Review modal and Calculator ticker inputs for consistent autocomplete across all ticker fields
- [x] Transaction price auto-fill — ticker selection auto-fills current market price with "Current price: X" hint, user can override
- [x] Detailed partial-add toast — shows exactly which data is missing (price/financials/growth) with guidance to add manually in Overview tab
- [x] Transaction ticker cross-link — ticker column in transaction table is now clickable to open company profile (tracker stocks only)
- [x] Screener filter presets — filters persist to localStorage, 4 built-in presets (Quality Growth, Undervalued, Dividend Safe, High Score), user save/load/delete custom presets

### Cross-Module Integration (2026-07-01)
- [x] Archive system — soft delete with "Archived" pipeline stage, archive modal (Archive/Delete permanently/Cancel), tracker toggle, screener filter, D1 CHECK constraint migration
- [x] Portfolio ↔ Pipeline auto-sync — buy triggers Companies "Owned", sell-all triggers "Watchlist", CSV import batch sync, real estate/bond/cash excluded, delete position/transaction triggers check
- [x] Pipeline-based review reminders — 90-day threshold for Owned/Buy target companies, Dashboard widget, company profile badge, auto-refresh after review save
- [x] Company profile summary tab — new default tab with positions, transactions, notes, reviews, sell triggers, TODOs, quick actions, cross-linking
- [x] KNOWN-ISSUES bugfix sweep — 1 CRITICAL + 5 HIGH fixed: Worker rate limiting, FMP budget tracking, non-D1 cache, atomic DELETE, dividend dedup finally, crypto secure context guard

## Completed: Cross-Device Login (2026-07-09)
- [x] Worker: GET/POST /sync/meta endpoints for encryption metadata
- [x] Worker: POST /sync/restore-backup for password change rollback
- [x] Worker: enc_version optimistic locking on /sync/save (409 if stale)
- [x] Lock screen: "Sign in from another device" view (Worker URL + Sync Key + password)
- [x] Lock screen: re-authentication view (password changed on another device)
- [x] Connection string: generate/paste for easy credential transfer between devices
- [x] Safe password change: data first, meta last, restore-backup on failure
- [x] meta_version guard: autoLoad/cloudLoad detect password changes and D1/KV mode switches
- [x] Settings: "Share connection" button
- [x] i18n: 20 new keys EN + HU
- [x] QA: 1 bug found and fixed (cat 68)

### Pre-Production Security Audit — COMPLETE (2026-07-10)
- [x] 185-test QA plan: XSS, SQL injection, auth, encryption, data integrity, PWA, mobile, i18n, accessibility
- [x] 17 bugs fixed (cat 69): CSV formula injection, SW D1 cache, Worker body size limit, dead code, 13 missing escH()
- [x] 4 accepted risks: API keys in URL (API design), encryption skipped (user choice), i18n fallback, Worker 500 on bad JSON
- [x] 15 manual tests documented for user verification (Safari, iOS PWA, encryption lifecycle, cross-device sync)

### Pre-Production Full QA (A+B+C) — COMPLETE (2026-07-10)
- [x] ~175 tests across 3 priority tiers: A (security, data integrity, calculations), B (sync, stress, cross-browser), C (destructive ops, API failures, edge cases)
- [x] 7 bugs fixed (cat 70): parseNum Infinity/% edge cases, KV cloudSave silent failure + retry, 3 missing undo guards (valuation snapshot, dashboard todo, company todo)
- [x] Stress test passed: 31 stocks, 150 tab switches 219KB heap growth, 0 chart/DOM leaks, all APIs graceful on failure
- [x] Cross-browser audit: no Safari-risky APIs, no lookbehind regex, mobile layout clean, all known issues documented

### Privacy Mode — COMPLETE (2026-07-10)
- [x] Eye icon toggle in sidebar + mobile menu (single click to hide, 1.2s long press to reveal)
- [x] Masks all private financial data: portfolio values, share counts, avg cost, P&L amounts, dividend income, net worth, FI tracker, transaction amounts
- [x] Keeps visible: percentages, public company data, DCF/valuation results, chart curve shapes, ticker names, dates
- [x] Chart.js Y-axis and tooltip masking for portfolio value + dividend forecast charts
- [x] Export warning toast when exporting (CSV/XLSX/PDF/backup) in privacy mode
- [x] FI tracker inputs masked + disabled in privacy mode
- [x] State persisted in localStorage across sessions
- [x] i18n: EN + HU translations for all privacy strings
- [x] QA: 4 bugs fixed — syntax error in template literal, mobile long-press handler, FI tracker input leak, allocation chart tooltip leak

# Stratos Ventures — Roadmap

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
- [ ] ~~Set up Cloudflare Access (Zero Trust)~~ — moved to Phase 10 (needs custom domain)
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

### Process & Docs Hygiene (2026-08-05, Cat 100)
Four-agent process audit — is the handoff process defined, does the docs policy actually hold?
- [x] **Handoff process defined** (CLAUDE.md § Session Status & Handoff) — one `memory/STATUS.md`, rewritten in place, five required sections. It had never been written down anywhere; each handoff reinvented its own format.
- [x] **Unwritten-but-followed rules recorded** (CLAUDE.md § Shipping a Batch, § Git) — conventional prefixes, the `(vNN)` suffix, `APP_VERSION`+`sw.js` lockstep, schema→worker→frontend deploy order. Dropped "branch per major feature" (0 of 239 commits ever used it).
- [x] **`docs/check.sh`** — 10 mechanical checks so the hand-maintained facts stop drifting. Fails closed.
- [x] **DEPLOYMENT.md P0** — it prescribed the retired `X-Sync-Key` auth header, listed removed routes, and omitted the mandatory deploy ordering. Rewritten against the Worker source.
- [x] **CLAUDE.md counters** (2026-08-19, Cat 101) — all 8 were wrong (ADRs, tables, fixes, categories, lessons, line count, cache name, dev port). The two slow-moving ones were corrected; the five that change every batch or commit were **removed** rather than repaired, because a claim that goes stale every batch turns the gate permanently red and trains people to bypass it. `check.sh` guards re-introduction, and check 5 now verifies CODING-LESSONS against itself instead of forcing it to restate BUG-HISTORY's numbers.
- [x] **`check.sh` check 9 rebuilt** (2026-08-19, Cat 101) — the "is the local key in git history" test lost its input when the key was deleted and degraded to a silent "skipped". Replaced by a scan of recent commits across all branches for key-shaped literals, sharing one pattern with the working-tree scan.
- [x] **BUG-HISTORY integrity** (2026-08-19, Cat 105) — 4 categories were documented but absent from the index (12/13/34/61, incl. the one CODING-LESSONS cites for the `t()`-shadowing rule); 3 sections had their numbers reused by later batches and were renumbered 102-104; 2 rows carried a placeholder instead of a commit hash, both recovered from git. The running total is now derived from the table rather than typed by hand. The 11 "missing body sections" turned out not to be a defect — the check was asking a one-directional question in both directions, and was corrected.
- [x] **Orphaned `.txt` dumps** (2026-08-19, Cat 106) — six one-off audit files plus `DOCUMENTATION-PLAN.pdf` held **32 items tracked nowhere else**, twice the ~16 estimated. Migrated to § Technical Debt & Deferred Audit Findings below, then all seven files deleted. The PDF turned out to be a fully executed plan (every document it proposed exists) and carried no open items — but it named three real docs missing from CLAUDE.md's file tree, so `check.sh` gained check 11 to keep that tree honest.
- [x] **Stale git worktree** (2026-08-19, Cat 106) — `.claude/worktrees/sleepy-jennings-5aafbd` removed. Its one unmerged commit `61cfc5e` (D1 checklist sync) was checked before deleting: all three of its fixes were independently re-made on `main` by `815857d` (flat-vs-`.answers` shape, via the `_sectionAnswers` helper that handles both) and `4b7db52` (seeding missing `checklist_templates`, via batch upsert + re-fetch). Nothing was lost.
- [x] **Memory consolidation** (2026-08-19, Cat 107) — **58 files → 30**, and `MEMORY.md` (the only file loaded every session) **12 801 → 4 721 bytes, −63%**, longest line 2 171 → 169 chars. It had become a document rather than an index. **11** stale pending-markers across 3 files are cleared, each with its evidence recorded rather than just deleted — 5 of them had been invisible to `check.sh`'s case-sensitive guard, its third fail-open. Only **3** files were actually deleted — pure pointers whose numbers had gone wrong (one claimed "430+ bugs across 71 categories" against a real 574/106); the other 27 were **consolidated, not discarded**, because the audit found they hold QA detail that exists nowhere else: `BUG-HISTORY.md` starts 2026-06-27, *after* phases 0-5 were already QA'd, and eleven of its categories are a summary row with no body section. Also fixed: 7 dangling `[[links]]`, a retired `SYNC_SECRET` and `Sync Key` still documented as live, "17 tables" against a real 24, and a pointer to a handoff file that was never written.
- [ ] **Archiving + missing ADRs** — split BUG-HISTORY (keep summary table + last ~15 categories + Deployment Notes hot) and ROADMAP (completed phases → archive); write the 2 ADRs that were skipped: D1 cloud snapshots and the FMP `/stable` migration.
- [ ] **Final: end-to-end process review + presentation** — once the cleanup batches are done, re-run the audit from scratch against the new end state, verify every rule now holds, and present it to Peter: what the process looks like now, what it costs per session, where it still leaks, plus concrete optimisation and improvement options (automation depth, what to measure, what to drop). Deliverable is a presentation for Peter, not another doc dump.

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

## Phase 10: Optional / Future
> Nice-to-have features, add when needed.

- [ ] Notifications — Push notifications for price alerts and dividend dates via Service Worker + Cloudflare Worker cron trigger. Requires: Web Push API subscription management, Worker cron (free: 5/worker) for background price checks, VAPID keys. In-app alerts (toasts, dashboard widgets, red flags) already complete. ~2-3 sessions.
- [ ] Google Drive migration tool (manual export/import sufficient for now)
### Maybe Later (Integrations)
- [ ] Brokerage sync (SnapTrade or similar) — automatikus pozíció import brókerből. SnapTrade $100-500/hó (nincs free tier), Plaid/Finicity szintén fizetős és US-focused. CSV import (már kész) gyakorlatilag elég, kézi futtatás havonta egyszer.
### Maybe Later (AI & Analysis)
- [ ] AI analysis via Claude API (company summaries, Q&A) — Haiku 4.5 ($1/$5 per 1M token) elég összefoglalókhoz, Sonnet mélyebb elemzéshez. Havi ~$5-15 költség 10-20 query/nap mellett. CF Worker proxy-n keresztül, API key env variable-ként.
### Maybe Later (Security & Infrastructure)
- [ ] Cloudflare Zero Trust — login screen a teljes site elé (email + one-time PIN auth már konfigurálva a stratosventures team-ben, de custom domain kell az élesítéshez, ~$10/yr). Előnyök: site-szintű hozzáférés-védelem, Worker API extra réteg, session kezelés, audit log. Ingyenes.
- [ ] localStorage encryption at rest (AES-256 for local data, not just cloud sync)
- [ ] Cloud sync conflict resolution (merge strategy instead of last-write-wins)
- [ ] Multi-tab localStorage sync (StorageEvent listener to prevent stale reads)

### Maybe Later (UX)
- [ ] Welcome wizard / guided setup — 3-4 lépéses onboarding új felhasználóknak (API kulcsok → első cég → első pozíció → dashboard). Csak első alkalommal jelenik meg. ~2-3 óra.
- [ ] Weekly focus dashboard widget — összevont heti teendő widget (earnings, review-k, TODO-k, price alert-ek egy helyen). Kényelmi feature, az adatok már most is elérhetők külön widgetekben.

### Maybe Later (Market & Timing Tools — Forecaster.biz inspiráció)
- [ ] Seasonality elemzés — 30 évre visszamenő szezonális minták, win rate, átlagos hozam hónapokra bontva. Forecaster fő USP-je. Value investinghez is hasznos (mikor érdemes pozíciót nyitni).
- [ ] Pattern matching (mintafelismerés) — historikus ármozgás-minták alapján bullish/bearish forgatókönyvek becslése, valószínűségekkel. AI/ML alapú, komoly fejlesztés.
- [ ] Quantum Screener — szezonalitás + pattern matching kombinált screener, globális instrumentumokra. Szezonalitás kell hozzá előbb.
- [ ] Sector Map (szektorrotáció) — gazdasági ciklus fázisok szektoronként, Consumer Cyclical vs Defensive, divergencia-jelzések. Terry Smith dashboard mellé illene.
- [ ] Market Mood Indicator — befektetői sentiment (FOMO → pánik skála), piaci csúcs/mélypont jelzések. Fear & Greed Index-hez hasonló.
- [ ] COT Report (Commitment of Traders) — futures pozíciók, piaci sentiment, szintetikus forex COT reportok. Főleg forex/commodity tradereknek.
- [ ] US Government Tracker — amerikai politikusok részvénytranzakcióinak követése. Csak US piacra releváns.
- [ ] Breakeven screener — 5+ veszteséges negyedév után nyereségessé váló részvények (turnaround jelzés).
- [ ] Overbought/Oversold indikátor — ciklikus technikai indikátor belépési/kilépési pontokkal. Dip Finder-nél komplexebb.

### Maybe Later (Meglévő feature-ök bővítése — Forecaster.biz inspiráció)
- [ ] Earnings calendar bővítés: analyst EPS/revenue estimates, beat history, Polymarket prediction market integráció
- [ ] Rankings bővítés: index komponensek rangsorolása, momentum szűrés (price change 1d/1m/6m/1y/3y/5y)
- [ ] Screener bővítés: globális instrumentumok (150K+) a saját DB helyett

### Maybe Later (UX & Performance)
- [x] Global search (Cmd+K) — search palette across all modules: companies, positions, transactions, research notes, reviews, company thesis notes
- [x] Form validation — visual inline validation for position and transaction forms with Hungarian error messages, red border highlights, auto-clear on focus
- [x] Keyboard shortcuts — Cmd+1-7 section nav, N for new item (context-aware), ? for shortcut guide in Settings, Esc to close. Shortcut guide card in Settings section.
- [x] Empty states — Icon + Hungarian heading + description + CTA button for Portfolio Overview, Positions, Transactions, Reviews, and Dashboard widgets
- [x] Bulk operations — Multi-select checkboxes, floating action bar (delete + CSV export), undo support for all 5 sections (positions, transactions, notes, reviews, tracked stocks), cross-mode guard, D1 delete propagation
- [x] Section fade transitions — 150ms fade-in animation on section switch (opacity + translateY)
- [x] Skeleton loading screens — shimmer-animated placeholders for all API fetch operations: dashboard widgets (benchmark, dip finder, earnings), company profile, insider trading, dividends, charts, exchange rates; button loading states with spinner; light/dark theme support
- [x] Confirmation dialogs — 3-tier system replacing native confirm(): simple confirm (cascade deletes), danger confirm with type-to-confirm (backup restore, permanent stock delete), bulk confirm (3+ items); focus trap, keyboard support, ARIA, re-entrancy guard, Hungarian UI
- [x] Scroll position preservation — cross-section, profile open/close, sub-tab switching, history.scrollRestoration='manual'
- [x] Dark/light/auto theme toggle — 3-state toggle (dark/light/auto), auto follows OS `prefers-color-scheme`, live update on OS change, half-circle icon
- [ ] Onboarding flow — Welcome screen for new users (3-4 steps: add first company → set up portfolio → explore dashboard). Currently new users land on a pre-filled DCF calculator with no context. Could include guided tour, sample data option, or progressive disclosure.
- [x] Soft-delete + trash view — `deleted_at` timestamp-based soft-delete for positions, transactions, notes, reviews. 30-day retention with auto-purge. Trash UI in Settings with restore/permanent delete/empty all. D1 schema + Worker updated. `getActivePositions()`/`getActiveTransactions()` helpers filter 30+ render/calc functions.
- [ ] Undo system evolution — Current: 6s undo toast for positions, transactions, notes, reviews, saved stocks (local only). Future: D1 cloud undo (re-insert on undo instead of local-only restore), undo stack for Ctrl+Z support, batch undo for multi-item operations.
- [x] Lazy-load charts (defer Chart.js rendering until canvas is visible)
- [x] Import merge strategy — reviews and framework now use `_mergeArrayById` (same ID = update, new ID = add) instead of full replace. Dividend history uses `Object.assign` merge by ticker key. No more silent data loss on import.
- [x] CSV import locale detection (European vs US number formats, auto-detect with manual override)
- [x] Toast hover pause — all toasts pause auto-dismiss on mouseenter, resume on mouseleave (min 1s). Recovery toast shows details (which data types were recovered).
- [x] i18n localization — Full EN/HU translation system: 744 keys across 23 namespaces, `t(key, params)` function, `data-i18n` attributes, language switcher in sidebar + settings. English default, Hungarian available. Deep pass: all UI chrome translated (nav, buttons, labels, tooltips, badges, empty states, toasts, confirmations, modals). Financial terms (DCF, FCF, P/E) stay English by design.
- [x] Position table sort — Clickable column headers (ticker, account, type, shares, avg cost, price, value, P&L, P&L %) with ascending/descending toggle, sort arrow indicators, pinned-first grouping preserved
- [x] Pin to top — Star button on tracked stocks and portfolio positions, pinned items always sorted first within their group, yellow filled/outline star visual, localStorage persistence
- [x] Pipeline quick filter bar — Multi-select OR logic filter buttons above tracker table, per-stage stock counts, "—" button for unassigned stocks, separate Archived styling, toggleable active state
- [x] Custom tag system — User-defined tags on company profiles with autocomplete, tag filter bar on tracker (multi-select OR logic), tag pills in Name column, screener Tag filter, XSS-safe encoding, 30-char limit
- [x] Missing `--yellow` CSS variable — Added `--yellow:#ffd93d` (dark) and `--yellow:#e6a800` (light) to `:root`, fixing invisible pin star colors and currency warning text
- [x] Dashboard widget hide/show — Hide button on hover, Manage Widgets panel with checkboxes and up/down reorder arrows, localStorage persistence, ARIA attributes, empty-state message
- [x] Screener/Compare discoverability — Accent-styled power buttons with emoji icons, tooltips, panel descriptions (EN+HU), mobile-safe layout
- [x] Remove redundant Tracker Export/Import — Settings Data Management already covers backup/restore/export; removed buttons, functions, and dead i18n key
- [x] API Usage widget in Settings — FMP (250/day with progress bar), Yahoo Finance (30/min), Finnhub (60/min); shows data targets, cache TTLs, configured status
- [x] Settings pill navigation — Sticky nav bar with 8 pills for quick section jumping, smooth scroll, active state highlight, overflow:visible fix for position:sticky
- [x] Typography scale — 8-level CSS variable scale (--fs-xs:10px through --fs-3xl:20px), eliminated 9px/17px/22px, consolidated dialog headings to 16px, hero numbers to 20px, converted 285 CSS class declarations
- [x] Card style consistency — Unified 5 card classes to var(--radius), normalized db-hero padding 24→20px
- [x] Inline hover styles — Replaced 5 inline JS onmouseover/onmouseout handlers with CSS :hover classes (sidebar buttons, toast undo, dividend calendar tooltip, external links)
- [ ] Error states polish — Chart container inline error placeholders ("Failed to load chart"), dashboard widget error states. Core API error handling (toasts, rate limit warnings, offline detection, retry logic) already complete.
- [x] Tooltips expansion — WIDGET_TIPS (12 dashboard widgets), PF_COL_TIPS (9 portfolio columns), 10 new METRIC_TIPS screener entries. initWidgetTips() DOM injection, pfTh() integration, renderScreenerUI() label tooltips. QA: 4 fixes (t→tip shadow, conditional formula/bench, dead code removal, i18n attr cleanup).
- [x] Portfolio history chart — Calculated daily portfolio value from transactions + FMP historical prices. Period selector (1M/3M/6M/1Y/YTD/ALL), asset type filter chips (i18n), S&P 500 benchmark overlay (dashed orange, scaled). Handles: stocks/ETF/crypto (API), real_estate (manual), cash/savings (=1), bonds (face value fallback). Race condition guard, in-memory price cache. QA: 5 fixes (race condition, savings=1, bond fallback, i18n chips, error status cleanup).
- [x] Accessibility (ARIA + Backdrop) — role="dialog" aria-modal on all 13 overlays, backdrop click-to-close on 11 modals, aria-label on 7 icon-only buttons. Remaining: aria-live on toast container, aria-expanded on collapsible toggles.
- [ ] Mobile gestures — Pull-to-refresh on company profile and dashboard (vertical swipe down, no browser conflict). Long-press on table rows for context menu (edit/delete/archive, replaces tiny icon buttons). Swipe-to-dismiss on toasts (horizontal, no browser back/forward conflict). Note: horizontal swipe navigation deliberately excluded — conflicts with browser back/forward gesture and bottom nav already handles section switching.

---

## Technical Debt & Deferred Audit Findings

Migrated 2026-08-19 (Cat 106) out of six one-off `.txt` dumps in `docs/` that were then deleted —
`IMPROVEMENT-IDEAS`, `optimization-suggestions`, `UX-IMPROVEMENTS`, `UX-REVIEW-2026-07-03`,
`UX-UI-AUDIT-2026-07-03`, `QA-SWEEP-2026-07-03`. Only items **tracked nowhere else** are listed:
each was checked against this file and KNOWN-ISSUES first, and about 70% of the dumps' ~107 findings
were dropped because they were already done, already tracked, or already fixed. A handful that the
dumps themselves marked "MAYBE LATER" were kept rather than dropped — each says so, with the reason,
because a deferral with a stated rationale is worth more than a deleted line. Provenance is kept per
item so the deletion lost nothing. None of this is blocking; it is the honest backlog.

### Architecture & code quality
The first item is the parent — most of the rest are only worth doing as part of it, or become much
cheaper after it.
- [ ] **Split the monolithic `index.html`** — 17 253 lines in one file, the single largest piece of
  technical debt. ES modules (`portfolio.js`, `dashboard.js`, `company.js`, `utils.js`, …). Makes
  debugging tractable, lets the browser cache per-module, and unlocks the four items below.
  ~4-5 sessions. *(IMPROVEMENT-IDEAS #1, optimization #1)*
  - [ ] **Code splitting / lazy-load** rarely used modules (screener, framework, valuation history)
    so first paint doesn't pay for all 18 phases. *(IMPROVEMENT-IDEAS #14)*
  - [ ] **Reduce the global surface** (`tStocks`, `pfPositions`, …) — explicit import/export instead
    of globals; removes name-collision and leak risk. *(optimization #5)*
  - [ ] **Build tooling** (Vite/esbuild) for bundling, minification and cache-busting — deferred in
    the dump itself, and only meaningful once the file is split. *(IMPROVEMENT-IDEAS #3)*
- [ ] **No automated tests at all** — `docs/TEST-PLAN.md` is 371 checkboxes and 100% manual; every
  fix in BUG-HISTORY came from manual QA. At minimum, unit tests over the pure calculation logic (DCF,
  TWR, XIRR, scoring, thresholds, yellow flags) so a refactor can't silently break the numbers.
  This is the item that sat untracked for six weeks. ~2-4 sessions.
  *(IMPROVEMENT-IDEAS #2, optimization #7)*
- [ ] **Extract the inline CSS** — a **1 058-line** `<style>` block (`index.html:36-1093`). A
  separate `.css` file is cached independently and downloaded in parallel. ~1 session.
  *(optimization #2 — which claimed "~3000+ sor"; measured, it was ~1 049 even when that was
  written. Re-measured rather than copied forward, since propagating unverified numbers is the
  habit this whole track exists to break.)*
- [ ] **JSDoc types for the core data structures** — `tStocks`, `pfPositions`, `pfAccounts` are
  documented in prose (ARCHITECTURE § 5.1) but nothing checks them. JSDoc gives IDE completion and
  catches shape errors without adopting TypeScript. ~1 session. *(optimization #8)*
- [ ] **`innerHTML` in the large renderers** — `escH()` already covers XSS (the 2026-07-09 sweep
  audited all 162 sites clean), so this is about speed and fragility: `DocumentFragment` or template
  cloning in `renderPositions`/`renderChecklist`. *(optimization #6)*
- [ ] **Virtual scrolling** for 100+ tracked companies or 500+ transactions. Fine at today's scale;
  a scalability ceiling, not a current bug. *(IMPROVEMENT-IDEAS #15, optimization #3)*
- [ ] **Chart.js ships whole** — `chart.js@4.4.7/dist/chart.umd.min.js` plus
  `chartjs-adapter-date-fns@3.0.0`, both from jsDelivr, while only line/bar/pie/doughnut are used.
  A custom build or uPlot would cut most of it. *(optimization #4 — its "~200 KB gzip" is
  **unverified**; that looks like the minified, not the gzipped, figure. Measure both bundles over
  the wire before deciding this is worth a batch.)*
- [ ] **Staging/dev D1** — every schema change today runs against the live database. Deferred in the
  dump on the grounds that schema changes are rare and always a manual `wrangler d1 execute`, with
  CLAUDE.md's warn-first rule as the mitigation. `wrangler d1 create stratos-ventures-dev` + an
  env-based binding if it is ever wanted. *(IMPROVEMENT-IDEAS #10)*

### UX findings (2026-07-03 UI/UX audit)
Rated high in the audit:
- [ ] **No breadcrumb or back navigation** — opening a profile and jumping to the calculator loses
  all context of where you came from. *(UX-UI #1, UX-IMPROVEMENTS #4)*
- [ ] **Profile Overview has no visual hierarchy** — metrics sit on identically sized cards in two
  `cp-metrics-grid` blocks (`index.html:9580`, `:9600`), so nothing reads as important. Proposed: a
  small "headline metrics" block (P/E, revenue growth, FCF yield, ROIC) plus a collapsible detail
  block, with the Terry Smith and ARIA scores lifted to the top. *(UX-UI #3 — the audit's "30+
  metrics" is **unverified**: the grids are built from several helpers and a static count was not
  cheap to establish. Count it in the browser before sizing this work.)*
- [ ] **Tracker column picker** — **39 columns** are defined (`stCols`, `index.html:13209-13249`)
  with no visibility control of any kind: no `colPicker`/`toggleCol`/per-column hide exists. The
  audit said "12-15", so this is materially worse than it was reported, not better. User-chosen
  columns with saved configurations ("valuation view", "growth view"). *(UX-UI #4 — count measured
  2026-08-19, not carried over)*

Rated medium/low:
- [ ] **Dashboard as hub** — widget headline numbers should be clickable and lead to the detail
  view, so most things are one click from the dashboard. Related: the default widget set is large
  enough to overwhelm on first run, even though hide/show and reordering already exist.
  *(UX-UI #2 + #5, UX-REVIEW #6)*
- [ ] **Ticker input autocomplete is inconsistent** — the transaction and research modals have a
  datalist, the tracker's "Add Stock" input does not. *(UX-UI #9)*
- [ ] **"Add broker first" is a dead end** — the error says what is wrong but doesn't open the
  account modal. *(UX-UI #10)*
- [ ] **Transaction price isn't pre-filled** from the last known price for an already-tracked
  ticker. *(UX-UI #11)*
- [ ] **Delete confirmation works three different ways** — confirm modal for positions, type-to-
  confirm for stocks, undo toast for notes. Proposed rule: soft delete + undo everywhere,
  confirm dialog for permanent actions, type-to-confirm only for genuinely destructive ones.
  *(UX-UI #13)*
- [ ] **No rule for modal vs inline data entry** — positions and transactions use modals, price
  alerts and sell triggers are inline. Proposed: 3+ fields → modal, 1-2 fields → inline.
  *(UX-UI #14)*
- [ ] **Missing cross-links** — earnings calendar, research notes and dashboard alerts show tickers
  as plain text. Every ticker occurrence should open that company's profile. *(UX-UI #15)*
- [ ] **Checklist has no progress indicator** — 12 sections and 100+ questions with no per-company
  "65% analysed" signal, in the tracker or at the top of the checklist. *(UX-REVIEW #7 + II.3)*
- [ ] **Quick add position** — adding a position is account → position → transaction with no wizard.
  One modal (ticker, broker, shares, price, date) that creates the account if needed.
  *(UX-REVIEW #3 + II.5)*
- [ ] **Pipeline is text-only** — Watchlist → Under review → Buy target → Owned would read far
  faster as a kanban or funnel view. *(UX-REVIEW #8)*
- [ ] **Empty states are weak in several places** — screener "no match" doesn't offer to clear
  filters, compare mode disables its button without saying why, the conviction and expected-return
  charts render an empty canvas. Each needs explanation + a CTA + a suggested first step. Related:
  the three empty dashboard cards on first run all say the same thing differently, and the empty
  pages would carry better with an illustration.
  *(UX-UI #18, UX-REVIEW #5, UX-IMPROVEMENTS #2 + #3)*
- [ ] **Partial add is silent about what's missing** — a "partial add" toast appears but doesn't say
  which data failed or how to fill it in by hand. *(UX-UI #12)*
- [ ] **Shortcut cheat-sheet** — `?` opens the guide in Settings; a floating overlay palette would
  surface it where it is needed. *(UX-UI #8)*
- [ ] **Recently viewed** — pin-to-top exists, but there is no most-recent list for the 5-6
  companies actually being worked on. *(UX-UI #16)*
- [ ] **Settings test buttons mix green and red styling** — colour should signal the result, not the
  button. *(UX-IMPROVEMENTS #5)*
- [ ] **Dashboard drag-and-drop** — hide/show and arrow reordering are done; freeform layout and
  widget sizing are not. *(IMPROVEMENT-IDEAS #13)*
- [ ] **Watchlist price tracking** — no sparkline or price history for watched companies, so you
  can't see whether something got cheaper since you started following it.
  *(IMPROVEMENT-IDEAS #12)*
- [ ] **Deep analysis is spread across modules** — fully analysing one company means Companies →
  checklist → Research → Portfolio → Reviews. The summary tab helps for reading; editing still
  bounces between sections. *(UX-REVIEW #4)*

---

## Open Questions
(none currently)

## Decisions Made
- ✅ Platform: Unified web app (not Electron)
- ✅ Hosting: Cloudflare free tier (~$10/yr domain only)
- ✅ Security: E2E encryption (AES-256-GCM) + Cloudflare Access (Zero Trust)
- ✅ Data: FMP + Finnhub + Yahoo (all free tier)
- ✅ Notes: Markdown inside app, exportable
- ✅ Mobile: responsive design, not native app
- ✅ Benchmark: S&P 500 + MSCI World (both, user-selectable)
- ✅ Currency effect: show both combined and separated (stock return vs FX return)
- ✅ Non-stock assets: custom asset with manual value entry
- ✅ Cost basis: Average cost (EU broker standard, simplest for multi-broker buy & hold)
- ✅ Returns: TWR + MWR/XIRR + Simple P&L (all three)

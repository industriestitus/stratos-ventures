# Stratos Ventures — Roadmap

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

### Cross-Module Integration (2026-07-01)
- [x] Archive system — soft delete with "Archived" pipeline stage, archive modal (Archive/Delete permanently/Cancel), tracker toggle, screener filter, D1 CHECK constraint migration
- [x] Portfolio ↔ Pipeline auto-sync — buy triggers Companies "Owned", sell-all triggers "Watchlist", CSV import batch sync, real estate/bond/cash excluded, delete position/transaction triggers check
- [x] Pipeline-based review reminders — 90-day threshold for Owned/Buy target companies, Dashboard widget, company profile badge, auto-refresh after review save
- [x] Company profile summary tab — new default tab with positions, transactions, notes, reviews, sell triggers, TODOs, quick actions, cross-linking
- [x] KNOWN-ISSUES bugfix sweep — 1 CRITICAL + 5 HIGH fixed: Worker rate limiting, FMP budget tracking, non-D1 cache, atomic DELETE, dividend dedup finally, crypto secure context guard

## Phase 10: Optional / Future
> Nice-to-have features, add when needed.

- [ ] Notifications (push notifications for price alerts — basic on-load alerts in Phase 15.4)
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
- [x] Skeleton loading screens — shimmer-animated placeholders for dashboard, profile, table, insider trading; light/dark theme support
- [x] Confirmation dialogs — 3-tier system replacing native confirm(): simple confirm (cascade deletes), danger confirm with type-to-confirm (backup restore, permanent stock delete), bulk confirm (3+ items); focus trap, keyboard support, ARIA, re-entrancy guard, Hungarian UI
- [x] Scroll position preservation — cross-section, profile open/close, sub-tab switching, history.scrollRestoration='manual'
- [x] Dark/light/auto theme toggle — 3-state toggle (dark/light/auto), auto follows OS `prefers-color-scheme`, live update on OS change, half-circle icon
- [ ] Onboarding flow — Welcome screen for new users (3-4 steps: add first company → set up portfolio → explore dashboard). Currently new users land on a pre-filled DCF calculator with no context. Could include guided tour, sample data option, or progressive disclosure.
- [x] Soft-delete + trash view — `deleted_at` timestamp-based soft-delete for positions, transactions, notes, reviews. 30-day retention with auto-purge. Trash UI in Settings with restore/permanent delete/empty all. D1 schema + Worker updated. `getActivePositions()`/`getActiveTransactions()` helpers filter 30+ render/calc functions.
- [ ] Undo system evolution — Current: 6s undo toast for positions, transactions, notes, reviews, saved stocks (local only). Future: D1 cloud undo (re-insert on undo instead of local-only restore), undo stack for Ctrl+Z support, batch undo for multi-item operations.
- [x] Lazy-load charts (defer Chart.js rendering until canvas is visible)
- [ ] Import merge strategy: Object.assign vs full replace — make consistent with cloud sync behavior
- [x] CSV import locale detection (European vs US number formats, auto-detect with manual override)
- [x] Toast hover pause — all toasts pause auto-dismiss on mouseenter, resume on mouseleave (min 1s). Recovery toast shows details (which data types were recovered).
- [x] i18n localization — Full EN/HU translation system: 744 keys across 23 namespaces, `t(key, params)` function, `data-i18n` attributes, language switcher in sidebar + settings. English default, Hungarian available. Deep pass: all UI chrome translated (nav, buttons, labels, tooltips, badges, empty states, toasts, confirmations, modals). Financial terms (DCF, FCF, P/E) stay English by design.

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

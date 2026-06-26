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

- [ ] Stock Scores: valuation, growth, profitability, health (calculated from FMP data)
- [ ] Company comparison: side-by-side metrics
- [ ] Basic screener with filters
- [ ] Insider trading display (from Finnhub)

## Phase 9: Export, Polish & D1 Migration (2-3 sessions)
> Full data portability, UI polish, and server-side database migration.

- [ ] JSON full backup/restore (unified: calculator + tracker + notes in one file)
- [ ] CSV export (positions, transactions)
- [ ] Excel export (multi-sheet)
- [ ] Markdown export (notes, journal, analysis)
- [ ] CSV import for positions
- [ ] Hash-based routing with browser back/forward button support
- [ ] Data versioning & migration system (schema version in localStorage, auto-upgrade on load)
- [ ] D1 migration: Worker CRUD API endpoints for all tables (schema already in docs/d1-schema.sql)
- [ ] D1 migration: localStorage → D1 one-time data migration tool
- [ ] D1 migration: Switch app to read/write D1 via Worker API (localStorage as offline cache)

## Phase 10: Optional / Future
> Nice-to-have features, add when needed.

- [ ] AI analysis via Claude API (company summaries, Q&A)
- [ ] Brokerage sync (SnapTrade or similar)
- [ ] PWA support (installable on phone)
- [ ] Notifications (earnings coming up, price alerts)
- [ ] Google Drive migration tool (import existing Docs)
- [ ] Dark/light theme toggle
- [ ] Set up Cloudflare Access (Zero Trust) — needs custom domain (~$10/yr), then protect pages.dev
- [ ] localStorage encryption at rest (AES-256 for local data, not just cloud sync)
- [ ] Cloud sync conflict resolution (merge strategy instead of last-write-wins)
- [ ] Multi-tab localStorage sync (StorageEvent listener to prevent stale reads)
- [ ] Lazy-load charts (defer Chart.js rendering until canvas is visible)

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

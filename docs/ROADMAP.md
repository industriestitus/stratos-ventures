# Stratos Ventures — Roadmap

## Process & Docs Hygiene — COMPLETE (2026-08-27)
> Started 2026-08-05 as Cat 100; promoted out of § Phases 11-18 to a top-level section on
> 2026-08-19 (Cat 109) when the completed phases were archived. Cats 100/101/105/106/107/109/114/115.
> **Every item below is checked.** It stays here rather than moving to `ROADMAP-ARCHIVE.md` only
> because the move is mechanical and belongs to whichever batch next touches this file; nothing
> in it is open, and `check.sh` check 12 holds the archive to that same standard.
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
- [x] **Archiving + missing ADRs** (2026-08-19, Cat 109) — `BUG-HISTORY.md` shed **~1 470 lines** to `BUG-HISTORY-ARCHIVE.md` (bodies older than Cat 84 / 2026-07-24; the summary table stays put as the index for both) and `ROADMAP.md` shed **365** to `ROADMAP-ARCHIVE.md` (completed phases 0-18). *Sizes quoted as what MOVED, not as the resulting file sizes — those grow every batch and a number that goes stale weekly is the thing this track exists to stop writing.* **ADR-044** (D1 cloud snapshots) and **ADR-045** (FMP `/stable` — probe the API, don't trust the docs) written. Also: **four** headings outside the category convention (`## Session 25`, `## Audit 19/20/21`) became Categories **108/110/111/112** — their **34 fixes had never been counted**, so the total moved 586 → 629 as a recovery, not new work. The scope said one heading; `check.sh`'s guard only knew that one spelling. `check.sh` gained check 12 (archives hold no live work) and had check 4 taught the split, which it needed: archiving would otherwise have silently exempted every archived category from the row check — re-opening the exact hole Cat 105 closed. QA then found **four more fail-opens** in the checker (an emptied archive passing green, the legacy scan blind to `## Audit N`, an indented checkbox slipping past check 12, and a silent pass); all closed and tested against broken input.
- [x] **Final: end-to-end process review + presentation** (2026-08-26, Cat 114) — every rule in CLAUDE.md measured against the repo, not against earlier documents. **Since `96cd04f` (2026-08-05), when the unwritten rules were first written down, there is not one violation of any rule** — including the four that no check covers (`(vNN)` suffix, `Co-Authored-By`, trunk-based, no Hungarian identifiers). The non-conforming subjects in the log all predate the rule. `APP_VERSION`/`CACHE_NAME` lockstep has never once been broken since `APP_VERSION` existed. *(Raw counts are not quoted: this batch's own commits moved every one of them mid-write. `git rev-list --count 96cd04f..HEAD` measures it.)* Cost, measured two ways because one number lies: the track itself ran ~28 doc lines per code line, but a *shipped feature* (v57) ran **0.6:1** — 100 code lines, 58 doc lines, 2 commits. **Five QA passes, five substantive findings** — this one found the tenth fail-open in the file the audit had just finished reading. Deliverable was a presentation, not a doc; per policy the open items landed here and the fixes in BUG-HISTORY.
  - [x] **Two `check.sh` leaks closed by this batch** — check 10 `warn`-and-skipped when the memory dir was absent (ninth fail-open), and check 6's prefix/purity assertions ran only on a clean tree, i.e. never in the invocation step 7 mandates (tenth). Both re-tested against deliberately broken input. See Cat 114.
  - [x] **The four leaks, all closed** (2026-08-27, Cat 115). (a) Check 1 now asserts the markers **moved together** — specifically that the last commit touching app code under `web/` bumped both — instead of only comparing where they stand. Phrased over history, because the obvious `if HEAD touches web/` form is vacuous at both moments the script actually runs: the eleventh fail-open of this exact shape. (b) The two `warn` sites that encode rules CLAUDE.md states without exception (stray `docs/` dumps, PENDING markers outside `STATUS.md`) are now `FAIL`; the pending-deploy pattern was additionally **aimed the wrong way** — it fired on the safe state and was silent on the dangerous one — and now requires the position to be *stated*. `warn` is kept only for the two genuinely advisory checks, and the summary no longer prints green over them. No `--strict` flag: a mode nobody runs is not a gate. (c) Check 10 now verifies the handoff's **currency** as well as its shape — `STATUS.md`'s `modified:` stamp must not predate the newest non-`docs:` commit, which is what makes it correct both mid-batch and after the closing docs commit. The QA pass, the browser check and the deploy ordering stay **permanently unverifiable**, and the script's header now says so out loud rather than leaving a green run to be read as complete. *The suggested half-fix — have the docs commit state a QA finding count — was deliberately not built: the number would be written by the same agent the check is meant to hold to account, so it is ritual, not evidence.* (d) `.githooks/pre-push` runs the gate on every push, plus check 13. A git hook rather than the GitHub Action sketched here, which sidesteps the trap this line warned about entirely: the hook runs on the machine where `$HOME/.claude` exists, so check 10 keeps working instead of needing a CI-only exemption that could rot into a silent no-op. **QA then found seven more defects in the fixes themselves** — chief among them that (a)'s new assertion counted diff lines *mentioning* the markers, so a re-add of the identical value passed: the same "necessary but not sufficient" trap it was written to close, one level up. All six code defects re-tested against the reproduction; the seventh was a CLAUDE.md ambiguity about how many times a batch pushes, fixed in the wording rather than by weakening the hook. See Cat 115.

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
- [x] i18n localization — Full EN/HU translation system: 744 keys across 23 namespaces (1011 per language today), `i18n(key, params)` function (named `t()` until Cat 117), `data-i18n` attributes, language switcher in sidebar + settings. English default, Hungarian available. Deep pass: all UI chrome translated (nav, buttons, labels, tooltips, badges, empty states, toasts, confirmations, modals). Financial terms (DCF, FCF, P/E) stay English by design.
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

### Documentation & log debts (2026-09-06)
Small, named, and each one currently lives only in a session handoff, which is not a backlog.
Written down here so they survive the next `STATUS.md` rewrite.

- [ ] **`docs/API-REFERENCE.md:35,77` calls the `X-Auth-Token` check a "timing-safe comparison"** —
  it is a SHA-256 KV lookup. `timingSafeEqual` is used only on the password and recovery
  verifiers, which line 477 already states correctly. Two lines.
- [ ] **`ROADMAP § Process & Docs Hygiene` is fully checked and belongs in `ROADMAP-ARCHIVE.md`** —
  it stays put only because the move belongs to whichever batch next edits this file.
- [ ] **`docs/BUG-HISTORY.md`'s "26 potential (unfixed)" cannot be derived from anything.**
  `check.sh` verifies the Fixed total against the Fixed column and **nothing** verifies this one;
  it matches neither the Unfixed column nor the "Potential Bugs (Unfixed)" section. Left untouched
  for four batches running, because changing a number you cannot derive is how the 646/653 error
  happened. Either make it derivable and let `check.sh` assert it, or delete it — deleting is
  defensible under this project's own rule that a counter nobody can keep true is worse than none.
- [ ] **P.32 — `applyI18n()` destroys the green highlight in `settings.d1Connected`** (KNOWN-ISSUES).
  Cosmetic. The fix is to restructure that one string, **not** to add a second exemption to
  `applyI18n()`: one carve-out for a runtime-injected child is a rule, two is a list.

### Architecture & code quality
The first item is the parent — most of the rest are only worth doing as part of it, or become much
cheaper after it.
- [ ] **Split the monolithic `index.html`** — the entire app in one file (~17k lines, and it grows
  every batch — `bash docs/check.sh` prints the measured figure rather than restating a stale one
  here; the number written when this item was filed had already drifted by 92 lines), the single
  largest piece of technical debt. ES modules (`portfolio.js`, `dashboard.js`, `company.js`, `utils.js`, …). Makes
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
- [ ] **Tracker column picker** — **40 columns** are defined (`stCols`, `index.html:13646-13687`)
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
- [x] **"Add broker first" is a dead end** (2026-09-06, Cat 120, v61) — all three entry points
  now offer to create the account and resume the original action. An EDIT is deliberately not
  resumed: `pfAccounts` is also empty when its D1 load merely failed, and coming back into an edit
  would silently reassign that record's broker. *(UX-UI #10)*
- [x] **Transaction price isn't pre-filled** — **this was already true when the item was written
  down.** `onTxTickerChange()` fills the price from `tStocks[ticker].price` and shows a "current
  price" hint; it does not overwrite a price the user typed, and invents nothing for an unknown
  ticker. Verified in the browser 2026-09-06 (Cat 120) and ticked, not rewritten. *(UX-UI #11)*
- [ ] **Delete confirmation works three different ways** — confirm modal for positions, type-to-
  confirm for stocks, undo toast for notes. Proposed rule: soft delete + undo everywhere,
  confirm dialog for permanent actions, type-to-confirm only for genuinely destructive ones.
  *(UX-UI #13)*
- [ ] **No rule for modal vs inline data entry** — positions and transactions use modals, price
  alerts and sell triggers are inline. Proposed: 3+ fields → modal, 1-2 fields → inline.
  *(UX-UI #14)*
- [ ] **Missing cross-links** — earnings calendar, research notes and dashboard alerts show tickers
  as plain text. Every ticker occurrence should open that company's profile. *(UX-UI #15)*
- [x] **Checklist has no progress indicator** (2026-09-06, Cat 120, v61) — the checklist half
  already existed (overall bar + per-section %); the tracker half is the new `CL%` column, which
  delegates to the same `cl.overallProgress` rather than counting anything itself. A company whose
  checklist was never opened reads `—`, not `0%`. **The item said "12 sections"; `CL_SECTIONS` has
  14** — re-measured rather than carried forward. *(UX-REVIEW #7 + II.3)*
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

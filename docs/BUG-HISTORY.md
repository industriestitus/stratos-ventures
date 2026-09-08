# Bug History — Stratos Ventures

Comprehensive log of all bugs found and fixed during QA audits. Organized by audit category and commit.

**The summary table below indexes EVERY category in the project.** Body sections for categories from
**2026-07-24 onward** (Cat 84+) are in this file; everything older lives in
[`BUG-HISTORY-ARCHIVE.md`](BUG-HISTORY-ARCHIVE.md). The cut-off is where Security v2 closed and the
app moved to token-only auth with envelope encryption, so what is hot here is what still describes
the current architecture. `docs/check.sh` check 4 scans both files, so a category cannot lose its
row by being archived.

Archiving is **by date, not by number** — so Category 108, despite being the highest number, is in
the archive: its content is from 2026-07-01 and it only received a number in 2026-08-19.

---

## QA Audit Categories

| # | Category | Commit | Date | Fixed | Unfixed |
|---|----------|--------|------|-------|---------|
| 1 | Data Integrity | `0ed9a10` | 2026-06-27 | 20 | 0 |
| 2 | Security | `13e0238` | 2026-06-27 | 17 | 0 |
| 3 | Financial Calculations | `98e7aba` | 2026-06-27 | 13 | 0 |
| 4 | UI/UX | `e3d051c` | 2026-06-27 | 25 | 0 |
| 5 | API Integration | `726a5ae` | 2026-06-27 | 17 | 7 |
| 6 | PWA & Offline | `967fc02` | 2026-06-27 | 15 | 3 |
| 7 | Browser Compatibility | `8cfa26f` | 2026-06-27 | 6 | 2 |
| 8 | Edge Cases | `4bae102` | 2026-06-27 | 8 | 8 |
| X | Cross-category BUGs | `9a06c86` | 2026-06-27 | 11 | 0 |
| X | INFO improvements | `34a249b` | 2026-06-27 | 2 | 0 |
| 9 | Post-completion QA | `93a0420` | 2026-06-27 | 10 | 0 |
| 10 | Mobile Responsive Overflow | `b21f930` | 2026-06-27 | 6 | 1 |
| 11 | Dashboard Widget Overflow | `b5fdc36` | 2026-06-27 | 3 | 0 |
| 12 | Chart Container Mobile Overflow | `39fbfca` | 2026-06-28 | 1 | 0 |
| 13 | TODO Widget Vertical Clipping | `c3b355f` | 2026-06-28 | 1 | 0 |
| 14 | Dashboard Grid Bottom Clipping | `e74446c` | 2026-06-28 | 1 | 0 |
| 15 | D1 Data Persistence | `f053cb7`+`cf9c284` | 2026-06-30 | 2 | 0 |
| 16 | Phase 15 Feature QA | `bc15b16`+`872b96b` | 2026-06-30 | 4 | 0 |
| 17 | Phase 14 Asset Types QA | `5cd3a24` | 2026-07-01 | 6 | 0 |
| 18 | Phase 15.4 Price Alerts QA | `631a3e2` | 2026-07-01 | 2 | 0 |
| 19 | Data Persistence & Sync | S1-S7 | 2026-07-01 | 11 | 0 |
| 20 | Financial Calculation Accuracy | S2+S3+S5 | 2026-07-01 | 7 | 0 |
| 21 | Cross-Module Integration | S3-S5+S7 | 2026-07-01 | 5 | 0 |
| 22 | Performance | S6 | 2026-07-01 | 3 | 0 |
| 23 | Security & Code Quality | S7 | 2026-07-01 | 2 | 0 |
| 24 | KNOWN-ISSUES Bugfix Sweep | `bde6c93` | 2026-07-01 | 6 | 0 |
| 25 | KNOWN-ISSUES Medium Sweep | `2dfccef` | 2026-07-01 | 6 | 1 |
| 26 | LOW + Deep Audit Sweep | `5cadef9` | 2026-07-01 | 8 | 2 |
| 27 | UX/UI Audit Fixes | `ff47c3f` | 2026-07-01 | 5+3 QA | 0 |
| 28 | Keyboard Shortcuts + Empty States | `79f0927` | 2026-07-02 | 2 QA | 0 |
| 29 | Bulk Operations | `11c3e3a` | 2026-07-02 | 2 QA | 0 |
| 30 | Bulk Ops: Notes/Reviews/Stocks | `73e7dfb` | 2026-07-02 | 4 QA | 0 |
| 31 | Skeleton/Animation QA | `c7412e9` | 2026-07-02 | 3 QA | 0 |
| 32 | Confirmation Dialogs | `a0362db` | 2026-07-02 | 3 QA | 0 |
| 33 | CSV/Scroll/Lazy QA | `10edf61` | 2026-07-02 | 2 QA | 0 |
| 34 | i18n Localization QA — 3 CRITICAL `t()` shadowing crashes | `e338abf` | 2026-07-02 | 3 | 0 |
| 35 | i18n Deep Pass | `c49f3ac` | 2026-07-02 | 5 | 0 |
| 36 | Soft-Delete + Trash | `fe3b0c8` | 2026-07-02 | 5 | 0 |
| 37 | UX Polish (padding/focus/collapsible) | `3d75f00` | 2026-07-02 | 1 QA | 0 |
| 38 | Chart Export + Sort Indicator | `828efc4` | 2026-07-02 | 2 QA | 0 |
| 39 | XLSX Export + Portfolio PDF | `0d2895c` | 2026-07-02 | 4 QA | 0 |
| 40 | Import Merge Strategy | `95ff2b0` | 2026-07-02 | 3 | 0 |
| 41 | Position Sort, Pin-to-Top, Pipeline Filter | `8bae88e` | 2026-07-02 | 4 | 8 |
| 42 | Custom Tag System | `97a2496` | 2026-07-02 | 8 | 0 |
| 43 | Skeleton Loading States | `e1cfd66` | 2026-07-02 | 1 | 0 |
| 44 | Missing CSS Variable | `7946c25` | 2026-07-03 | 1 | 0 |
| 45 | Screener/Compare Discoverability | `74fa17c` | 2026-07-03 | 3 | 0 |
| 46 | Dashboard Widget Management | `bdab96f` | 2026-07-03 | 4 | 0 |
| 47 | Tracker Export/Import Cleanup + API Usage Widget | `9ec622e` | 2026-07-03 | 2 | 0 |
| 48 | Settings Pill Navigation | `45caaf9` | 2026-07-03 | 3 | 0 |
| 49 | Typography Scale | `2664cd1` | 2026-07-03 | 6 | 0 |
| 50 | Card Style Consistency | `474c56a` | 2026-07-03 | 2 | 0 |
| 51 | Inline Hover Styles | `1bea6c9` | 2026-07-03 | 5 | 0 |
| 52 | Accessibility (ARIA + Backdrop) | `2a26e9c` | 2026-07-03 | 30 | 0 |
| 53 | UX Review — Default Tab Fix | e45cba3 | 2026-07-04 | 1 | 0 |
| 54 | UX — Back Navigation | d3260d0 | 2026-07-04 | 1 | 0 |
| 55 | UX — Dashboard Hub Links | 3ec4467 | 2026-07-04 | 1 | 0 |
| 56 | UX — Ticker Autocomplete | `1fea9e8` | 2026-07-04 | 2 | 0 |
| 57 | UX — Transaction Price Auto-fill | `6edec93` | 2026-07-04 | 3 | 0 |
| 58 | UX — Partial Add Toast | `14e92e5` | 2026-07-04 | 1 | 0 |
| 59 | UX — Transaction Ticker Cross-link | `f616215` | 2026-07-04 | 1 | 0 |
| 60 | UX — Screener Filter Presets | `3f81b2d` | 2026-07-04 | 4 | 0 |
| 61 | Keyboard Shortcut + TEST-PLAN Accuracy | `c4427e0` | 2026-07-04 | 1 | 0 |
| 62 | Tooltip Expansion QA | `9a875f9` | 2026-07-08 | 4 | 0 |
| 63 | Portfolio History Chart QA | `a7d64b9` | 2026-07-09 | 5 | 0 |
| 64 | QA Sweep — CRITICAL+HIGH fixes | `e75f044` | 2026-07-09 | 16 | 0 |
| 65 | QA Sweep — MEDIUM fixes | `60d3c5e` | 2026-07-09 | 14 | 0 |
| 66 | QA Verification — extra parseInt radix | `935ad58` | 2026-07-09 | 2 | 0 |
| 67 | QA Sweep — LOW fixes | `e682b59` | 2026-07-09 | 8 | 0 |
| 68 | Cross-Device Login QA | `bbc5856` | 2026-07-09 | 1 | 0 |
| 69 | Pre-Production Security Audit | `f42dfb4` | 2026-07-10 | 17 | 0 |
| 70 | Pre-Production Full QA (A+B+C) | `61488a7` | 2026-07-10 | 7 | 0 |
| 71 | Privacy Mode QA | `abe37a1` | 2026-07-10 | 5 | 0 |
| 72 | Field-by-Field Sync Audit & Hardening | `36cf706`…`1d31799` | 2026-07-22 | 21 | 0 |
| 73 | S2a Cross-Device Sync + SW Auto-Reload | `e8aacb0`+`8803d3c` | 2026-07-23 | 4 | 0 |
| 74 | S2a-2 Per-Company Attr Sync + Single-PUT Upsert | `aaff465` | 2026-07-23 | 2 | 0 |
| 75 | S2a-3 Research-Note Images → D1 | `9c4e6ca` | 2026-07-23 | 3 | 0 |
| 76 | S2b Non-Stock Positions Cross-Device | `b8d5778` | 2026-07-23 | 3 | 0 |
| 77 | S2c Soft-Delete Tombstones (framework/override/valuation/note_images) | `19faaf4` | 2026-07-23 | 4 | 0 |
| 78 | Tracker Metric + Override Hydration on D1 Load | `af214e4` | 2026-07-23 | 2 | 0 |
| 79 | Tracker Hydration Rate-Limit Regression (v35→v36) | `d9c4ad6` | 2026-07-23 | 2 | 0 |
| 80 | api_cache Write-Path Sanitize (SV.6) + tracker-field persistence | `5d5cf69` | 2026-07-23 | 2 | 0 |
| 81 | /api Rate-Limit Raise + app_settings 404→200-null | `608c102` | 2026-07-23 | 2 | 0 |
| 82 | Security v2 C3 — Encrypt Existing Cloud Rows + /migrate Gate | `d176a0a` | 2026-07-23 | 5 | 0 |
| 83 | Security v2 B3a/B3b-1 — Token-Primary Auth + Connection-String Login Removal | `ce69164` | 2026-07-23 | 0 | 0 |
| 84 | Security v2 B3b-2 — Remove Legacy Client-Encryption + Legacy KV Sync (token-only boot) | `681354b` | 2026-07-24 | 0 | 0 |
| 85 | Security v2 B3c — Retire the Sync Key (worker token-only auth + client cleanup) | `2ba0019` | 2026-07-24 | 0 | 0 |
| 86 | Security v2 C3b — Encrypted Clear-and-Restore (worker /api/purge) | `feb4b4b` | 2026-07-24 | 1 | 0 |
| 87 | Security v2 Phase D — Final Security Sweep + Doc/Comment Closeout | `657c553`+ | 2026-07-24 | 0 | 0 |
| 88 | Purge stale legacy client-encryption verifier from server meta | `39100c8` | 2026-07-24 | 1 | 0 |
| 89 | Backup restore wiped the auth token (logged out mid-restore, cloud restore skipped) | `17f9845` | 2026-07-24 | 1 | 0 |
| 90 | Security v2 Phase-D final sweep — C3b restore data-loss paths (CRITICAL + 2 HIGH + 3 MEDIUM) | `cc485c8` | 2026-07-24 | 6 | 0 |
| 91 | Encrypted Backup (Batch A) — feature + adversarial QA fixes (b64 overflow, size guard, min-length, version guard) | `6e5735f` | 2026-07-24 | 5 | 0 |
| 92 | Backup Batch B — restore guardrails + completeness (pre-restore backup, richer confirm, market-cache rehydrate, auto-refresh-stale) + QA collision-id guard | `d2f857a` | 2026-07-24 | 1 | 0 |
| 93 | Backup Batch D — Data Management UX polish (verify backup, last-backup indicator, restore danger cue) + QA nits | `45f0a01` | 2026-07-24 | 3 | 0 |
| 94 | Backup Batch E1a — offline-readable HTML archive export + QA completeness fixes | `4cc0615` | 2026-07-24 | 2 | 0 |
| 95 | Backup Batch E1b — full-dump XLSX + unencrypted-export warning; QA found 4 more ungated sensitive exports | `7557158` | 2026-07-24 | 4 | 0 |
| 96 | Backup Batch E2 — opt-in historical data in the encrypted backup + chart-PNG export gate; QA found a false success signal, a silent no-op tick and a render-blocking restore step | `5f3ab13` | 2026-08-05 | 8 | 0 |
| 97 | Backup Batch C — D1 cloud snapshots; QA found a CRITICAL function-name collision with the portfolio `deleteSnapshot` + 5 more | `d38500a` | 2026-08-05 | 6 | 0 |
| 98 | FMP `/stable` migration — 5 broken endpoints restored (financials, portfolio history, benchmark, dividends, earnings); QA found a HIGH 24h cache-poisoning path + 7 more | `5a30b3e` | 2026-08-05 | 8 | 0 |
| 99 | FMP live-browser verification — `earnings-calendar` ignores `symbol` and returned ANOTHER company's earnings (HTTP 200, wrong data) | `14bd3b6` | 2026-08-05 | 1 | 0 |
| 100 | Process audit — handoff process defined, unwritten shipping rules recorded, `docs/check.sh` added; DEPLOYMENT.md P0 (retired `X-Sync-Key` auth, removed routes, missing deploy ordering); QA caught 4 new false statements + a `pipefail` bug that made the checker lie; FMP key exposure closed by rotation | `96cd04f` | 2026-08-19 | 9 | 0 |
| 101 | Stale counters removed rather than repaired — CLAUDE.md's 8 wrong numbers fixed or deleted by volatility, `check.sh` guards re-introduction, check 9 rebuilt to scan new commits, CODING-LESSONS header synced | `74fe4eb` | 2026-08-19 | 5 | 0 |
| 102 | PDF Export QA (renumbered from a duplicate 24) | `eb93370` | 2026-07-01 | 5 | 0 |
| 103 | Scroll Preservation + Lazy-Load Charts (renumbered from a duplicate 33) | `36c8750` | 2026-07-02 | 5 | 0 |
| 104 | CSV Import Locale Detection (renumbered from a duplicate 34) | `3412aac` | 2026-07-02 | 4 | 0 |
| 105 | Summary table reconciled with the body — 4 unindexed categories, 3 renumbered duplicates, 2 placeholder hashes, rows 56-61 rebuilt from the body, total re-derived | `cd919d5` | 2026-08-19 | 11 | 0 |
| 106 | Orphaned items recovered and the dumps deleted — 32 items (twice the ~16 estimate) migrated to ROADMAP, 7 files removed, stale worktree cleared after checking its unmerged commit; duplicate `P.17` id, the last unfixed QA-sweep finding, 3 docs missing from CLAUDE.md's tree, and a workflow doc still prescribing a deleted branching model | `e828856` | 2026-08-19 | 10 | 0 |
| 109 | Archiving + the 2 missing ADRs — BUG-HISTORY split by date (~1 470 lines archived), ROADMAP 365 lines archived; **four** headings outside the category convention (`Session 25`, `Audit 19/20/21`) indexed as Cat 108/110/111/112, recovering 34 uncounted fixes; a checkbox that could never be ticked; 4 more `check.sh` fail-opens closed; ADR-044 and ADR-045 written, then corrected against the code | `6d9a272` | 2026-08-19 | 12 | 0 |
| 108 | Cross-Module Integration — archive system, portfolio↔pipeline auto-sync, review reminders, company summary tab (renumbered from an unindexed `## Session 25`; 25 was already Category 25) | `276315d`+`a8a499b`+`b9ab43e`+`d0613ae`+`7a9f617` | 2026-07-01 | 24 | 0 |
| 107 | Memory consolidated — 58 files → 30, `MEMORY.md` −63%; 11 stale pending-markers cleared across 3 files (5 of them invisible to a case-sensitive `check.sh` guard — its 3rd fail-open), a retired `SYNC_SECRET`/`Sync Key` still documented as live, "430+ bugs / 71 categories" against a real 574/106, "17 D1 tables" against 24, 7 dangling `[[links]]`, and a pointer to a handoff that was never written | `23fd7ae` | 2026-08-19 | 12 | 0 |

| 110 | Phase 16.3 Conviction Tracker QA (renumbered from an unindexed `## Audit 19`; 19 was already Category 19) | `c5f14b8` | 2026-07-01 | 3 | 0 |
| 111 | Phase 17.2 Position Sizing QA (renumbered from an unindexed `## Audit 20`; 20 was already Category 20) | `8b33ac8` | 2026-07-01 | 1 | 0 |
| 112 | Phase 18.2 Earnings Calendar QA (renumbered from an unindexed `## Audit 21`; 21 was already Category 21) | `121d1e8` | 2026-07-01 | 6 | 0 |
| 113 | Exchange rates nobody fetched — Portfolio showed `0 Ft` / `TWR −100%` because the rates table was only ever filled by a button; auto-fetch on boot. QA then found the automation's own guards: a write-back that could overwrite the user's `baseCurrency` after a failed D1 load, a backoff that failed open when localStorage did, no retry when connectivity returned, a trigger blind to foreign dividends — plus a sub-tab re-render calling a function that does not exist | `b8341d3` | 2026-08-26 | 6 | 1 |
| 114 | Process audit closing the hygiene track — every CLAUDE.md rule measured against the repo; zero violations since the rules were written down, lockstep never once broken. Found the **ninth and tenth** `check.sh` fail-opens: check 10 `warn`-and-skipped when the memory dir was absent, and check 6's prefix/purity assertions ran only on a clean tree — i.e. never in the invocation CLAUDE.md mandates. Plus an unset-`$HOME` abort that skipped two checks silently, a misdiagnosed unreadable dir, a dead whitelist variable, and two stale counters (one inside the checker's own header) | `d498829`+`0be1938` | 2026-08-26 | 4 | 0 |

| 115 | The four leaks Cat 114 left open, closed. Check 1 compared the two version markers instead of asserting they *moved*, so the likelier failure — app code shipping with **no** bump, both markers equal at the old value — passed the guard that exists to forbid it. Two `warn` sites encoded hard CLAUDE.md rules (stray `docs/` dumps; PENDING markers outside `STATUS.md`) yet never touched the exit code, and the pending-deploy pattern warned on the safe case while staying silent on the dangerous one. Check 10 asserted the handoff's *shape* but not its *currency* — it had gone green over a `STATUS.md` two commits stale. And nothing ran the gate at all unless someone remembered: now `.githooks/pre-push` + check 13. **QA then found seven more, including the new check 1 asserting that the marker lines were *touched* rather than that the version *changed*** — the same trap the batch existed to close, reproduced one level up | `46024a1`+`ee12352` | 2026-08-27 | 11 | 0 |

| 116 | **The totals stop mixing currencies (P.29 closed).** Every base-currency total fell back to the raw foreign amount when a rate was missing, so an empty rates table added it straight into a base-currency sum — $2 000 landing in a HUF total as 2 000 Ft, and the allocation doughnut drawing an 18.9% holding as 0.07%. One accumulator (`baseSum`) replaced all **34** sites; P.29 had recorded 16, because its grep counted one spelling of three. Four further sites mixed currencies **without ever calling `convertCurrency()`** and were found only by opening the app: a snapshot delta rendering `+33900.0%`, an index-to-100 chart, an account rollup, and a tooltip labelling dollars as forints. Plus a refused TWR published as exactly 0.0% Alpha. **The QA pass found eight more, the two worst created by the fix itself:** a `base_currency` NOT NULL DEFAULT `'USD'` colliding with readers that assumed the current base, so a D1 round-trip turned a 3.4M Ft snapshot into ~1.19bn Ft; and seven brand-new 'Fetch rates' buttons that stored the rates and never re-rendered, leaving the only way out of an emptied widget looking broken | `98ff584` | 2026-08-27 | 16 | 0 |
| 117 | **The i18n global is `i18n()`, not `t()` (P.28 closed).** P.28 recorded ~110 scopes binding a local `t` that shadows the global i18n `t()`, and proposed renaming those locals. That treats the symptom: the disease is a **one-letter global**, and `t` is the likeliest local name in JavaScript, so the trap reopens on the next `t=>` anyone writes. The global moved instead — **683 sites rewritten at AST byte offsets** (1 definition + 680 calls + **2 inside a static inline `onclick` handler**, which is HTML text and so invisible to every JS parser). The 104 shadowing scopes were left untouched and are now harmless. Measured with `acorn`, not grep, because Cat 116 had just taught that a scope count inherits the shape of its query: the real figure is **104**, not ~110, and **zero** of them ever called `t()` — the trap never sprang in four years. Also retired **8 comments** warning against shadowing `t`, which described a hazard that no longer exists. **QA found two, both mine:** an orphaned `*/` left by the comment surgery, and a comment shipped in code citing a `Cat 117` that did not yet exist. QA independently re-derived every count and diffed the string, regex and property-name multisets across the refactor — 14 689 strings, exactly two differing (`v58`→`v59`) | `7fad100` | 2026-09-06 | 5 | 1 |
| 125 | **The blocking export warning was rendering under the dialog that raised it — the profile PDF export has been impossible since v52.** `_confirmSensitiveExport()` opens `.confirm-overlay` at z-index **350**; the PDF dialog it is raised from sits at **9999**. The confirm was neither visible nor clickable, so the export waited forever on a decision nobody could make — and because the export could not run, nobody ever saw whether the PDF's `(3/4 pillars)` line from Cat 124 was right. Peter found it by trying to run TEST-PLAN case 41. **QA then found three regressions in the fix itself**: raising `.toast-container` to clear the confirm put toasts over the **opaque lock screen** (leaking a ticker through `toast.pdfExported`) and, at ≤768px where the band is full width and `pointer-events:auto`, over a dialog's footer buttons — so that half was reverted; `showPasswordPrompt`'s inline `z-index:400`, a value derived from the old 350 base, was left behind and put the **backup-passphrase prompt** below the class it is built from; and the raised confirm now cleared the lock screen, so a destructive confirm raised before a mid-session 401 stayed **clickable on top of a locked app**. Also: the Score column header still described the score as `Composite Quality Score (0-100)` — Cat 124's corrected formula had landed only in the metric help card, and the header is the surface people actually hover — and three `METRIC_TIPS` pillar formulas named metrics their pillars do not score, `_scoreHlt` claiming an interest-coverage term the health pillar has never had | `ca3d834` | 2026-09-08 | 10 | 1 |
| 124 | **A partial Quality Score now says so — P.35 closed, Peter's call.** The composite renormalises over the pillars it could compute, so a company missing one was scored on the other three and rescaled to 100: **85/100 from three pillars outranked 69/100 from four**, in a column the Tracker sorts by. Rather than re-rank every company, the number now declares what it rests on — a `3/4` marker on the Tracker, `(3/4)` in Compare, `(3/4 pillars)` in the PDF, and a help text that describes the renormalisation instead of an average. **QA found the critical one: Compare was still crowning the company with the LEAST data**, in the one view whose purpose is to declare a winner — so the green crown is now dropped when the pillar counts differ. It also found that absolute positioning moved the marker out of the layout but NOT out of `textContent` (`"853/4"` to a copy/paste), that 9px at `opacity:.7` measured 2.19:1, and that the breakdown panel the marker points people to read `83/100 across 3 pillér` on a Hungarian UI. **A second QA round over those fixes found the accessibility fix had DELETED the score from the accessibility tree** — an `aria-label` replaces a cell's name rather than adding to it, so a hundred Score cells were all announced as "Click for score breakdown" — plus a Compare crown that compared how many pillars instead of which, and an unguarded predicate that would have made "Compare" silently do nothing for anyone holding one corrupt company. The i18n gate rejected the fix's own runtime-built key along the way | `e22b285` | 2026-09-07 | 14 | 2 |
| 123 | **A corrupt market cap was scoring a company 82 out of 100.** Peter's Tracker showed Apple with a market cap of `3`, and every ratio built from it read `0.0x`. calcStockRatios only checked that the cap was above zero, not that it was plausible — so on the dashboard the ratios collapsed, and on the Tracker the SAME number produced a **perfect 25/25 valuation pillar** and a buyback yield of 8000000000000%. The dashboard was the mildest consumer of a corrupt field. Also: the allocation widget was clipping two of its four doughnuts because `1fr` is `minmax(auto,1fr)` and a Chart.js canvas will not shrink; the benchmark's `—` never said why. **QA rejected the ratio fix twice** — it guarded the weighted AVERAGE (which absorbs one broken holding into a plausible 24.0) and it masked at one consumer while eight others kept reading the field — and caught that this batch's own v64 message named a cause that cannot happen. Worst of all, v64's dip fix DESTROYED known-good 52-week highs on a failed refresh, under a green success toast | `af7d65f` | 2026-09-07 | 11 | 1 |
| 122 | **The dashboard was publishing a -100% return on a portfolio that had lost nothing.** Peter looked at his own dashboard: TWR -100.0%, Alpha -99.9%, P&L +0 Ft. Both of his snapshots stored a total of **zero**, and calcTWR multiplies period returns — one period ending at zero makes the product zero, and zero times anything stays zero, so the metric was pinned at exactly -100% for the life of the portfolio. Cat 116 taught takeSnapshot() to refuse a missing exchange RATE; a missing PRICE walked past it as 0. Also: the Dip Finder divided a fresh 52-week high by a price that could be months old (a "-71% dip" on AAPL), the widget hide button sat on top of three widgets' Refresh buttons, and the allocation tooltip never showed a share. **QA found the first round of fixes wrong in three places**, the worst being that the Snapshots panel bypassed the very chokepoint the fix relied on and went on printing 0 Ft and -100.0% beside a TWR that had already given up | `56ad30b` | 2026-09-07 | 12 | 0 |
| 121 | **What the owner's first manual pass found — and the class behind each.** Every defect here came from Peter opening the app and using it, which is the check no gate in this repo can perform. **Global search was entirely dead** for anyone who had ever written a review: `.map` was called on `answers`, which is an OBJECT, so the whole function threw — and one throw kills every source, so typing "app" with an Apple position on screen returned nothing. That was **one of seven**: QA reproduced six more shape assumptions in the same function, each equally fatal, in data that `doImport`/`doRestore` assign verbatim from a backup file. **No tab ever looked selected in Hungarian**, because both strips compared the *translated* label to an internal id. **Cmd+1..7 could not work** and the guide advertised it anyway; the first replacement used bare digits and Peter rejected it — a convenience that fires by accident is a bad trade. **Charts went blank with the reason sitting in the console**, and a transient Yahoo 429 was permanent for the session. QA then found five more layers in the chart fix alone, including a module-level counter that let an abandoned round report "0 of 3 could not be loaded" over three charts that had just loaded | `bef0448` | 2026-09-07 | 21 | 0 |
| 120 | **Checklist progress reaches the tracker, and the broker dead end ends.** Three UX items were picked; **two were already built and only their checkboxes were stale**, which is the batch's most useful finding — a backlog that misdescribes the product sends the next session to rebuild what exists. The real work: a `CL%` column that delegates to the checklist's own `overallProgress` rather than counting again, and three "Add a broker account first" dead ends that now offer the fix and resume the original action. **QA found five, and the worst was the exact failure the commit claimed to have designed around:** the not-started guard asked `if(!cl)`, but `_d1CompanyToTStock` gives every company a bare `checklist:{sections:{}}`, so in the D1 path it never fired and untouched companies showed a fabricated **7-13%**. Also: a table render was writing derived progress into state that syncs to D1; one malformed checklist silently froze the whole table; resuming into an *edit* could reassign a transaction's broker; and a double-submit lock taken before validation swallowed the corrected retry | `cba751a` | 2026-09-06 | 8 | 1 |
| 119 | **The i18n contracts stop being hand-maintained (check 14).** The invariants Cats 117 and 118 established by hand — every used key exists in every dictionary, nothing resolves to a global `t`, `applyI18n()` still does its two jobs, no element shadows `i18n` in a handler's `with` scope — are now asserted by `docs/i18n-invariants.mjs`, which parses `index.html` with acorn. **QA found FIVE fail-opens in the first version**, in a gate whose own header forbids exactly that: the `applyI18n` assertion was a regex to the first newline, so a trailing `// TODO restore …` comment satisfied both halves while both defects were reintroduced; `data-i18n` was recognised only double-quoted (check 4's own antipattern, verbatim); `\bsrc\s*=` also matched `data-src=`, cloaking a whole script block; inside inline handlers `t` was caught only when *called*, so `[t]` passed; and a dictionary that was not an object literal was dropped in silence while the summary claimed the languages agreed. Also five false positives that would have blocked correct work, an undeclared acorn dependency, and the two real blind spots now **pinned** so growth fails | `c61957c` | 2026-09-06 | 16 | 0 |
| 118 | **The sign-in gate follows the language setting (P.31 closed).** `applyI18n()` had exactly two callers, `autoLoad()` and `renderDbFiTracker()`, and both run only after a successful sign-in — so the first screen every user sees was the one screen i18n never reached, with **ten** fully-translated keys that could never display. Now applied on `DOMContentLoaded`, which the spec orders strictly before the `window` `load` handler that un-hides the gate, so it is painted already translated. Three more in the same function: **`<html lang>` was hard-coded `"hu"`** while the app defaults to English, so every English user was served a page declaring Hungarian; **`textContent` was silently deleting all 12 dashboard widget tooltips**, because `initWidgetTips()` appends them *inside* `data-i18n` nodes and the widgets render lazily, so `renderDbFiTracker()` wiped them the moment the FI widget scrolled into view (measured 12 → 0, now 12 → 12); and the preservation reads **direct children only**, so a nested node's bubble can never be re-parented onto its ancestor. **The batch's own worst moment was self-caught:** a first fix rewrote the wrong thing because its supporting measurement was taken on the live DOM, which the old `textContent` had already flattened — the source markup was never looked at | `47d6746` | 2026-09-06 | 5 | 2 |

**Total: 771 fixed, 29 potential (unfixed)** — derived from the Fixed column above, not maintained by hand; `docs/check.sh` fails if the two ever disagree. — P.3/P.15/P.16 accepted as external limitations.

 (Cat 83/84/85/87 are QA-clean 0-fix batches; Cat 86 = 1 QA-caught fix; Cat 88 = 1 runtime-state fix; Cat 90 = 6 data-loss fixes from the final security sweep; Cat 91 = 5 adversarial-QA fixes folded into the encrypted-backup feature; Cat 92 = 1 QA collision-id guard in the restore-completeness batch; Cat 93 = 3 QA nits in the Data-Management UX-polish batch; Cat 94 = 2 QA completeness fixes in the HTML-archive export; Cat 95 = 4 ungated sensitive exports found + gated by QA; Cat 96 = 8 adversarial-QA fixes folded into the historical-in-backup batch; Cat 97 = 6 adversarial-QA fixes folded into the cloud-snapshot batch; Cat 98 = 8 adversarial-QA fixes folded into the FMP /stable migration; Cat 99 = 1 wrong-data endpoint caught only by live-browser verification.)

---

## Potential Bugs (Unfixed)

Issues identified during QA audit that were not fixed. Grouped by severity.

### WARN — Should Fix (14)

| # | Cat | Issue | Impact | Why Not Fixed |
|---|-----|-------|--------|---------------|
| P.1 | 5 | No FMP API call budget tracking (250/day limit) | User can silently exhaust daily quota with no warning | Needs new feature: call counter + localStorage persistence + warning UI |
| P.2 | 5 | No client-side cache in non-D1 mode | Every company profile view re-fetches all API data | `cachedFetch()` returns `fetchFn()` directly when D1 off; needs sessionStorage or in-memory TTL cache |
| P.3 | 5 | FMP `/profile` endpoint doesn't return totalDebt/totalCash | EV/EBIT calculations use 0 for debt/cash on FMP-only stocks | Needs separate balance sheet API call; FMP free tier rate limits make this expensive |
| P.4 | 5 | Worker: no rate limiting | Attacker can exhaust API quotas via unrestricted proxy | Needs per-IP or per-key throttling in Worker |
| P.5 | 5 | Worker: Yahoo chart endpoint lacks crumb/cookie auth | May break if Yahoo enforces auth on chart endpoint | `/quote/` uses crumb but `/chart/` doesn't; could break without warning |
| P.6 | 5 | Worker: company DELETE not transaction-safe | Notes deleted but company delete fails → orphaned note deletion | Two separate DELETE statements not wrapped in db.batch() |
| P.7 | 5 | `fetchAllDividendData` dedup flag not in `finally` block | Exception mid-fetch permanently locks function until page reload | `_fetchingDivData=false` not in finally; other dedup guards (refreshProfile, benchmark) correctly use finally |
| P.8 | 6 | `skipWaiting()` unconditional in SW | New SW activates immediately, can disrupt active sessions | Should use `clients.claim()` strategy or prompt user before activating |
| P.9 | 6 | `chInited` flag never resets | Stale chart data when navigating away and back to tracker | Flag set on first chart render, never cleared on navigation |
| P.10 | 7 | Web Crypto used without secure-context guard | `crypto.subtle` is undefined over plain HTTP (non-localhost) — encryption setup crashes | Should check `window.isSecureContext` before offering encryption |
| P.11 | 8 | No file size limit on import/CSV file reads | Loading a 500MB file freezes the browser | FileReader reads entire file into memory; should check `file.size` before reading |
| P.12 | 8 | Two inconsistent `parseNum()` functions | Line ~6314 returns 0 on failure, line ~4272 returns NaN — different callers get different behavior | Should unify to single function with consistent return |
| P.13 | 8 | No `fetchStockData` deduplication | Concurrent calls for same ticker waste API quota | Needs in-flight request map like the dedup guards on other fetch functions |
| P.14 | 8 | `autoSave` has no debounce | 100ms setTimeout on every input event causes overlapping saves when D1 sync is slow | Should use proper debounce (clearTimeout + setTimeout) |

### INFO — Acceptable Risk (4)

| # | Cat | Issue | Impact |
|---|-----|-------|--------|
| P.15 | 7 | `accent-color` needs Safari 15.4+ | Checkboxes show system color instead of accent — cosmetic only, graceful degradation |
| P.16 | 7 | `fetch keepalive` ignored in Firefox 90-99 | Sync on page close may fail on 4+ year old Firefox — negligible user base |
| P.17 | 8 | `renderPositions` NaN propagation on malformed data | Shows 0 instead of NaN — has `\|\|0` fallbacks, not ideal but non-crashing |
| P.18 | 8 | Screener filter score cache missing | Recalculates scores on every filter — unnoticeable at <50 stocks |

### Deep Audit Findings (Not Acted On)

These were found by the deep audit agent but not prioritized for fixing:

| # | Issue | Risk | Notes |
|---|-------|------|-------|
| D.1 | Screener filter keys (`k`) in onclick handlers not escaped | Low — keys come from hardcoded SCREENER_DEFS constants | Would only matter if screenerFilters populated from imported JSON |
| D.2 | `md.label` in innerHTML without escH() | Low — comes from internal metric definitions | Purely internal data |
| D.3 | parseInt without radix in 3 locations | Low — modern browsers default to radix 10 | Lines 2574, 4248, 4252 |
| D.4 | CSV number parsing regex has moderate backtracking potential | Low — input is anchored and bounded | `/^\d{1,3}(\.\d{3})+,\d+$/` |
| D.5 | Portfolio grouping uses computed keys (prototype pollution risk) | Low — ticker regex `[A-Z0-9.]{1,10}` prevents `__proto__` in tracker, but CSV import has no such restriction | Only exploitable via crafted CSV import |

---

## Category 102 — PDF Export QA (2026-07-01) — `eb93370`

*Renumbered 2026-08-19: this was written as "Category 24" and a later batch reused that number, leaving this section invisible in the summary table. Content unchanged; the date column preserves the chronology.*

### Fixed (5)

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 102.1 | XSS risk: inline onclick with ticker interpolation in PDF dialog | Replaced with data-attribute + addEventListener | index.html:11637 |
| 102.2 | Null ref: window.jspdf undefined if CDN blocked | Added validation check before destructuring | index.html:11659 |
| 102.3 | Memory: jsPDF doc object never cleaned up | Moved closePdfDialog() to finally block (doc goes out of scope) | index.html:12236 |
| 102.4 | Dialog stays open on PDF generation error | Moved closePdfDialog() to finally block (always runs) | index.html:12233 |
| 102.5 | PDF dialog not responsive on mobile <480px | Added media query for max-width and scrollable section list | index.html:912 |

### Unfixed (0)

---

## Category 103 — Scroll Position Preservation & Lazy-Load Charts (UX audit, 2026-07-02)

*Renumbered 2026-08-19 — originally written as "Category 33", a number a later QA batch reused.*

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | HIGH | `history.scrollRestoration='auto'` — browser's built-in scroll restore interfered with manual scroll management | Added `history.scrollRestoration='manual'` to disable browser's default |
| 2 | HIGH | `requestAnimationFrame` / `setTimeout` scroll restore never took effect — browser layout not settled when async callback fires | Changed all scroll restores to synchronous: `void document.body.offsetHeight; window.scrollTo(0, pos)` |
| 3 | HIGH | `switchCompanyTab` called from `showSection` saved wrong scrollY (mid-transition value) and overrode section scroll restore | Added `skipScroll` parameter; `showSection` passes `true` to skip sub-tab scroll save/restore |
| 4 | HIGH | `closeProfile()` scroll restore clobbered — `window.location.hash` change re-triggered `handleRoute` → `showSection` which overwrote saved scroll with 0 | Changed to `history.replaceState` to update hash without triggering hashchange |
| 5 | LOW | Dashboard widgets rendered eagerly — all 13 widgets created on section load, causing unnecessary layout work | Added `lazyChart()` utility with IntersectionObserver (200px rootMargin); first 2 widgets eager, remaining 11 lazy |

---

## Category 104 — CSV Import Locale Detection (UX audit, 2026-07-02)

*Renumbered 2026-08-19 — originally written as "Category 34", a number the i18n QA batch reused.*

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | HIGH | US numbers `1,234.56` parsed as 1 — `parseFloat` stops at comma | New `_csvNumParse(s,locale)` handles both EU and US formats correctly |
| 2 | HIGH | No locale auto-detection — EU decimal commas silently misinterpreted | Added `_detectNumLocale()` scoring heuristic: scans numeric columns for format patterns (e.g. `\d.\d{3},\d` → EU) |
| 3 | MED | CSV delimiter detection failed for EU files — semicolons not detected when data contains commas in numbers | Changed to header-line heuristic: count semicolons vs commas in first line, pick higher |
| 4 | LOW | No user override for auto-detected locale | Added "Number format" dropdown in preview UI (Auto/EU/US) |

---

## Category 84 — Security v2 B3b-2: Remove Legacy Client-Encryption + Legacy KV Sync (2026-07-24)

**Not bug fixes — the riskiest hardening batch in the project** (kept here per the per-batch doc policy). Retires the deprecated password-based client-side encryption system AND the legacy KV `/sync` cloud path; the boot/lock gate now keys **solely** off the master-password auth token + envelope DEK (Security v2 Phase B/C). Frontend-only; no worker/schema change. sw.js **v41**. Net **−521 lines**.

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 84.1 | Remove legacy client-side encryption | Deleted `encryptPayload`/`decryptPayload`/`isEncryptedBlob`, `encryptVerify`/`verifyPassword`/`verifyPasswordWithMeta`/`isEncryptionEnabled`, `_encPass`, and the idle-lock timers (`_autoLockTimer`/`_encIdleTimer`/`_resetEncIdleTimer` + `AUTO_LOCK_DELAY`/`ENC_IDLE_TIMEOUT`). **KEPT** `deriveKey`/`hashKey`/`generateRecoveryKey`/`recoveryWrapKey`/`b64`/`unb64` — the handoff removal list was wrong here: the kept envelope/recovery-key auth calls `recoveryWrapKey`→`deriveKey`, so removing `deriveKey` would have broken master-password recovery. | `681354b` |
| 84.2 | Remove legacy KV sync path | Deleted `cloudSave`/`cloudLoad`/`testSync`/`scheduleCloudSave`, `autoLoad`'s `!d1Mode` KV-load tail, `autoSave`'s `scheduleCloudSave` branch, and the `visibilitychange` idle-lock block. **KEPT** the token-authed (vestigial) `/sync/meta` path: `cloudSaveMeta`/`cloudLoadMeta`/`cloudSaveMetaRetry`/`buildMeta`/`_metaVersion`. `buildMeta` reworked to report `has_encryption:false`, `enc_salt/verify/recovery:null` (it no longer references the removed `isEncryptionEnabled`). The dead `/sync/load|save|restore-backup` routes are removed worker-side in B3c. | `681354b` |
| 84.3 | Rework boot/lock gate (brick-critical) | Pre-paint IIFE now **unconditionally** adds `app-locked`; the async boot IIFE clears it only on the token+DEK path (→`autoLoad`), else routes every no-token case to `showMasterLogin()` (mpInit true/false/null). Removed the legacy `lock-unlock`/`lock-setup` boot branches + the `autoLoad` password-reauth check (`showReauthScreen`). Every reachable boot state ends in either app-visible or a visible master-login/recovery gate — **never** stuck behind hidden `app-locked` chrome. Verified in-browser across no-token, token-invalid-DEK, and `autoLoad`-body paths (`bricked:false` on all). | `681354b` |
| 84.4 | Remove legacy lock/encryption UI | Deleted `unlockApp`/`setupEncryption`/`skipEncryption`/`finishSetup`/`recoverWithKey`, `changeEncPassword`/`updateEncStatus`, `showReauthScreen`/`handleReauth`; the `#lock-unlock`/`#lock-setup`/`#lock-recovery-key`/`#lock-recovery`/`#lock-reauth` views; the `#settings-encryption` card + its Settings-nav pill. `showLockView` now toggles only `lock-masterlogin`/`lock-mprecovery`. | `681354b` |
| 84.5 | Cosmetic `getSyncKey()` → `hasDataAuth()` | Converted display/gate guards that were sync-key-only to token-or-sync-key: `fetchInsiderTrading`, `renderInsiderTrading`, `renderApiUsage` (3× `key:hasDataAuth()`; used only as `!!api.key`), `updateD1UI`, `testFinnhub`, `testFmp`. The "Sync Now" button → `testD1()` unconditionally. The `authDataHeaders`/`setupMasterPassword`/`renderMasterPassword` sync-key references are intentionally left for B3c. | `681354b` |

**QA:** 1 adversarial agent over the working-tree diff (8-point brick-hazard checklist) = **SHIP, 0 defects**. Independently verified: all 22 removed symbols return grep-count 0 (remaining `cloudSave` hits are i18n keys + the D1 `API.scheduleSave` retry path); no `onclick/onkeydown` references a removed fn; `showLockView` only ever called with the 2 kept views; brace/paren balance intact (6/6 inline `<script>` blocks parse clean); `buildMeta` caller works; boot IIFE has no gate-less terminal state; `hasDataAuth()` swaps coherent. Also verified in-browser: sw.js **v41** loads, master-login gate renders, recovery view toggles.

---

## Category 85 — Security v2 B3c: Retire the Sync Key (2026-07-24)

**Not bug fixes — the final, IRREVERSIBLE step of Phase B** (kept here per the per-batch doc policy). The master-password device token is now the SOLE data credential; the legacy sync key (`X-Sync-Key` header + the `SYNC_SECRET` Worker secret) is gone from both the Worker and the client. sw.js **v42**. Net **−108 lines**.

**Preconditions confirmed with Peter before deploy:** his device is on v41+ and boots by token (B3b-2 token-boot verified), and the recovery key is saved — the two backstops against lockout. Removing `/auth/setup` means **no in-app new-account bootstrap anymore** (accepted: single provisioned account; recorded here and in ADR-040).

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 85.1 | Worker `authenticate()` token-only | Dropped the `X-Sync-Key`/`SYNC_SECRET` branch → a request authenticates only with a valid `X-Auth-Token` (KV `token_<sha256>` lookup). | `2ba0019` |
| 85.2 | Worker remove `/auth/setup` | The sync-key-gated one-time bootstrap route is gone (dead post-provision; would 401 anyway once `SYNC_SECRET` is unset). | `2ba0019` |
| 85.3 | Worker remove legacy KV blob sync | Deleted `/sync/load`, `/sync/save`, `/sync/restore-backup` (+ their `user_data`/`user_data_backup` writes). **KEPT `/sync/meta`** (GET+POST, token-authed, vestigial version/mode marker still used by the client). CORS `Allow-Headers` dropped `X-Sync-Key`. | `2ba0019` |
| 85.4 | Client token-only auth | `authDataHeaders()` → `{X-Auth-Token}` or `{}`; `hasDataAuth()` → `!!getAuthToken()`; `API._fetch` guard token-only; `API._key` removed. | `2ba0019` |
| 85.5 | Client remove sync-key surface | Deleted `authSetup()`/`setupMasterPassword()` + the `#mp-setup-form` Settings UI; `renderMasterPassword()` reworked to not depend on it; replaced the `#st-synckey` field with a "Cloud Sync — authenticated by your master password" note (kept Test-D1 + status); dropped `syncKey` from `stSettings`/`loadTrackerSettings`; removed `getSyncKey()`. i18n `settings.cloudSync`/`tokenAuthNote` (EN+HU); corrected the stale `settings.apiKeysNote` "Only your Sync Key is kept locally" copy. | `2ba0019` |

**Deploy (Peter, IRREVERSIBLE — order below):** (1) `cd web/cloudflare-worker && npx wrangler deploy`; (2) verify the app still loads + saves on his token device; (3) `npx wrangler secret delete SYNC_SECRET`. Frontend (v42) already auto-deploys via GitHub Pages and is safe against the pre-deploy dual-auth worker (his device is token-authed). Lockout backstop: `/auth/login` + `/auth/recover` stay public; existing device tokens are independent of `SYNC_SECRET`.

**QA:** 1 adversarial agent over the worker+client diff (8-point checklist incl. lockout hunt) = **SHIP, 0 defects**. Verified: no worker path references `X-Sync-Key`/`SYNC_SECRET`/`/sync/load|save`/`action==='setup'` (only comments); `/sync/meta` intact + brace-balanced; `/auth/login`+`/auth/recover` still public (no lockout); existing tokens survive the secret unset; client has zero live refs to removed symbols; `renderMasterPassword` works without the setup form. Worker + 6/6 inline client scripts `node --check` clean. In-browser: token-only headers (no `X-Sync-Key`), `hasDataAuth` false w/o token & true w/ token, `renderMasterPassword` renders, remote worker `initialized:true`.

---

## Category 86 — Security v2 C3b: Encrypted Clear-and-Restore (2026-07-24)

Fixes **SV.8**: with encryption active, "Restore from Backup" REPLACED-vs-MERGED. Previously the encrypted restore upserted the backup via the savers without clearing the cloud, so D1 rows absent from the backup survived and could resurrect after a reload. C3b clears the cloud first, then re-encrypts + re-inserts. Worker needs `wrangler deploy` (new route, no schema change). sw.js **v43**.

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 86.1 | Worker `POST /api/purge` | Token-authed full clear of user-entity tables (`companies`/`notes`/`broker_accounts`/`portfolio_snapshots`/`exchange_rates`/`general_todos`/`framework_entries`/`reviews`/`valuations`); children cascade via `ON DELETE CASCADE`. Leaves `app_settings` (key-value config, upserted — no resurrection); `api_cache` clears via the companies cascade (regenerable). Shared `userDataClearStmts()` refactored out of `handleMigrate` (its behavior unchanged). | `feb4b4b` |
| 86.2 | Client `_c3bClearAndRestore()` | cancelPending → purge → `_stripD1Refs()` → phase 1 (companies/accounts) → recapture new company D1 ids → phase 2 (children resolve FKs via the recaptured ids). **No reload and no D1→local read** → a mid-flow failure leaves local data intact and re-syncs on the next normal save (worst case = D1 incomplete, never data loss). | `feb4b4b` |
| 86.3 | `API.cancelPending()` + `flushAllAwait()` | Queue primitives: cancel drops scheduled merge-writes without sending; awaitable flush sends all pending and resolves when they settle. | `feb4b4b` |
| 86.4 (QA-fix) | Strip ALL stale company-id caches, not just positions | **Adversarial QA CRITICAL:** `_stripD1Refs` initially stripped `_d1*` + `pfPositions[].companyId` but MISSED the identical non-prefixed `companyId` cache on `pfTransactions`, `researchNotes[*]`, and `rvData.entries`. Since `companies.id` has no AUTOINCREMENT, post-purge re-inserts get fresh rowids → a stale cached `company_id` → the atomic `transactions/notes/reviews` batch hits an FK violation → **the whole batch 500s and is dropped** → on next reload the D1-load overwrites localStorage → permanent loss of all transactions / company-linked notes/reviews. Fixed: strip `companyId` on all four; `saveResearchNotes` gained a `_tickerToD1Id(ticker)` fallback (transactions/reviews already had one) so company-linked notes keep their link. | `feb4b4b` |

**Verified:** worker `node --check` + `node:sqlite` purge dry-run (cascade clears all 11 parent/child tables; `app_settings` preserved); 6/6 inline client scripts parse; in-browser `_stripD1Refs`/`cancelPending`/`flushAllAwait` behavior (incl. the 86.4 re-verify: `companyId` stripped on all four, `ticker`/`companyTicker` preserved). Adversarial QA agent: 1 CRITICAL (86.4) → fixed + re-verified; data-safety invariant ("never reads D1→local; worst case D1-incomplete, not data-loss") confirmed. **Deploy:** `cd web/cloudflare-worker && npx wrangler deploy` (frontend v43 already live; until the worker deploys, an encrypted restore's `/api/purge` 400s → caught → falls back to the old merge + "restored locally" warning — safe degrade).

---

## Category 87 — Security v2 Phase D: Final Security Sweep + Closeout (2026-07-24)

**Closes Security v2.** A final holistic adversarial security sweep over the whole end-state (auth model, E2EE, no-sync-key) produced a **clean sign-off — no must-fix gaps**: zero unauthenticated data routes (every `/api/*`, `/proxy/*`, Yahoo, `/sync/meta`, `/auth/dek|devices|revoke|change` gated by token `authenticate()`; only salt/login/recover/health public), no live sync-key credential or `SYNC_SECRET` read anywhere, `/auth/change`+`/auth/recover` sound (prove old password / recovery key, revoke all tokens), brute-force limiter on login+recover keyed on edge-set `CF-Connecting-IP`, `encStr` fails closed (throws when DEK required but absent → can't write plaintext), full saver encryption coverage vs the `C3_TABLES` manifest, api_cache write-path sanitized (SV.6), and clean secrets hygiene (no key/token logged or in a URL).

Applied the 4 nice-to-have cleanups the sweep flagged (no behavior change):
| # | Item | Detail |
|---|------|--------|
| 87.1 | `wrangler.toml` | Removed the stale "`SYNC_SECRET` — auth key for /sync endpoints (Required)" secret line (unused post-B3c). |
| 87.2 | worker `api_cache` comment | Corrected the `CACHE_STOCK_STRIP` comment that said the cache WRITE path was "unchanged / plaintext concern open" — the write path IS sanitized now (client `_sanitizeStockCache` allowlist, SV.6). |
| 87.3 | `API-REFERENCE.md` Security Notes | Replaced the false "API keys sent in query parameters" + "sync key timing-safe" lines with the current model (server-side keys via proxy, token auth, envelope E2EE at rest). |
| 87.4 | docs | ROADMAP Phase D closed + Security v2 marked COMPLETE; ARCHITECTURE §7 / KNOWN-ISSUES SV.* confirmed accurate. |

Deferred (pre-existing, non-blocking, accepted): SV.1 (per-isolate in-memory rate limiting — the *auth* brute-force limiter is already KV-durable), SV.4 (CORS localhost origins), SV.5 (bearer token in localStorage — device-trust posture).

---

## Category 88 — Purge Stale Legacy Encryption Verifier from Server Meta (2026-07-24)

**Runtime-state finding (Peter spotted it in the browser console), not caught by the code-only Phase D sweep.** The `/sync/meta` response still carried the pre-B3b-2 legacy client-encryption fields — `has_encryption:true` + `enc_salt`/`enc_verify`/`enc_recovery`. That system was removed in B3b-2 and `buildMeta()` now nulls those fields, but the old values were still sitting in KV `user_meta` because nothing had overwritten it since. `enc_verify` is an AES-GCM verifier of a known plaintext under the legacy password-derived key → an **offline-brute-forceable verifier for the (legacy) password, at rest in KV**. `/sync/meta` is token-authed now (only an authenticated device reads it), so LOW severity, but stale sensitive state worth purging.

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 88.1 | Self-heal the stale meta | `autoLoad` now overwrites `user_meta` with the clean `buildMeta()` (nulled enc fields) when the loaded meta still has `has_encryption`/`enc_*` set. One-time + self-terminating (next boot sees nulls → no-op). | `39100c8` |
| 88.2 | Stop logging the verifier | Removed `console.log('cloudLoadMeta response:', …)` which printed the meta (incl. the verifier) to the console on every boot. | `39100c8` |

sw.js **v44**, frontend-only (reload triggers the self-heal). **Lesson (CODING-LESSONS):** a security sweep must audit runtime/stored STATE (KV, D1, localStorage), not just the code that writes it — removing the writer doesn't remove data already written.

---

## Category 89 — Backup Restore Wiped the Auth Token (2026-07-24)

**Peter caught it live testing the C3b restore** (`wrangler tail` + console): every restore attempt logged the device out and flooded the console with `D1 save error … API not configured`, and the cloud restore silently did nothing.

**Root cause:** `doRestore()` wipes `localStorage` except a `keepKeys` allowlist (`index.html:4556`) that predated master-password auth and never included the session keys. A restore therefore deleted `auth_token` (+ `dek_cache`/`enc_active`/`d1_migrated`/`meta_version`) → the device was logged out mid-restore → `hasDataAuth()` false → `API.ready()` false → the entire `if(d1Mode && API.ready())` cloud-restore block (incl. the C3b `_c3bClearAndRestore` purge) was **skipped**, and any straggler save threw "API not configured". Pre-existing since master-password auth landed; C3b surfaced it because its purge depends on the token.

**Silver lining:** because the token was gone, the C3b **purge never ran** → D1 was never cleared → re-login showed all data intact. **No data loss** at any point.

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 89.1 | Preserve session/auth/mode keys across restore | Added `auth_token`, `dek_cache`, `enc_active`, `d1_migrated`, `meta_version` to `keepKeys`. These are identity, not data — they must survive a data restore. With the token preserved, the C3b clear-and-restore now actually executes (purge → re-encrypt → re-insert) as designed. | `17f9845` |

sw.js **v45**, frontend-only. **Lesson (CODING-LESSONS Data-Safety):** a "wipe everything except X" allowlist is a standing liability — every new cross-cutting key (auth tokens, session/mode flags) must be re-checked against it. Prefer wiping only known *data* keys over "wipe all except keep-list".

---

## Category 90 — Security v2 Phase-D Final Sweep: C3b Restore Data-Loss Paths (2026-07-24)

**Final adversarial security sweep of the whole Security v2 end-state — 5 parallel agents** (auth/authorization, crypto/E2EE, data-at-rest/leakage, client/XSS, destructive-flow data-safety). **The security surface came back essentially clean** (see the ✅ notes below); the real findings were **data-loss paths in the C3b encrypted clear-and-restore** — latent in Peter's successful live test (small data, no failures) but live under a mid-restore failure or >1000-row tables. sw.js **v46**.

**Security dimensions — clean:** Auth/authorization ✅ (every route token-gated, zero sync-key residue, password-proof required for change/recover, brute-force not spoofable, no SSRF/open-proxy). Crypto/E2EE ✅ (fresh IV everywhere, PBKDF2 600k, encKey⊥authKey one-way, DEK never leaves client, recovery double-hash, encStr/decStr never blanks on failed decrypt). Data-at-rest ✅ (all ~24 sensitive write paths encStr'd, api_cache both-side sanitize, /migrate 403-gated fail-closed, no sensitive console/URL leakage). Client/XSS ✅ (marked→DOMPurify + escH everywhere; no working payload; no secrets in source).

| # | Sev | Item | Fix | Commit |
|---|-----|------|-----|--------|
| 90.1 | CRITICAL | Partial C3b + reload = silent total loss (next-boot autoLoad reads partial D1 → overwrites intact local; reconcile runs after loaders) | `c3b_incomplete` guard set before purge, cleared only on full success; new autoLoad recovery branch loads localStorage (not partial D1) + re-pushes via shared `_c3bResaveToD1()` | `cc485c8` |
| 90.2 | CRITICAL(follow-up, QA-caught) | `flushAllAwait` swallowed save rejections → `_c3bResaveToD1` never threw on a network drop → guard cleared over a purged D1 (still lost the DB) | `flushAllAwait` now returns success; `_c3bResaveToD1` throws on any failure → flag persists → recovery | `cc485c8` |
| 90.3 | HIGH | Unchunked batches hit the worker 1000-item cap → whole batch 400s → data type dropped | positions/transactions/portfolio_snapshots/snapshot_positions/dividend_history/notes/valuations → chunked `postBatch` | `cc485c8` |
| 90.4 | HIGH | `savePortfolioTransactions` sent unresolvable-FK rows → null company_id → NOT NULL → whole atomic batch 500s (ALL transactions dropped) | filter to syncable rows (resolved company_id + account_id), mirroring positions | `cc485c8` |
| 90.5 | MEDIUM | `cancelPending` didn't drain in-flight saves before purge (race → duplicates) | await `_inFlight` before purge | `cc485c8` |
| 90.6 | MEDIUM | recapture/load caps `limit=500/1000` could drop rows above the cap | raised to `100000` (worker GET cap) | `cc485c8` |
| 90.7 | MEDIUM | CSP `connect-src https://*.workers.dev` — anyone can register a worker → stolen-token exfil target | pinned to the exact worker host | `cc485c8` |

**QA:** the destructive-flow finder agent produced the CRITICAL/HIGH map; a dedicated QA agent then verified the fix batch **SHIP on #3–#7 and caught 90.2** (the `flushAllAwait`-swallows-errors hole in the CRITICAL fix), which was then fixed + re-verified in-browser (flushAllAwait returns true/false correctly).

**Deferred / accepted (documented, not fixed here):** notes full-text search now runs over encrypted title/content → searches ciphertext (functional, KNOWN-ISSUES); a schema-valid-but-WRONG backup still purges+replaces (no different-account detection); CSP pin means a user-set custom worker URL on a different host is blocked (fine for the default deployment); defense-in-depth — the v44 legacy-meta-verifier purge is client-runtime-dependent, closeable with a one-off `wrangler kv` `user_meta` overwrite.

**Lesson (CODING-LESSONS):** a helper that swallows errors (`.catch()` + `Promise.allSettled`) turns a failure into a silent success — lethal when a guard/rollback decision keys off "did it throw?". Make such helpers report success explicitly.

---

## Category 91 — Encrypted Backup (Batch A of the backup safety-net) (2026-07-24)

**Feature:** the exported backup `.json` was the ONLY place data left the E2EE envelope (plaintext theses/notes/positions/amounts). The default **🔒 Download Backup** now prompts for a **standalone** passphrase (decoupled from the master password, so a backup survives a password change) → PBKDF2-SHA256-600k → AES-256-GCM → downloads a `{v,format,kdf,cipher,salt,iv,ct}` blob as `stratos-backup-YYYY-MM-DD.enc.json`. Reuses the existing `deriveKey`/`b64`/`unb64` crypto — no new primitives. Plaintext export kept behind a separate button + explicit "unencrypted — handle with care" confirm. Restore auto-detects the encrypted shape and decrypts **before any destructive mutation**; a wrong or cancelled passphrase leaves all data untouched (AES-GCM tag mismatch → clean error). New reusable `showPasswordPrompt()` (optional confirm field + min-length validation, reuses `mp.tooShort`/`mp.mismatch`). i18n EN+HU. sw.js **v47**.

**Verified in-browser (small + 6MB datasets):** lossless round-trip incl. Unicode, wrong passphrase throws, random salt+iv per encryption (no nonce reuse), no plaintext leak in ciphertext, modal validation + submit/cancel.

| # | Sev | Item (found by adversarial QA agent) | Fix | Commit |
|---|-----|------|-----|--------|
| 91.1 | HIGH | `b64()` was `btoa(String.fromCharCode(...bytes))` — the spread throws `RangeError` on large buffers. A real backup with embedded note images passes the whole ciphertext through it → the **default** encrypted path would throw for exactly the users who need it (round-trip test passed only because the sample was small). | `b64` rewritten chunked (32KB `subarray` + `String.fromCharCode.apply`); `unb64` already spread-free. Verified on a 6MB buffer (was RangeError). | `6e5735f` |
| 91.2 | MEDIUM | Restore file-size guard was 10MB; an encrypted backup is ~1.33x (base64) — a real image-bearing backup produced a **10.7MB** ciphertext → valid backup rejected on restore. | guard 10MB → 50MB. | `6e5735f` |
| 91.3 | LOW | Backup passphrase min-length 8 < master password's 10, and the encrypted file is offline-brute-forceable (it leaves the envelope). | minLength 8 → 10; the min is now stated in the prompt copy. | `6e5735f` |
| 91.4 | NIT | `_decryptBackup` ignored `blob.v` — a future format would decrypt with silently-wrong params. | throws on unknown `blob.v` (forward-safety). | `6e5735f` |
| 91.5 | NIT | Corrupt file and wrong passphrase showed the same "wrong passphrase" toast. | copy now reads "Wrong passphrase or corrupt file". | `6e5735f` |

**Lesson (CODING-LESSONS):** `btoa(String.fromCharCode(...bytes))` is a latent large-input bomb — the spread's arg-count limit makes it throw only once a buffer is big, so small-sample tests pass. Encode base64 in chunks. See CODING-LESSONS.

**Still pending (this batch was A only):** Batch B (auto pre-restore safety backup + richer restore confirm summary), Batch D (UX polish: danger affordance on Restore, backup-age indicator, verify-backup, export grouping), Batch C (D1 monthly snapshot table + picker). See `memory/project_backup-safety-net.md`.

---

## Category 92 — Backup Batch B: Restore Guardrails + Completeness (2026-07-24)

**Feature (backup safety-net Batch B).** The restore path (data-critical: wipes local + C3b-purges D1) gained four guardrails, prompted by a real incident — Peter's Batch-A restore test blanked the tracker's market metrics (the C3b purge cleared the regenerable `api_cache`, and the FMP drift meant the live re-fetch couldn't repopulate it; only the persistent companies-row overrides survived). sw.js **v48**.

1. **Auto pre-restore safety backup** (`_preRestoreSafetyBackup`) — before the wipe, downloads an ENCRYPTED snapshot of the CURRENT data. Reuses the restore file's passphrase when the restore is encrypted (no 2nd prompt); else prompts skippably. Best-effort — a throw or cancel never aborts the restore.
2. **Richer confirm** (`_backupSummary`) — the `RESTORE` type-to-confirm now shows what the file contains (N companies/positions/transactions/notes/reviews + date) so a valid-but-WRONG backup is caught before anything is touched.
3. **Complete restore** (`_rehydrateStockCache`) — re-populates `api_cache` `stock_data` from the restored `tStocks` so a reload re-shows tracker metrics **even when the live APIs are down**. `_stockMarketOnly` sanitizes to market fields (`STOCK_CACHE_FIELDS` allowlist) and BACKS OUT manual overrides via `_origData` so the cache holds pure market data; thesis/notes can never reach it. Directly addresses Peter's "make the backup a complete snapshot" ask.
4. **Auto-refresh-stale** — if the restored backup's `exportedAt` is > 7 days old and d1Mode + `hasDataAuth()`, fires `refreshAllStocks()` over the rehydrated cache.

**QA (adversarial data-safety agent):** the PRIMARY concern (data-loss/ordering) came back CLEAN — the safety backup runs on fully-intact data strictly before the wipe; if `_c3bClearAndRestore` throws, `_stripD1Refs` already nulled every id so rehydrate no-ops (no writes against a half-purged D1); override back-out and the market-only allowlist prevent private-data leakage into the cache; age-calc is safe on missing/invalid dates; `refreshAllStocks()` is safe to fire off-view.

| # | Sev | Item | Fix | Commit |
|---|-----|------|-----|--------|
| 92.1 | MEDIUM | In the non-encrypted **migrate** branch, if the id-recapture GET throws, `st._d1Id` keeps the SOURCE device's stale id (auto-inc ids collide across devices) → `_rehydrateStockCache` could write market data onto a DIFFERENT company's cache. | Guard each upsert with `_d1CompanyMap[cid]===ticker` — only write when the freshly-rebuilt id map confirms the id belongs to this ticker. Verified with a collision test (stale/colliding/absent ids all skipped, only the matching ticker written). | `d2f857a` |

**Accepted (documented, not fixed):** the "safety backup saved" toast can fire even if the browser silently blocked the automatic download (same `a.click()` pattern as every other export; copy softened to "downloaded — keep it until the restore looks right"). Reusing the restore file's passphrase to encrypt the pre-restore backup was flagged as a minor UX surprise; Peter chose to keep the reuse (no second prompt) and the success toast now states "encrypted with the passphrase you just entered" (v49) so it's no longer silent. On a stale restore, rehydrate + the immediate `refreshAllStocks()` double-write the same rows (harmless; rehydrate kept as the safe floor in case the refresh fails).

**Lesson (CODING-LESSONS):** a restore that only replaces the AUTHORITATIVE rows leaves DERIVED/regenerable caches (here `api_cache` market metrics) empty — so the app looks like it lost data after the next reload. A complete restore must rehydrate the derived caches too, and any FK id resolved from restored data must be re-validated against the freshly-rebuilt id map before it's used as a write target.

---

## Category 93 — Backup Batch D: Data Management UX Polish (2026-07-24)

**Feature (backup safety-net Batch D).** Polish for the Data Management card. sw.js **v50**.
- **Verify backup** (`verifyBackup`) — a NON-destructive button: opens a backup file, decrypts it (prompts for the passphrase if encrypted), and shows its contents summary via a plain info dialog. Never restores or mutates anything (QA-confirmed strictly read-only — shares none of `doRestore`'s wipe logic). This is the safe way to check a file / confirm a passphrase without restoring.
- **Last-backup awareness** — a "Last backup: N days ago" line under the backup buttons, with a stale nudge (> 14 days → amber, never/invalid → red). Tracked in `last_backup_at`, set on every explicit backup download (`_markBackupNow`); NOT set by the automatic pre-restore backup (it's an artifact, not a user backup).
- **Restore danger affordance** — the Restore button now has a ⚠ + red-tinted border/text so a destructive action doesn't look identical to the benign exports.
- **Copy/icon polish** — 🔓 on the plaintext button; REPLACES / MERGES uppercased in the helper copy (`applyI18n` sets `textContent`, so HTML bold isn't available — uppercase is the textContent-safe emphasis). HTML hardcoded defaults synced to the new i18n values so no stale text flashes before `applyI18n`.

**QA (agent):** `verifyBackup` verified strictly read-only (every path traced; cancel/wrong-pass/invalid-file all exit clean; summary rendered via `textContent` so no XSS); i18n complete in EN+HU; `updateLastBackupIndicator` null-guarded so the `showSection` hook can't throw; `_markBackupNow` correctly skipped when the download throws.

| # | Sev | Item | Fix | Commit |
|---|-----|------|-----|--------|
| 93.1 | NIT | A garbage/non-ISO `last_backup_at` (tampering/migration) rendered "Last backup: NaN days ago." | `isNaN(parsed)` → falls back to the "no backup yet" (red) state. | `45f0a01` |
| 93.2 | NIT | `toast.fileTooLarge` copy said "max 10MB" but the guard was raised to 50MB (Batch A) — a 10–50MB file was rejected with a wrong number (pre-existing in `doRestore`, second call site added here). | Copy → "max 50MB" (EN+HU). | `45f0a01` |
| 93.3 | NIT | EN indicator showed "Last backup: 1 days ago." | New singular `backup.lastBackupDay` key; `days===1` branch. | `45f0a01` |

**Accepted (browser limitation):** `_markBackupNow` marks "backup done" on `a.click()`, which fires even if the OS save dialog is cancelled — there's no reliable "download completed" signal, same as the existing "Backup downloaded" toast.

---

## Category 94 — Backup Batch E1a: Offline-Readable HTML Archive (2026-07-24)

**Feature (backup safety-net Batch E1a).** A new "📄 Archive (HTML)" export (`exportHtmlArchive`) writes a self-contained `stratos-archive-YYYY-MM-DD.html` you can open in ANY browser WITHOUT the app — Peter's "interpret it even if the app is gone" goal. Renders ALL data (portfolio accounts/positions/transactions, companies with metrics + manual overrides + thesis + checklist, research notes, framework, reviews, dividends) styled like the app (inline `_ARCH_CSS`, dark theme). Read-only; source = the same in-memory globals as the backup. sw.js **v51**. (Batch E1b = extend the XLSX export to a full dump, still to come.)

**Security:** the file opens as a top-level document, so an un-escaped value would be stored XSS. EVERY user value — including object keys used as labels (override metric keys, checklist section/field keys, review field keys) — is `escH()`-wrapped. A dedicated QA agent audited it field-by-field: escaping complete, no gap. Verified in-browser with injection payloads (a company name `<img onerror>`, a thesis `</style><script>…</script>`, a tag `"><svg onload>`, a note `<script>…</script>`) — all rendered escaped.

| # | Sev | Item | Fix | Commit |
|---|-----|------|-----|--------|
| 94.1 | LOW | The checklist + review renderers filtered `typeof v==='string'`, so numeric answers (target price, CAGR, scores) and boolean checkboxes were dropped from a "full data" archive. | New `_archVal` — strings trimmed, finite numbers formatted, `true`→"Yes", `false`/empty skipped (so unchecked boxes don't flood the file). | `4cc0615` |
| 94.2 | NIT | `toast.archiveFailed` showed "undefined" if a non-`Error` was thrown. | `(e&&e.message)||String(e)`. | `4cc0615` |

**Accepted:** review `extra` uses a denylist (not an allowlist), so a future unknown string field would show with its raw key as a (harmless, escaped) label — cosmetic only. Self-caught before QA: a duplicate review `summary` (shown in both the main div and the extra fields) — `summary` added to the extra-field exclusion list.

---

## Category 95 — Backup Batch E1b: Full-Dump XLSX + Unencrypted-Export Warning (2026-07-24)

**Feature (backup safety-net Batch E1b).** Two parts. sw.js **v52**.
1. **Full-dump XLSX** — `exportXlsxAll` now writes **9 sheets** (was 5): added **Companies** (all metrics + manual overrides + thesis), **Checklist** (flattened section/field/answer via `_archVal` — so numeric/boolean answers appear, `false` checkboxes skipped), **Valuations** (bear/base/bull scenario inputs), **Dividends** (per-ticker history). Completes Peter's "both formats" ask (HTML in E1a + XLSX here).
2. **Unencrypted-export warning** (Peter's ask) — new `_confirmSensitiveExport()` blocking confirm ("Unencrypted export — this file will contain your data in cleartext…") gated before EVERY export that writes sensitive data unencrypted. The gate is the FIRST statement (before any button-disable/try), so Cancel aborts cleanly with no file and no stuck button. Encrypted backup stays ungated; plaintext backup keeps its own stronger warning (no double-dialog). i18n EN+HU (`export.warn*`).

**QA (agent) — found 4 sensitive exports the first pass MISSED** (the batch gated the 6 Settings-page exporters; these bypass them):

| # | Sev | Ungated export | Fix | Commit |
|---|-----|------|-----|--------|
| 95.1 | CRITICAL | `downloadExport()` — the "Download JSON" button dumps the ENTIRE dataset as plaintext JSON, no warning | async + `_confirmSensitiveExport` gate | `7557158` |
| 95.2 | HIGH | `generatePdf(ticker)` — per-company PDF (thesis/notes/checklist), only had the privacy-mode toast | gate after the section-select validation | `7557158` |
| 95.3 | HIGH | `bulkExportPositions()` — inline plaintext CSV of selected positions (built its own blob, bypassed `_downloadCsv`) | async + gate | `7557158` |
| 95.4 | HIGH | `bulkExportTransactions()` — same inline-CSV pattern for transactions | async + gate | `7557158` |

**Accepted / documented decision:** the per-chart `⤓` PNG download (`_dlChartPng`) is left ungated — charts are often public company financials and gating every chart image is high-friction; the portfolio/allocation charts it can also capture make this a judgment call flagged for Peter. The confirm's OK button renders red (`btn-danger`, since `danger` isn't set to false) — matches the plaintext-backup caution precedent, kept intentionally.

**Lesson (CODING-LESSONS):** when adding a cross-cutting guard "before every X", enumerate X by grepping the low-level primitive (here every `a.download=`/`doc.save(`), not by listing the obvious call sites — inline/bulk variants and a full-dump modal button bypassed the shared helpers and would have shipped ungated.

---

## Category 96 — Backup Batch E2: Opt-in Historical Data in the Backup + Chart-PNG Gate (2026-08-05)

**Feature (backup safety-net Batch E2 — the last E item).** sw.js **v53**. Two parts.

1. **Opt-in historical data in the encrypted backup.** Historical charts, insider transactions and dividend history are CACHE-ONLY — they live in D1 `api_cache` (or `_memCache` offline), never on `tStocks`, so a normal backup never carried them. New **"Include historical data"** checkbox on the encrypted-backup passphrase prompt (`showPasswordPrompt` gained an optional `opts.checkbox`; with it the resolved value becomes `{value,checked}` instead of a bare string — the other 4 callers are unaffected). When ticked, `_gatherHistoricalCache()` reads the three `api_cache` data_sources with **server-side filtered** GETs (`api_cache?filter=data_source&filter_value=…`, so the bulky `stock_data` rows never cross the wire) and folds them into the backup as `historicalCache`, **keyed by TICKER** — D1 ids are re-minted on restore. `stock_data` is deliberately excluded: those market metrics already ride on `trackerStocks` and are re-inserted by `_rehydrateStockCache` (Cat 92). OFF by default (size). Restore (`_restoreHistoricalCache`) pushes them back via `cache-upsert` behind the same `_d1CompanyMap[cid]===ticker` collision guard as the stock-metric rehydrate, fail-closed on `data_source` (a tampered backup cannot write an arbitrary source), throttled 80ms. **No worker change — `api_cache` is already in the generic `TABLES` CRUD, so nothing to deploy.**
2. **Chart `⤓` PNG gate (Peter's decision, reversing the Cat 95 "accepted" note).** `exportChartPng` is now async and gated behind `_confirmSensitiveExport()`, which gained an optional `msgKey` — the PNG gets chart-specific copy ("this image may contain personal financial data (allocation, net worth, amounts)") instead of the theses/notes wording. **Every sensitive download in the app is now gated.**

**QA (agent, adversarial) — categories A (data loss / collision poisoning), B (return-shape change across all 5 `showPasswordPrompt` callers) and C (privacy: can `historicalCache` carry plaintext user content) came back CLEAN and verified. 8 fixes folded in:**

| # | Sev | Issue | Fix |
|---|-----|-------|-----|
| 96.1 | MEDIUM | Ticking the box could be a **silent no-op**: offline mode reads `_memCache`, which is cold until profiles are browsed, and an expired token fails `API.ready()` → empty gather, but the user still saw the plain success toast | empty result now warns (`toast.historicalNothingCached`) instead of passing as success |
| 96.2 | MEDIUM | **False success signal**: `ok++` counted `_memCache` writes even in d1Mode, where `cachedFetch` never reads `_memCache` — "restored for N companies" was reported even when zero rows reached D1 (e.g. after a failed C3b, when the id map is empty) | count only what lands where it will be read (D1 upserts in d1Mode, `_memCache` offline), report the real count, and warn when the file had entries but none landed |
| 96.3 | MEDIUM | The awaited restore step **blocked the post-restore render** — up to 3 throttled upserts per ticker (minutes at 40+ companies) with the pre-restore DOM still on screen and no progress | moved after `handleRoute()` and fire-and-forget; nothing on screen needs historical until a profile is opened |
| 96.4 | LOW | A 401 mid-loop signs the device out (`API._fetch` drops the token) and the loop kept grinding through doomed requests | `if(!API.ready())return ok` — stop as soon as auth is gone |
| 96.5 | LOW | Size asymmetry: no cap on write, but `doRestore`/`verifyBackup` reject >50MB → an **unrestorable** backup | warn at write time with the actual MB (`toast.backupTooBigToRestore`) |
| 96.6 | LOW | The **pre-restore safety backup** (the one artifact that can undo a bad restore) carried no historical — yet the C3b purge drops `api_cache` via the companies FK cascade | `_preRestoreSafetyBackup` now always includes it, best-effort |
| 96.7 | NIT | `_memCache` was seeded for tickers that no longer exist locally | folded into 96.2 (`_memCache` written only when `!d1Mode`) |
| 96.8 | NIT | No re-entrancy guard — a second click during the (slow) PBKDF2+AES run started a parallel backup, or stacked a second passphrase dialog | `_backupBusy` set **before** the prompt, cleared in `finally` / on cancel |

**Accepted / documented decisions:**
- **Restored rows are stamped fresh.** `cache-upsert` sets `fetched_at = now`, so restored history reads as current until its TTL (24h charts/dividends, 12h insider) expires. That is the point of an offline snapshot; the `fetched_at` captured in the file is informational (forward-compat), not applied. The stale-restore auto-refresh (Cat 92) only refreshes `stock_data`.
- **The gather is one un-paginated GET per source** (`limit=100000`). A very large result could 500; it degrades correctly to the best-effort warning toast and a historical-less backup.
- **The plaintext backup has no historical option** — the encrypted download is the default and the intended complete-snapshot path.

---

## Category 97 — Backup Batch C: D1 Cloud Snapshots (2026-08-05)

**Feature (backup safety-net Batch C — the last item in the plan).** sw.js **v54**. In-app rollback without a file.

- **Schema:** new `backups` (header: `created_at, label, kind, app_version, size_bytes, chunk_count, summary`) + `backup_chunks` (`backup_id` FK ON DELETE CASCADE, `seq`, `data`, UNIQUE(backup_id,seq)). Both are deliberately ABSENT from the worker's `USER_DATA_CLEAR_TABLES` and hold no FK to `companies`, so neither the C3b purge nor `/api/migrate`'s clear can destroy the snapshots you might need to roll back to — verified in QA.
- **Payload:** `_gatherAllData()` → JSON → **gzip** (`CompressionStream`, `raw` fallback for Safari <16.4) → **AES-GCM with the account DEK** → base64, tagged `snap:v1:<codec>:<iv>:<ct>`, split into 500 000-char chunks (D1 caps a row at 2MB, the worker a body at 5MB; an export with note images is several MB). The DEK — not a passphrase — because an automatic monthly snapshot has to run silently. `_dek==null` (locked / no envelope) → the feature is simply unavailable; there is no path to a plaintext dump.
- **Lifecycle:** header row first, then chunk POSTs; a failed chunk deletes the header again (no restorable-looking 0-chunk snapshot). One automatic snapshot per calendar month on a clean D1 boot (server list is the authority, localStorage only short-circuits), manual "📸 Snapshot now", retention = newest 12, restore + delete from Settings → Data Management.
- **No custom worker route** — the generic CRUD covers create/list/delete with 2 `TABLES` entries.
- **`_applyRestore` refactor:** the "apply a decrypted backup object" body was lifted verbatim out of `doRestore` so the file restore and the snapshot restore run ONE path (version checks → typed RESTORE confirm → pre-restore safety FILE backup → wipe → re-apply → C3b clear-and-restore → rollback on failure). QA diffed the 107 moved lines and confirmed the extraction is faithful (only the intended `confirm.restoreSource` line added).
- **Integrity:** the payload is a SINGLE AES-GCM ciphertext, so any missing/reordered/truncated chunk fails the tag check inside `_snapUnpack` — before `_applyRestore` is reached and before anything is mutated. Plus an explicit `chunk_count` and contiguous-`seq` check.

**QA (agent, adversarial) — the refactor, snapshot integrity, prune safety, privacy and i18n came back CLEAN and verified. 6 fixes folded in:**

| # | Sev | Issue | Fix |
|---|-----|-------|-----|
| 97.1 | **CRITICAL** | **Function-name collision.** `deleteSnapshot(id)` already existed for PORTFOLIO snapshots (`portfolio_snapshots`). Both are top-level declarations in the same script, so the later one won — clicking Delete on a cloud snapshot would have run `API.del('portfolio_snapshots/<id>')` and permanently deleted a portfolio history row with the same id (both tables start at id 1). The confirm copy was near-identical, so there was no visual tell; the cloud row stayed listed. Portfolio snapshots feed the value-over-time chart and TWR → silent, permanent data loss. | whole cloud API renamed (`deleteCloudSnapshot` / `createCloudSnapshot` / `restoreFromCloudSnapshot` / `renderCloudSnapshots` / `cloudSnapshotNow` / `_listCloudSnapshots` / `_pruneCloudSnapshots`) + a full duplicate-declaration scan of the file |
| 97.2 | HIGH | Auto-snapshot fired after a PARTIAL D1 boot: a per-company `/full` failure leaves stub `tStocks` entries, so the month's automatic snapshot would capture hollow data, set the month marker (suppressing the real one) and evict a good snapshot on prune — while the picker summary still showed the right company count | `_d1LoadHadErrors` + `_d1LoadClean` gate the boot hook; skipped loads log a warning |
| 97.3 | MEDIUM | A snapshot payload carries no `historicalCache`, yet restoring one runs the C3b purge which cascades `api_cache` away → every cached chart/insider/dividend series silently lost | `restoreFromCloudSnapshot` captures the CURRENT historical cache (pre-purge) and hands it to `_applyRestore`, which re-upserts it through the existing path |
| 97.4 | LOW | `restoreFromCloudSnapshot` didn't catch `_applyRestore` rejections (the file path does) → an unhandled rejection from an onclick, no toast | same try/catch → `toast.restoreError` |
| 97.5 | LOW | The chunk-count guard failed OPEN when the header row wasn't found | `if(!hdr)throw` — fail closed |
| 97.6 | NIT | Manual "Snapshot now" silently no-opped while the auto snapshot was running; `created_at` (SQLite UTC) rendered raw, so a 00:30 CEST snapshot showed as the previous day | busy toast (auto stays silent) + `_snapWhen()` local-time render |

**Accepted / documented:** two tabs booting at the same second can each create the monthly auto snapshot (harmless duplicate, pruned eventually); `created_at`/`kind`/`app_version`/`size_bytes`/`chunk_count` stay plaintext metadata (a rough dataset-size signal, negligible next to the row counts the single-tenant DB already exposes).

**Lesson (CODING-LESSONS):** in a 17k-line single-file app, grep every new top-level function name against the file BEFORE writing it — a duplicate `function` declaration is silently legal, the later one wins, and here it would have pointed a Delete button at a different table.

---

## Category 98 — FMP `/stable` API Migration (2026-08-05)

**External API drift, fixed on our side.** sw.js **v55**. FMP retired the legacy v3 path style and moved `limit` above 5 behind a paid plan. Five features were silently broken (display-only — no data was ever at risk).

**Method: measured, not guessed.** The docs alone couldn't say whether the 402 came from the endpoint, the `limit` parameter or its value, so a 17-endpoint probe was run through the app's own authenticated proxy with the account's real key (no key handling anywhere). Results:

| Call | Before | After |
|---|---|---|
| `historical-price-full/{sym}` | **404** | `historical-price-eod/light?symbol=` → 200, `[{symbol,date,price,volume}]`, ~1250 rows (5y) |
| `historical-price-full/stock_dividend/{sym}` | **404** | `dividends?symbol=` → 200, `[{date,recordDate,paymentDate,declarationDate,adjDividend,…}]` |
| `earning-calendar?symbol=` | **404** (not previously known) | `earnings-calendar?symbol=` → 200; fields renamed `eps`→`epsActual`, `revenue`→`revenueActual` |
| `quote/{A,B,C}` (v3 path batch) | path form dead | `quote?symbol=` (single per docs; comma list probed once at runtime, per-symbol fallback) |
| `income-statement` / `cash-flow-statement` `?limit=10` | **402 "Premium Query Parameter: 'limit'"** | `limit=5` → 200 (`limit<=5` is the free-plan ceiling) |

Confirmed still working on this plan (so deliberately untouched): `profile`, `financial-growth`, `key-metrics-ttm`, `balance-sheet-statement`, `quote?symbol=` (single), and `from`/`to` on the EOD endpoints.

**Implementation notes:**
- `/stable` returns a **FLAT array** where v3 wrapped rows in `{symbol, historical:[…]}`. `_fmpRows()` accepts BOTH, so an `api_cache` row written before the migration still parses instead of silently reading as empty. `_fmpClose()` bridges `price` (light) vs `close` (full/v3).
- `FMP_MAX_LIMIT=5` is clamped **inside `fmpFetch`** (copying the params object, never mutating the caller's) so no call site can reintroduce the 402 — fix the system, not the symptom.
- `fmpHistoricalPrices()` asks with `from`/`to`, and on a successful-but-empty response retries unranged and windows the rows client-side, so the feature survives if that parameter is ever gated.
- `balance-sheet-statement` went 3 → 5 years: same call cost, two more years of history.
- **No worker change or redeploy** — the proxy already points at `/stable` and its path sanitiser already accepts the new endpoint names.

**QA (agent, adversarial) — data-correctness/ordering, legacy cache shapes, the clamp's effect on derived metrics and hoisting all came back CLEAN and verified. 8 fixes folded in:**

| # | Sev | Issue | Fix |
|---|-----|-------|-----|
| 98.1 | **HIGH** | `fetchHistoricalCharts` returns a wrapper object even when all three calls failed; `cachedFetch` only refuses `null`/`rateLimited`, so `{incData:null,cfData:null,bsData:null}` was cached for the full **24h TTL** — the migration would look broken for a day per company, and every pre-fix page-open refreshed the poison window | return `null` (or the sentinel) when nothing came back, so a failure is never cached |
| 98.2 | MEDIUM | Dip finder could go from 2 calls to **32 per click** (per-symbol fallback for every ticker), and symbols this plan can't quote (EVO.ST, MC.PA…) burned a wasted call on **every** refresh forever | probe the comma batch ONCE per run, skip the fallback entirely when it works, negative-cache unquotable symbols (`high52:null`) and skip anything already probed today |
| 98.3 | MEDIUM | HTTP **429** returned `null`, not the `rateLimited` sentinel, so the new guards didn't catch it — a rate limit mid-run fired up to 30 more doomed calls, 30 toasts and 30 budget ticks | `fmpFetch` returns the sentinel for 429 too (verified safe: every caller reads `x?.[0]` or `Array.isArray`) |
| 98.4 | MEDIUM | The unranged retry also fired when the request FAILED (null), doubling cost and turning a 31s timeout into 63s | retry only on a parsed-but-empty response (`d!=null`) |
| 98.5 | MEDIUM | `fetchSpyForChart` never cached a negative result, and it runs on every period switch / asset-filter click → repeated re-fetches | cache the empty result too; a cache hit returns the same `null` the miss path does |
| 98.6 | MEDIUM | The card promised "Historical Trends (10 Year)" while the plan now caps at 5 — a half-window trend presented as the full one (and a hardcoded English string) | `comp.historicalTrendsN` i18n key, filled from the actual row count after the fetch |
| 98.7 | LOW | Upcoming earnings stored `undefined` (dropped by `JSON.stringify`) instead of `null` | `?? null` |
| 98.8 | NIT | Inner `break` on the sentinel leaked one extra call+toast per group; the fallback loop had no throttle while every sibling loop paces itself | `stop` flag + 300ms pacing |

---

## Category 99 — FMP Live Verification: `earnings-calendar` Returns the Wrong Company (2026-08-05)

**Found by running the migrated code against the real API in the user's own browser**, after Cat 98 had already shipped and passed unit tests + an adversarial QA agent. sw.js **v56**.

**The bug:** `/stable/earnings-calendar?symbol=AAPL` returns **HTTP 200 with rows for other companies** — the live check came back with PLTR data. It is the MARKET-WIDE calendar; the `symbol` parameter is silently ignored. `fetchEarningsCalendar` takes the first row at/after today and writes it to `tStocks[ticker].earningsCalendar`, so **every tracked company would have been given some unrelated company's earnings date, EPS and revenue** — then synced to D1 and shown in the dashboard's earnings widget as if it were theirs.

**Fix:** use `/stable/earnings?symbol={TICKER}` — the per-company endpoint (verified live: 165 rows, all AAPL, same `epsActual`/`revenueActual` fields). Plus a defensive `filter(e=>!e.symbol||e.symbol===ticker)` so a response that ever ignores the filter again cannot write another company's numbers.

**Why nothing earlier caught it:** the endpoint returned 200 with a well-formed array of exactly the expected shape. Unit tests stub the response, and a code reviewer (human or agent) cannot see that a live API ignores a query parameter. Only a real call with real data exposes a *wrong-but-valid* response.

**Also measured live in the same pass (documented in API-REFERENCE, no code change needed):**
- `quote?symbol=AAPL,MSFT,NVDA` (comma list) → **402**, and a non-US single symbol (`EVO.ST`) → **402**. Both are plan gates rather than empty results, so the dip finder's per-symbol fallback + day-long negative cache (Cat 98.2) is what actually runs — behaviour is correct, now confirmed against reality.
- Confirmed working end-to-end on the live account: `historical-price-eod/light` (1253 rows), the same with `from`/`to` (11 rows for a 2-week window), `dividends` (92 rows), and the `limit` clamp (asked for 10 → returned 5 years, HTTP 200).

**Lesson (CODING-LESSONS #13):** an external-API migration is not verified until it has run against the live API. A 200 with the right *shape* can still be the wrong *data*.

---

## Category 100 — Process Audit: Undefined Handoff, Drifted Docs, a Wrong Deploy Guide (2026-08-19)

**Found by a four-agent process audit** (docs freshness · docs usefulness · memory/handoff · process compliance), run against the written rules rather than the code. No app code changed; nothing deployed.

**What the audit established, with evidence:**

- **The handoff process was never defined.** `grep -i handoff` → zero hits in CLAUDE.md and all 13 `feedback_*` memories. The two existing handoffs shared no section heading, and supersession depended on a later session manually demoting the earlier file. `docs/CODING-LESSONS.md:488` already records a handoff as the *source* of a wrong instruction.
- **Rules that are followed but written nowhere:** conventional commit prefixes, the `(vNN)` subject suffix, the `APP_VERSION` + `sw.js CACHE_NAME` lockstep, and the schema-before-worker-before-frontend deploy order. A fresh session could not know any of them.
- **A dead rule:** "branch per major feature" — 0 of 239 commits ever followed it, `git log --merges` is empty. Removed rather than left as decoration.
- **Every hand-maintained counter had drifted**, while the one rule with a visible feedback loop (APP_VERSION in the sidebar) held for 28/28 deploys. That asymmetry is the root cause and the reason for `docs/check.sh`.
- **~16 open items were orphaned** in six one-off `.txt` dumps in `docs/`, including "there is not a single automated test". Tracked nowhere else since a single manual migration on 2026-07-04.

**100.1 — `DEPLOYMENT.md` prescribed a retired auth header (P0).** §10 said *"All endpoints except `/health` require `X-Sync-Key`"* — fifteen lines after the same file marked that credential RETIRED (B3c). Reality is `X-Auth-Token` (`index.js:93`). Anyone following the guide would have built a client that 401s.

**100.2 — Endpoint table listed removed routes and omitted the live ones.** `/sync/load` and `/sync/save` were retired in B3c; `/auth/*`, `/proxy/fmp`, `/proxy/finnhub`, `/api/purge`, `/sync/meta`, the natural-key DELETE and the generic `/api/<table>` CRUD surface were all missing.

**100.3 — The mandatory deploy ordering was absent from the deploy guide.** BUG-HISTORY states it four times ("DDL BEFORE `wrangler deploy`", "worker FIRST, then frontend push"); DEPLOYMENT.md's pre-deploy checklist had only "D1 schema compatible". A push auto-deploys the frontend within a minute, so the omission is data-shaped, not cosmetic.

**100.4 — `/api/migrate` documented without its 403 gate.** Since C3 it 403s on an encrypted account (`index.js:1128-1129`); the encrypted path is `/api/purge`. Also corrected the "wipes all D1 tables" claim: it clears the 9 `USER_DATA_CLEAR_TABLES` plus `app_settings` except `schema_version` — `checklist_templates`, `backups` and `backup_chunks` survive by design.

**100.5 — Stale facts corrected:** 22 → 24 D1 tables, `stratos-v5` → `stratos-v56`, dev port 8765 → 8767, KV described as "legacy sync" → auth config + device tokens + `user_meta` + brute-force counters, `FMP_KEY`/`FINNHUB_KEY` marked required-now rather than required-eventually, the B3c sync-key retirement marked DONE instead of reading as pending.

**100.6 — QA on this batch caught 4 NEW false statements I had just written:** `/auth/salt` documented as POST (it is GET, `index.js:284`); "all of `/auth/*` is unauthenticated" (only `salt`/`login`/`recover` are — `change`/`devices`/`revoke`/`dek` all call `authenticate()`); "migrate wipes all tables"; and the `/sync/load|save` removal attributed to B3b-2 instead of B3c. All four fixed before commit.

**100.7 — `docs/check.sh` added** — 10 mechanical checks (version lockstep, CLAUDE.md counters vs measured reality, BUG-HISTORY table/body integrity and Fixed-column sum, CODING-LESSONS sync, the docs pass and `docs:`-commit purity, stray dumps, stray worktrees, secrets in tree **and in history**, STATUS.md shape). It fails closed: an unmatched pattern is a FAIL, because a claim that can no longer be located is indistinguishable from a wrong one.

**100.8 — A `pipefail` defect in check.sh made it lie.** `producer | grep -q` SIGPIPEs the producer once grep exits at the first match, so the pipeline status is 141 and the match branch never runs. The secrets check reported "no key in git history" for a key that is demonstrably in three commits. Fixed by dropping `pipefail`; every check treats empty output as FAIL, so the failure mode stays closed. → CODING-LESSONS #14.

**Still open after this batch** (deliberately, as the next batches): CLAUDE.md's 8 stale counters, the BUG-HISTORY table/body divergence below, the six orphaned `.txt` dumps, the stale worktree, and the memory consolidation. `docs/check.sh` reports each one, so none of them can be forgotten again.

**100.9 — The live FMP API key was exposed in this public repo's git history — ROTATED, closed.** The key sat in `value="…"` attributes in `index.html`/`valuation.html` from `23f9c31`; `cfc0da6` deleted the lines but a public repo's history keeps serving them. The project's own security rule had been written *because* of this incident, yet the remediation had stopped at deleting the line — so the same key was still in production months later. Rotated at FMP + `wrangler secret put FMP_KEY`; **verified dead: the old key now returns HTTP 401 "Invalid API KEY"**. The 26 `settings.local.json` permission entries that embedded it were removed (355 → 329 allow rules); the app itself holds no client-side key (Settings shows "🔒 Stored securely on the Worker" since Phase A2), so nothing else needed changing.

*Checker note:* `check.sh` check 9 tested the key found in `settings.local.json` against `git log --all -S`. With the key gone it now reports "skipped" — weaker, not stronger. Batch 2a replaces it with a closed-out record of this one-time exposure plus the tree scan that guards future commits. **Lesson: a check whose input can disappear degrades to silence, and silence reads as success.**

---

## Category 101 — Stale Counters Removed Rather Than Repaired (2026-08-19)

**101.1 — All 8 counters in CLAUDE.md were wrong.** ADRs 29→43, D1 tables 22→24, fixes 171→536, categories 19→100, coding lessons 25→54, `index.html` 11.6K→17.3K lines, service-worker cache `stratos-v5`→`stratos-v56`, dev port 8765→8767, and the tech-stack line still called KV "legacy sync" when it holds the auth config, device tokens and sync meta. The docs tree also omitted TEST-PLAN.md and check.sh, and did not say EXPANSION-PLAN's phases are complete.

**101.2 — The real fix was deciding which counters deserve to exist.** Two of them (`index.html` line count, `sw.js` cache name) change on *every* commit or deploy: keeping them would have made `check.sh` fail on every batch, and a gate that is always red trains people to bypass it. Three more (bug total, category count, lesson count) change on every *batch* — the same disease, slower. All five were removed from CLAUDE.md rather than corrected; they live in the document that owns them. Only the ADR count and the table count stayed, because they move on architecture or schema batches — exactly when someone is already deep in the docs.

QA caught the batch getting this half-right: the first attempt asserted `check.sh` still verified all five "in their owning document", when in fact deleting the CLAUDE.md claims had removed the *only* lesson-count check in the repo, and the `index.html` line count ended up claimed by nobody and checked by nothing. Removing a duplicated claim also removes whatever verification hung off it — that has to be replaced deliberately, not assumed. `check.sh` check 5 now verifies CODING-LESSONS against **itself** (its summary vs the lessons it actually contains), which is a claim that file genuinely owns.

The design test was built into this very batch: adding Category 101 changes the bug total and the category count, and it **required no CLAUDE.md edit**. Under the previous design it would have required two.

**101.3 — `check.sh` guards against re-introduction.** A new check fails if CLAUDE.md ever regains a volatile counter, so the decision cannot quietly erode. The old "index.html line count" comparison was deleted along with the claim.

**101.4 — `check.sh` check 9 rebuilt (see 100.9).** The "is the local key in git history?" test was replaced: the 2026-05-27 exposure is closed by rotation, and history cannot be un-published, so there was nothing left to test — but the check's *input* could vanish, turning it into a silent "skipped". It now scans the last 20 commits' diffs for key-shaped literals, which guards the thing that can still go wrong: a *new* key being committed.

**101.5 — CODING-LESSONS stopped restating BUG-HISTORY's numbers.** The header had been five batches stale (Cat 96–100), while the file's own lessons #10–#14 cited categories the header claimed did not exist yet. The first attempt simply updated the numbers — but that reproduced the very disease this category is about, since check 5 then forced an edit here on *every* batch. The fix count and category range were removed instead, replaced by a pointer to the document that owns them.

The summary table was also wrong in its own right and had been for months: it claimed **42** lessons where the file contains **54**, and 5 of its 7 per-domain rows were stale (JavaScript 11→12, Data Safety 8→11, API & Caching 7→5, Process 5→4, AI Behavioral 10→14). Recounted from the headings.

**Result:** `check.sh` went from 15 failures to 5. Four of the five are the BUG-HISTORY table/body divergence that batch 2c will resolve; the fifth is a different defect — two summary rows (Cat 66, 71) carry a placeholder instead of a real commit hash.

---

## Category 105 — Summary Table Reconciled With the Body (2026-08-19)

The QA log's index and its contents had drifted apart in three directions at once. None of it was visible until `docs/check.sh` (Cat 100) started comparing them.

**105.1 — Four categories were documented but invisible in the index.** Cat **12** (chart-container mobile overflow, `39fbfca`), **13** (TODO widget vertical clipping, `c3b355f`), **34** (i18n QA — the three CRITICAL `t()`-shadowing crashes, `e338abf`) and **61** (keyboard shortcut + TEST-PLAN accuracy, `c4427e0`) had full body sections and no summary row. Cat 34's absence is the notable one: `CODING-LESSONS.md:150` cites "Category 34: 34.1-34.3 — all CRITICAL" as the source of the `t()`-shadowing rule, so the index was silently missing the entry behind one of the project's most-cited lessons.

**105.2 — Three sections had their numbers taken by later batches.** The 2026-07-01/02 UX-audit work was written as Categories 24, 33 and 34; later QA batches reused all three numbers. For 24 and 33 the summary table resolved the number to the *later* section; for 34 there was no row at all (105.1), and `CODING-LESSONS.md:150` is what pins 34 to the later, i18n section. The earlier ones became unreachable — present in the file, absent from the index, impossible to cite without ambiguity. They were renumbered **102** (PDF Export QA, `eb93370`), **103** (scroll preservation + lazy-load charts, `36c8750`) and **104** (CSV import locale detection, `3412aac`), each carrying a note about its original number. Content unchanged; the Date column preserves the chronology that the numbering no longer carries.

**105.3 — Two rows carried a placeholder instead of a commit hash**, against the docs rule that requires a real hash in the index. Cat 66 said `pending`; Cat 71 was an empty pair of backticks. Recovered from git: `935ad58` ("Fix 2 remaining parseInt missing radix found during QA verification") and `abe37a1` ("Add Privacy Mode"). Both had been unresolved for over a month.

**105.4 — The running total was a hand-maintained number that matched nothing.** It claimed 542 while the Fixed column summed to 529. Be precise about the direction, because the obvious story is wrong: recovering the 20 genuinely-missing fixes (6 in the four unindexed categories, 14 in the three renumbered ones) puts the true pre-batch count at **549**, so the stated 542 was **7 too low** — not 13 too high. The −13 was measured against a table that was itself incomplete. The residual 7 is unexplained drift from re-typing a total across dozens of batches, and there is no way to attribute it now. The total is now **derived from the table** and `check.sh` fails if the two disagree. It is not a coincidence that the one number nobody could verify is the one that was wrong.

**105.5 — `check.sh` check 4 asked a one-directional question in both directions.** It required every number to have *both* a summary row and a `## Category N` body section, so it reported 11 "missing" bodies (Cat 1-4, 17, 66-71). Those are not defects: the table is the index of record, and a category summarised in a single row is a complete entry. A body section with no row is the real defect — work that has vanished from the index. The check now enforces that direction only, and reports table-only categories as information.

**105.6 — Rows 56-61 indexed the wrong work entirely (found by QA on this batch).** The first attempt at this category added a row for Cat 61 and declared the region fixed. QA noticed the new row was byte-identical to row 60 — which exposed a table that had been offset against the body since 2026-07-04. Rows 56-60 carried shifted titles and, in three cases, the hash of the *docs* commit rather than the fix commit (`fe3cbd6`, `f17d2c7`, `68604b1` are all "Update docs: BUG-HISTORY cat N…"). The body sections were correct all along, each holding its own feature commit. The rows were rebuilt from the body: 56 Ticker Autocomplete `1fea9e8` (2), 57 Transaction Price Auto-fill `6edec93` (3), 58 Partial Add Toast `14e92e5` (1), 59 Transaction Ticker Cross-link `f616215` (1), 60 Screener Filter Presets `3f81b2d` (4), 61 Keyboard Shortcut + TEST-PLAN `c4427e0` (1) — 12 fixes where the table had claimed 7. Git shows the origin: commit `1228090`, "Update BUG-HISTORY: add cat 60-61, **fix summary table** for July 4 sessions", is what introduced the offset while trying to correct it.

**105.7 — A blank line was silently splitting the summary table.** In GFM a blank line ends a table, so the rows after it rendered as literal `| 102 | … |` text. `check.sh` never saw it because its parser reads line-by-line and ignores blanks. A machine check and a human reader were looking at two different documents.

**105.8 — Known limits of this check, stated rather than implied.** `check.sh` compares category *numbers*, not content: a row numbered N satisfies it whatever it says, which is precisely why the 56-61 misalignment survived. It is also blind to the one `## Session 25` heading (24 documented fixes, no row) that predates the `## Category N` convention. Both are now reported by the script rather than left to be rediscovered.

**Lesson:** an index and its contents drift apart silently, because nothing reads both at once. Every defect here was months old, and none had ever been caught by a human reading the file.

---

## Category 106 — Orphaned Items Recovered, the Dumps Deleted (2026-08-19)

Six one-off `.txt` audit files and a PDF had been sitting in `docs/` since early July, outside every index. The batch was scoped as "migrate ~16 items and delete the files"; the actual contents were larger and worse than that, and pulling the thread surfaced four defects in documents that were never part of the plan.

**106.1 — 32 items, twice the estimate, and none of them tracked anywhere.** Every item in all six dumps was checked line-by-line against ROADMAP and KNOWN-ISSUES before migrating. Of roughly 107 findings across the six files, about 70% were dropped as already done (tooltips expansion, portfolio history chart, screener filter presets, Companies default tab), already tracked (onboarding, mobile gestures, push notifications, Claude API, seasonality, conflict resolution, multi-tab sync, Zero Trust, weekly focus, error-state polish), or already fixed. What remained — **32 items** (29 top-level, 3 nested under the module split) — is now ROADMAP § Technical Debt & Deferred Audit Findings, each carrying its source so the deletion loses no provenance. A few items the dumps had themselves marked "MAYBE LATER" were migrated rather than dropped, each keeping its stated reason. The headline item is the one the previous session flagged: **there is not a single automated test.** `docs/TEST-PLAN.md` is 371 checkboxes and 100% manual, every fix in this log came from manual QA, and that fact had been recorded nowhere but a `.txt` file for six weeks. The batch was scoped at "~16 items" from the previous session's estimate; the real figure was double, which is the ordinary result of estimating a pile nobody has read.

**106.2 — The PDF was a plan that had already been carried out.** `DOCUMENTATION-PLAN.pdf` (2026-07-01) proposed ARCHITECTURE, API-REFERENCE, GLOSSARY, CODING-LESSONS, KNOWN-ISSUES, DECISIONS and DEPLOYMENT. All seven exist. It held zero open items — but it named three real documents that CLAUDE.md's file tree does not, which is how 106.7 and 106.8 were found. All seven files were deleted; git history keeps them.

**106.3 — The stale worktree held one commit that was not on `main`.** `.claude/worktrees/sleepy-jennings-5aafbd` (pinned at `f45f09b`, v37) shadowed the real tree so every search from the repo root matched both copies. It also carried `61cfc5e`, "Fix D1 checklist sync", unmerged — the checklist `flat`-vs-`.answers` shape bug the July sync audit rated CRITICAL. Deleting the worktree without reading that commit would have been the obvious move and the wrong one. All three of its fixes were verified present on `main`, independently re-made and in better form: the save-path serialisation and the load-path restore by `815857d` (via the `_sectionAnswers` helper, which handles both shapes rather than assuming one), and the missing-`checklist_templates` seeding by `4b7db52` (batch upsert + re-fetch rather than a per-key loop). Nothing was lost. The worktree is gone; the branch is kept, since it costs nothing and shadows nothing.

**106.4 — KNOWN-ISSUES had two live entries numbered `P.17`.** The open "notes full-text search runs over ciphertext" (Phase-D sweep) and the fixed "`renderPositions` NaN propagation" shared one id, and BUG-HISTORY records `P.17` under the *older* meaning in two places. Exactly the defect Cat 105 removed from this file, one document over. The open one was renumbered **P.27** — not the fixed one, whose id is pinned by the historical rows.

**106.5 — The unfixed remainder of the 2026-07-09 QA sweep was tracked nowhere.** That sweep raised 35 findings: the CRITICAL and all five HIGH were fixed in Cat 64, most MEDIUM and LOW in Cat 65 and 67, and nine were judged not real bugs on review. What was left unfixed was the WARN group — `t()` shadowing — and it went into no index at all. (State this loosely on purpose: the dump's own tallies do not reconcile, summing to 39 against a stated 35, so any precise "N were fixed" restated from it would be inventing precision. What is certain is which finding survived.) The global i18n `t()` is shadowed at **110 sites today** — 15 `const t =`, 91 `t =>` callback parameters, 4 `(t, …)` parameter lists — up from the ~91 measured in July, because `index.html` has grown from ~14.6K to 17 253 lines since. Nothing crashes today because none of those scopes calls `t()` — the risk is that any future line added inside one does. That is not hypothetical: it has already happened twice, in Cat 34 (three CRITICAL crashes) and again in the tooltips batch, where QA caught a `t`→`tip` shadow before it shipped. Now **P.28**, with the fix direction and the reason it needs its own batch.

**106.6 — KNOWN-ISSUES' summary table named no currently-open issue.** Every row was a struck-through 2026-07-01 snapshot, so the file's own summary implied nothing was open while the body held ~18 live entries. Kept as history, with the open set listed beneath it.

**106.7 — CLAUDE.md's docs tree was missing three real documents** — `DEVELOPMENT-WORKFLOW.md`, `INVESTMENT-CHECKLIST.md` and `reference-desktop-schema.sql`. The tree is the only map of `docs/` anyone reads, and nothing had ever compared it to the directory.

**106.8 — The unlisted document had drifted the furthest, which is not a coincidence.** `DEVELOPMENT-WORKFLOW.md` still prescribed a `feature/phase-0-security` / `feature/phase-1-shell` branching model — the rule Cat 100 deleted from CLAUDE.md six weeks earlier after establishing that **0 of 239 commits** ever used it. So the repo's two process documents actively contradicted each other, and the wrong one was the one no index pointed at. It also mapped a `desktop/` directory that no longer exists (only its schema survives, as `reference-desktop-schema.sql`), and its commit section predated conventional prefixes, the `(vNN)` suffix, the `APP_VERSION`+`sw.js` lockstep and the separate `docs:` commit. Corrected, and given a header naming CLAUDE.md as authoritative so the two cannot silently diverge again — it is a Peter-facing document about *how the collaboration feels*, not a second copy of the rules.

**106.9 — `check.sh` check 11: the docs tree must match the directory, both ways.** An unlisted file goes stale unnoticed (106.8); a listed-but-absent file sends the reader nowhere. Tested against all three failure modes before being trusted — an unlisted file, a ghost entry, and the tree block itself moving — each exits 1 with the right message.

**106.10 — check 4's placeholder-hash test was fail-open in two independent ways.** Cat 105 added it to stop rows carrying `pending` instead of a commit. This batch's own row, written as `` `PENDING` ``, went straight past it — verified directly: the old pattern returns 0 hits on the exact offending line, the new one flags it. Both reasons matter, and the second is the one that actually let this row through: the pattern was **case-sensitive** (`grep -E "pending"` misses `PENDING`), *and* it required the cell to be **bare**, so even a lowercase `` `pending` `` in backticks would have passed — and backticks are the format every other row uses. A blacklist had to guess both the wording and the punctuation. The test now asserts that the cell **contains** an identifier instead. Deliberately shape-tolerant: the legitimate cells are not uniform (backticked and bare hashes, `a`+`b` pairs, an `a`…`b` range, and the pre-Cat-24 `S1-S7` session references), and demanding one canonical form flagged 10 valid rows alongside the one real defect. A check that cries wolf on correct data is a check that gets bypassed.

**Lesson:** *a document that no index points at is a document nobody maintains.* The three files missing from CLAUDE.md's tree were not equally stale — the least-referenced one was the most wrong, to the point of contradicting the authoritative process. Second lesson, and the second time this track has produced it: **verification code fails in ways the code it verifies does not.** Cat 100 found `check.sh` reporting "no key in git history" for a key that was demonstrably in it; this batch found its placeholder guard blind to the uppercase of the very word it was written to catch. Both were invisible because a passing check and an absent check look identical.

---

## Category 107 — Memory Consolidated, and Four Warnings That Outlived Their Cause (2026-08-19)

58 memory files, of which `MEMORY.md` — a 12 801-byte index with a 2 171-character line — is the only one loaded into every session. The stated goal was "consolidate ~28 duplicates". The audit found the duplication claim was largely **wrong**, which changed the batch from a deletion into a consolidation.

**107.1 — Eleven stale marker strings across three files warned about work that was already done.** (The batch was scoped for "four" from the plan; the real figure only emerged after 107.11 fixed the guard that was hiding most of them.) Each was cleared with its evidence written down, not silently deleted, because the three cases are not equally solid and a reader deserves to know which is which. *sync-audit* (six strings): line 32 warned that a D1 `ALTER` was pending while **line 50 of the same file** recorded Peter confirming it on 2026-07-23 — the file contradicted itself. Five more on lines 27/28/33/37/53 said the same about two worker deploys; line 53 again records Peter having run one of them. Those five are the subject of 107.11. *security-v2-plan* (three markers): contradicted by the same file's own 2026-07-24 end-state, and independently by Cat 100's rewrite of DEPLOYMENT.md against the Worker source, which found no `X-Sync-Key` path. *backup-safety-net* (two strings, one issue): **resolved by inference, and the inference is stated so it can be challenged** — no run-date was ever recorded for the `CREATE TABLE backups/backup_chunks` DDL (a process gap: CLAUDE.md requires one), but a later session verified live that the automatic monthly snapshot fired on its own and its payload decrypted and gunzipped back into a complete backup object. That round-trip is impossible unless both tables exist and the worker is deployed.

**107.2 — The three files that really were redundant were also the three carrying wrong numbers.** `reference_bug-history` claimed "**430+ fixed bugs across 71 QA categories**" — the real figures are 574 and 106 — and enumerated category ranges stopping at 71. `reference_test-plan` claimed "200+ test cases" against 371 checkboxes. `reference_data-structures` was a pointer to ARCHITECTURE § 5.1 holding no structure of its own, describing a "14K-line index.html" that is now 17 253. Deleted; the repo owns all three subjects and `check.sh` derives the numbers.

**107.3 — Two operational references documented retired credentials as live.** `reference_cloudflare-worker` listed "Secrets configured: **SYNC_SECRET** (sync auth key)" and told the reader to set it with `wrangler secret put` — that secret was retired and unset in B3c on 2026-07-24, 26 days earlier, and auth has been token-only since. It also said the D1 schema has **17 tables** (24), and its CORS list omitted port 8767. `reference_github-pages` told the reader cloud sync restores "once Worker URL + **Sync Key** are entered". All corrected rather than deleted: both files hold operational facts (Zero Trust team, D1 region and id, wrangler version, and the fact that **Peter always tests on GitHub Pages, never localhost**) that live nowhere else.

**107.4 — The "~28 duplicates" premise was wrong, and checking it is what saved the content.** The 18 phase-status memories look like pure duplicates of ROADMAP. They are not: `BUG-HISTORY.md` **begins 2026-06-27**, while phases 0-5 were built and QA'd from 2026-06-23. The Phase 5 memory alone lists 34 QA fixes; spot-checking four of them (`db52wHighs` in export/import, `recalcPositionFromTransactions` split handling, the `Math.log` guard, future-date rejection) found **none** in BUG-HISTORY. Separately, eleven BUG-HISTORY categories exist as a summary row with **no body section at all** — Cat 71 is one row reading "Privacy Mode QA … 5", while the memory names the four actual bugs. So the memories are the only record of the detail behind numbers the repo merely counts. They were consolidated 18 → 1 (`phase-history`) and 9 → 1 (`feature-history`), each stating that BUG-HISTORY is authoritative where the two disagree — as they do on Cat 71, 4 against 5.

**107.5 — Seven dangling `[[link]]` occurrences, four of them one repeated mistake.** `[[bug-history]]` pointed at a file this batch deleted; `[[expansion-plan]]` and `[[phase13-status]]` at files it consolidated. The other four occurrences were the same error repeated — four distinct slugs written with the *filename* prefix (`[[feedback_smaller-units]]`) where the resolver wants the `name:` slug (`[[smaller-units]]`), appearing in five places across two files — broken since whenever that convention settled, and never noticed because nothing had ever checked. The audit was rewritten to resolve links against the `name:` field after a first pass using filename globs produced false positives on `STATUS.md`.

**107.6 — A memory pointed at a handoff that was never written.** `session-handoff-2026-07-24` said "SUPERSEDED by `[[session-handoff-2026-08-05]]` for current status" and repeated it in a closing block. No such file was ever created — the 2026-08-05 work went into `STATUS.md` instead, per the rule Cat 100 introduced. A reader following that pointer for "current status" would have found nothing and had no way to know whether the file was missing or the status was.

**107.7 — `finance-app-plan` still routed work around a directory that does not exist.** "All new development goes into the web/ directory. **Desktop app is reference only**" — the Electron app has been deleted; only its SQLite schema survives, as `docs/reference-desktop-schema.sql`. The same stale `desktop/` claim Cat 106 found in DEVELOPMENT-WORKFLOW.md, in a second place.

**107.8 — `MEMORY.md` rewritten as an index: 12 801 → 4 721 bytes (−63 %), longest line 2 171 → 169.** It had become a document — single entries carrying full batch histories, commit hashes and version numbers, i.e. exactly the volatile facts CLAUDE.md says must live only in the document that owns them. It now carries one line per memory, grouped, stating only what the memory is for. Verified both directions: every memory file has an index line, and every index line resolves to a file.

**107.9 — 58 files → 30, with only 3 deletions.** The reduction is almost entirely consolidation. This is the point: the cost being paid every session was `MEMORY.md`'s size, not the file count, and cutting the index solves it without destroying anything. Deleting 27 files to hit a tidier number would have thrown away the only surviving record of roughly a hundred early QA fixes.

**107.10 — The memory directory is not under version control.** Unlike Cat 106's dumps, nothing here was recoverable from git; a copy of all 58 originals was taken to the session scratchpad before the first edit. Worth stating plainly because it changes the standard of care: in `docs/` a wrong deletion is a `git revert`, here it is permanent.

**107.11 — `check.sh`'s memory guard was case-sensitive, so it certified a file it had never read.** Found by this batch's QA pass, after 107.1 had already been written and declared complete. The check greps `'PENDING PETER|⚠️ PENDING'` — all caps. `project_sync-audit-2026-07-22.md` carried **five** `PENDING Peter` markers, mixed case, untouched since July, and the gate reported "no stale PENDING markers in other memories" the whole time. They were stale by the file's own testimony: line 53 records Peter running the very deploy lines 27 and 28 warn about. Now `grep -liE`. **This is the third fail-open in this script, and the second caused by case** — check 9's `pipefail`/SIGPIPE bug (Cat 100) reported "no key in git history" for a key in three commits, and check 4's placeholder guard (Cat 106) waved through `PENDING` because it only knew `pending`. Fixing the guard immediately surfaced a false positive too — a line reading "No pending Peter deploy" — which was reworded rather than special-cased, on the Cat 106 principle that a check crying wolf on correct data is a check that gets bypassed.

**107.12 — ROADMAP sent the reader to the wrong audit.** `docs/ROADMAP.md:36` closed the sync-audit section with "Details of every fix in `docs/BUG-HISTORY.md` Category 71" — Cat 71 is Privacy Mode QA; the sync audit is **Categories 72-81**. An off-by-one in a cross-reference, which is the least visible kind: it resolves to something real, so nothing looks broken. Flagged by QA as pre-existing and out of scope; fixed anyway, because it costs one line and this batch is about pointers that lie.

**Lesson:** *the duplication was assumed, and the assumption was wrong in the direction that would have destroyed data.* "~28 memories duplicate what the repo already records" had been carried in the plan for two batches; checking it took one grep per claim and reversed the batch's whole shape. Second lesson: **every wrong fact found here was a fact nothing could check.** The four `PENDING` markers, the retired secret, the 430-vs-574, the 17-vs-24, the seven dead links — none had a feedback loop, and `check.sh`'s one memory check (stale `PENDING` markers) is the only reason batch 4 existed at all.

---

## Category 109 — Archiving, and Four Headings Nothing Indexed (2026-08-19)

Batch 5 of the process track: split the two files that had grown past reading, and write the two ADRs skipped when their batches shipped. The batch was scoped around one orphaned heading; QA found three more, and four fail-opens in the checker.

**109.1 — Four headings sat outside the category convention, holding 34 fixes nobody had counted.** The scope said one — `## Session 25` — because that is the only spelling `check.sh` knew. QA found `## Audit 19`, `## Audit 20` and `## Audit 21` as well. All four share the same three defects: a heading style no check understands, a number **already taken by a different topic**, and no summary row, so their fixes were absent from the running total. `Session 25` (Cross-Module Integration: archive + portfolio↔pipeline sync, 24 fixes) became **Category 108**; the three Audits (Phase 16.3 Conviction Tracker 3, Phase 17.2 Position Sizing 1, Phase 18.2 Earnings Calendar 6) became **110/111/112**. Item ids renumbered, content untouched, every commit verified with `git log`. The total moved 586 → 629, of which **34 is recovery, not new work.**

**109.2 — `BUG-HISTORY.md` split by date; ~1 470 lines of pre-2026-07-24 bodies moved to `BUG-HISTORY-ARCHIVE.md`.** The cut-off is **Category 84 / 2026-07-24**, where Security v2 closed and the app moved to token-only auth with envelope encryption — so what stays hot is what still describes the current architecture. **The summary table did not move:** it is the single index for both files. Archiving is by **date, not number**, which puts Category 108 in the archive despite its high number; stated at the top of both files rather than left to be discovered.

**109.3 — `ROADMAP.md` shed 365 lines to `ROADMAP-ARCHIVE.md`, and now opens with work in flight.** Completed phases 0-18 and finished tracks went to `ROADMAP-ARCHIVE.md`. The first attempt got the structure wrong: `### Process & Docs Hygiene` — the *active* track — is nested inside the completed `## Phases 11-18` block, so a naive split either archived live checkboxes or dragged four completed sections into the live file. It was promoted to a top-level `## Process & Docs Hygiene — IN FLIGHT` (keeping its 2026-08-05 / Cat 100 provenance) and the rest archived. An assertion in the split script — no open checkbox may cross into the archive — is what caught the first attempt.

**109.4 — A checkbox that could never be ticked.** `- [ ] ~~Set up Cloudflare Access (Zero Trust)~~ — moved to Phase 10` — an *unticked* box with *struck-through* text. It reads as open work, renders as done, and is neither: the work moved to § Maybe Later, where it is tracked. It survived because it is invisible to a reader (struck through) and visible to a grep for open items (it matches). Now a plain note.

**109.5 — Archiving nearly exempted every archived category from the check that indexes them.** Check 4's row/body cross-check read only `$BH`. The moment bodies moved, every archived category would have been reclassified "table-only" — a legitimate state, therefore silent — and could then have lost its row with the gate still green. That is the Cat 105 defect, reintroduced by the cleanup performed *because of* Cat 105. Now `$BH_ALL`, tested by deleting an archived category's row: fails with the right message, exit 1.

**109.6 — New check 12: an archive may contain only finished work.** `ROADMAP-ARCHIVE.md` must hold no open checkbox and `ROADMAP.md` must still hold some. Live work swept into an archive is not archived, it is lost — Cat 106's orphaned `.txt` dumps arrived at from the opposite direction. The second half matters independently: it catches a split that went the wrong way entirely.

**109.7 — Four more fail-opens in `check.sh`, all found by QA *after* this batch had been declared complete.** Listing them together because they are one failure mode, and it is now the dominant one in this file:
- **The archive could be emptied and the gate stayed green.** `$BH_ALL` fixed the *moved* case but nothing asserted the archive had content. Emptying all ~1 470 lines reclassified 73 categories as "table-only" — legitimate, unasserted — and `check.sh` exited 0 with zero warnings. Now `[ ! -s "$BHA" ]` fails, **and** the table-only count is pinned at 11: it only rises when a body disappears, so an unasserted `ok` was hiding the one number that detects loss.
- **The legacy-heading scan was hardcoded to `## Session N`** and therefore blind to `## Audit N` — which is why 109.1 was scoped at one heading instead of four, and why the check printed "no headings outside the convention" while three sat in the file. It now matches **any** `^## <Word> <N>` that is not `## Category N`, and fails rather than warns.
- **Check 12's two halves used different regexes.** The live side allowed indentation, the archive side did not — so an *indented* open checkbox in the archive passed. Not hypothetical: `ROADMAP.md` already contains indented open items, so a nested live task swept into the archive was invisible to the check written to catch exactly that.
- **The legacy scan printed nothing on success**, so a pass and a check that never ran looked identical. Fixed in the same pass; it now prints `ok` like every other check.

All four were tested against deliberately broken input before being trusted: each exits 1 with the correct message, and the tree was restored and re-verified clean.

**109.8 — ADR-044 written: D1 cloud snapshots (Batch C, 2026-08-05).** The batch shipped without one. The decision worth recording is the one that is easy to get backwards: the payload is **one ciphertext, split after encryption**, not one ciphertext per chunk — per-chunk encryption would let every chunk verify alone, so a dropped one decrypts cleanly into silently truncated JSON. Also recorded: DEK rather than passphrase (the monthly snapshot must run unattended; no usable DEK disables the feature rather than writing plaintext), and why `backups`/`backup_chunks` sit deliberately outside the purge path.

**109.9 — ADR-045 written: the FMP `/stable` migration (2026-08-05).** The decision is a method, not an endpoint list: **probe the API, don't trust the docs** — the published docs cannot distinguish a plan-gated parameter from a removed endpoint, which was the only distinction that mattered.

**109.10 — Both new ADRs were wrong in ways only the code could settle.** Written from the batch records, checked by QA against `web/index.html`, and eight claims did not survive. ADR-045 said `balance-sheet-statement` was "deliberately untouched" — it kept its path but lost `limit:3` to the central clamp, a user-visible 3 → 5 years; called single `quote?symbol=` untouched when that call site is **new**, replacing the dead path batch; said "five call sites" where nine pass a `limit`; claimed no call site can reintroduce the 402 when one bypasses `fmpFetch` entirely; folded the *sixth*, previously-unknown broken endpoint into the five known ones, erasing the batch's own argument for probing; and named `earnings-calendar` throughout while the shipped code calls **`earnings`** — the first is the bug, the second is the fix. ADR-044 claimed "the only server-side work was the DDL" (two `TABLES` entries need a `wrangler deploy` too), that a 0-chunk header "can never" appear (the compensating delete only fires on a rejected POST; a closed tab still leaves one), and described the integrity ordering backwards. **An ADR written from the batch notes rather than the code is a plausible story about the code.**

**109.11 — The split broke four cross-references, in both directions.** `KNOWN-ISSUES.md` sends readers to "`BUG-HISTORY.md` Category 72" and "Cat 79" — both bodies now archived; `BUG-HISTORY-ARCHIVE.md` sends them to "`ROADMAP.md` § Data Sync Audit", which now exists only in `ROADMAP-ARCHIVE.md`. All four repointed. This is the predictable cost of splitting a file and the reason to grep for inbound references, not just check the two halves.

**109.12 — `ARCHITECTURE.md` kept a second `docs/` tree, and nothing watched it.** It claimed "168 fixes, 21 categories" against a real 629/112, "22 tables" against 24, an 843-line worker against 1 412, and described `ROADMAP.md` as the phase tracker after the phases had moved out. Check 11 verifies CLAUDE.md's tree against the directory; this one had no owner and no check. Replaced with a pointer to CLAUDE.md — one owner, per Cat 101 — and the volatile worker line count deleted rather than corrected, since it would be stale again next batch.

**Lesson:** *a cleanup is the most dangerous time for the checks that guard the thing being cleaned.* Five of the twelve items here (109.5, 109.7's four) are defects this batch would have **introduced or perpetuated in `check.sh` itself** while tidying the files it watches — and 109.5 would have re-opened the exact hole Cat 105 was written to close. Second lesson, earned twice in one batch: **a guard that enumerates the one bad spelling it has seen is not a guard.** `## Session N` hid three `## Audit N` sections for months; `PENDING PETER` hid five `PENDING Peter` markers in Cat 107. Both were written as blacklists of observed wordings, and both certified files they had never really read.

## Category 113 — Exchange Rates Nobody Fetched (2026-08-26)

First batch since v56 to ship app code. The Portfolio showed `0 Ft` and `TWR −100%` for a HUF-base account holding USD: `convertCurrency()` returns `null` on an empty rates table, and the table was only ever filled by a button the user had to notice. Five of the seven items below are QA findings on the fix, not on the original bug.

**113.1 — Rates were never fetched unless the user found the button.** `pfExchangeRates.rates` starts `{}` and is written only by `fetchExchangeRates()`, wired to two manual buttons. The "Fetch rates" prompt appears *inside* the positions summary, and only when currencies are mixed *and* rates are missing — i.e. it is easiest to miss in exactly the state that needs it. `_maybeAutoFetchRates()` now runs 1.2 s after `autoLoad()`, fire-and-forget, when a position **or transaction** is in a currency other than the base and the table is empty or over a day old. Verified against the live API: 10 × $200 rendered `0 Ft` → `619 580 Ft` at USD/HUF 309.79.

**113.2 — CRITICAL: the auto-save could overwrite the user's base currency with the `'HUF'` default.** `baseCurrency` is user data and lives in exactly one place, the `exchange_rates_config` D1 row. `loadExchangeRates()` wraps both its D1 reads in one `try`, so a failed read falls back to localStorage with the in-memory object still holding its `{baseCurrency:'HUF'}` initialiser — and `saveExchangeRates()` writes that field back unconditionally. Manually that needs a deliberate click; automatically it would have happened at boot, unattended, with nothing on screen. Gated on a new `_ratesLoadedFromD1`, set only when the D1 branch completes. Same rule as the auto-snapshot's `_d1LoadClean`: **never write back a load that failed.** Found by QA, not by the batch.

**113.3 — The cross-reload backoff failed open, and stamped attempts it should not have.** Two defects in one guard. The `localStorage.setItem` that records an attempt sat in `try{}catch(e){}` with an empty body: where storage is unavailable the backoff silently evaporates and a dead or 429-ing API is re-hit on every single page load — the failure the guard exists to prevent, passing as success. It now says so via `console.warn`, and the per-page-load flag is documented as the only bound that remains. Second, the stamp was never cleared on success: a fetch that succeeded while its D1 write failed left the next boot backed off for an hour with an empty table, i.e. the bug this batch fixes, caused by this batch's own guard.

**113.4 — Nothing retried when connectivity came back.** `navigator.onLine` is true behind a captive portal, so a boot on a dead uplink attempts, fails, and holds `0 Ft` for the full hour. An `online` listener now clears both guards and retries once — coming online is new information about the cause of the failure, which is what justifies discarding the backoff.

**113.5 — The trigger ignored transactions, so foreign dividends never woke it.** Dividends are transactions, and a HUF-base portfolio can hold only HUF positions while receiving USD dividends that the totals still convert. The first version mirrored the banner's positions-only test; `_portfolioNeedsRates()` now checks both.

**113.6 — `_reRenderCurrentSection()` claimed to refresh the open portfolio sub-tab and never did.** It read `document.querySelector('.pf-tab.active')` — the markup is `.pf-tabs .tab` — and passed the result to `switchPfTab()`, **a function that does not exist anywhere in the file**. `if(at)` was always false, so the dead call never threw and the omission never surfaced. Consequence beyond this batch: any background re-render left the Positions and Transactions panels stale, the privacy-mode toggle included. Now it detects the open panel the way `switchPortfolioTab()` does and calls that panel's renderer directly — not `switchPortfolioTab()` itself, which would also clear the bulk selection and reset scroll. Dividends is deliberately left to the line below it, which already handled that one case; someone had patched the symptom without finding the cause.

**113.7 — UNFIXED, documented: "silent" is only true of this function.** In d1Mode a successful auto-fetch calls `saveExchangeRates()` → `API.scheduleSave`, which raises its own retry and failure toasts, and a 401 there drops the user on the lock screen as any save does. The fetch itself raises nothing; the save path is shared with every other save and was left alone. The code comment states the limit rather than claiming full silence. Related: `KNOWN-ISSUES.md` **P.29** records that the totals fall back to `||amt` — summing un-converted foreign amounts — when rates are missing, which is why an empty table shows a plausible wrong number rather than a dash.

**Lesson (Cat 113):** *the batch that adds automation inherits every guard the manual path never needed.* 113.2, 113.3 and 113.4 are all the same shape — a write, a backoff and a retry that were fine while a human clicked the button and were wrong the moment a timer did. And 113.6 is this project's signature failure once more, in a new place: a condition that can never be true, hiding a call that could never work, staying silent for exactly that reason. → CODING-LESSONS § Testing & QA #4.

## Category 114 — The Process Audit Audits Its Own Checker (2026-08-26)

Closing batch of the process-hygiene track (ROADMAP § Process & Docs Hygiene). The job was to verify every rule in CLAUDE.md against the repository rather than against earlier documents, and to present the result. **The rules hold.** Across every commit since `96cd04f` (2026-08-05), the commit that first wrote the unwritten rules down, there is not one violation of any rule — and that includes the four that nothing checks: the `(vNN)` suffix, the `Co-Authored-By` trailer, trunk-based development, and the ban on Hungarian identifiers. `APP_VERSION`/`CACHE_NAME` lockstep holds for **every commit that has ever bumped it** since `APP_VERSION` existed (`a720745`), without exception. The non-conforming commit subjects in the log are entirely pre-rule and are not defects. *(Counts are deliberately not quoted here: this batch's own commits moved every one of them while it was being written, which is the drift this track exists to stop. `git rev-list --count 96cd04f..HEAD` and `git log -S APP_VERSION` measure them on demand.)* Four defects were found, all in the checker itself — two by the audit, two by the QA pass on the audit.

**114.1 — CRITICAL for the gate: `check.sh` check 10 switched itself off when it could not find what it guards.** The check opens `MEMDIR="$HOME/.claude/projects/$SLUG/memory"` and began `if [ ! -d "$MEMDIR" ]; then warn "…status check skipped"`. Because warnings do not affect the exit code, a checkout where that path resolves differently — a fresh clone, another machine, a different `$HOME` — lost **every assertion about `STATUS.md`** (five required sections, the live version in § Current state, the pending-deploy statement, the stray-PENDING scan) while the gate still printed *All checks passed* and exited 0. Check 10 is the only mechanical guard on the handoff, so the failure mode was: the handoff verification vanishes precisely where the handoff is most likely to be missing. Reproduced before the fix by running the script with a fake `$HOME` — the section printed one warning and nothing else, exit 0. A missing directory and a missing `STATUS.md` are the same defect (the handoff does not exist), so they now share a verdict: `bad`, exit 1. The other two paths are untouched and were re-tested; a fresh clone now fails loudly, which is correct — it genuinely has no handoff yet.

This is the **ninth** fail-open in this script's life, and the first found by auditing the checker deliberately rather than by QA tripping over it. Its shape is new: the input comes from **outside the repo**, so the check does not degrade when the repo is wrong — it degrades when the *environment* differs, which no repo-level test would surface. → CODING-LESSONS § AI Behavioral #14.

**114.2 — the checker carried exactly the kind of counter it exists to delete.** Its header comment justified the design with "APP_VERSION is visible in the sidebar → 28/28 deploys correct". Measured at the time of the audit: **38/38**. The number was written once, never re-measured, and sat inside the script whose purpose is to stop unverifiable numbers being restated. Replaced with the absolute claim it was there to support (no `APP_VERSION` bump has ever missed its `sw.js` bump) plus the command that measures it on demand. Same correction applied to `ROADMAP.md`'s "17 253 lines" for `index.html`, against a measured 17 345 — the file is now described, not counted, because check 2 already prints the real figure on every run.

**114.3 — CRITICAL, and found by QA on the batch that closed 114.1: check 6's assertions never ran during a batch at all.** The conventional-prefix test and the `docs:`-purity test sat in `elif` arms beneath `if [ -n "$DIRTY" ]`, so they executed **only on a clean working tree** — while this script's own header and CLAUDE.md § Shipping a Batch step 7 both mandate running it *with the docs edits still uncommitted*. In the one invocation the process actually prescribes, an unprefixed HEAD passed and an impure `docs:` commit passed. Demonstrated on a throwaway clone with HEAD amended to a subject carrying no prefix: **FAIL** on a clean tree, **ok** on a dirty one. Split into 6a (properties of the commit — asserted unconditionally) and 6b (state of the docs pass), and re-tested against four inputs: unprefixed HEAD, impure `docs:` commit, pure `docs:` commit, and a `chore:` HEAD, all with a dirty tree. This is the **tenth** fail-open, and it revises 114.1's own finding: the audit had recorded "check 6 only inspects HEAD", which implied HEAD was at least covered. It was not.

**114.4 — three smaller guard defects in the same script.** (a) Under `set -u`, an unset `$HOME` aborted the run at check 10's `MEMDIR` assignment, so checks 11 and 12 never executed and **no summary line printed at all**; it exited 1, so it failed closed, but "died two checks early" is not a verdict anyone can act on — now `${HOME:-}`, which yields a path that cannot exist and is reported properly. (b) An unreadable memory directory was diagnosed as "STATUS.md is missing" when `STATUS.md` was in fact present; it now names the real cause. (c) Check 8 computed a whitelisted worktree list that **nothing has ever read** — an abandoned guard, in the script whose entire subject is abandoned guards. Deleted.

**Four leaks stay open, recorded in ROADMAP with costed options.** Check 1 compares the two version values as they *stand* rather than asserting they *moved together*, so bumping them in separate commits passes the guard that exists to forbid it. Five `warn` sites do not affect the exit code, so "exit 0" tolerates a stray dump, a stray worktree or stale PENDING markers. The QA pass, the live browser check and the deploy ordering have no mechanical loop at all and are pure self-report — and this batch demonstrated the cost of that concretely rather than in the abstract: check 10 passed green against a `STATUS.md` that was, at that moment, describing a tree two commits stale, because it asserts *shape* and not *currency*. And nothing runs `check.sh` automatically: there is no hook and no CI step, and `deploy.yml` deploys without gating.

**Lesson:** *a rule written down in the place the work happens holds without a checker; a checker is what you add for the facts nobody can see — and then the checker itself becomes a fact nobody can see.* The four unchecked rules are perfect since the day they were written down, while every drift this track ever found — stale counters, orphaned dumps, unindexed categories, a `docs:` tree missing three files — was in a fact invisible from the work. Ten fail-opens in one 400-line script says the same thing from the other side: **verification code is the least-observed code in the project, so it rots fastest and silently.** The audit found two of these; the QA pass on the audit found two more, in the file the audit had just finished reading. → CODING-LESSONS § AI Behavioral #14.

## Category 115 — Closing the Four Leaks the Audit Named (2026-08-27)

Cat 114 ended by listing four gaps it had found and deliberately not fixed, "recorded in ROADMAP with costed options". This batch closes all four. No app code changed, so there is no version bump and nothing deployed — `web/` was not touched.

**115.1 — check 1 verified that the two version markers *agree*, never that they *moved*.** `APP_VERSION` and `sw.js` `CACHE_NAME` were compared to each other, which catches the case where one is bumped and the other is not. It cannot catch the likelier one: app code ships with **no** bump at all, both markers sit equal at the previous value, the service worker keeps serving the old generation under the old cache name, and the fix "does not apply" — the exact symptom this project hit twice while testing locally. The guard designed to forbid an un-bumped deploy passed it silently. Now the script asserts the invariant that carries the weight: **the most recent commit touching app code under `web/` moved both markers in that same commit.** Verified against all eight such commits in the log — every one bumped both, so the assertion goes green on real history rather than flagging the past.

The framing is over history rather than over HEAD on purpose, and this is the interesting part. Written the obvious way — *if HEAD touches `web/`, then it must have bumped* — the check would be vacuous at both moments the script actually runs: HEAD is the code commit only for the minutes before the `docs:` commit lands, and afterwards it touches no `web/` file at all. That is the **eleventh** instance of this script's signature defect: a branch that reports `ok` for *"I did not look."* Over history it is never vacuous. `web/cloudflare-worker/` is excluded — the Worker deploys separately and has no cache name. **Residual limit, stated rather than hidden:** uncommitted `web/` edits with no bump are outside the assertion; it is a check on committed history, and the mandated run time is after the code commit.

**115.2 — five `warn` sites meant "exit 0" was not the all-clear it read as.** Warnings do not affect the exit code, so a green run tolerated a stray audit dump in `docs/`, stale PENDING markers in other memories, an extra worktree, and a code commit that had swallowed the docs pass. Two of those encode CLAUDE.md rules stated **without exception** — the dump ban (§ Documentation Maintenance) and the status-marker rule (§ Session Status & Handoff) — and both fail by going unnoticed, which is precisely what a non-blocking warning guarantees. Both are now `bad`. The dump ban has a price on record: six stray `.txt` files once held ~16 open items that appeared in no backlog, one of them *"there is not a single automated test"*, untracked for a month.

The pending-deploy assertion was worse than merely non-blocking — it was **pointed the wrong way**. It matched only `none`/`no …`, so it fired on the *safe* state (a batch with nothing pending that phrased it differently) and stayed silent on the *dangerous* one (a batch with a real pending deploy, whose § Current state legitimately says something else). It now requires the position to be **stated at all**, and FAILs when it is not — the half that is genuinely checkable. `warn` is kept for the two checks that are genuinely advisory: an extra worktree is environmental, not a repo defect, and a code commit that also touched `docs/` is explicitly *allowed* by policy. The summary line no longer prints green over unfixed warnings; it prints yellow and says the count out loud.

**115.3 — check 10 asserted the handoff's shape and called it verified.** All five required sections can be present over a body describing a state two commits old, and that is not hypothetical: on the batch immediately before this one, the gate went green against a `STATUS.md` written before the last two commits landed, and said nothing. Structure is not currency. `STATUS.md` is rewritten during the docs pass — after every code/`chore:` commit of the batch, and before the `docs:` commit that closes it — so its `modified:` frontmatter stamp must not predate **the newest non-`docs:` commit**. That framing is what makes it correct at both invocation points: at the mandated mid-batch run the newest non-docs commit *is* the code commit just made, and after the `docs:` commit closes the batch the docs commit is correctly ignored rather than producing a false FAIL against a handoff written 19 seconds earlier. Compared as UTC integers, so no locale or timezone can shift the verdict; an unreadable stamp on either side is a FAIL, not a skip.

**115.4 — the script exempted itself from its own thesis.** Its opening rationale is that every rule with a feedback loop has held and every rule without one has drifted — and it ran only when a human or an agent remembered to run it. `.githooks/pre-push` now makes `git push` the trigger: the last moment a mistake is still free, and the moment immediately before GitHub Actions auto-deploys `web/` to Pages, which is the first moment it is not. Pre-**push** and not pre-commit deliberately: a batch is only complete after its `docs:` commit, so a per-commit gate would fail on every code commit by design and be bypassed within a day. Check 13 asserts the hook is present and executable (FAIL — a future session could delete it) and reports separately whether this clone enabled it (`warn` — `core.hooksPath` is per-clone local config and cannot be versioned, so a fresh checkout is un-configured, not defective). Bypass stays available and documented: `git push --no-verify`.

**What is now written down as permanently unverifiable.** The script's header states plainly that three CLAUDE.md rules have no mechanical evidence and cannot acquire any from inside a repo: that the QA agent ran (step 5), that someone opened the app in a browser (step 6), and that a Worker batch really did schema → `wrangler deploy` → push in that order. Check 10 constrains the shape and now the currency of the handoff; it cannot constrain its truthfulness. That is the whole reason § Verified live is kept apart from what was merely reviewed — the separation is the only evidence there is, and fabricating it is the one failure this gate cannot catch. Saying so in the file is the point: an unstated limit gets read as coverage.

**115.5 — the QA pass, and the finding that makes the whole batch worth reading.** Seven issues, six of them code, all re-tested against the reproduction on a throwaway clone.

**The one that matters: 115.1's own fix was necessary but not sufficient — the identical defect, one level up.** The new assertion counted `+` lines in the commit's diff that *mention* `APP_VERSION` and `CACHE_NAME`. A re-add of the **identical value** counts as a hit, so the check asserted that the two marker lines had been *touched*, not that the version had *changed*. QA demonstrated it: a commit that reflows those two lines and ships a real app change passed clean, reporting `ok  … moved both markers together` while nothing had moved. A lint or prettier pass over `web/` reaches it, and so does any added line that merely names `APP_VERSION`. It now reads both parsed values on both sides of the commit and requires them to differ — and reports the transition (`v56 → v57`) so the claim is legible rather than merely asserted. Unreadable on either side is a FAIL. **A batch written to stop a check measuring position instead of motion shipped a check measuring position instead of motion.**

The other five, each a shape this script has met before. (a) The freshly-promoted PENDING-marker FAIL fired on a memory that merely **documents the rule** — *"never leave a `PENDING Peter` marker outside STATUS.md"* tripped the guard against PENDING markers. Harmless while it was a `warn`; as a FAIL it blocks a push over correct writing, which is how a gate gets bypassed — the hazard this script names in check 3's own comment. Anchored to the shape a real marker has (it leads its line) rather than the phrase it contains. (b) Check 13 compared `core.hooksPath` to the literal string `.githooks`, so `./.githooks` and an absolute path reported *"not enabled"* **while the hook was running and printing that very line** — the "enumerates the one spelling it has seen" antipattern this file condemns in check 4's hash guard. Both sides now resolve to a real directory. (c) The hook located `check.sh` via `dirname "$0"`, which breaks for the copy-or-symlink-into-`.git/hooks` install route, where `$0` is `.git/hooks`; it failed *closed* (exit 127 blocks the push) but the gate never ran and the error named no cause. Now `git rev-parse --show-toplevel`. (d) Check 13 asserted the hook's existence and exec bit and nothing about its content — a hook gutted to `exit 0` kept it green, which defeats the point of guarding it. (e) The freshness comparison strips punctuation before comparing digits, so a stamp carrying an offset (`…T12:00:00+02:00`) would have been read as if UTC and scored **late** — a fail-open in the lenient direction, i.e. a stale handoff passing. The trailing `Z` is now required. Unreachable while the memory system writes `Z`, which is precisely when a format assumption is worth asserting instead of relying on.

**115.6 — the seventh finding was not a bug, and the fix was in CLAUDE.md.** QA argued the pre-push hook blocks a state § Shipping a Batch prescribes, reading step 3 (*"Only then commit and push the frontend"*) as a second, mid-batch push — which the hook correctly refuses, since it would leave `main` code-without-docs. The reading was wrong (steps 1-3 constrain *when* the frontend push happens relative to the Worker; steps 4-8 are that push) but the wording genuinely allowed it, and a gate that blocks prescribed work gets bypassed within a day. **The gate was not weakened; the ambiguity was removed.** Step 3 now states that a batch pushes **once**, after the docs commit, and names `git push --no-verify` as the deliberate exception. Declining the offered fix — a `CHECK_FROM_HOOK=1` escape hatch downgrading the two batch-completion assertions to warnings when run from the hook — was the point: it would have made the hook permanently blind to a missing docs pass, which is most of what closing leak (d) bought.

**Lesson:** *the four leaks were all the same defect wearing different clothes — a check that reports on a question it never asked.* Comparing two values that both stayed still; warning about a rule stated without exception; asserting headings and calling it a handoff; and a gate that only runs when remembered. Each returns a verdict; none of them measures the thing the rule is about. → CODING-LESSONS § AI Behavioral #14.

## Category 116 — The Totals Stop Mixing Currencies (2026-08-27) — v58

First app-code batch since v57, and the one that closes **P.29**. With an empty exchange-rate table, every base-currency total in the app read `total += convertCurrency(amt, cur, base) || amt` — so the **raw foreign amount was added to a base-currency sum**. With a HUF base, $2 000 of AAPL and 3 000 000 Ft of OTP totalled **3 002 000 Ft** instead of 3 700 000 Ft: a number that never throws, never renders blank, and is wrong by the exchange rate. The allocation doughnut built from the same figures drew AAPL as **0.07%** of the portfolio instead of 18.9%.

**116.1 — the fix, and the count that was wrong.** P.29 recorded **16 sites**, measured with `grep -c 'convertCurrency(.*)||'`. The real figure was **34 across 17 functions**: `?? amt` and `isFinite(cv)?…:else if(isFinite(raw))` are the same fallback in different syntax, and the grep counted a *spelling* rather than the defect. All 34 now route through one accumulator, `baseSum(base)`, which adds only what it could convert and counts what it could not; `.total` is `null` the moment anything is missing and is **never a partial sum**, because a partial base-currency total is itself a plausible wrong number. Callers render `—` on screen (`N/A` in the PDF, that document's own convention) and state the reason **in the tile** — the old "rates not loaded" banner sits two panels away on another tab, so an unexplained dash reads as *"you own nothing"*. Afterwards the entire file contains exactly **one** call to `convertCurrency()`, inside `baseSum.add()`. Verified with seeded data: `3 700 000 Ft` with rates, `—` without, and `—` again when the table holds *other* pairs but not this portfolio's — a state the old banner condition (`mixed currencies AND empty table`) never fired on.

**116.2 — the only site that WROTE the wrong number, and the reorder that had to come with it.** `takeSnapshot()` stored the mixed total in D1, where it then fed `calcTWR()` and the "since last snapshot" delta long after the rates came back — the one place a missing rate outlived itself. It now refuses with an explanatory toast. The rates check had to move **above** the overwrite confirmation: that branch does `pfSnapshots = pfSnapshots.filter(…)` *before* the value is computed, so bailing after it would have deleted a good snapshot and written nothing in its place. Verified both ways — 0 snapshots written and an error toast without rates; with rates, a stored total of `3 700 000` and per-position values of `700 000` + `3 000 000`.

**116.3 — snapshots carry their own base currency, and five sites subtracted them raw.** This half of the defect has **nothing to do with the rates table**: a snapshot stores `baseCurrency`, so changing the base setting at any point makes every historical comparison a cross-currency subtraction. `calcTWR()` compared consecutive snapshot totals; `renderDbPortfolioSummary` and `renderDbNetWorth` computed their delta and YoY against one; `renderCloudSnapshotsList` printed the row-to-row delta; `renderDbBenchmark` indexed the series to 100. Seeded with a `$10 000` snapshot followed by a `3 400 000 Ft` one, the snapshot list rendered **`+3 390 000 Ft (+33900.0%)`** — read straight off the screen during verification. All five convert now, and drop the comparison when it will not convert (`-100 000 Ft (-2.9%)` once rates were present, i.e. against $10 000 × 350).

**116.4 — a refused metric published as exactly 0.0%.** `renderDbBenchmark` read `const pfReturn = twrData ? twrData.annualized : 0`. That was defensible when `null` only meant "fewer than two snapshots"; 116.3 gave the same `null` a second meaning — *could not be computed* — and the tile then subtracted the S&P return from the fabricated zero and published the difference as **Alpha**. The batch written to stop the app stating wrong numbers had created one. Both cells now render `—`. → CODING-LESSONS § JavaScript #13.

**116.5 — an unlabelled cross-currency sum, which is the worst version of this bug.** The Transactions summary bar added `totalAmount` and `fees` across every currency in the filtered list and rendered them through `fmtMoney()`, which prints **no currency symbol at all**. A $1 500 buy and a 2 500 000 Ft buy showed as `2.5M` with nothing on screen — not even a wrong unit — to suggest the two had been added together. Now converted, `—` when it cannot be, with the same banner as the positions bar.

**116.6 — the PDF's Broker Accounts table summed an account's positions without converting** and printed the result under that account's own currency column, so an account holding both USD and HUF positions published their raw sum as forints. **116.7 — the dividend calendar tooltip** took an amount in the *position's* currency and prefixed it with the *base* currency code: a $10 dividend read `HUF 10.00`. It now converts (`HUF 3500.00`), or falls back to labelling the amount with its own currency (`USD 10.00`) — a single payment needs no cross-currency sum to be true, so the honest move there is a correct label, not a withheld number.

**116.8 — null propagation, the cost of the fix.** Widening several functions to return `null` meant `.toFixed()` and `.toLocaleString()` now sat on nullable values in the dividend cards, the breakdown table and the PDF's local `fmt()` (which shadows the global one and needed its own guard). These would have thrown rather than lied, but a thrown renderer takes the whole tab with it. Every caller of the six functions whose return type changed was traced and guarded.

**Sites 116.3 and 116.5–116.7 were not in the 34.** None of them ever called `convertCurrency()`, so no grep for it could reach them; they were found by opening the app with seeded data and reading a `+33900.0%` off the screen. **Behaviour deliberately left permissive:** a portfolio entirely in the base currency, or a computation whose only foreign input legitimately contributes nothing, still shows its numbers — `calcTWR()` returns a value when every cashflow in the period is base-currency, and the Terry Smith metrics sum only the positions carrying stock data, so an unconvertible property does not hide metrics for USD stocks whose weights relative to each other are sound. All three were tested explicitly; the accumulator is meant to be precise, not to refuse in bulk.

### The QA pass found eight more — and the two worst were created by the fix itself

**116.9 — CRITICAL: a D1 round-trip turned a correct snapshot into a ≈350× wrong one.** `savePortfolioSnapshots()` wrote `base_currency: s.baseCurrency||'USD'`, and `d1-schema.sql:251` backs it with `NOT NULL DEFAULT 'USD'` — while all six of the comparison sites 116.3 introduced read `s.baseCurrency||base`, i.e. *"if unknown, assume it is already in today's base"*. **The two defaults disagree, and saving converts one into the other.** A snapshot merely lacking the field — legacy localStorage rows, anything arriving through import or restore — rendered correctly before the save and came back tagged `USD` after it: a 3 400 000 Ft total read as **≈1.19 billion Ft**, the snapshot list printed a `−99.7%` delta, and `calcTWR()` got a `vStart` 350× its `vEnd`, compounding that into every later period and into the Alpha card. Pre-batch, `baseCurrency` drove arithmetic at exactly one site; 116.3 raised that to six without noticing that the field can be a fabrication. An absent denomination is now **refused, not guessed** (`baseSum.miss()` / `snapshotInBase()`), and the writer preserves the unknown as `''` rather than laundering it into a real currency. *This is the batch's own defect shape, aimed inward, in the one place its own comment called "the only place where a missing rate outlives itself."*

**116.10 — CRITICAL for usability: the seven new "Fetch rates" buttons did nothing visible.** `fetchExchangeRates()` stores the rates and returns a boolean; its own docblock says *"so the caller can decide to re-render"*. **No caller ever did** — and it had never mattered, because before this batch those widgets showed a wrong-but-present number. Emptying them made that button the only way back, and it appeared broken: click, a second of nothing, a green *"Rates updated"* toast, and a still-blank widget. (`setBtnLoading` targets Settings' `#pf-rate-btn`, so the inline buttons had no spinner either.) All eight call sites now go through `fetchRatesAndRefresh(this)`, which re-renders on success and shows progress on the button it was given. Verified end to end: `—` → `3 700 000 Ft`, grid restored, warning cleared, one re-render.

**116.11 — a Chart.js instance left pointing at a detached canvas.** `renderDbBenchmark`'s new `!canChart` branch removes the canvas via `innerHTML` but the `destroy()` sat inside the `if(canChart)` arm. The batch identified this exact hazard and handled it correctly in `renderDbNetWorth`, then did not apply it to the path it had just added — and the older `totalNW===0` branch four lines below that comment had the same hole. Both destroy now. **116.12 — the per-company PDF printed `$` beside un-converted amounts** in a row that also states the real currency: `$3400.00 | HUF | $1.2M`. The Currency column is the unit, so those numbers are now bare; the transaction table below it, which has no such column, carries each amount's own currency code instead. Same shape as the calendar tooltip (116.7), missed on the first pass.

**116.13 — the positions table ranked money across currencies.** Sorting by Value, P&L, Price or Avg Cost compared each position's *native* amount with `va-vb`, so with a HUF base a 3 000 000 Ft holding outranked a $10 000 one — and the cells use `fmtMoney()`, which prints no symbol, so the column was unitless too. Pre-existing, and inside this batch's stated scope (*combined, **compared**, indexed or labelled*), in a function the sweep had already revisited. Sort keys are converted now; a position whose rate is missing sorts last, the only honest place for a value that cannot be ranked.

**116.14 / 116.15 / 116.16 — two shadows and some dead weight.** `renderDbNetWorth` carries a header comment reading *"`at`, not `t` — the asset type shadowed the i18n t()"*, and an identical `t` shadow sat **85 lines lower in the same function**; a new `const cv=` in the calendar shadowed the global `cv()` CSS-variable helper used elsewhere in that very region. Neither could throw today, both are the P.28 bomb. And `calcPortfolioDividendIncome` returned a `ratesOk` nothing read, while `takeSnapshot` converted every position **twice** to fill a `valueInBase` field that is written to localStorage and never read back — one conversion now feeds both the row and the total.

**What QA cleared, which is worth recording too:** i18n symmetry (1011 keys each in `en`/`hu`, no undefined references, no unused new keys); null propagation through all six functions whose return type changed (every caller traced and guarded — the `x?x.y:0` shape occurred exactly once, at 116.4); `baseSum` itself against negatives, `0`/`-0`, `NaN`/`undefined`/`''`, a missing `from`, and `from===base` with an empty table; all eight reads of the partial `.value`, each gated by a completeness check on the same input set; and the `takeSnapshot` reordering, confirmed to mutate nothing before its bail.

**Lesson (Cat 116):** *a scope count inherits the shape of the query that produced it, and a number with its method printed beside it is more persuasive, not more true.* "16 sites, measured with `grep -c`" was believed for a day and was wrong twice over — it missed two other spellings of the same fallback, and it could not in principle reach the four sites that mixed currencies without calling the helper at all. When the defect is *"two things that should not be combined get combined"*, the authoritative search is over the **combining**, not over the function that usually does it. → CODING-LESSONS § AI Behavioral #14 (twelfth instance, and the first outside a checker) and § JavaScript #13.

## Category 117 — The i18n Global Is `i18n()`, Not `t()` (2026-09-06) — v59

The batch that closes **P.28**, and it closes it from the other end. P.28 had stood since the 2026-07-09 sweep as *"~110 sites, rename them to descriptive locals"*. Renaming 110 locals is the symptom's fix: `t` stays a free name, so site 111 arrives with the next `.filter(t=>…)` anyone writes, and the entry would have to be reopened or a gate check written to hold the line forever. The **disease is a one-letter global**. `t` is arguably the likeliest local name in JavaScript — transaction, todo, tab, text, tooltip, target, time — so the global moved instead: **`t()` → `i18n()`**, a name nobody reaches for as a local. The 104 shadowing scopes were not touched and are now harmless.

**117.1 — the count was wrong, and it was wrong in the direction Cat 116 predicted.** P.28 said **~110**, "15 `const t =` declarations, 91 `t =>` callback parameters and 4 `(t, …)` parameter lists" — a grep census of *spellings*. Parsed with `acorn` and scope-resolved, the real figure is **104 scopes**, and the categories do not line up either: 13 `const`, 90 arrow parameters, 1 function parameter. The same instrument answered the question P.28 never asked — **how many of those scopes actually call `t()`? Zero.** The trap had never sprung on its own; both historical crashes (Cat 34, and the tooltips batch) came from someone *adding* a call inside an existing shadow. That is the entry's own claim, but nothing had ever measured it. Sites 10190–10214 show how close it ran: `.filter(t=>…)` shadows and `t('comp.insiderSummary')` calls interleaved **in the same function, ten lines apart**.

**117.2 — two call sites no JS parser could reach.** 680 of the 681 references to the global live in `<script>` blocks. The last two live in a static inline `onclick` on the export-modal Copy button — HTML text, invisible to `acorn`, and equally invisible to the AST rename. Found by diffing the file's **691 textual `t(` occurrences** against the **680** the parser accounted for and reading all ten of the remainder. Eight were comments (117.3); two were live code. *This is 116's lesson one level up: an AST census has a shape too, and its blind spot is exactly the code that is not JavaScript until the browser makes it so.*

**117.3 — eight comments that warned against a hazard that no longer exists.** Every previous shadow fix had left a marker: `/* \`tx\`, not \`t\` — the old callback shadowed the i18n t() used in the bar below. */`. After the rename each one is false, and a stale warning is worse than none — it teaches the next reader that `t` is still special. All eight were resolved (five lines dropped, four rewritten to keep the non-shadow content they also carried, e.g. *"sumAll.ok above guarantees this converts"*). The knowledge they carried is now stated once, where it belongs: a four-line rationale above the definition explaining why the function is not called `t`.

**Method, because the diff is 552 lines and nobody can eyeball it.** Every site was rewritten at an exact AST byte offset, each asserted to be a `t(` immediately before substitution. The working tree was then **reconstructed from `HEAD` by replaying the offsets**, and compared byte-for-byte — identical, so the diff provably contains the rename, the comment edits and the version bump and nothing else. Verified live afterwards, not merely parsed: `window.t` is `undefined` and `window.i18n` is a function; **1 059 real `i18n()` executions** across 298 distinct keys, seven sections and both languages, with **zero exceptions**; 321 DOM nodes changed text on a language switch with no key left raw; and the inline handler's own expression resolved from global scope to `"Copied to clipboard"`.

### QA found two, and both were mine

**117.4 — an orphaned comment terminator.** Deleting the trailing sentence of the 117.3 comment at the transactions bar left `*/` alone on its own line, indented six spaces against the block's five, under a paragraph now ending mid-thought. Syntactically valid — which is why the parse check went green over it — and pure litter. Joined onto the preceding line. *A parser confirms a file is legal, never that it is intact.*

**117.5 — shipped code citing a record that did not exist.** The new rationale comment above the definition ends `KNOWN-ISSUES P.28, BUG-HISTORY Cat 117.` — written before either was true, while P.28 was still open and 116 was the highest category. For the length of the code commit the repository shipped a forward reference to itself. Resolved by this docs commit making both citations real; the general form is that **a `docs:` commit is part of the batch, not a postscript to it**, which is why CLAUDE.md requires it before the push rather than after.

### Found, not fixed

**117.6 — the lock screen never follows the language setting.** Found while verifying: with `app_lang=hu`, the sign-in screen renders entirely in English. `applyI18n()` is called from exactly two places, `renderDbFiTracker()` and `autoLoad()`, and **both run only after a successful sign-in** — so the first screen of the app is the one screen the translation system never reaches. Ten keys carry complete Hungarian text that can never display, the recovery flow among them (`mp.rec.*`): *"Belépés"*, *"Titkosított befektetési platform"*, *"Add meg a helyreállítási kulcsod és egy új mesterjelszót"*. **Pre-existing and unrelated to this batch** — `HEAD~1` has the same two call sites — so it was recorded rather than folded in. → KNOWN-ISSUES **P.31**.

---


## Category 118 — The Sign-In Gate Follows the Language Setting (2026-09-06) — v60

Closes **P.31**, recorded one batch earlier during Cat 117's verification. `applyI18n()` — the function that rewrites every `[data-i18n]` node — was called from exactly two places, `renderDbFiTracker()` and `autoLoad()`, and **both run only after a successful sign-in**. So the sign-in gate, the first screen every user sees and the only screen an unauthenticated user *can* see, was the one screen the translation system never reached. Ten keys carried complete, already-written Hungarian that could never display: *"Belépés"*, *"Titkosított befektetési platform"*, *"Add meg a helyreállítási kulcsod és egy új mesterjelszót"*, and the whole `mp.rec.*` recovery flow. Dead translations, not missing ones.

**118.1 — the fix is one listener, and the ordering is a guarantee rather than a hope.** `document.addEventListener('DOMContentLoaded', applyI18n)`. `#lock-screen` ships as `display:none` and is un-hidden by `showMasterLogin()`, every caller of which sits in the `window` `load` handler or in a later network/user event — and `load` is ordered strictly after `DOMContentLoaded`, so the gate is painted *already translated* rather than flipping language in front of the user. Caught in the act during verification: one probe landed between the two events and read `display:none` on a gate whose button already said **Belépés**, `<html lang>` already `hu`; three seconds later it read `flex`.

**118.2 — `<html lang>` was hard-coded `"hu"`, and the app defaults to English.** Found by QA. `index.html:2` declared Hungarian while `_lang` falls back to `'en'`, so **the default state for every new user was a page whose markup lied about its own language** — wrong for screen readers, browser translate prompts and hyphenation. `applyI18n()` now sets `document.documentElement.lang=_lang`, and the static default was corrected to `"en"` so the markup agrees with the code before any script runs. *In a batch whose entire subject is "the markup follows the language setting", this was the one place that still did not.*

**118.3 — `applyI18n()` had been silently deleting all 12 dashboard widget tooltips.** `textContent` deletes element children, and `initWidgetTips()` appends the tooltip bubble (`.cp-tiptext`) **inside** the node that carries `data-i18n`. Both are called from `DOMContentLoaded`, which looks safe — but the widgets render **lazily** through `lazyChart()`/IntersectionObserver, so `renderDbFiTracker()`'s own `applyI18n()` fires whenever the FI widget scrolls into view: long after `initWidgetTips()` ran, with nothing restoring the bubbles until the next `renderDashboard()`. Measured in the browser: **12 bubbles → 0** on a single `applyI18n()`. The bubbles are now lifted out and re-appended; **12 → 12** across repeated calls, content and parent intact. This bug had nothing to do with P.31 and was found only because the fix touched the same function.

**118.4 — the preservation reads DIRECT children only.** QA's hardening. `el.querySelector('.cp-tiptext')` is descendant-scoped and singular; there are three other `.cp-tiptext` factories in the file. The day one of them lands inside a translated node, a descendant's bubble would be **re-parented onto its ancestor** — silently moved rather than merely lost, which is the worse failure. Now `querySelectorAll(':scope>.cp-tiptext')`, and every bubble is put back.

### The batch's own worst moment, self-caught

**118.5 — a fix built on a measurement of the wrong artifact.** The first attempt at 118.3 changed the *write path* — "set the leading text node instead of `textContent`" — and justified it with a measurement: *"332 `[data-i18n]` nodes, 12 with element children, **0 whose first child is not a text node**."* That measurement was taken **on the live DOM**, where the old `textContent` had already flattened every node. The source markup was never looked at. Re-measured by fetching the page and parsing it with `DOMParser`, the real answer is that **exactly one** `[data-i18n]` element has a child in the source — `settings.d1Connected`, which *begins* with a `<span>` — so the new write path inserted the Hungarian translation **in front of the surviving English sentence** and produced a duplicated paragraph. Caught by a "duplicate text nodes" assertion in the verification sweep, before commit. The fix was replaced with one that preserves the bubble specifically and leaves replace-all semantics alone.

**This is the third batch running to be bitten by the shape of its own instrument** — Cat 116's grep-shaped scope count, Cat 117's AST census that could not see HTML, and now a DOM census that could not see the markup. The pattern is sharper here than in either: the measurement was not merely incomplete, it was taken *downstream of the very code under repair*, so it could only ever report the behaviour being changed. → CODING-LESSONS § JavaScript **#14** and § AI Behavioral **#14**.

**118.6 — and the comment that blessed a bug as a design.** QA's second find. The replacement comment said replace-all semantics were what `settings.d1Connected` *"genuinely relies on"*. It relies on the opposite: `textContent` destroys that paragraph's green `<span>` highlight, which is never restored, so the line renders unstyled. Pre-existing — `autoLoad()` already did this — but the batch had written a silent visual regression into the source as intentional. The comment now says what is true, and the loss is recorded as **P.32** rather than blessed.

### Found, not fixed

**P.32 — the green highlight in `settings.d1Connected` is destroyed on every `applyI18n()`.** The only `[data-i18n]` node with a child in the source markup. Pre-existing, cosmetic, and the honest fix is to restructure that one string rather than to special-case another selector.

**P.33 — a first-time user still gets English, with no control on the gate to change it.** QA's sharpest find, because it limits the batch's own headline. The only two `setLang` entry points are the sidebar toggle and the Settings `<select>`, and both live inside `#sidebar` / `#main-content`, which `html.app-locked` hides. Measured on the gate: `#sidebar` computed `visibility:hidden`, the language button `offsetWidth === 0`. `_lang` defaults to `'en'`. **So this batch reaches returning users, whose choice is already in localStorage, and nobody else.** `#lock-screen` sits outside the `app-locked` subtree, so a toggle can go there — but that is a visible change to the sign-in screen and is Peter's call, not a QA cleanup.

*Two INFO findings recorded without action: `showLockView()` reads `#lock-error`, an element that does not exist (harmless `&&` guard, dead code, pre-existing); and `#ml-pass` reuses the heading key `mp.title` as its placeholder, which reads acceptably in both languages but is now live rather than dormant.*

---


## Category 119 — The i18n Contracts Stop Being Hand-Maintained (2026-09-06) — check 14

Cats 117 and 118 established four invariants and left all four resting on memory: the global is `i18n()` and nothing may reference a bare `t`; every key in use exists in every dictionary; `applyI18n()` must preserve the tooltip child and set `<html lang>`; and no element may carry `id`/`name="i18n"`, because inline `on*=` handlers evaluate under `with(element)` and such an element would shadow the function inside every one of them. The last of those had sat in `STATUS.md` as prose since Cat 117. **This batch makes all four mechanical** — `docs/check.sh` check 14, backed by `docs/i18n-invariants.mjs`, which parses `index.html` with `acorn` rather than grepping it. It is the project's first gate check with an external toolchain dependency, and the first that shells out at all.

**119.1 — what it licenses, and what it does not.** The dictionary and key assertions are strong: read from the AST, so a renamed or restructured `I18N` is a failure rather than a silent pass. The `t` assertion is scope-resolved, so the 104 scopes that legitimately bind a local `t` stay legal and only a genuine global reference fails. The `applyI18n` assertions are structural but still only prove the calls are **present**, not that they work — the browser is the only thing that shows that, which is why `TEST-PLAN.md` § Internationalisation carries the manual case. Two blind spots remain by construction: **10 keys built at runtime** (`i18n('x.'+k)`, `data-i18n="${k}"`) and **1 inline handler of 500** that is not valid JS standing alone. Both are **pinned**, and exceeding the pin is a FAIL.

**119.2 — "printed on every run" is not a guard, and the first version claimed it was.** The commit message and the file header both asserted that printing those counts meant they "cannot grow in silence". QA disproved it in one line: the runtime-key count went 10 → 11 and the unparseable-handler count 1 → 69, both under a green `ok`. Printing a number only works if a human remembers it between runs — which is precisely the hand-maintained fact this gate exists to replace, and the project already owned the right pattern one check away (check 4's *"is at or below the pinned 11"*). Now pinned, with a `warn` when the number *drops* so the ceiling gets lowered rather than quietly loosening.

### QA found five fail-opens, in a gate whose own header forbids them

The script's header states the rule: *"A check must never fail OPEN: if a pattern stops matching, that is a FAIL, not a pass."* This batch broke it five times, and the whole set had been break-tested first — against nine mutants that all failed correctly. **Nine passing break-tests bought less confidence than they appeared to, because the author chose the nine.**

**119.3 — CRITICAL: a comment satisfied the contract.** `html.match(/function applyI18n\(\)\{[\s\S]*?\n/)` captures from the declaration to the first newline. `applyI18n` is the last thing on its line, so the window swallowed whatever followed it. QA deleted **both** Cat 118 behaviours — the `:scope>.cp-tiptext` rescue and the `documentElement.lang` assignment — and appended `// TODO restore :scope > .cp-tiptext and documentElement.lang =` on the same line. **Both assertions reported ok, exit 0.** The two lines the check exists to protect could have been removed under a green gate. The same window also failed on a *correct* refactor: pretty-printing the function across lines broke both assertions, an undeclared "this function must stay on one line" rule. Both cured at once by asserting on the syntax tree — a comment cannot satisfy an AST, and line breaks are invisible to one.

**119.4 — CRITICAL: one spelling of an attribute.** `data-i18n="…"` was matched only double-quoted. `data-i18n='k'` and `data-i18n=\"k\"` (escaped, inside a JS string — the very construct the handler scanner already unescapes) both passed with a bogus key and did not even move the counted total. This is check 4's *"enumerates the one spelling it has seen"* antipattern reproduced verbatim, in a check written by an author who had read that warning in the same file an hour earlier. Latent rather than live — all 358 occurrences happen to be double-quoted today — which is exactly why nothing would have caught it.

**119.5 — CRITICAL: `\bsrc\s*=` also matches `data-src=`.** `-` is a word boundary. A `<script data-src="lazy">` block was skipped wholesale, taking a global `t` and a nonexistent key with it. An attribute-gated lazy-load block was an invisibility cloak for every assertion in the check.

**119.6 — CRITICAL: in handlers, `t` was only caught when called.** The `<script>` pass counts every *identifier* and correctly flags `[t]`, `` `${t}` ``, `{x:t}` and `typeof`-free references. The handler pass matched `CallExpression` only, so `onload="console.log([t])"` passed clean. The weakest coverage sat exactly where Cat 117 had already been bitten — two live `i18n()` calls hiding in an inline handler — which is the hole this scanner was added to close.

**119.7 — CRITICAL: an unreadable dictionary was skipped, and the summary then lied.** `if (lang.value.type !== 'ObjectExpression') continue`. With `var I18N={de:DE,en:{…},hu:{…}}` the run printed *"2 dictionaries read from the AST … identical key sets"* while the app shipped a third language missing 1010 keys. A `continue` in a checker is a fail-open with a friendly face; it is now a FAIL that names the entry it could not read, and spread elements inside a dictionary are reported the same way.

### Five false positives, which are fail-opens by a longer route

A gate that red-lights correct work is the gate that gets `--no-verify`'d, after which it guards nothing. `ecmaVersion: 2022` made an ES2024 regex flag report the app as unparseable; `sourceType` defaulted to `script`, so any `type="module"` block would have done the same; `typeof t === 'function'` — a defensive guard, not a crash — was flagged as a global reference; a runtime-built `data-i18n="${k}"` was reported as a *missing key* while its `i18n('x.'+k)` twin was celebrated as an acknowledged blind spot; and helper **stderr was merged into the parsed stream**, so one benign Node warning produced two "unrecognised output" FAILs on a clean tree.

**119.8 — and the dependency was never declared.** `acorn` was reaching the checker only through npm hoisting from `wrangler`, which is not a contract npm makes: a wrangler upgrade could nest or drop it and permanently break every push, with the advertised remedy (*"run npm install"*) unable to fix it. It is now in the worker's `devDependencies`, the prerequisite is stated in the script header, and a 60-second bound was added because this is the first external process the gate runs and it runs from `pre-push`, where a hang blocks a push with no diagnosis. (`timeout` is absent from a stock macOS — confirmed on this machine — so it is used only when present rather than assumed.)

**The sentence worth carrying forward:** *a break-test you designed yourself measures your imagination, not your code.* Nine mutants passed before QA; QA wrote thirty and found five holes. The nine were the failure modes the author had thought of while writing the checks, which is the same set the checks were written to catch. → CODING-LESSONS § AI Behavioral **#14** (fifteenth instance).

---


## Category 120 — Checklist Progress Reaches the Tracker (2026-09-06) — v61

Three UX items were chosen off ROADMAP. Checking each against the code before writing any, **two were already built and only their checkboxes were stale.** That is worth stating first, because it is the most reusable thing the batch produced: a backlog that misdescribes the product does not merely waste a session, it sends the next one to build something that exists and then to "fix" working code around it.

- *"Transaction price isn't pre-filled from the last known price"* — it is, and has been. `onTxTickerChange()` fills the field from `tStocks[ticker].price` and shows a "current price" hint. Tested rather than assumed: a tracked ticker pre-fills; a price the user has already typed is **not** overwritten; an unknown ticker produces no price and no hint. Ticked, not rewritten.
- *"Checklist has no progress indicator … in the tracker or at the top of the checklist"* — the checklist half exists (overall bar plus per-section percentages). Only the tracker half was missing. The item also said "12 sections"; `CL_SECTIONS` holds **14**.

**120.1 — the `CL%` column delegates rather than counting.** `calcClProgress()` already produced `cl.overallProgress`; nothing surfaced it outside the checklist page and the PDF. The new column calls that same function and reads that same field. Two independent ways to answer *"how analysed is this company"* would be two truths, and the one on the busier screen would win by exposure. Verified by rendering both and comparing: tracker `15%`, checklist header `15%`. Sortable, with never-started sorting as unknown-last rather than as zero.

**120.2 — the three dead ends.** `openPositionModal`, `openTransactionModal` and `openCsvImportModal` each showed *"Add a broker account first"* and stopped, leaving the user to find Portfolio → Accounts → Add unaided and then repeat the action they came for. All three now offer the fix through `requireBrokerAccount()` and resume the original intent once the account exists. The pending intent is cleared when the account modal is opened by hand, so a cancelled flow can never fire a modal the user has forgotten about.

### QA found five, and the first is the one to remember

**120.3 — CRITICAL: the not-started guard tested the wrong thing, and the comment beside it claimed otherwise.** The column renders `—` rather than `0%` for a company nobody has opened, because `change_log` counts as complete by definition and the `financials` section takes credit for live FMP metrics — so a fresh checklist already reads 7-13%, and printing that would be a plausible wrong number of the Cat 116 kind. The code said so, in a comment, directly above `if(!cl)return null`. **But `_d1CompanyToTStock()` builds every company with a bare `checklist:{sections:{}}`, so in the D1 path — production for anyone migrated — that guard never fired.** Measured by QA: `7%` for an untouched company, `11%` for one carrying live metrics. *The guard was real, the reasoning was written down, and it still tested the wrong property.* It now asks whether any section holds content the user put there, ignoring the `progress` field the calculation itself leaves behind.

**120.4 — CRITICAL: a table render was writing to state that syncs to production.** `calcClProgress()` stamps `progress` onto every section object and `overallProgress` onto the checklist, and `saveTrackerStocks()` syncs exactly those. Rendering the Companies tab therefore turned `sections.financials` from `{}` into `{progress:96}` for a company whose checklist had never been opened — and those values would ride the next unrelated save into a D1 that has no staging. **A read that writes is not a read.** The helper now snapshots what it is about to overwrite and restores it; three consecutive renders leave the objects byte-identical.

**120.5 — CRITICAL: one malformed checklist silently froze the entire table.** `calcClProgress` reads `cl.sections[sec.key]` unguarded, so a `checklist:{}` throws. Because the call now sits inside `renderTracker()`'s row loop and `tbody.innerHTML` is assigned only at the end, the throw left the **whole table showing stale rows with nothing on screen to say so** — sorting and filtering appeared to do nothing. Reachable through `doImport()` of a hand-edited backup, which validates no shape, persists it, and swallows the exception. The helper now catches, logs, and renders `—` for that one company. **This deliberately breaks the rule in CODING-LESSONS § Data Safety 0c** (a helper that swallows errors turns failure into silent success) because here the *un*caught failure is the silent one: a frozen table with no error, versus one honest dash.

**120.6 — the resume could reassign a broker.** `pfAccounts` is empty not only when the user has no accounts but also when its D1 load **failed** — the three portfolio loaders share one `Promise.all`, so transactions can be present while accounts are not. Clicking the edit pencil on a transaction then walked the user into creating an account and resumed *into the edit modal*, whose account `<select>` now held only the new account; saving would have silently reassigned that transaction's broker. Only a **create** is resumed now. *The batch had turned a read-only dead end into a data-mutating one.*

**120.7 — the double-submit lock was taken before validation**, so a rejected save (empty or duplicate name) locked out the corrected retry for 500 ms and swallowed it without a toast. Pre-existing, but this batch drops users into that modal mid-task, which is exactly when a hurried empty-Save-then-retry happens. The lock is now taken after validation passes. **120.8 — the cell tooltip claimed more than the number measures**, saying *"% of the checklist is filled in"* when part of the figure is credited from market data. Reworded.

### Found, not fixed

**P.34 — `CL%` moves when nothing was filled in.** The `financials` section credits a threshold as complete when it can be derived from live FMP metrics, so the figure drops when a fetch fails and rises after a refresh — QA measured 14% → 9% with no user action. `change_log` is hardwired to 100. This is `calcClProgress`'s long-standing definition, shown unchanged on the checklist page for as long as it has existed; Cat 120 only put it somewhere busier. Recorded rather than changed, because redefining it would move every historical percentage at once.

---


## Category 121 — What the Owner's First Manual Pass Found (2026-09-07) — v62

The app's owner sat down with `docs/TEST-PLAN.md` and worked through it. Everything below came out of that hour. It is the batch that most clearly justifies KNOWN-ISSUES **P.30**: five consecutive batches had passed a green gate and an adversarial QA agent, and the first person to actually *use* the result found a core feature that had never worked.

**121.1 — CRITICAL: global search was entirely dead, for years, for anyone with a single review.** `_gsSearch` read `(r.answers||[]).map(a=>a.answer||'')`. But `answers` is an **object** keyed by question id — as every other consumer in the file already treats it: `Object.entries` in the CSV export, `Object.values` in the reviews list, `r.answers||{}` in the renderer. So `||[]` never engaged, `.map` was `undefined`, and the whole function threw. Because `onGlobalSearchInput` did not catch, the previous markup stayed on screen: **the search looked like it was ignoring what you typed.** Typing "app" with an Apple position on the screen returned nothing. Reported as *"kereső bejön, de nem működik"*, and the cause was in the console log the owner pasted — a `TypeError` nobody had looked at, because nobody had opened the console.

**121.2 — and fixing that line alone would have left six more of it.** QA reproduced every one: a position or transaction with **no ticker** (real-estate and cash rows), a transaction with **no type**, `tags` arriving as a **string**, a note list arriving as an **object**, a thesis field as an **object**, a company name as a **number**. Each throws, and **one throw takes down every source in the search**, not just its own. This data is assigned *verbatim* from a user-supplied backup by `doImport()` and `doRestore()`, and the codebase already defends against absent tickers (`p.ticker||''` when saving) and non-array tags elsewhere — `_gsSearch` was the single consumer that trusted all of it. Every field now goes through one normaliser. *The diagnosis was right and the fix was one seventh of it; that gap is the finding.*

**121.3 — three more in the reviews block, all invisible without reading the data model.** It read `r.companyName` and `r.reviewDate`, **neither of which the model has ever set** — entries are `{id,type,date,companyTicker,companyId,answers,summary}` — so every review titled itself `AAPL (AAPL)` with a permanently blank subtitle, and a review with no ticker had no title at all. Soft-deleted reviews were returned while every other source filters them, so a search result could land you on a list that did not contain it. And `group:'Reviews'` was the one hardcoded English string in an otherwise translated palette — invisible to check 14 by construction, because it is a literal and not a key.

**121.4 — no tab ever looked selected in Hungarian.** Both tab strips decided the active button with `b.textContent.toLowerCase()===name` — the button's **translated label** against an internal id. `"Grafikonok"` is not `"charts"`, so in Hungarian nothing matched and nothing was highlighted; in English it happened to work, which is why it had survived. Twelve buttons across the Companies tabs and the company profile. The sidebar had used `data-section` all along: these were the outliers, not the pattern. The portfolio strip, which keyed on **array index**, joined them — and that turned up a dangling `[data-tab="pf-transactions"]` selector that had never matched anything, so the Transactions search result silently landed on Overview.

**121.5 — a shortcut that could not work, and the fix that was worse than the bug.** `Cmd/Ctrl+1..7` is reserved by every browser for tab switching; `preventDefault()` does not take it back, and in Safari it never reaches the page. The Settings guide advertised it regardless. The first replacement used **bare digits** — and Peter rejected it immediately, for the right reason: the focus guard only covered inputs, textareas, selects and contenteditable, so a stray keystroke with focus on the body would navigate away from whatever he was doing. **A convenience that can fire by accident is a bad trade at any hit rate.** Now `Alt/Option+1..7`, matched on `e.code` because macOS Option+1 emits `¡` and reading `e.key` would have silently never matched. And no shortcut — including the pre-existing `n` and `?` — fires any more while a modal, confirm dialog or the search palette is open: focus sits on a `BUTTON` there, which the old guard missed, so `⌥1` used to switch section behind a dialog that was still waiting for an answer.

**121.6 — the charts knew exactly why they were empty and did not say.** Yahoo answers **429** under load. `fetchChartData` logged `"Chart rate limited for"` and returned `null`; `renderAllCharts` then cleared the progress line unconditionally. An empty chart with no explanation is indistinguishable from *"there is no data"* — precisely the defect Cat 116 fixed for currency totals, reappearing on a different screen. The reason is now stated where the chart is, naming the rate limit specifically.

### QA found four more layers inside that one fix

**121.7 — a transient limit was permanent for the session.** `chInited` was set *before* the fetches resolved, so leaving the Charts tab and returning only re-rendered data that had never arrived. A full page reload was the only way out. It now re-fetches whenever nothing is loaded.

**121.8 — and that retry then fed the limit it was recovering from.** With no cooldown, every visit to the tab fired a fresh N/6-batch round — while the new message told the user to *"switch away and back"*, i.e. to perform the amplifying action. A rate-limited round now blocks automatic retries for 30 seconds, and an in-flight round blocks a second.

**121.9 — the failure counter was module-level, so an abandoned round reported over a newer one.** Reproduced by QA: a slow rate-limited round overtaken by a fast successful one ended with **all three charts loaded** and the message *"0 of 3 charts could not be loaded"*, in yellow. A round guard on the *reporting* was not enough — the stale round was still **counting** into a counter the new round had zeroed. Failures are now attributed to the round that produced them.

**121.10 — two paths returned `null` in silence**, so the message *"see the console for the reason"* pointed at an empty console. `if(!hasDataAuth())return null` is the likeliest failure on a fresh or locked session, and a 200 response carrying no series was equally quiet. Both now count and log.

*A note for whoever writes the next summary row: **a `|` anywhere in a cell silently shifts every column after it.** Check 4 splits rows with `awk -F'|'`, which cannot see markdown escaping, so `\|\|` breaks it exactly as `||` does. This row first went in containing `(r.answers||[]).map` and the gate reported "Fixed column sums to 1151" — it caught the damage, but the message pointed at the total rather than at the cause. Keep pipes out of the cells.*

**The sentence worth carrying forward:** *a green gate and a clean QA pass certify the repository, not the product.* Five batches in a row had both. What found a years-dead search feature was one person opening the app and typing a word into it. → CODING-LESSONS § JavaScript **#15**, § AI Behavioral **#14** (sixteenth instance).

---


## Category 122 — A -100% Return on a Portfolio That Had Lost Nothing (2026-09-07) — v63

Peter opened his own dashboard. The hero read **P&L +0 Ft, +0.0%** — and beside it, **TWR -100.0%** and **Alpha -99.9%**. He asked whether the S&P comparison was right. It was; the portfolio number was not.

**122.1 — one zero snapshot pins the metric forever.** `calcTWR()` multiplies `(1+r)` across periods. Both of his snapshots stored `totalValue: 0`, so a period ending at zero gives `r = -1`, the running product collapses to zero — and **zero times anything stays zero**, so no later period can ever lift it. The metric was not wrong once; it was unrecoverable. Alpha inherited it, and the same zero is why the hero subtitle read *"+31 202 Ft since 2026-07-22"*: measured from zero, his entire portfolio looked like gain.

**122.2 — and Cat 116 had walked past the cause.** That batch taught `takeSnapshot()` to refuse a missing exchange **rate**. A missing **price** was still folded in as `0`: `mktVal = price!=null ? shares*price : 0`, and converting 0 succeeds, so `allConverted` stayed true and a zero portfolio was written to storage. **A stored total of zero is the same defect class as a wrong rate** — a number that never throws, never renders blank, and is wrong. Fixed at both ends: the writer refuses, and `snapshotInBase()` refuses any snapshot totalling zero so every existing bad row degrades to `—` without Peter having to delete anything.

**122.3 — the Dip Finder was dividing two different moments.** The 52-week-high refresher stored only `yearHigh` out of the quote response, so the dip was a freshly fetched high over whatever `tStocks[t].price` happened to hold — months old, or never fetched at all, which is what his console showed: `FMP HTTP 402` on every symbol. AAPL rendered a confident **-71.0% dip** from a current high and a stale price. Both numbers now come from the same response, and a high with no price from that same fetch produces no row: *a dip against a price of unknown age is not a dip*.

**122.4 — the hide button sat on top of the Refresh button**, on three widgets rather than the two first assumed: Benchmark, Dip Finder and Earnings. `.db-widget-hide` is absolutely positioned in the corner, which is where a header button already is. **122.5 — the allocation tooltip never showed a share**, only a label and an amount, on a chart whose entire subject is proportion.

### QA found the first round of fixes wrong in three places

**122.6 — CRITICAL: the fix relied on a chokepoint the Snapshots panel bypassed.** `renderCloudSnapshotsList()` printed `formatMoney(s.totalValue, …)` and computed its own delta with `baseSum(...).add(s.totalValue)` — neither through `snapshotInBase()`. So on the one screen dedicated to managing snapshots, a refused row still showed **`0 Ft`** and a fabricated **`-100.0%`**, next to a TWR that had already given up. *A screen that mixes `—` with a confident wrong number is worse than either alone.* Both now read through the chokepoint, and the tooltip names the real cause instead of blaming a missing exchange rate — which it had been doing, sending the user to fetch rates for a problem rates cannot fix.

**122.7 — CRITICAL: the guard switched off depending on which store the row came from.** The first version refused only when `snap.positions` was non-empty. But `savePortfolioSnapshots()` silently drops positions whose ticker or account does not resolve, and `loadPortfolioSnapshots()` caps the position fetch at 5000 rows — so the **same** snapshot is refused when read from localStorage and accepted as a confident `0` when read back from D1. **A guard whose trigger depends on where the row was loaded from is not a guard.** This is Cat 116.9's shape exactly, reproduced by the batch that cites it. Resolved by dropping the condition entirely: `takeSnapshot()` is the only writer of `pfSnapshots` and already refuses a portfolio with no positions, so a legitimate zero total cannot exist and `totalValue <= 0` is sufficient on its own.

**122.8 — CRITICAL: the price guard would have made snapshots impossible for whole asset classes.** `getPositionPrice()` returns `null` for bonds, savings, "other" and property with no recorded value — they have no market price by nature. An all-or-nothing refusal meant **one** such row blocked snapshots for the entire portfolio, permanently, under a toast reading *"Refresh prices and try again"* — advice that can never work for a bond. Peter holds both bonds and property. The refusal is still right (a total that silently counts a holding as zero is what Cat 116 existed to remove), but it now **names the offending rows** and says a Current Value is what they need. Verified: a bond blocks the snapshot and is named; giving it a value lets the snapshot through.

**122.9 — three smaller ones from the same pass.** A price of `0` — what FMP returns for a halted or delisted symbol — passed the new `h.price==null` check and produced a fabricated **-100% dip**. Every `db52wHighs` entry written before v63 lacks a price, so all are skipped, and with a non-empty cache the "click Refresh" branch never fired: the widget would have announced *"no dips"* over a portfolio well off its highs. And the hide-button fix left `justify-content:space-between` on a title row that now held three items, which parks Refresh in the middle, while the inline button was `opacity:0` — invisible but still reserving width and still clickable beside Refresh. It is `display:none` until hover, and the label grows to fill.

**Not a defect, recorded so it is not re-investigated:** all four allocation doughnuts render (By Ticker, Account, Type, Currency). They were below the fold in the screenshot; the console confirmed four items at 177px each.

**The sentence worth carrying forward:** *a chokepoint only works if everything actually goes through it.* Cat 116 built `snapshotInBase()` precisely so one refusal would propagate everywhere, and this batch leaned on that — without checking that the busiest consumer of snapshots called it. → CODING-LESSONS § JavaScript **#17**.

---


## Category 123 — A Corrupt Market Cap Was Scoring a Company 82 out of 100 (2026-09-07) — v64

Peter kept testing, and this batch is what one screenshot of his Tracker contained. Apple's row read **MCAP 3** — the number three — next to a profit of 122.6B. Adobe read MCAP 200 with REV 6 while its PROFIT kept its full scale. Where the cap was intact (APP, ASML, AXON, BKNG) every ratio was correct; where it was not, `P/S 0.0x  P/E 0.0x  PEG 0.0x  P/FCF 0.0x  EV/EBIT 0.1x`.

**123.1 — the P/E was not the bug; it was the mildest symptom of one.** He asked directly whether the P/E was being calculated wrong. It is not: `marketCap / profit` is the definition, and his own data proves the code right — APP 134.0B/4.0B rendered 33.8x, ASML 692.5B/10.6B rendered 65.1x. `calcStockRatios()` guards `mc>0` but nothing asks whether the cap is *plausible*, so a value of `3` sailed through. On the dashboard that produced a visible absurdity. **On the Tracker the same number scored the company 82 with a perfect 25/25 valuation pillar and a buyback yield of 8 000 000 000 000%** — a fabrication that reads as a *recommendation*. Fixed at `_applyMarketData()`, the choke point every path already passes, and mirrored in `calcStockRatios()` for the manual-override path that bypasses it. The test is share count: `marketCap/price` below a thousand is not a listed company; rows with no price at all (crypto, unpriced assets) are left alone.

**123.2 — the edit path was investigated and cleared, at Peter's request.** He asked whether the P/E was miscalculated; checking that led to the editable Tracker cells, which display abbreviated values (`3.5T`) and could plausibly write them back raw. They do not: `stDataFocus` restores the true number from `dataset.raw` and `stDataBlur` runs `parseNum()`, which handles the T/B/M/K suffixes correctly. *A dead function next to them, `updateTrackerField`, would have written the display string verbatim — it is never called, but it is the shape of the bug that was suspected.* Recorded so the next person does not re-investigate the same path.

**123.3 — the allocation widget was clipping half of itself.** His console gave the proof: `gridTemplateColumns: "300px 300px"` with four 300px items inside a narrower card. `grid-template-columns:1fr 1fr` means `minmax(AUTO,1fr)`, and a Chart.js canvas sets its own width, so the tracks could not shrink below it; the grid overflowed the card and carried By Account and By Currency outside it, with nothing to scroll. He was seeing the LEFT column of both rows — exactly what that overflow produces, and exactly what he reported. *An earlier answer told him the other two were simply below the fold. They were not; his "the widget will not scroll" is what corrected it.* QA found the same construction in `.cp-hist-charts` on the company profile and it was fixed with it.

**123.4 — a dash that does not explain itself is read as a bug**, which is precisely what happened: he reported the benchmark as still broken when it was the v63 refusal working correctly on his two zero-valued snapshots. The three cards now carry a line naming the cause and the route to fix it.

### QA rejected the ratio fix twice, and both rejections are rules

**123.5 — CRITICAL: the first guard tested the AVERAGE.** It filtered the finished weighted mean, which is indistinguishable from correct for a single holding — and Peter has one. With five positions and one broken cap, QA measured the P/E rendering **24.0 where the truth is 30.0**: a clean, plausible, confident number, wrong in the *cheap* direction. **That is strictly worse than the `0.0` it replaced**, because 0.0 is self-evidently broken and 24.0 invites a purchase. *An average absorbs one broken value; a filter does not.* Guarded per position now, before weighting.

**123.6 — CRITICAL: it masked at one consumer while eight kept reading the field.** Tracker ratio cells, the screener, compare, the scatter chart, the profile's valuation cards, Money Back, DCF and 10cap all take the same cap. Masking at the dashboard is one fix and eight bugs. The refusal moved to the source.

**123.7 — and this batch's own v64 message named a cause that cannot happen.** It said the corruption came from "a partial write after the quote endpoint answered 402". `fmpFetch('quote', …)` is called only inside `fetchDipData` and writes only `db52wHighs`; it never touches `marketCap`. The real shape is `_applyMarketData` copying only the keys *present* in a response, so a failed profile call leaves an old cap beside new revenue and profit. **A wrong story in a commit message becomes a wrong story in this file** unless someone checks it — QA did.

### And a regression this session created

**123.8 — CRITICAL: v64's dip fix deleted known-good data.** Lifting the same-day skip (correct) let the refresh actually run, and the negative cache then replaced the entire entry with `{high52:null}` the moment the plan answered 402 — **destroying 52-week highs that had been fetched successfully**. Over the top of it: a green *"highs updated"* toast, and a widget announcing *"no stocks down more than 10% from 52-week high"* because it could no longer see a single price. Reproduced by QA end to end. **Losing data to a failed refresh is worse than the stale number the refresh was meant to replace.** The cache preserves what it knew and records the refusal separately, the renderer counts skips before checking the high rather than after, and the toast reports what actually arrived.

### Found, not fixed

**123.9 — a missing pillar makes the composite score go UP.** `calcStockScore` renormalises over the pillars it can compute (`rawTotal/maxPossible*100`), so a company whose valuation pillar is absent is scored only on growth, profitability and health. Measured after this batch: a stock with a broken cap scores **85** while the same stock with real — and poor — valuation data scores **69**. Absent data outranks present data, and sorting the Tracker by Score floats the least-known companies to the top. This predates the batch and is a scoring-philosophy decision, not a defect to patch silently: either the total is capped by its missing pillars, or it states how many it rests on. → KNOWN-ISSUES **P.35**, Peter's call.

**The sentence worth carrying forward:** *guard the input per item, never the aggregate.* An average is a laundering device — it turns one impossible value into a plausible one and hands it to you with a straight face.

---

## Category 124 — A Partial Quality Score Says So (2026-09-07) — v65

Cat 123 found it and left it for Peter: `calcStockScore` renormalises the total over the pillars it could actually compute, so a company missing one is scored on the other three and rescaled to 100. **Absent data outranked present data** — 85/100 from three pillars sitting above 69/100 from four, in a column the Tracker sorts by. Three answers were on the table; two of them re-rank every company in the app. **Peter chose the third: keep the number, and declare what it rests on.** An 85 that admits it saw three pillars is a different claim from an 85 that saw four.

**124.1 — the Tracker score now carries its denominator.** A partial score renders a small `3/4` marker, and the cell explains itself in the tooltip and to a screen reader. The full-score cell is unchanged, so the marker means something by its presence.

**124.2 — the profile PDF said `85/100` with no qualification.** An exported page outlives the app that produced it, so it is the *worst* place for the number to be silent. It now reads `85/100 (3/4 pillars)`.

**124.3 — the metric help described a formula the code does not use.** It said the score was the "average of Valuation + Growth + Profitability + Health". It is not an average over four; it is a renormalisation over however many exist — which is the entire mechanism behind this category. Rewritten to say so.

### What QA found in the fix

**124.4 — CRITICAL: Compare mode was still crowning the company with the LEAST data.** The Tracker was fixed and Compare was not, and Compare is the view whose whole purpose is to declare a winner: it highlights the best value in each row in green, and `91/100` from three pillars beat `75/100` from four in exactly the place a person goes to choose between two companies. Two fixes, because the marker alone would not have been enough: the row appends `(3/4)`, **and the green crown is dropped entirely when the two scores come from different pillar counts.** *A "best" across different denominators is an assertion, not a comparison.* Verified in the browser: with differing counts no cell is crowned; with both complete a winner is crowned again; every other `hi` row is untouched.

**124.5 — the marker's first two shapes were both wrong, in different ways, and the second is the interesting one.** Inline, it cost 15px of a 40px content box (a three-digit score plus the marker measured 39.3px against a 40px box at mobile width) and shifted the digits ~8px left in a column that carries `tabular-nums` precisely to stop that. Absolute positioning fixed the layout — and *not* the reading: **an absolutely positioned element is still in the cell's `textContent`**, which measured `"853/4"`. One token to a screen reader, and `853` to anyone who copies the table. `aria-hidden` plus a labelled cell answered the screen reader and left the copy/paste mangled. The marker is now a CSS pseudo-element (`content:attr(data-pillars)`), which **is** absent from `textContent` — measured back as a clean `"83"`. *Moving a thing out of the layout is not the same as moving it out of the text.* Note what generated content does **not** buy you: Chrome and Firefox expose `::after` content in the accessibility tree as static text, exactly as they do for icon-font pseudo-elements, so it is a copy/paste fix and not a screen-reader fix. What silences it for a screen reader is 124.10's label.

**124.6 — the marker was styled at an opacity nobody could see.** 9px at `opacity:.7` measured **2.19:1** against the light theme — below every contrast floor there is. A marker that exists but cannot be read is the same silence P.35 was opened about, in a smaller font. Full-opacity `--text2` instead.

**124.7 — the score breakdown panel was half-English on a Hungarian UI.** This is the panel the new marker *sends people to* — "click for the breakdown" — and it hardcoded `Quality Score`, `Metric`, `Value`, `Score`, `N/A`, the four pillar names, `… Details` and the not-enough-data message. Worse than plain English: the sentence under the total read **`83/100 across 3 pillér`**, English preposition welded to a Hungarian noun, because only the last word had ever been translated. Twelve keys added to both dictionaries; the Hungarian phrasing is `83/100, 3 pillér alapján` rather than a word-for-word calque.

**124.8 — the i18n gate then rejected my own fix, and was right to.** The obvious way to write 124.7's sentence is `i18n(n!==1?'comp.scoreAcross':'comp.scoreAcross1', …)` — and check 14 failed the build: *runtime-built keys: 11, above the pinned ceiling of 10*. A key assembled at call time is invisible to every static check in this repo, including the one that proves a key exists in both dictionaries. **The fix was to make both calls literal, not to raise the pin** — the pin exists to make that choice a deliberate one, and this was the first time it caught something it had not been written against.

### The second QA round, over the fixes above

**124.10 — HIGH: the accessibility fix deleted the score from the accessibility tree.** A `<td>` takes its accessible name *from its content* — unless the author supplies one, and then the author wins. Putting the explanation in `aria-label` therefore did not annotate the cell, it **replaced** it: the partial cell announced the sentence and never the number, and because the label was set on *both* branches, **a Tracker of a hundred companies had a hundred Score cells all named "Click for score breakdown"**, none of which announced its value. The batch had made the screen-reader experience worse in the act of improving it, and 124.5's own write-up asserted the opposite. Now only a partial cell carries a label, the label leads with `83/100`, and a full score keeps its content as its name with the hint as a `title` description.

**124.11 — the Compare crown compared how MANY pillars, not WHICH.** `availablePillars` is a count, so a company missing Valuation and a company missing Health both read `3` — the predicate saw them as equal, restored the crown, and the row printed `(3/4)` beside each while declaring a winner between a Growth+Profitability+Health score and a Valuation+Growth+Profitability one. **Numerically equal denominators, semantically different ones** — the precise assertion 124.4 exists to withhold. The predicate compares the *set* of non-null pillars now.

**124.12 — one company with no data at all suppressed the crown for two that were perfectly comparable.** `calcStockScore` returns `availablePillars: 0` when nothing can be computed, so adding a freshly typed ticker to a comparison of two fully scored companies made `[4,4,0]` and dropped the highlight — over a third cell that renders `-` anyway. The predicate now runs over the stocks that actually produced a number.

**124.13 — the predicate was the one unguarded call in the row loop, and could take the whole modal down.** `m.f` is wrapped per cell precisely so a corrupt company blanks one value; `m.hi(stocks)` was not, and it calls the same scoring code. A stock that throws would have blanked its cell in `vals` and then re-thrown here — **aborting `renderComparison` before `innerHTML` is assigned, and before `openComparison` opens the modal, so "Compare Selected" would have done nothing at all, with no error anywhere on screen.** That is Cat 121's failure shape exactly: one throw, total silence, feature dead. Reproduced with a getter that throws; it now blanks the cell and the modal renders.

**124.14 — the tooltip asserted a single missing pillar for one, two or three.** The marker fires whenever fewer than four pillars were used, but the sentence said "the missing one is not counted" — so a company with only price and market cap showed `1/4` beside a claim that one pillar was missing while three were. Reworded in both languages to say what could not be computed is left out, which is true for any count. *Ironic, given the batch had just added `scoreAcross`/`scoreAcross1` one panel over to get exactly this right.*

**124.15 — three smaller ones from the same pass.** The Valuation pillar borrowed `comp.valuation`, the profile *tab's* key, so renaming a tab would have silently renamed a pillar (it has its own key now); one interpolation of the pillar label was escaped and its twin four lines away was not; and a cell rendering `-` still offered "Click for score breakdown", which lands on "not enough data".

### Found, not fixed

**124.9 — the marker has no tooltip on a touch device.** `title` never appears without a hover, so on Peter's phone the 9px `3/4` is the only signal, and it explains nothing by itself. The mitigation is real but indirect: tapping the cell opens the profile, whose breakdown panel now states `83/100, 3 pillér alapján` in his own language — which is why 124.7 was worth fixing in the same batch. A tap-to-explain affordance on the marker is the proper answer. → KNOWN-ISSUES **P.36**.

**124.16 — a three-digit partial score overlaps the marker.** QA rebuilt the CSS and measured it: the `::after` is 14.88px wide, the `_score` column is 48px with `table-layout:fixed`, and a centred `100` spans into it by **3.8px** on desktop and 4.7px at mobile type sizes; the boxes intersect vertically too. It needs a total of exactly 100 built from three pillars — every one of them a perfect 25/25 — which is rare but *not* hypothetical, since Cat 123 had just documented a corrupt market cap manufacturing a 25/25 valuation pillar. Not fixed because every candidate is worse than the defect: a smaller marker still overlaps, a background behind it hides a digit, and extra padding shifts the digits, which is the thing 124.5 fixed. **Note the test that would not have caught it** — TEST-PLAN asks whether the digits stay *aligned*, and they do; overlap is a different failure. → KNOWN-ISSUES **P.37**.

**The sentence worth carrying forward:** *a fix that lands in one view is a bug in every other view that shows the same number.* Cat 123 said it about eight consumers of `marketCap`; this batch shipped the Tracker and left Compare crowning the least-informed score. Ask who else renders it — the Tracker, Compare, the PDF and the help text were four.

---


## Category 125 — The Warning Nobody Could See (2026-09-08) — v66

Peter reached TEST-PLAN case 41 — *does the PDF print `(3/4 pillars)`?* — and could not run it:
*"Nem tudok jelenleg pdf-et exportálni, valószínű azért, mert a pdf popup alá bukkan fel az a popup,
ami figyelmeztet arra hogy érzékeny adatok vannak benne."* He described the mechanism exactly.

**125.1 — The blocking export warning rendered beneath the dialog that raised it.** `generatePdf()`
awaits `_confirmSensitiveExport()`, which is a plain `showConfirm` on `.confirm-overlay`
(`index.html:194`, **z-index 350**). It is raised from inside `.pdf-dialog-overlay`
(`index.html:1110`, **z-index 9999**). Both are `position:fixed` children of `<body>` with no ancestor
creating a stacking context, so z-index alone decides: the confirm painted **under** an opaque
backdrop, invisible and unclickable. The export then awaited a promise that could only be settled by
a control the user could not reach. Fixed by raising `.confirm-overlay` to **10050**, above the PDF
dialog (9999) and `#recovery-key-modal` (10000).

**This is not a Cat 124 regression.** The unencrypted-export warning was added to *all* sensitive
exports in **v52** (`7557158`). The profile PDF export has therefore been unusable for **thirteen
versions**, and that is why the Cat 124 PDF line was never validated by anyone: the test could not
be run. *A gate that cannot be answered is not a gate, it is a dead end.*

### The three regressions QA found in the fix

**125.2 — Toasts began rendering over the opaque lock screen.** To keep toasts visible above the
newly-raised confirm, `.toast-container` was moved 500 → 10060. `#lock-screen` is
`position:fixed;inset:0;background:var(--bg)` at 9999, and the app-hiding rule names only three
elements — `html.app-locked #sidebar,#main-content,#bottom-nav` (`index.html:1307`). The toast
container is a body-level sibling of all three and is **not** in that selector: it was hidden solely
by sitting under the lock screen. `showMasterLogin()` fires on **any** mid-session 401
(`index.html:5766`), and several toasts live 10–14 seconds, one of which interpolates a filename
built from the ticker. A tracked ticker became readable on a locked screen.

**125.3 — And could cover a dialog's buttons on a phone.** `.toast` sets `pointer-events:auto`, and
under `@media(max-width:768px)` the container becomes `left:12px;right:12px` — a full-width,
click-absorbing band. At 10060 two or three stacked toasts sit over the footer of the PDF dialog and
of `#recovery-key-modal`.

Both 125.2 and 125.3 were caused **only** by the toast bump, so the bump was reverted to 500. The
cost is that a toast fired while a confirm is open is now hidden behind it — which is what it did
before this batch, and no flow depends on it.

**125.4 — A derived constant was left behind.** `showPasswordPrompt` overrides the shared class with
`ov.style.zIndex='400'` (`index.html:4645`) — a value that exists only to sit +50 above the *old*
base of 350. Moving the base to 10050 and leaving the derived value put the **encrypted-backup
passphrase prompt** 10050 below the very class it is built from, and below every dialog at 9999+. No
currently reachable flow puts a 9999 layer on screen while it is open, so this was a broken invariant
rather than a live failure — but the dialog in question is where a user types their backup
passphrase, and a hidden one means typing it into nothing. Raised to 10055, keeping the +5 intent.

**125.5 — A destructive confirm became answerable through the lock screen.** The confirm now clears
`#lock-screen` (9999) too. Sequence: the user clicks Delete on a position, `showConfirm` opens with
the ticker in its message, a background call 401s, `showMasterLogin()` paints the lock screen
*underneath* — and the confirm stays fully visible and fully clickable. A destructive action could be
executed on an app that had just locked itself, with its subject named on the lock surface. Before
this batch the confirm was buried at 350, which was also wrong (its promise hung silently) but did
not permit action. `showMasterLogin()` now calls `_confirmCancel()` first, so locking answers any
pending confirm with `false`.

### The rest

**125.6 — `generatePdf` dereferenced a possibly-missing button outside its `try`.**
`btn.disabled=true` before the `try` throws an unhandled rejection — no toast, no PDF — if the dialog
is already gone. This is exactly how 125.1 manifested: the buried confirm left the user clicking the
PDF backdrop, which calls `closePdfDialog()`, which revealed the confirm, whose OK then hit a null
`btn`. `generatePortfolioPdf` already guards; the two now match.

**125.7 — The Score column header still described the old formula.** Cat 124 corrected the
description of the renormalisation — in `METRIC_TIPS._score`, the metric help *card*. The Tracker's
column header `title` still read `Composite Quality Score (0-100)`, unchanged since Phase 8. Peter
hovered the header, because that is what a person does. It now carries the real behaviour, and in
both languages: it was English while the Score *cell* one row below already answered in Hungarian via
`comp.scorePartial`. **The header was the fifth consumer, and Cat 124's own lesson was about missing
one.**

**125.8 — The i18n gate rejected the fix's mechanism, again.** The first attempt added a generic
`tipKey` field read as `i18n(c.tipKey)` — a runtime-built key, invisible to check 14, which failed at
*runtime-built keys: 11, above the pinned ceiling of 10*. As in Cat 124, the fix was to name the key
literally (`c.k==='_score'?i18n('comp.tipScoreCol'):c.tip`), **not** to raise the pin. Second batch
running in which this pin caught something it was not written against.

**125.9–125.11 — Three pillar formulas in `METRIC_TIPS` named metrics their pillars do not score.**
Found by QA while verifying the new tooltip's claim. `_scoreHlt` advertised *"D/E, current ratio,
interest coverage"* — the health pillar has **never** had an interest-coverage term; it scores D/E,
current ratio, FCF positive, FCF/net income, SBC/revenue and buyback yield. `_scoreVal` omitted DCF
Upside and `_scoreGrw` omitted revenue consistency, both of which are scored. All three corrected
against `calcStockScore`. Same defect class as 125.7, in the same registry.

### What QA raised that this batch deliberately did **not** fix

`pillar()` rescales a **second** time, one level below the pillar total: `scaled =
round(earned/possible*25)`. A pillar is `null` only when *every* item in it is non-computable, so
Cat 124's `3/4` marker covers the rare case. The common case is a **partially**-computable pillar —
and a company where only `pe` resolves scores `6/6 → 25/25`, a perfect Valuation pillar from one
ratio, with `availablePillars` still **4**, no marker, and nothing anywhere saying so. That is P.35's
exact failure mode one level down. It is recorded as **KNOWN-ISSUES P.38** rather than fixed here,
for the same reason P.35 was put to Peter: every honest fix changes numbers he has already read.

**The sentence worth carrying forward:** *when you move a shared layer, you move everything derived
from it — and everything that was only ever hidden by sitting below it.* Three of this batch's five
z-index defects were not the original bug; they were things that had been silently relying on the old
number. The lock screen hid toasts by being above them, not by any rule that said so.

---


## Deployment Notes

- **`d38500a` (Batch C — cloud snapshots) deploy order is MANDATORY** — create the two tables in live D1 BEFORE `wrangler deploy`, otherwise the new `TABLES` entries reference missing tables and every snapshot call 500s. Both are NEW tables — nothing is altered, dropped or backfilled, so this is non-destructive to existing data:
  ```bash
  cd web/cloudflare-worker
  npx wrangler d1 execute stratos-ventures-db --remote --command "CREATE TABLE backups (id INTEGER PRIMARY KEY, created_at TEXT NOT NULL DEFAULT (datetime('now')), label TEXT, kind TEXT NOT NULL DEFAULT 'manual', app_version TEXT, size_bytes INTEGER NOT NULL DEFAULT 0, chunk_count INTEGER NOT NULL DEFAULT 0, summary TEXT); CREATE INDEX idx_backups_created ON backups(created_at DESC); CREATE TABLE backup_chunks (id INTEGER PRIMARY KEY, backup_id INTEGER NOT NULL REFERENCES backups(id) ON DELETE CASCADE, seq INTEGER NOT NULL, data TEXT NOT NULL, UNIQUE(backup_id, seq)); CREATE INDEX idx_backup_chunks_backup ON backup_chunks(backup_id, seq);"
  npx wrangler deploy
  ```
  Until both steps are done the feature degrades quietly: the Settings list shows "Could not load the snapshots", a manual snapshot toasts an error and the automatic one fails silently. No other feature is affected.
- **`d176a0a` (C3) deploy order is MANDATORY — worker FIRST, then frontend push.** The 403 gate on `/api/migrate` must be live before (or together with) the client push: until the worker is deployed, a stale cached pre-encryption client could still call the un-gated `/migrate` and clear+re-import plaintext. No schema change. Then: **backup live D1** (`cd web/cloudflare-worker && npx wrangler d1 export stratos-ventures-db --remote --output=../../backup-pre-c3.sql`), reload to v38, and run Settings → Master Password → Data Encryption → Scan → Encrypt on ONE device with others closed.
- **Worker must be redeployed** after commits `9a06c86` (Yahoo proxy auth), `bde6c93` (rate limiting + atomic DELETE), `2dfccef` (chart crumb auth), `bbc5856` (cross-device login: /sync/meta, /sync/restore-backup, enc_version guard), `f42dfb4` (5MB body size limit), `36cf706` (natural-key upsert conflict targets), `cc3c9a2` (natural-key DELETE route + `NATURAL_DELETE` allowlist + GET cap 100000), `aaff465` (S2a-2: companies attr columns + single-PUT upsert — **run the D1 `ALTER` first**, see below), and any future Worker changes:
  ```bash
  cd web/cloudflare-worker && npx wrangler deploy
  ```
- **`aaff465` (S2a-2) deploy order is MANDATORY** — add the 4 columns to live D1 BEFORE deploying the worker, else the new `TABLES.companies.cols` make the companies batch INSERT reference missing columns and 500 the whole sync:
  ```bash
  cd web/cloudflare-worker
  npx wrangler d1 execute stratos-ventures-db --remote --command "ALTER TABLE companies ADD COLUMN price_alerts TEXT; ALTER TABLE companies ADD COLUMN tags TEXT; ALTER TABLE companies ADD COLUMN ideal_trait_checks TEXT; ALTER TABLE companies ADD COLUMN avoid_checks TEXT;"
  npx wrangler deploy
  ```
- **`b8d5778` (S2b) deploy order is MANDATORY** — add both columns to live D1 BEFORE deploying the worker (same reason: the new `TABLES` reference missing columns → 500s the whole batch):
  ```bash
  cd web/cloudflare-worker
  npx wrangler d1 execute stratos-ventures-db --remote --command "ALTER TABLE companies ADD COLUMN holder_type TEXT; ALTER TABLE positions ADD COLUMN details TEXT;"
  npx wrangler deploy
  ```
- **`19faaf4` (S2c) deploy order is MANDATORY** — add the 4 `deleted_at` columns to live D1 BEFORE deploying the worker (same reason: the new `TABLES` cols reference missing columns → the override/valuation/framework/note_images batch upserts 500). All 4 are nullable `ADD COLUMN`s — non-destructive, no backfill needed:
  ```bash
  cd web/cloudflare-worker
  npx wrangler d1 execute stratos-ventures-db --remote --command "ALTER TABLE framework_entries ADD COLUMN deleted_at TEXT DEFAULT NULL; ALTER TABLE company_data_overrides ADD COLUMN deleted_at TEXT DEFAULT NULL; ALTER TABLE valuations ADD COLUMN deleted_at TEXT DEFAULT NULL; ALTER TABLE note_images ADD COLUMN deleted_at TEXT DEFAULT NULL;"
  npx wrangler deploy
  ```
- **Service Worker** cache version is `stratos-v3` — browsers auto-update on next visit
- **GitHub Pages** auto-deploys from `web/` via Actions

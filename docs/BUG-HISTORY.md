# Bug History — Stratos Ventures

Comprehensive log of all bugs found and fixed during QA audits. Organized by audit category and commit.

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

**Total: 201 fixed, 21 potential (unfixed)** — Categories 19-24 ALL COMPLETE (0 unfixed)

---

## Category 5 — API Integration (`726a5ae`)

### Fixed (17)

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 5.1 | No request timeout — API calls hang indefinitely | `fetchWithTimeout(url,opts,ms=15000)` helper with AbortController | index.html:6305 |
| 5.2 | FMP API key visible in plaintext input | `type="password"` + `autocomplete="off"` | index.html:1681,1690 |
| 5.3 | fmpFetch no retry, no error detail | 2-attempt retry with 1.5s backoff, JSON parse guard, Error Message logging | index.html:6912 |
| 5.4 | fetchInsiderTrading no timeout, no auth error handling | fetchWithTimeout, 401/403 distinction with toast | index.html:5612 |
| 5.5 | fetchYahooData no timeout, no rate limit detection | fetchWithTimeout, 429 detection | index.html:7000 |
| 5.6 | fetchChartData no timeout, no rate limit detection | fetchWithTimeout, 429 detection, console.warn | index.html:8079 |
| 5.7 | fetchExchangeRates no timeout | fetchWithTimeout, 429 detection | index.html:4105 |
| 5.8 | API._fetch retry on POST/PUT/DELETE (non-idempotent) | Retry only for GET, POST/PUT/DELETE throw immediately | index.html:3050 |
| 5.9 | sendBeacon can't set X-Sync-Key header | fetch+keepalive replaces sendBeacon | index.html:3110 |
| 5.10 | refreshProfileData called multiple times simultaneously | `_refreshingProfile` dedup guard with finally reset | index.html:6979 |
| 5.11 | fetchBenchmarkData called multiple times simultaneously | `_fetchingBenchmark` dedup guard with try/finally | index.html:4553 |
| 5.12 | fetchAllDividendData called multiple times simultaneously | `_fetchingDivData` dedup guard | index.html:6575 |
| 5.13 | Insider buy filter uses `change>0` (wrong for stock awards) | `transactionCode==='P'` only | index.html:5650 |
| 5.14 | Insider sell filter uses `change<0` (conflates types) | `transactionCode==='S'` | index.html:5650 |
| 5.15 | Insider price===0 displays as missing | `price!=null&&typeof price==='number'` guard | index.html:5698 |
| 5.16 | getSyncUrl rejects localhost URLs | Allow `http://localhost` and `http://127.0.0.1` | index.html:9241 |
| 5.17 | Cache age timezone double-Z bug | `fa.endsWith('Z')?fa:fa+'Z'` | index.html:6946 |

## Category 6 — PWA & Offline (`967fc02`)

### Fixed (15)

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 6.1 | SW cache version not bumped after changes | Cache version bumped to 'stratos-v3' | sw.js:1 |
| 6.2 | SW caches duplicate './index.html' and './' | LOCAL_ASSETS cleaned: index.html, manifest.json, icons only | sw.js:2 |
| 6.3 | API calls cached by SW (stale financial data) | `isApiCall()` function excludes API domains from caching | sw.js:12 |
| 6.4 | Workers.dev: no cache on successful GET | Caches GET responses with .catch() on cache.put() | sw.js:56 |
| 6.5 | Workers.dev offline: returns undefined | Returns 503 JSON `{"error":"offline"}` | sw.js:62 |
| 6.6 | Dead `/api/` pathname check in SW | Removed | sw.js |
| 6.7 | CDN failure during install silently ignored | Promise.allSettled with console.warn per failed CDN asset | sw.js:20 |
| 6.8 | No cache size limit | MAX_CACHE_ENTRIES=200 with LRU eviction on activate | sw.js:9,34 |
| 6.9 | All cache.put() calls lack error handling | .catch(err=>console.warn(...)) on every cache.put() | sw.js:59 |
| 6.10 | manifest.json: icon purpose "any maskable" in single entry | Separated into 4 entries (192 any, 192 maskable, 512 any, 512 maskable) | manifest.json |
| 6.11 | manifest.json: missing scope | Added `"scope": "./"` | manifest.json |
| 6.12 | manifest.json: missing id | Added `"id": "/stratos-ventures/"` | manifest.json |
| 6.13 | manifest.json: missing categories, lang | Added categories and lang fields | manifest.json |
| 6.14 | manifest.json: description too generic | Updated to detailed description | manifest.json |
| 6.15 | manifest.json: missing orientation | Added `"orientation": "any"` | manifest.json |

## Category 7 — Browser Compatibility (`8cfa26f`)

### Fixed (6)

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 7.1 | `prices.findLast(...)` — Chrome <97 crash | `[...prices].reverse().find(...)` | index.html:4616 |
| 7.2 | `navigator.clipboard.writeText` — no fallback on failure | Async try/catch with fallback toast | index.html:886,1849 |
| 7.3 | `background-clip:text` — Firefox needs unprefixed | Added unprefixed `background-clip:text` + `color:transparent` | index.html:52 |
| 7.4 | `:focus-visible` — Safari <15.4 no support | `:focus` with `:focus:not(:focus-visible){outline:none}` pattern | index.html:106 |
| 7.5 | `user-select:none` — needs -webkit prefix for Safari | Added `-webkit-user-select:none` before `user-select:none` | index.html:163,797 |
| 7.6 | Dead `-webkit-overflow-scrolling:touch` CSS | Removed | index.html:842 |

## Category 8 — Edge Cases (`4bae102`)

### Fixed (8)

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 8.1 | `_getSavedStocks()` — JSON.parse crashes on corrupt localStorage | try/catch with console.warn, returns empty object | index.html:2669 |
| 8.2 | `decodeURIComponent` in handleRoute crashes on malformed hashes | try/catch with fallback to raw hash | index.html:3186 |
| 8.3 | Position validation uses `isNaN` (passes Infinity) | `!isFinite(shares)` and `!isFinite(avgCost)` | index.html:3525 |
| 8.4 | Transaction validation uses `isNaN` | `!isFinite(totalAmount)` and `!isFinite(shares)` | index.html:3702 |
| 8.5 | `flushAll` keepalive race — _keepalive never reset | Promise.allSettled().then() resets `_keepalive` | index.html:3075 |
| 8.6 | FI tracker — `||8` blocks 0% return rate | `fi.assumedReturnRate??8` (nullish coalescing) | index.html:4704 |
| 8.7 | `refreshAllStocks` — renderTracker on every iteration | renderTracker every 5 stocks instead of every 1 | index.html:7196 |
| 8.8 | FI tracker — `monthlySavings>0` blocks 0 savings projection | `fi.monthlySavings>=0` | index.html:4706 |

## Cross-Category BUG Fixes (`9a06c86`)

### Fixed (11)

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| X.1 | Worker CORS returns `'null'` for disallowed origins | Returns empty string `''` instead | worker/index.js:37 |
| X.2 | Worker timingSafeEqual leaks key length via early return | No short-circuit; XOR lengths, loop to max length with modulo | worker/index.js:25 |
| X.3 | Worker batch upsert: individual statements, no atomicity | `db.batch(stmts)` wraps all in a transaction | worker/index.js:653 |
| X.4 | Worker batch ON CONFLICT without column | `ON CONFLICT(${pk})` specifies primary key column | worker/index.js:695 |
| X.5 | Yahoo proxy endpoints unauthenticated | `/quote/`, `/batch`, `/chart/` all require X-Sync-Key; client sends header | worker/index.js:748+ index.html:7004,8084 |
| X.6 | D1 deletes fire-and-forget (local/cloud diverge) | `async` + `await API.del()` + try/catch + warning toast on 4 delete functions | index.html:3341,3545,3721,9228 |
| X.7 | `deleteFwEntry` crash on undefined `s.checklist[checkKey]` | Added `s.checklist[checkKey]` null check before `delete` | index.html:8495 |
| X.8 | Save buttons: no double-click protection (6 functions) | 500ms `_lock` re-entrancy guard on saveAccount/Position/Transaction/FwEntry/Review/ResearchEntry | index.html:multiple |
| X.9 | No negative/invalid API price guard | Validates `stock.price` and `stock.marketCap` (reject <0 or !isFinite) | index.html:7143 |
| X.10 | Migration stats innerHTML without escH() (XSS) | `escH(k)` on keys, `parseInt(v)` on values | index.html:9322 |
| X.11 | Money Back precision loss via toFixed(1)+parseFloat | `Math.round(...*100)/100` for 2 decimal precision | index.html:7253 |

## INFO Improvements (`34a249b`)

### Fixed (2)

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| I.1 | No `beforeinstallprompt` handler / no custom install UI | Install card in settings, prompt capture, appinstalled handler | index.html:1667,9661 |
| I.2 | renderTracker full DOM rebuild loses scroll/focus | Save/restore scrollTop + focused input (ticker,field,selection range) | index.html:7751 |

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

## Category 9 — Post-completion QA (`93a0420`)

### Fixed (10)

| # | Severity | Bug | Fix | File:Line |
|---|----------|-----|-----|-----------|
| 1 | CRITICAL | `switchTab` clobbered all `.tabs .tab` globally — broke other modules' panels | Scoped to `#company-panel-calculator` container + bounds check | `index.html:2466` |
| 2 | CRITICAL | Reverse DCF exit (`igE`) showed NaN% when binary search diverged — no `isFinite` guard | Added `isFinite(igE)` guard matching perpetuity branch | `index.html:2564` |
| 3 | HIGH | `toggleMoreMenu` crash if `.more-menu` element absent — no null-safety | Added optional chaining `?.` (matching `closeMoreMenu`) | `index.html:5384` |
| 4 | MEDIUM | Mini chart crash when all close values null — `first`/`last` undefined | Early return if `first==null\|\|last==null` | `index.html:8260` |
| 5 | MEDIUM | Tracker filter matched `"undefined"` as literal string when `s.name` missing | Changed to `(s.name\|\|'')` | `index.html:7596` |
| 6 | MEDIUM | PWA `userChoice` deprecated API — missing `.catch()` | Replaced with `prompt().then().catch()` modern API | `index.html:9677` |
| 7 | LOW | `verifyPassword` — `JSON.parse(enc_verify)` crash on corrupt non-empty value | Wrapped in try/catch | `index.html:2263` |
| 8 | LOW | `testWorker/testFinnhub/testFmp` used implicit `event` global — unreliable strict mode | Explicit `ev` parameter + onclick `event` passthrough | `index.html:9358,9371,9385` |
| 9 | LOW | Timezone double-suffix — `'Z'` appended to dates already having `+00:00` offset | Regex check for existing timezone suffix | `index.html:6959` |
| 10 | INFO | `toggleCpPreview` missing images param to `renderMarkdown` | Not fixed — company profile notes have no image upload, so `img:N` syntax is unused there | `index.html:6041` |

---

## Category 10 — Mobile Responsive Overflow (`b21f930`)

### Fixed (6)

| # | Severity | Description | Fix | Location |
|---|----------|-------------|-----|----------|
| 1 | HIGH | 40+ elements overflow viewport at 375px mobile — grids, tables, flex items extend past screen edge | Added `overflow-x:hidden` to body and `.content`, `min-width:0` to `.card`/`.db-hero`/`.db-widget` | `index.html:48,86,533,542,87` |
| 2 | HIGH | Dashboard widgets 404px wide at mobile (grid track expands from min-content) | Added `min-width:0` to grid items, `overflow-x:hidden` to `.db-widget` | `index.html:596-604` |
| 3 | MED | 480px breakpoint incomplete — only covered 5 of 20+ grid/flex containers | Expanded to cover all grids: `cp-fin-grid`, `cp-val-details`, `cp-earn-grid`, `div-summary-grid`, `st-exp-grid`, `db-grid`, etc. | `index.html:713-740` |
| 4 | MED | `.two-col`/`.three-col` still 2-3 columns at 480px | Added `grid-template-columns:1fr` at 480px breakpoint | `index.html:730` |
| 5 | MED | Modal fields and tooltip overflow at narrow widths | Added `min-width:0` to `.pf-modal-field`/`.research-modal-field`, constrained tooltip `max-width:calc(100vw-40px)` | `index.html:731-733` |
| 6 | LOW | Dashboard todo "Add" button clipped at 320px | Added `flex-wrap:wrap` to `.db-todo-input` and `min-width:0` on input | `index.html:603-604` |

### Unfixed (1 WARN)

| # | Severity | Description | Reason | Location |
|---|----------|-------------|--------|----------|
| 1 | WARN | Calendar grid (7 columns) tight at 320px (~40px per cell) | Acceptable — only shows day numbers + dots, font already 11px at mobile | `index.html:499` |

---

## Category 11 — Dashboard Widget Overflow (`b5fdc36`)

### Fixed (3)

| # | Severity | Description | Fix | Location |
|---|----------|-------------|-----|----------|
| 1 | HIGH | FI form number inputs (168px browser minimum) overflow widget by 34px at 3-column layout, visually covering and blocking clicks on adjacent TODO Summary column | Added `min-width:0` to `.db-fi-form .input-group` so inputs shrink to grid cell width | `index.html:581` |
| 2 | MED | `.db-widget` only had `overflow:hidden` at 768px breakpoint — at desktop widths, internal content could overflow widget boundary and overlap neighboring grid cells | Moved `overflow:hidden` to base `.db-widget` rule (all viewports) | `index.html:542` |
| 3 | MED | TODO date input (`min-width:auto`) prevented flex row from shrinking, causing "Add" button to clip outside widget at 3-column widths | Added `min-width:0` to `.db-todo-input input[type=date]` | `index.html:585` |

### Unfixed (0)

None.

---

## Category 14 — Dashboard Grid Bottom Clipping (`e74446c`)

### Fixed (1)

| # | Severity | Description | Fix | Location |
|---|----------|-------------|-----|----------|
| 1 | MED | `.db-grid` had no bottom padding, causing the last widget (General TODO) to be clipped at the viewport bottom when scrolled to max — task items near the bottom were cut off by the page boundary | Added `padding-bottom:24px` to `.db-grid` to ensure the last widget has breathing room below the viewport fold | `index.html:533` |

### Unfixed (0)

None.

---

## Category 13 — TODO Widget Vertical Clipping (`c3b355f`)

### Fixed (1)

| # | Severity | Description | Fix | Location |
|---|----------|-------------|-----|----------|
| 1 | MED | `overflow:hidden` on `.db-widget` (added in Category 11) vertically clipped TODO list items when the list grew beyond the grid row height — "task 3" and beyond were cut off at the widget border | Removed `overflow:hidden` from `.db-widget`; `min-width:0` alone prevents horizontal grid overflow without vertical clipping | `index.html:543` |

### Unfixed (0)

None.

---

## Category 12 — Chart Container Mobile Overflow (`39fbfca`)

### Fixed (1)

| # | Severity | Description | Fix | Location |
|---|----------|-------------|-----|----------|
| 1 | HIGH | Chart.js canvas rendered with hardcoded pixel width (e.g. 321px) exceeding `.chart-container` on mobile (266px at 320px viewport), pushing `.two-col`, `.panel`, `#section-calculators`, and `#company-panel-calculator` 40px wider than viewport — content clipped by `.content overflow-x:hidden` | Added `overflow:hidden` to `.chart-container` and `max-width:100%` to `.chart-container canvas` | `index.html:125-126` |

### Unfixed (0)

None.

### Audit Details

Tested all 7 sections at 8 viewport widths (320, 375, 768, 769, 976, 1331, 1332, 1440px). Verified `scrollWidth <= offsetWidth` for every visible element. Confirmed no `overflow:visible` layout breaks remain on any page. Dashboard grid 2→3 column breakpoint confirmed at exactly 1332px viewport width (`.db-grid minmax(340px,1fr)` × 3 + gap 32px + content padding 40px + sidebar 240px).

---

## Category 15 — D1 Data Persistence (`f053cb7` + `cf9c284`)

**Date:** 2026-06-30 | **Fixed: 2** | **Unfixed: 0**

User-reported: TODOs added on dashboard disappeared after page refresh.

### Bug 15.1 — CRITICAL: All save/load functions skipped localStorage in D1 mode

**Commit:** `f053cb7` | **File:** `web/index.html`

**Problem:** 14 save functions had `if(d1Mode){...scheduleSave...;return}` — the `return` skipped localStorage entirely. 15 load functions had `catch(e){...};return}` — the `return` was outside the try/catch, so D1 errors meant no localStorage fallback.

**Fix:** Removed `return` from all save D1 blocks (write-through: always save to both D1 and localStorage). Moved `return` inside try block in all load functions (read-fallback: D1 error falls through to localStorage).

**Affected functions (15 pairs):** savePortfolioAccounts/load, savePortfolioPositions/load, savePortfolioTransactions/load, savePortfolioSnapshots/load, saveExchangeRates/load, saveDashTodos/load, saveDashFiSettings/load, saveDashBenchmark/load, saveDash52wHighs/load, saveResearchNotes/load, saveTrackerStocks/load, saveDividendHistory/load, saveDivSettings/load, saveFramework/load, saveReviews/load.

### Bug 15.2 — CRITICAL: Worker batch handler silently dropped new items

**Commit:** `cf9c284` | **Files:** `web/cloudflare-worker/src/index.js`, `web/index.html`

**Problem:** Worker batch endpoint used `UPDATE ... WHERE id = ?` for items with IDs. New items have locally-generated IDs that don't exist in D1 — UPDATE matched 0 rows, silently dropping data. Additionally, race condition on quick refresh: D1 load could succeed before scheduleSave (1500ms debounce) had synced new items.

**Fix (server):** Changed batch handler from `UPDATE WHERE id` to `INSERT ... ON CONFLICT(id) DO UPDATE SET ...` (upsert) — works for both new and existing items across ALL tables. **Fix (client):** After successful D1 load in `loadDashTodos()`, merge any localStorage todos whose IDs aren't in D1 result (race condition safety net).

---

## Category 16: Phase 15 Feature QA (2026-06-30 — 2026-07-01)

### Bug 16.1 — CRITICAL: Unescaped date output in Quarterly Follow-up

**Commit:** `bc15b16` | **File:** `web/index.html:9947`

**Problem:** `e.date` was output directly in HTML without escaping, potential XSS vector.

**Fix:** Wrapped with `escH(e.date||'')`.

### Bug 16.2 — CRITICAL: Progress calculation referenced removed field names

**Commit:** `bc15b16` | **File:** `web/index.html:10083`

**Problem:** `calcClProgress` for quarterly_followup section still counted old fields `numbersOk` and `thesisIntact` which no longer exist after the 14-field expansion. Progress bar was always wrong.

**Fix:** Replaced with array of 13 correct field names: `numbers`, `news`, `managementCommentary`, `companyForecast`, `thesisStatus`, `moatStatus`, `qualityTrend`, `thesisChanges`, `valuationUpdate`, `convictionLevel`, `action`, `watchNextQuarter`, `uncertainties`.

### Bug 16.3 — WARN: Missing bottom padding on last quarterly entry

**Commit:** `bc15b16` | **File:** `web/index.html:862`

**Problem:** Last `.cl-qf-entry` was clipped at the bottom of the scrollable container.

**Fix:** Added `.cl-qf-entry:last-child{margin-bottom:16px}`.

### Bug 16.4 — WARN: Learning log category dropdown white background

**Commit:** `872b96b` | **File:** `web/index.html`

**Problem:** Category `<select>` in Learning Log section had white background because it wasn't wrapped in a `.cl-field` div, so dark theme styling didn't apply.

**Fix:** Wrapped the select in `<div class="cl-field">`.

**Phase 15.3 (Follow Sources & Quick Links):** QA clean — 0 issues found (commit `7156d8f`).

---

### Category 17 — Phase 14 Asset Types QA (commit `5cd3a24`, 2026-07-01)

6 bugs found and fixed during Phase 14.1-14.3 (Real Estate, Bond, Cash asset types) QA:

**17.1 [CRITICAL] `const` to `let` — `savePosition()` crash on real_estate/cash (index.html:3682-3685)**
`shares`, `avgCost`, `currentPrice` declared as `const` but reassigned inside `if(assetType==='real_estate')` and `if(assetType==='cash')` branches. TypeError on save.
**Fix:** Changed `const` → `let` for all three variables.

**17.2 [CRITICAL] D1 `loadPortfolioPositions` strips `assetType` and all custom fields (index.html:3340)**
D1 load only mapped `{id, ticker, name, accountId, shares, avgCost, currency, companyId}`. After D1 load, all real_estate/bond/cash positions displayed as "other" with broken calculations.
**Fix:** D1 load now merges localStorage extras back into D1-loaded positions, recovering `assetType`, `reLocation`, `bondType`, `cashAmount`, etc.

**17.3 [WARN] Pie chart labels showed raw `real_estate` key with underscore (index.html:4195, 4628)**
Dashboard pie chart grouped by type used raw `pos.assetType` string as label. `"real_estate"` displayed with underscore.
**Fix:** Added capitalization logic: `real_estate` → `"Real Estate"`, others get `charAt(0).toUpperCase()`.

**17.4 [WARN] Cash badge color identical to crypto badge (CSS line 424)**
Both used `rgba(253,203,110,.2)` with `var(--orange)` — indistinguishable in the table.
**Fix:** Changed cash badge to teal `rgba(129,236,236,.15)` with `#81ecec`.

**17.5 [WARN] CSV export missing `assetType`, `Name`, `currentPrice` columns (index.html:2998)**
`exportCsvPositions()` only exported `['Ticker','Account','Shares','Avg Cost','Currency','Created']`. Real estate positions exported as shares=1, avgCost=purchasePrice — misleading without type context.
**Fix:** Expanded to `['Ticker','Name','Account','Type','Shares','Avg Cost','Current Price','Currency','Notes','Created']`.

**17.6 [WARN] Snapshot positions missing `assetType` field (index.html:3968)**
`takeSnapshot()` stored positions without `assetType`, losing type info for historical asset class breakdown.
**Fix:** Added `assetType:pos.assetType||'stock'` to snapshot position objects.

---

## Category 18 — Phase 15.4 Price Alerts QA (`631a3e2`)

**Date:** 2026-07-01 | **Fixed: 2** | **Unfixed: 0**

### Bug 18.1 — CRITICAL: priceAlerts lost in D1 mode on reload

**Commit:** `631a3e2` | **File:** `web/index.html:7178`

**Problem:** D1 `loadTrackerStocks` sets `tStocks={}` and rebuilds from D1 data. `_d1CompanyToTStock` does not include `priceAlerts` (not in D1 schema). Result: price alerts work in-session but vanish on reload for D1 users.

**Fix:** After D1 full load, merge `priceAlerts` from localStorage backup: `Object.entries(ls).forEach(([t,s])=>{if(tStocks[t]&&s.priceAlerts)tStocks[t].priceAlerts=s.priceAlerts})`.

### Bug 18.2 — WARN: Negative price alert values accepted

**Commit:** `631a3e2` | **File:** `web/index.html:5805,7071`

**Problem:** `savePriceAlert` accepted any parseable float including negatives. Inputs lacked `min` attribute.

**Fix:** Added `min="0.01"` to both `<input>` elements. Added `num<=0` guard in `savePriceAlert()` to delete invalid values.

---

## Audit 19 — Phase 16.3: Conviction Tracker (2026-07-01)

**Commit:** `c5f14b8` | **3 bugs found, 3 fixed**

### Bug 19.1 — Memory leak: conviction chart not destroyed on closeProfile

**File:** `web/index.html:6061`

**Problem:** `closeProfile()` destroyed `cpHistCharts` but not `window._convictionChart`, leaking chart instances.

**Fix:** Added `if(window._convictionChart){window._convictionChart.destroy();window._convictionChart=null;}` to `closeProfile()`.

### Bug 19.2 — Missing null check in renderConvictionBadge

**File:** `web/index.html:6144`

**Problem:** `renderConvictionBadge` didn't null-check the DOM element before accessing `.innerHTML`.

**Fix:** Added `if(!el)return;` guard after `getElementById`.

### Bug 19.3 — NaN conviction values from non-numeric input

**File:** `web/index.html:6108-6120`

**Problem:** Psychology checklist and quarterly follow-up sources used `parseInt()` without validating the result, unlike the review source which had `>=1 && <=10` guard.

**Fix:** Added `>=1 && <=10` validation to both checklist and quarterly_followup conviction sources.

## Audit 20 — Phase 17.2: Position Sizing (2026-07-01)

**1 bug found, 1 fixed**

### Bug 20.1 — Position bar marker disappears when currentPct > barMax

**File:** `web/index.html` (renderPositionSizing)

**Problem:** When current portfolio position exceeded 14% (barMax), the visual marker disappeared entirely instead of clamping to the bar edge. Lost visual feedback for concentrated positions.

**Fix:** Removed `<=barMax` guard and clamped position with `Math.min(currentPct, barMax)` so the marker always appears.

---

## Audit 21 — Phase 18.2: Earnings Calendar (2026-07-01)

**6 bugs found, 6 fixed**

### Bug 21.1 — CRITICAL: Wrong FMP API endpoint path
**Problem:** `v3/earning_calendar` under `/stable/` base URL produced invalid path. **Fix:** Changed to `earning-calendar`.

### Bug 21.2 — HIGH: Dashboard earnings status not interactive
**Problem:** `toggleEarningsStatus` defined but never called — no way to mark reviewed/listened from dashboard. **Fix:** Added review + listened checkboxes in table rows.

### Bug 21.3 — LOW: Unused `_earningsCalendarCache` variable
**Fix:** Removed dead code.

### Bug 21.4 — MEDIUM: No rate-limit delay between sequential API calls
**Fix:** Added 300ms delay between FMP requests.

### Bug 21.5 — MEDIUM: `data.find` on unsorted array may select wrong upcoming date
**Fix:** Changed to `data.filter().sort()[0]` for correct nearest date.

### Bug 21.6 — MEDIUM: Missing try/catch around fetch loop
**Problem:** Unexpected error would abort without saving partial results. **Fix:** Wrapped inner loop in try/catch.

---

## Category 19 — Data Persistence & Sync (Full QA Audit 2026-07-01)

### Fixed (6) — `2c36bdc` + Session 4

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 19.1 | `autoSave()` no try/catch — quota error kills flushAll | Wrapped in try/catch, toast on QuotaExceededError | index.html:11423 |
| 19.2 | D1 save failure loses data permanently | Added retry with backoff, dirty-key tracking, reconcileDirtyKeys on load | index.html:3199-3256 |
| 19.3 | `refreshProfileData()` overwrites user-editable fields not in preserve list | Added 14 fields to preserve array: thesis, sortOrder, dcfMode, evaWacc, sellTriggers, priceAlerts, learningLog, convictionHistory, followSources, earningsCalendar, pipelineStatus, dateAdded, sbc, roic | index.html:8407 |
| 19.4 | `scheduleSave` concurrent overlap — duplicate D1 writes for same key | Added `_inFlight` promise tracker, chains new saves after in-flight completes | index.html:3206 |
| 19.5 | `flushAll()` no reentrance guard — double-flush from beforeunload+visibilitychange | Added `_flushing` boolean guard | index.html:3212 |
| 19.7 | `flushAll` during `beforeunload` can't complete async saves | Added `useBeacon` parameter — beforeunload uses local fallback only, visibilitychange handles async flush | index.html:3212,11434 |

### Unfixed (0)

### Fixed in Session 5

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 19.9 | Research notes not cleaned up on company delete | Added `researchNotes.filter()` + save in `removeTrackerStock()` | index.html:8493 |
| 19.10 | `_tickerToD1Id()` silently filters null D1 IDs | Added `console.warn` when company exists but has no D1 ID | index.html:3292 |

### Fixed in Session 7

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 19.6 | `saveTrackerStocks` closure reads live tStocks during async | JSON.parse/stringify snapshot at closure start | index.html:7704 |
| 19.8 | Multi-tab conflicts — no data reload on storage event | Added debounced `storage` event listener that reloads changed data and re-renders | index.html:11510 |
| 19.11 | Corrupted localStorage silently initializes empty | Added `console.error` in catch blocks + toast for tracker_stocks | index.html:7795 |

---

## Category 20 — Financial Calculation Accuracy (Full QA Audit 2026-07-01)

### Fixed (7) — `ecdf115` + `6585785` + Session 5

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 20.1 | `convertCurrency()` falsy check passes NaN/undefined/null through | Changed to `if(amount==null\|\|!isFinite(amount))return null` | index.html:4384 |
| 20.2 | One NaN-price position poisons entire portfolio total | Added `isFinite()` guards to all 8 portfolio sum loops | index.html:3576,4028,4114,4183,4314,4627,4808,6391 |
| 20.3 | `getConvictionHistory()` reads wrong data path, missing `cl.sections.psychology` | Changed to `cl.psychology\|\|cl.sections?.psychology\|\|{}` | index.html:6441 |
| 20.4 | `calcReverseDCF()` produces meaningless result when Market Cap or FCF is 0/empty | Added early return guard: shows '—' in all result fields when mc<=0 or fcf0<=0 | index.html:2665 |
| 20.5 | Global `parseNum()` mishandles European period-as-thousands (`1.500` → 1.5) | Added European format detection regex before comma stripping | index.html:7595 |
| 20.6 | CSV date parser hardcoded DD/MM/YYYY — swaps day/month for US formats | Added auto-detection: scans all dates for fields >12 to determine DD/MM vs MM/DD | index.html:4525 |
| 20.7 | Mixed-currency portfolio sums without conversion when rates not loaded | Added `hasRates` check + warning banner with "Fetch rates" button | index.html:3591 |

### Unfixed (0)

---

## Category 21 — Cross-Module Integration (Full QA Audit 2026-07-01)

### Fixed (2) — `6585785` + Session 4

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 21.1 | CSV import doesn't update positions or portfolio metrics | Added position reconciliation: aggregates buy/sell per ticker into shares/avgCost, creates/updates positions, re-renders portfolio overview | index.html:4548-4570 |
| 21.2 | No guard against concurrent `autoLoad()` — 4 call sites can race | Added `_autoLoadRunning` boolean guard at top/bottom of autoLoad() | index.html:11343 |

### Fixed in Session 5

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 21.4 | Finnhub rate-limit response cached in D1 for 12 hours | Added `!fresh.rateLimited` guard before cache upsert | index.html:8279 |

### Fixed in Session 7

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 21.3 | Worker `/api/migrate` no transaction wrapping | Replaced individual DELETEs with `db.batch()` for atomic table clearing | cloudflare-worker/src/index.js:330 |
| 21.5 | D1 offline startup shows spinner 15s with no fallback | Added `navigator.onLine` check — falls through to localStorage instantly when offline | index.html:11395 |

### Unfixed (0)

---

## Category 22 — Performance (Full QA Audit 2026-07-01)

### Fixed (3) — Session 6

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 22.1 | `recalcAll()` fires on every keystroke with no debounce | Wrapped in `requestAnimationFrame` — multiple calls per frame coalesce into one | index.html:2796 |
| 22.2 | Chart.js instances destroyed/recreated on every recalcAll | `renderChart()` now uses `chart.update('none')` when chart already exists | index.html:2775 |
| 22.3 | Redundant `recalcAll()` calls from loadData + callers | Automatically coalesced by RAF debounce — no code removal needed | index.html:2797 |

### Unfixed (0)

---

## Category 23 — Security & Code Quality (Full QA Audit 2026-07-01)

### Fixed (2) — Session 7

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 23.1 | 10/12 modal openers bypass `_openModal()` — no focus trap | Routed all 10 modal opens through `_openModal()` | index.html:2840,3512,3772,3968,4483,5706,9287,9794,11044 |
| 23.2 | `_encPass` in memory with no idle timeout | Added 15-min idle timer (click/keydown/touchstart resets), locks screen on expiry | index.html:2334 |

### Unfixed (0)

---

## Category 24 — PDF Export (QA 2026-07-01)

### Fixed (5)

| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 24.1 | XSS risk: inline onclick with ticker interpolation in PDF dialog | Replaced with data-attribute + addEventListener | index.html:11637 |
| 24.2 | Null ref: window.jspdf undefined if CDN blocked | Added validation check before destructuring | index.html:11659 |
| 24.3 | Memory: jsPDF doc object never cleaned up | Moved closePdfDialog() to finally block (doc goes out of scope) | index.html:12236 |
| 24.4 | Dialog stays open on PDF generation error | Moved closePdfDialog() to finally block (always runs) | index.html:12233 |
| 24.5 | PDF dialog not responsive on mobile <480px | Added media query for max-width and scrollable section list | index.html:912 |

### Unfixed (0)

---

## Session 25 — Cross-Module Integration: Archive + Portfolio↔Pipeline Sync (2026-07-01)

### Archive System (Session 1)
| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 25.1 | D1 CHECK constraint rejects 'archived' pipeline value | Migrated live D1 table, added 'archived' to CHECK, normalized values to lowercase snake_case | index.html:7772 |
| 25.2 | archivedAt field lost on page refresh (not in preserve array) | Added 'archivedAt' to preserve array | index.html:8528 |
| 25.3 | setPipeline() doesn't set archivedAt when clicking Archived button | Added archivedAt management in setPipeline() | index.html:6341 |
| 25.4 | Screener Pipeline=Archived shows 0 results (pre-filtered) | Check screenerWantsArchived before filtering | index.html:8969 |

### Portfolio↔Pipeline Sync (Session 2)
| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 25.5 | deletePosition() doesn't trigger pipeline check | Added _checkSellAllPositions(delTicker) after position deletion | index.html:3886 |
| 25.6 | deleteTransaction() doesn't trigger pipeline check | Added _checkSellAllPositions(delTicker) after transaction deletion | index.html:4064 |
| 25.7 | CSV import ignores sold-all tickers (pipeline stays Owned) | Added post-import loop calling _checkSellAllPositions for zero-share tickers | index.html:4668 |
| 25.8 | saveTransaction() passes no name to _syncTickerToCompanies | Added tStocks[ticker]?.name||ticker as name parameter | index.html:4052 |
| 25.9 | Real estate/bond positions incorrectly synced to Companies tracker | Extended asset type guard to exclude real_estate and bond | index.html:3874 |
| 25.10 | Tracker UI not updated after sync (missing renderTracker calls) | Added renderTracker() to _syncTickerToCompanies, batch, and _checkSellAllPositions | index.html:8633 |
| 25.11 | String shares "0" treated as >0 in _checkSellAllPositions | Changed to parseFloat(p.shares)>0 | index.html:8669 |

### Review Reminders (Session 3)
| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 25.12 | saveReview() doesn't refresh dashboard widget or profile badge | Added renderDbReviewsDue() and renderReviewDueBadge() after save | index.html:11342 |
| 25.13 | Sort NaN when multiple companies have Infinity daysSince | Replaced subtraction with comparison-based sort | index.html:5421 |
| 25.14 | Light theme hover uses hardcoded dark color #252836 | Changed fallback to var(--border) | index.html:614 |
| 25.15 | Null review date produces NaN daysSince, silently hides badge | Added last.date truthiness check before Date computation | index.html:6726 |

### Summary Tab (Session 4)
| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 25.16 | + Note button clicks Preview instead of New Entry | Changed to call openResearchEntryForTicker() directly | index.html:6745 |
| 25.17 | Summary tab double-renders on every profile open | Removed redundant render in switchProfileTab | index.html:6214 |
| 25.18 | Dashboard reviews-due navigates to Overview unnecessarily | Removed switchProfileTab('overview') from onclick | index.html:5448 |
| 25.19 | P&L shows -100% when currentPrice is null | Fallback to avgCost when currentPrice missing | index.html:6761 |
| 25.20 | rv.id used unescaped in onclick handler | Added parseInt(rv.id)||0 sanitization | index.html:6834 |
| 25.21 | Hardcoded $ currency in positions/transactions | Use position/transaction currency field | index.html:6768 |

### Unfixed (0)

---

## Deployment Notes

- **Worker must be redeployed** after commits `9a06c86` (Yahoo proxy auth) and any future Worker changes:
  ```bash
  cd web/cloudflare-worker && npx wrangler deploy
  ```
- **Service Worker** cache version is `stratos-v3` — browsers auto-update on next visit
- **GitHub Pages** auto-deploys from `web/` via Actions

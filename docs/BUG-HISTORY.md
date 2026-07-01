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
| 19 | Data Persistence & Sync | — | 2026-07-01 | 0 | 11 |
| 20 | Financial Calculation Accuracy | — | 2026-07-01 | 0 | 7 |
| 21 | Cross-Module Integration | — | 2026-07-01 | 0 | 5 |
| 22 | Performance | — | 2026-07-01 | 0 | 3 |
| 23 | Security & Code Quality | — | 2026-07-01 | 0 | 2 |

**Total: 168 fixed, 49 potential (unfixed)** — Categories 19-23 from full QA audit (7 parallel agents)

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

### Unfixed (11)

| # | Bug | Impact | Reason |
|---|-----|--------|--------|
| 19.U1 | `autoSave()` (line 11360) has no try/catch — localStorage quota error prevents `flushAll()` from running, losing all pending D1 data on page close | **CRITICAL** — silent data loss on full localStorage | Needs careful implementation — must not mask other errors |
| 19.U2 | D1 save failure permanently loses data — failed saves are never retried, and D1 takes precedence on reload, overwriting newer localStorage fallback | **CRITICAL** — user changes silently lost after network error | Needs retry queue + dirty-flag mechanism + localStorage-vs-D1 timestamp comparison |
| 19.U3 | `refreshProfileData()` overwrites user-editable fields not in the preserve list (thesis, sortOrder, dcfMode, evaWacc, sellTriggers, priceAlerts, learningLog, convictionHistory, followSources, earningsCalendar) | **HIGH** — user loses manually entered data on profile refresh | Add missing fields to preserve array at line 8379 |
| 19.U4 | `scheduleSave` (line 3200) can overlap — timer callback and new scheduleSave fire the same key's async fn concurrently, causing duplicate D1 writes | **MEDIUM** — potential write conflicts on D1 | Needs in-flight promise tracking per key |
| 19.U5 | `flushAll()` (line 3205) has no reentrance guard — `beforeunload` and `visibilitychange` can trigger concurrent flushes, breaking keepalive on in-flight requests | **MEDIUM** — data loss on mobile Safari app-switch | Add `_flushing` guard flag |
| 19.U6 | `saveTrackerStocks` closure (line 7606) reads `tStocks` during multi-step async execution — mutations between steps cause companies/sub-entities to get out of sync | **MEDIUM** — inconsistent D1 state after concurrent edits + save | Snapshot tStocks at closure start |
| 19.U7 | `flushAll` during `beforeunload` cannot complete multi-step async saves — only first fetch gets keepalive, sub-entities likely lost on page close | **MEDIUM** — sub-entity data (todos, earnings, checklist) lost on tab close | Use `navigator.sendBeacon()` or single-payload endpoint |
| 19.U8 | Multi-tab conflicts — no data reload on `storage` event, D1 batch writes from different tabs overwrite each other with stale data | **MEDIUM** — last-tab-to-save wins, earlier tab's changes lost | Needs `storage` event listener + conflict resolution |
| 19.U9 | Research notes not cleaned up on company delete — orphaned notes remain in `researchNotes` array and D1 | **MEDIUM** — data leaks, confusing stale notes appear | Add cascade delete in `deleteCompany()` |
| 19.U10 | `_tickerToD1Id()` silently filters out null returns — if a company has no D1 ID, its sub-entities are silently skipped during save | **MEDIUM** — silent data loss for companies added while D1 is unreachable | Log warning when null D1 ID encountered |
| 19.U11 | Corrupted localStorage silently initializes empty state with no user warning — empty catch blocks on JSON.parse, new data overwrites good D1 data | **LOW** — user loses data without knowing why after browser crash | Add console.error + warning toast in catch blocks |

---

## Category 20 — Financial Calculation Accuracy (Full QA Audit 2026-07-01)

### Unfixed (7)

| # | Bug | Impact | Reason |
|---|-----|--------|--------|
| 20.U1 | `convertCurrency()` line 4356 falsy check `if(!amount)return amount` passes NaN/undefined/null through instead of returning null — one bad value can poison totals | **HIGH** — NaN propagates through portfolio calculations | Change to `if(amount==null\|\|!isFinite(amount))return null` |
| 20.U2 | One position with NaN price poisons entire portfolio total — `totalValue+=NaN` makes all remaining positions sum to NaN in dashboard | **HIGH** — entire dashboard summary shows NaN/broken with one bad position | Guard each position: `if(isFinite(valInBase)) totalValue+=valInBase` |
| 20.U3 | `getConvictionHistory()` line 6441 reads from `cl.psychology` only, missing `cl.sections.psychology` (the current storage format) — conviction chart/badge always empty for new entries | **HIGH** — conviction tracker shows no data even when user has filled psychology section | Change to `cl.psychology\|\|cl.sections?.psychology\|\|{}` matching line 6313 pattern |
| 20.U4 | `calcReverseDCF()` runs 200-iteration binary search solver when Market Cap or FCF is 0/empty — produces a finite but meaningless implied growth rate that gets displayed | **MEDIUM** — misleading calculated value shown to user | Add guard: `if(mc<=0\|\|fcf0<=0)` show '—' and return |
| 20.U5 | Global `parseNum()` (line 7533) mishandles European period-as-thousands numbers — `1.500` (meaning 1500) parsed as 1.5 | **MEDIUM** — wrong values for users pasting European-formatted numbers | Add European format detection regex from CSV parseNum |
| 20.U6 | CSV date parser (line 4497) hardcoded to DD/MM/YYYY — silently swaps day/month for US-format broker exports (IBKR, Schwab) | **MEDIUM** — wrong transaction dates, corrupted portfolio history | Add date format selector in CSV import modal |
| 20.U7 | Mixed-currency portfolio silently sums values without conversion when exchange rates haven't loaded yet | **MEDIUM** — incorrect portfolio total until rates load, no warning shown | Check rates loaded before summing, show "rates loading" indicator |

---

## Category 21 — Cross-Module Integration (Full QA Audit 2026-07-01)

### Unfixed (5)

| # | Bug | Impact | Reason |
|---|-----|--------|--------|
| 21.U1 | CSV transaction import doesn't trigger position recalc or TWR/XIRR update — imported transactions not reflected in portfolio metrics until manual refresh | **HIGH** — portfolio returns show stale values after bulk import | Call position recalc + TWR/XIRR after CSV import completes |
| 21.U2 | No guard against concurrent `autoLoad()` — 4 call sites with no re-entrancy flag, encryption setup + window.load can race causing duplicate API fetches and `_d1CompanyMap` corruption | **MEDIUM** — data corruption on startup in edge cases | Add `_autoLoadRan` boolean guard |
| 21.U3 | Worker `/api/migrate` has no transaction wrapping — partial migration on failure leaves D1 in inconsistent state (some tables migrated, some not) | **MEDIUM** — broken D1 state requiring manual cleanup | Wrap migration in D1 transaction or add rollback mechanism |
| 21.U4 | Finnhub rate-limit response `{rateLimited:true}` cached in D1 `api_cache` for 12 hours — blocks insider trading data until cache expires | **MEDIUM** — no insider data shown for half a day after rate limit hit | Check response before caching; skip cache on rate-limit |
| 21.U5 | D1 mode offline at startup shows 'Loading from D1...' spinner for 15 seconds with no offline indicator or localStorage fallback | **LOW** — poor UX on startup without internet | Check `navigator.onLine` before D1 load; fall through to localStorage |

---

## Category 22 — Performance (Full QA Audit 2026-07-01)

### Unfixed (3)

| # | Bug | Impact | Reason |
|---|-----|--------|--------|
| 22.U1 | `recalcAll()` fires on every keystroke (40+ calculator inputs) with no debounce — runs 5 calculations + destroys/recreates 2 Chart.js instances per keypress | **MEDIUM** — visible flicker on mobile, GC pressure, wasted CPU | Debounce with `requestAnimationFrame` |
| 22.U2 | Chart.js instances destroyed and recreated on every `recalcAll` call instead of using `chart.update()` — causes flicker and memory churn | **MEDIUM** — poor UX on slower devices | Store chart instances in map, call `chart.update()` on data change |
| 22.U3 | Redundant `recalcAll()` calls — `loadData()` already calls it internally, but callers (import, password change) call it again | **LOW** — wasteful double calculation on import/restore | Remove redundant calls or debounce with RAF |

---

## Category 23 — Security & Code Quality (Full QA Audit 2026-07-01)

### Unfixed (2)

| # | Bug | Impact | Reason |
|---|-----|--------|--------|
| 23.U1 | 10 of 12 modal openers bypass `_openModal()` — no focus trap, no Escape key handler, no scroll lock for these modals | **MEDIUM** — accessibility issue, background scrollable while modal open | Route all modal opens through `_openModal()` |
| 23.U2 | `_encPass` global variable holds encryption password in memory with no idle timeout — accessible via DevTools console until page close | **LOW** — encryption password exposed to XSS or physical access | Add idle timeout to clear `_encPass` after N minutes |

---

## Deployment Notes

- **Worker must be redeployed** after commits `9a06c86` (Yahoo proxy auth) and any future Worker changes:
  ```bash
  cd web/cloudflare-worker && npx wrangler deploy
  ```
- **Service Worker** cache version is `stratos-v3` — browsers auto-update on next visit
- **GitHub Pages** auto-deploys from `web/` via Actions

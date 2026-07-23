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
| 56 | UX — Transaction Ticker Link | fe3cbd6 | 2026-07-04 | 1 | 0 |
| 57 | UX — Accessibility Overlay Fix | f17d2c7 | 2026-07-04 | 1 | 0 |
| 58 | UX — TEST-PLAN.md + Data Structures | 68604b1 | 2026-07-04 | 0 | 0 |
| 59 | UX — Screener Filter Presets | 3f81b2d | 2026-07-04 | 4 | 0 |
| 60 | Keyboard Shortcut + TEST-PLAN Accuracy | c4427e0 | 2026-07-04 | 1 | 0 |
| 62 | Tooltip Expansion QA | `9a875f9` | 2026-07-08 | 4 | 0 |
| 63 | Portfolio History Chart QA | `a7d64b9` | 2026-07-09 | 5 | 0 |
| 64 | QA Sweep — CRITICAL+HIGH fixes | `e75f044` | 2026-07-09 | 16 | 0 |
| 65 | QA Sweep — MEDIUM fixes | `60d3c5e` | 2026-07-09 | 14 | 0 |
| 66 | QA Verification — extra parseInt radix | pending | 2026-07-09 | 2 | 0 |
| 67 | QA Sweep — LOW fixes | `e682b59` | 2026-07-09 | 8 | 0 |
| 68 | Cross-Device Login QA | `bbc5856` | 2026-07-09 | 1 | 0 |
| 69 | Pre-Production Security Audit | `f42dfb4` | 2026-07-10 | 17 | 0 |
| 70 | Pre-Production Full QA (A+B+C) | `61488a7` | 2026-07-10 | 7 | 0 |
| 71 | Privacy Mode QA | `` | 2026-07-10 | 5 | 0 |
| 72 | Field-by-Field Sync Audit & Hardening | `36cf706`…`1d31799` | 2026-07-22 | 21 | 0 |
| 73 | S2a Cross-Device Sync + SW Auto-Reload | `e8aacb0`+`8803d3c` | 2026-07-23 | 4 | 0 |
| 74 | S2a-2 Per-Company Attr Sync + Single-PUT Upsert | `aaff465` | 2026-07-23 | 2 | 0 |

**Total: 458 fixed, 24 potential (unfixed)** — P.3/P.15/P.16 accepted as external limitations

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

### Final QA Pass (cross-session)
| # | Bug | Fix | File:Line |
|---|-----|-----|-----------|
| 25.22 | doDeleteStock() crashes — researchNotes.filter() called on object not array | Iterate journal/news/market arrays, filter by .ticker not .companyTicker | index.html:8840 |
| 25.23 | D1 round-trip breaks pipeline — lowercase snake_case not normalized back to title case | Added case normalization map in _d1CompanyToTStock | index.html:8060 |
| 25.24 | deleteReview() doesn't refresh dashboard widget or profile badge | Added renderDbReviewsDue() and renderReviewDueBadge() after delete | index.html:11513 |

### Unfixed (0)

---

## Category 24 — KNOWN-ISSUES Bugfix Sweep (`bde6c93`)

### Fixed (6)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | CRITICAL | P.4: Worker has no rate limiting — attacker can exhaust API quotas | Per-IP rate limiting: 30/min Yahoo proxy, 120/min D1 API, 429+Retry-After |
| 2 | HIGH | P.1: No FMP API call budget tracking (250/day limit) | localStorage daily counter with auto-reset, toast at 80%/100% |
| 3 | HIGH | P.2: No client-side cache in non-D1 mode | In-memory TTL cache (`_memCache` Map) respecting `CACHE_TTLS` |
| 4 | HIGH | P.6: Company DELETE + notes DELETE not atomic | Wrapped in `db.batch()` |
| 5 | HIGH | P.7: Dividend fetch dedup flag not in finally block | try/finally wrapping entire function body |
| 6 | HIGH | P.10: crypto.subtle crashes on non-HTTPS | `isSecureContext` guard in `deriveKey()` |

### Unfixed (0)

---

## Category 25 — KNOWN-ISSUES Medium Sweep (`2dfccef`)

### Fixed (6)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MEDIUM | P.5: Yahoo Chart endpoint missing crumb auth | Added getCrumb() + cookie auth + 401 retry to /chart/ |
| 2 | MEDIUM | P.8: Service Worker skipWaiting() unconditional | Message-based activation, user sees "reload now" toast |
| 3 | MEDIUM | P.9: chInited chart flag never resets on navigation | resetCharts() called in showSection() on leave |
| 4 | MEDIUM | P.11: No file size limit on FileReader imports | 10MB guard on all 4 FileReader call sites |
| 5 | MEDIUM | P.13: fetchStockData has no deduplication | In-flight promise map shares concurrent fetches |
| 6 | MEDIUM | P.14: autoSave has no debounce | clearTimeout+setTimeout 300ms debounce |

### Accepted (1)

| # | Severity | Bug | Reason |
|---|----------|-----|--------|
| 1 | MEDIUM | P.3: FMP /profile missing debt/cash data | External API limitation, Yahoo provides data when available |

---

## Category 26 — LOW + Deep Audit Sweep (`5cadef9`)

### Fixed (8)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | LOW | P.12: Two inconsistent parseNum functions | CSV version renamed to `csvNum()`, no more name collision |
| 2 | LOW | P.17: renderPositions NaN propagation in P&L % | `isFinite()` guard, shows '—' instead of 'NaN' |
| 3 | LOW | P.18: Screener score cache missing | `_screenerScoreCache` Map, invalidated on stock save |
| 4 | Deep | D.1: Screener filter keys not escaped in onclick | All keys/labels escaped with `escH()` |
| 5 | Deep | D.2: md.label in innerHTML without escH() | Fixed alongside D.1 |
| 6 | Deep | D.3: parseInt without radix in 32 locations | Added `,10` radix to all 32 calls |
| 7 | Deep | D.4: CSV regex backtracking risk | Length guard (>30 chars) before regex |
| 8 | Deep | D.5: Prototype pollution in portfolio grouping | `Object.create(null)` for grouping objects |

### Accepted (2)

| # | Severity | Bug | Reason |
|---|----------|-----|--------|
| 1 | LOW | P.15: accent-color needs Safari 15.4+ | CSS spec limitation, cosmetic only |
| 2 | LOW | P.16: fetch keepalive ignored in Firefox 90-99 | Browser limitation, negligible user base |

---

## Category 27 — UX/UI Audit Fixes (*uncommitted*)

Full UX/UI audit of app workflows, touch targets, theming, and interaction patterns.

### Fixed (5)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MED | Light theme loading overlay uses hardcoded dark rgba(15,17,23,.7) | Changed to `rgba(0,0,0,.5)` + `[data-theme="light"]` override with `.3` opacity |
| 2 | LOW | Settings status colors hardcoded `#2ecc71`/`#e74c3c`/`#aaa` | Replaced with `var(--green)`/`var(--red)`/`var(--text2)` |
| 3 | MED | Bottom nav z-index (100) above more-menu (99) and backdrop (98) | More-menu → 101, backdrop → 100 |
| 4 | LOW | Touch targets under 44px on mobile (tabs 36px, delete/back buttons 32px) | Min-height/width 44px on `.tab`, `.st-del`, `.st-exp-btn`, `.cp-back`; `::before` pseudo for rating buttons |
| 5 | FEATURE | Destructive deletes use `confirm()` with no undo | `undoableDelete()` system: 6s toast with "Visszavonás" button, JSON snapshot restore. Applied to positions, transactions, research entries, reviews, saved stocks |

### QA Fixes (3)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 6 | MED | D1 `API.del()` fires immediately, cloud data deleted even if user clicks Undo | Moved API.del into `onConfirm` callback — only fires after 6s timer or manual close (positions, transactions, reviews) |
| 7 | LOW | Single global `_undoTimer` — previous toasts lose auto-dismiss | Per-toast local `timer` variable instead of shared global |
| 8 | TRIVIAL | Dead code: duplicate `onmouseenter` assignment | Removed first duplicate |

### Audit Scope

22 findings identified across 4 categories (Critical UX, Moderate, Minor Polish, Enhancements). 5 implemented + 3 QA fixes this session, onboarding + undo evolution saved to ROADMAP.md for later.

---

## Category 28 — Keyboard Shortcuts + Empty States (`79f0927`)

Features: keyboard shortcuts (Cmd+1-7 nav, N new item, ? guide, Esc close) with guide card in Settings; empty states with icon + Hungarian text + CTA for Portfolio Overview, Positions, Transactions, Reviews, Dashboard widgets.

### QA Fixes (2)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MED | Portfolio Overview CTA button no-ops — `[data-tab=pf-accounts]` selector matches nothing (tabs lack `data-tab` attrs) | Changed to `switchPortfolioTab('accounts')` |
| 2 | MED | N key always opens position modal — `dataset.tab` undefined on portfolio tabs, so transactions tab never detected | Replaced with `pf-panel-transactions` display check |

---

## Category 29 — Bulk Operations (`11c3e3a`)

Features: multi-select checkboxes + floating action bar (delete/export CSV) for positions and transactions. Undo support for batch deletes. Select all in header.

### QA Fixes (2)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MED | Bulk bar persists when navigating away from portfolio to other sections | Clear `_bulkPosIds`/`_bulkTxIds` and remove bar in `showSection()` when leaving portfolio |
| 2 | LOW | "Select all" header checkbox always unchecked on re-render even when all items selected | Added dynamic `checked` attribute based on Set vs filtered list comparison |

---

## Category 30 — Bulk Ops: Notes/Reviews/Stocks (`73e7dfb`)

Extended bulk operations to research notes, reviews, and tracked stocks. Select all + per-item checkboxes, floating bulk bar, undoable batch delete, D1 sync on confirm.

### QA Fixes (4)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | HIGH | `bulkDeleteNotes` splice corruption — iterating keys and splicing by re-finding index; after first splice, subsequent indices stale | Collect indices per type, sort descending, splice from end |
| 2 | HIGH | Missing D1 delete for notes — `saveResearchNotes()` only upserts remaining, never deletes removed from D1 | Added `onConfirm` callback with `API.del('notes/'+id)` for each deleted note |
| 3 | MED | Missing D1 delete for stocks — `_putSavedStocks` only batch-upserts remaining valuations | Added `onConfirm` with `API.del('valuations/'+id)` for deleted stocks |
| 4 | MED | No cross-mode guard — selecting items in two sections simultaneously shows wrong bulk bar | Added `_clearOtherBulk(keep)` that clears all other Sets when a new one gains an entry |

---

## Category 31 — Skeleton/Animation QA (`c7412e9`)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MED | Light theme shimmer invisible — `rgba(255,255,255,.04)` gradient on white background | Added `[data-theme="light"] .skel::after` with `rgba(0,0,0,.06)` |
| 2 | LOW | `skel-grid--2` not collapsed on small phones (<480px) | Added `@media(max-width:480px){.skel-grid--2{grid-template-columns:1fr}}` |
| 3 | MED | Insider trading skeleton orphaned on error — no try/catch around fetchInsiderTrading | Wrapped in try/catch/finally with `hideSkeleton(el)` in finally block |

---

## Category 32 — Confirmation Dialogs (`a0362db`)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MED | z-index tie with global search — both at 300 | Bumped confirm overlay to z-index:350 |
| 2 | MED | Re-entrancy promise leak — calling showConfirm while one is open loses old resolve | Auto-resolve old promise with `false` before replacing `_confirmResolve` |
| 3 | MED | No focus trap — user can Tab out of confirm dialog | Reuse existing `_trapFocus` mechanism, added `role="dialog"` and `aria-modal="true"` |

---

## Category 33 — Scroll Position Preservation & Lazy-Load Charts (UX audit)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | HIGH | `history.scrollRestoration='auto'` — browser's built-in scroll restore interfered with manual scroll management | Added `history.scrollRestoration='manual'` to disable browser's default |
| 2 | HIGH | `requestAnimationFrame` / `setTimeout` scroll restore never took effect — browser layout not settled when async callback fires | Changed all scroll restores to synchronous: `void document.body.offsetHeight; window.scrollTo(0, pos)` |
| 3 | HIGH | `switchCompanyTab` called from `showSection` saved wrong scrollY (mid-transition value) and overrode section scroll restore | Added `skipScroll` parameter; `showSection` passes `true` to skip sub-tab scroll save/restore |
| 4 | HIGH | `closeProfile()` scroll restore clobbered — `window.location.hash` change re-triggered `handleRoute` → `showSection` which overwrote saved scroll with 0 | Changed to `history.replaceState` to update hash without triggering hashchange |
| 5 | LOW | Dashboard widgets rendered eagerly — all 13 widgets created on section load, causing unnecessary layout work | Added `lazyChart()` utility with IntersectionObserver (200px rootMargin); first 2 widgets eager, remaining 11 lazy |

---

## Category 34 — CSV Import Locale Detection (UX audit)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | HIGH | US numbers `1,234.56` parsed as 1 — `parseFloat` stops at comma | New `_csvNumParse(s,locale)` handles both EU and US formats correctly |
| 2 | HIGH | No locale auto-detection — EU decimal commas silently misinterpreted | Added `_detectNumLocale()` scoring heuristic: scans numeric columns for format patterns (e.g. `\d.\d{3},\d` → EU) |
| 3 | MED | CSV delimiter detection failed for EU files — semicolons not detected when data contains commas in numbers | Changed to header-line heuristic: count semicolons vs commas in first line, pick higher |
| 4 | LOW | No user override for auto-detected locale | Added "Number format" dropdown in preview UI (Auto/EU/US) |

---

## Category 33 — CSV/Scroll/Lazy QA (2026-07-02)

Post-implementation QA for CSV locale detection, scroll preservation, and lazy-load charts.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | HIGH | US locale `_csvNumParse`: `s.replace(',','.')` only replaces first comma, so `"1,000"` → `1.000` → parseFloat = 1.0 | Changed to `s.replace(/,/g,'')` to treat commas-without-dots as thousand separators |
| 2 | LOW | `parseInt(document.getElementById('pf-csv-account',10).value)` — radix `10` passed to `getElementById` instead of `parseInt` | Fixed to `parseInt(document.getElementById('pf-csv-account').value, 10)` |

---

## Category 34 — i18n Localization QA (2026-07-02) — `e338abf`

QA for full EN/HU internationalization implementation.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | CRITICAL | `undoableDelete()`: local `const t=document.createElement('div')` shadows global `t()` i18n function — `t('common.undo')` and `t('common.restored')` crash with TypeError | Renamed local variable from `t` to `el` |
| 2 | CRITICAL | `deleteTransaction()`: local `const t=pfTransactions.find(...)` shadows global `t()` — `t('toast.transactionDeleted',...)` crashes | Renamed local variable from `t` to `tx` |
| 3 | CRITICAL | Global search `pfTransactions.forEach(t=>{...})`: iterator `t` shadows `t()` — `t('search.transactions')` crashes | Renamed iterator from `t` to `tx` |

---

## Category 35 — i18n Deep Pass (2026-07-02) — `c49f3ac`

Deep pass fixing remaining untranslated strings found during visual browser testing.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MEDIUM | Keyboard shortcut labels (⌘2-⌘7) hardcoded as English "Companies", "Portfolio", etc. | Added `data-i18n` spans reusing `nav.*` keys |
| 2 | MEDIUM | "Select all" checkbox text hardcoded in 3 locations (stocks, notes, reviews) | Added `common.selectAll` key, wrapped with `t()` |
| 3 | CRITICAL | `renderResearchEntry()`: `const t=e._type` shadows global `t()` i18n function — type badge translation calls would crash | Renamed variable from `t` to `nt`, updated all 16 references |
| 4 | LOW | Research note type badges ("NEWS", "JOURNAL", "MARKET") not translated | Added `t('research.journal/news/market')` calls for badge labels |
| 5 | LOW | Pin/Unpin, Source, Edit/Delete tooltips hardcoded in English in research entries | Added `common.pin/unpin/source` keys, wrapped with `t()` |

---

## Category 36 — Soft-Delete + Trash (2026-07-02) — `fe3b0c8`

Soft-delete with `deleted_at` timestamps for positions, transactions, notes, reviews. 30-day trash with restore/permanent delete in Settings.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MEDIUM | `pfPositions.length` used for empty-state checks in 5 locations (takeSnapshot, checkSnapshotReminder ×2, renderPortfolioOverview, renderDbAllocCharts) — soft-deleted items counted as active | Changed all 5 to `getActivePositions().length` |
| 2 | MEDIUM | `deleteResearchEntry()` D1 sync used local `id` parameter instead of `entry._d1Id\|\|entry.id` — wrong D1 record targeted if IDs diverge after sync | Fixed to use `entry._d1Id\|\|entry.id` |
| 3 | MEDIUM | `_toggleAllRv()` used `rvData.entries.slice()` — included soft-deleted reviews in toggle-all | Changed to `rvData.entries.filter(e=>!e.deleted_at)` |
| 4 | LOW | `calcDividendSummary()` `totalPositions:pfPositions.length` counted soft-deleted positions | Changed to `getActivePositions().length` |
| 5 | LOW | `bulkDeleteNotes()` used `const[t,idStr]=k.split(':')` — `t` variable shadows global i18n `t()` function | Renamed to `[tp,idStr]` |

---

## Category 37 — UX Polish: Padding, Focus Ring, Collapsible (2026-07-02) — `3d75f00`

Three UX consistency fixes: card padding standardization, global input focus ring, dynamic collapsible height.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | LOW | `toggleYearlyGrowth()` scrollHeight returns 0 when element has `max-height:0` and `overflow:hidden` — collapsible opens with 0 height | Temporarily set `maxHeight='none'`, read scrollHeight, reset to 0, force reflow, then animate to measured height |

**Also fixed (not bugs, design improvements):**
- Content card padding inconsistency (16px vs 20px) → standardized to 20px + mobile 14px override
- Input elements missing focus ring → global `input:focus,textarea:focus{box-shadow:0 0 0 2px rgba(108,92,231,.25)}`
- Removed static `.collapsible.open{max-height:500px}` CSS rule → JS-driven dynamic height

---

## Category 38 — Chart Export + Sort Indicator (2026-07-02) — `828efc4`

Chart PNG download with SV watermark on all charts; sort indicator font size fix.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | CRITICAL | `MutationObserver.observe(document.getElementById('app'))` ran at script parse time before `#app` existed — TypeError crash prevented all download buttons | Wrapped observer setup inside `DOMContentLoaded` listener |
| 2 | LOW | Download icon `⭳` (U+2B73) renders as empty box on most systems — not in Arial or default fonts | Changed to `⤓` (U+2913) which has broader font support |

**Also added (new features):**
- Chart PNG export: hover download button (⤓) on all chart containers with SV logo watermark
- Sort indicator readability: table header 9px→11px, sort arrow 8px→10px

---

## Category 39 — XLSX Export + Portfolio PDF (2026-07-02) — `0d2895c`

XLSX multi-sheet export and portfolio summary PDF report.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MEDIUM | `exportXlsxAll()` showed success toast before async `_downloadXlsx()` completed — on first click (CDN load), toast fired before download began | Made `_downloadXlsx` and `exportXlsxAll` async, moved toast inside try/catch after await |
| 2 | MEDIUM | Operator precedence in allocation calc: `(typeMap[tp]||0)+convertCurrency(v,...)||v` — `||` binds looser than `+`, NaN accumulation after first position | Added parentheses: `(typeMap[tp]||0)+(convertCurrency(...)||v)` |
| 3 | MEDIUM | `fmt()` in PDF didn't handle negative values — `-1500` failed `>=1e3` check, showed raw number instead of `-1.5K` | Use `Math.abs(v)` for comparisons, prepend sign |
| 4 | LOW | Allocation by Asset Type section hidden when only 1 type exists (`>1` check) | Changed to `>=1` |

---

## Category 40 — Import Merge Strategy (2026-07-02) — `95ff2b0`

Fixed import to use merge instead of full replace for reviews, framework, and dividend history.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | HIGH | `doImport()` replaced all reviews on import (`rvData = d.reviewsData`) — existing reviews silently lost | Changed to `_mergeArrayById(rvData.entries, d.reviewsData.entries)` — same ID updates, new ID adds |
| 2 | HIGH | `doImport()` replaced all framework data on import (`fwData = d.frameworkData`) — principles, rules, traits, avoid list silently lost | Changed to `_mergeArrayById` on all 4 framework arrays individually |
| 3 | MEDIUM | `doImport()` replaced dividend history on import (`divHistory = d.dividendHistory`) — per-ticker history lost | Changed to `Object.assign(divHistory, d.dividendHistory)` — merge by ticker key |

## Category 41 — Position Sort, Pin-to-Top, Pipeline Filter (2026-07-02) — `8bae88e`

Added sortable position table, pin-to-top for positions and tracked stocks, and pipeline quick filter bar. QA found 12 issues; 4 fixed this session, 4 deferred (D1 schema needed), 4 accepted/pre-existing.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | — | pre-existing pipeline dropdown issue | Accepted — not introduced in this session |
| 2 | MEDIUM | Pin button titles hardcoded "Unpin"/"Pin to top" instead of i18n | Changed to `t('common.unpin')` / `t('common.pin')` |
| 3 | MEDIUM | P&L column headers hardcoded "P&L" / "P&L %" instead of i18n | Changed to `t('pf.plCol')` / `t('pf.plPct')` |
| 4 | — | pre-existing score column display issue | Accepted — not related to this feature |
| 5 | HIGH | Stocks with no pipeline stage vanished when any filter active | Added "—" button in filter bar for unassigned stocks with `stPipeFilter.has('')` |
| 6 | LOW | CSV/XLSX export doesn't include pinned field | Deferred — D1 schema needs `pinned` column first |
| 7 | LOW | Pin state not synced to D1 (positions) | Deferred — needs D1 schema migration |
| 8 | LOW | Pin state not synced to D1 (tracked stocks) | Deferred — needs D1 schema migration |
| 9 | MEDIUM | Pipeline bar border-radius broken — `:last-child:not(.st-pipe-arch)` never matched | Switched to inline `style="border-radius:..."` per button in renderPipelineBar() |
| 10 | LOW | Sort arrow direction inconsistent UX convention | Accepted — minor preference, current behavior clear |
| 11 | LOW | Pipeline filter not persisted across page reload | Accepted — ephemeral filter state, consistent with text filter behavior |
| 12 | LOW | Pin star click propagates to row in some cases | Accepted — `event.stopPropagation()` already on tracker pin, positions pin is in separate actions cell |

---

## Category 42 — Custom Tag System (2026-07-02) — `97a2496`

Added user-defined tag system: add/remove tags on company profiles with datalist autocomplete, tag filter bar on tracker (multi-select OR logic), tag pills in Name column, screener Tag filter with dynamic options. QA found 8 issues; 6 fixed, 2 deferred.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | HIGH | XSS via single quotes in tag names — `escH()` HTML-encodes `'` to `&#39;` but browsers decode before executing onclick JS | Replaced `escH()` with `_tagEnc()`/`_tagDec()` using `encodeURIComponent` + `%27` for JS-context safety |
| 2 | LOW | Tags not synced to D1 (tracked stocks) | Deferred — needs D1 schema migration (same as `pinned`) |
| 3 | MEDIUM | Screener tag options not HTML-escaped — tag with `"` or `<` breaks select HTML | Wrapped option values and text with `escH()` |
| 4 | LOW | No max tag length — could paste arbitrarily long strings | Added `tag.slice(0,30)` in `addTagToStock()` and `maxlength="30"` on input |
| 5 | MEDIUM | Tag delete button was `<span>` not `<button>` — not keyboard accessible | Changed to `<button>` with `aria-label`, added `aria-pressed` to filter buttons |
| 6 | LOW | "Any" option in screener hardcoded in English | Changed to `t('common.any')`, added EN/HU i18n keys |
| 7 | MEDIUM | Stale tag filter entries remain after all stocks with that tag are untagged | Added pruning loop in `renderTagFilterBar()` to remove stale entries from `stTagFilter` |
| 8 | LOW | Static datalist ID `tag-suggestions` — only one profile open at a time so no conflict | Accepted — single-profile SPA, no conflict possible |

## Category 43 — Skeleton Loading States (2026-07-02) — `e1cfd66`

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | MEDIUM | `fetchAllDividendData` skeleton appended to full panel container — invisible below existing content | Changed from `showSkeleton` to `showSpinner` overlay which covers entire panel |

---

## Category 44 — Missing CSS Variable (2026-07-03) — `7946c25`

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | MEDIUM | `--yellow` CSS variable used in 2 places (pin icon color, currency warning) but never defined in `:root` — rendered as inherited/transparent | Added `--yellow:#ffd93d` to dark theme `:root` and `--yellow:#e6a800` to light theme |

---

## Category 45 — Screener/Compare Discoverability (2026-07-03) — `74fa17c`

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | MEDIUM | Screener and Compare buttons visually identical to Export/Import — no indication they are power features | Added `.st-power-btn` CSS class with accent border/background, emoji icons (🔍/⚖), distinct active state |
| 2 | LOW | No tooltip or description explaining what Screener and Compare do | Added `data-i18n-title` tooltips on buttons, description text inside both panels (EN+HU) |
| 3 | LOW | Compare bar description could overflow on narrow screens | Hidden via `display:none` in 480px media query |

---

## Category 46 — Dashboard Widget Management (2026-07-03) — `bdab96f`

Added dashboard widget hide/show and reorder: Manage Widgets panel with checkboxes and up/down arrows, per-widget Hide button on hover, localStorage persistence, empty-state message. QA found 6 issues; all 6 fixed.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MEDIUM | Manage panel stays open when navigating away from dashboard | Close panel in `showSection()` when leaving dashboard |
| 2 | MEDIUM | `toggleDbWidgetVisibility` doesn't re-render manage panel | Added `renderManageWidgets()` call after save |
| 3 | LOW | No empty-state message when all widgets hidden | Added `db-all-hidden-msg` element with i18n text |
| 4 | LOW | Manage panel and toggle button lack ARIA attributes | Added `aria-expanded`, `aria-controls`, `role="region"` |
| 5 | LOW | Reorder arrow buttons lack accessible labels | Changed `title` to `aria-label="Move up/down"` |
| 6 | LOW | Silent failure when localStorage full during config save | Added `showToast(t('toast.storageFull'))` on catch |

---

## Category 47 — Tracker Export/Import Cleanup + API Usage Widget (2026-07-03) — `9ec622e`

Removed redundant Export/Import buttons and functions from Tracker tab (Settings Data Management already covers this). Added API Usage widget to Settings showing FMP, Yahoo Finance, and Finnhub limits, usage tracking, data targets, and cache TTLs.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | LOW | Export/Import on Tracker redundant with Settings Data Management | Removed buttons + `exportTrackerData()`/`importTrackerFile()` functions |
| 2 | LOW | `toast.importedShort` i18n key became dead code after function removal | Removed from both EN and HU i18n blocks |

---

## Category 48 — Settings Pill Navigation (2026-07-03) — `45caaf9`

Added sticky pill navigation bar to Settings page for quick section jumping (8 pills for 8 cards). Fixed CSS `position:sticky` broken by parent `overflow-x:hidden`.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MEDIUM | Settings page has 9 cards (~4 screens) with no navigation aid | Added sticky pill nav bar with 8 buttons, `scrollToCard()` function |
| 2 | MEDIUM | `position:sticky` broken by `.content` having `overflow-x:hidden` | Added `#section-settings{overflow:visible}` override |
| 3 | LOW | `scrollToCard()` had redundant `querySelectorAll` calls | Consolidated into single query with `classList.toggle()` |

---

## Category 49 — Typography Scale (2026-07-03) — `2664cd1`

Introduced 8-level typographic scale via CSS variables (--fs-xs through --fs-3xl). Eliminated 3 redundant font sizes (9px, 17px, 22px), consolidated dialog headings to 16px, hero numbers to 20px. Converted 285 CSS class declarations to use variables.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MEDIUM | 16 different font sizes with no typographic scale | Added 8 CSS variables (--fs-xs:10px through --fs-3xl:20px) to :root |
| 2 | MEDIUM | 9px text barely readable, same role as 10px badges | Eliminated 9px → 10px (7 places: badges, tags, chart labels) |
| 3 | LOW | 17px Markdown h2 between 16px and 18px with no reason | Changed to var(--fs-xl) = 16px |
| 4 | LOW | 22px/24px hero numbers inconsistent (same role as 20px) | Consolidated to var(--fs-3xl) = 20px |
| 5 | LOW | Dialog headings split between 15px and 16px | Unified to var(--fs-xl) = 16px |
| 6 | LOW | 285 CSS class font-sizes hardcoded as px values | Converted to CSS variable references |

---

## Category 50 — Card Style Consistency (2026-07-03) — `474c56a`

Unified card border-radius to var(--radius) and normalized db-hero padding.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | LOW | 5 card classes used hardcoded border-radius (10px/8px) instead of var(--radius) | Changed pf-account-card, pf-summary-card, pf-summary-bar, cp-val-item, skel-card to var(--radius) |
| 2 | LOW | db-hero padding 24px inconsistent with other full cards (20px) | Changed to 20px (mobile override 16px kept) |

---

## Category 51 — Inline Hover Styles (2026-07-03) — `1bea6c9`

Replaced 5 inline JS hover handlers with CSS :hover pseudo-classes.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | LOW | Language toggle uses onmouseover/onmouseout for hover background | Created `.sidebar-btn` CSS class with `:hover` rule |
| 2 | LOW | Theme toggle uses onmouseover/onmouseout for hover background | Created `.sidebar-btn--theme` CSS class with `:hover` rule |
| 3 | LOW | Toast undo button uses onmouseenter/onmouseleave + inline cssText | Created `.toast-undo` CSS class with `:hover` rule |
| 4 | LOW | Dividend calendar tooltip show/hide via inline JS handlers | CSS `.div-cal-day:hover .div-cal-tooltip{display:block}` replaces JS |
| 5 | LOW | External links use onmouseover/onmouseout for color swap | Created `.cp-ext-link` CSS class with `:hover` rule |

---

## Category 52 — Accessibility (ARIA + Backdrop) (2026-07-03) — `2a26e9c`

Added ARIA dialog roles, unified backdrop click-to-close, and aria-labels on icon-only buttons.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | LOW | Global search overlay missing role="dialog" and aria-modal | Added `role="dialog" aria-modal="true" aria-label="Global search"` |
| 2-12 | LOW | 11 modal-overlays missing role="dialog" and aria-modal | Added `role="dialog" aria-modal="true"` to all 11 modals |
| 13-23 | LOW | 11 modal-overlays not closeable by backdrop click | Added `onclick="if(event.target===this)closeModals()"` to all 11 |
| 24-25 | LOW | Toast close buttons (× symbol) missing aria-label | Added `aria-label="Close notification"` to both showToast and undoableDelete |
| 26 | LOW | Chart download button (⤓ symbol) missing aria-label | Added `aria-label="Download chart as PNG"` |
| 27 | LOW | Research image delete button (× symbol) missing aria-label | Added `aria-label="Remove image"` |
| 28-29 | LOW | Todo delete buttons (× symbol) missing aria-label | Added `aria-label` to company profile and dashboard todo delete |
| 30 | LOW | Valuation snapshot delete button (× symbol) missing aria-label | Added `aria-label="Delete snapshot"` |

---

## Category 53 — UX Review — Default Tab Fix (2026-07-04) — `e45cba3`

Companies section default tab changed from Calculator to Tracker for better new-user experience.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | LOW | Companies section opens on Calculator tab (8+ input fields) — unintuitive for new users who want to add their first company | Default tab changed to Tracker; sessionStorage still preserves last-used tab for returning users |

---

## Category 55 — UX — Dashboard Hub Links (2026-07-04) — `3ec4467`

Dashboard widget titles now link to their detail sections, making the dashboard a navigation hub.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MEDIUM | Dashboard widget titles are static text — no way to navigate from widget to its detail section | Added clickable title links with → arrow and hover effect to 8 widgets: Allocation/Net Worth/Smith → Portfolio, Red Flags/Sell Triggers/Dip Finder/Earnings → Companies/Tracker, Reviews Due → Reviews. Allocation chart ticker segments also clickable → showProfile |

---

## Category 54 — UX — Back Navigation (2026-07-04) — `d3260d0`

Company profile "Back" button now returns to the originating section instead of always going to Tracker.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | HIGH | Profile "Back" button always returns to Tracker regardless of origin section (Dashboard, Portfolio, Research, Reviews) — user loses navigation context | Added `_profileOrigin` state tracking; `showProfile()` captures current section before hash change; `closeProfile()` navigates back to origin with correct i18n label (EN+HU) |

---

## Category 56 — UX — Ticker Autocomplete (2026-07-04) — `1fea9e8`

Review modal and Calculator ticker inputs now have datalist autocomplete, matching existing behavior in Research/Transaction/Position modals.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MEDIUM | Review modal ticker input (`rv-modal-ticker`) has no autocomplete — user must type full ticker manually unlike Research/Transaction modals | Added `<datalist id="rv-ticker-list">` populated from `tStocks` keys in `openReview()` |
| 2 | MEDIUM | Calculator ticker input (`stockName`) has no autocomplete — user must remember exact ticker names | Added `<datalist id="calc-ticker-list">` populated on focus from `tStocks` + saved valuations via `populateCalcTickerList()` |

---

## Category 57 — UX — Transaction Price Auto-fill (2026-07-04) — `6edec93`

Transaction modal now auto-fills price from tracker data when a known ticker is entered.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MEDIUM | Transaction price field empty even when ticker is in tracker with known price — user must manually look up and type the current price | Added `onTxTickerChange()`: auto-fills `tStocks[ticker].price` when price field is empty, shows "Current price: X" hint below field |
| 2 | LOW | Price hint not reset when transaction modal reopened after previous use | Added `pf-tx-price-hint` display reset in `openTransactionModal()` before `_openModal()` |
| 3 | LOW | Pre-existing `t` variable shadowing in position/transaction datalist `.map(t=>)` callbacks | Renamed map parameter from `t` to `tk` in `updatePositionModalFields()` and `updateTxModalFields()` |

---

## Category 58 — UX — Partial Add Toast (2026-07-04) — `14e92e5`

Stock add with incomplete API data now shows exactly what's missing instead of a generic warning.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | LOW | Partial add toast says generic "some data unavailable — check API settings" without specifying what's missing or how to fix it | Toast now lists missing items (price/financials/growth) and says "add manually in Overview tab"; 5s duration instead of default |

---

## Category 59 — UX — Transaction Ticker Cross-link (2026-07-04) — `f616215`

Transaction table ticker column is now clickable to open the company profile.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | LOW | Transaction table shows ticker as plain text — no way to quickly navigate to the company profile from a transaction | Ticker cell now renders as accent-colored clickable link calling `showProfile()` for tickers in `tStocks`; unknown tickers remain plain text |

---

## Category 60 — UX — Screener Filter Presets (2026-07-04) — `3f81b2d`

Screener filters now persist to localStorage and support preset system (built-in + user-saved).

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MEDIUM | Screener filters lost on page reload — `screenerFilters` was only in memory | Auto-persist to `screener_filters_v1` localStorage key on every filter change |
| 2 | LOW | No way to save/reuse common filter combinations | Added preset bar: 4 built-in presets (Quality Growth, Undervalued, Dividend Safe, High Score) + user save/load/delete |
| 3 | MEDIUM | `innerHTML +=` with `<optgroup>` breaks DOM — browser auto-closes tag | Build full HTML string first, then assign to `innerHTML` once |
| 4 | LOW | Missing `escH()` on i18n strings in optgroup label attributes | Wrapped `t()` output with `escH()` for XSS consistency |

---

## Category 61 — Keyboard Shortcut + TEST-PLAN Accuracy (2026-07-04) — `c4427e0`

Verified TEST-PLAN.md against codebase with 3 parallel agents; found 27 inaccuracies. Also discovered real code bug: "N" shortcut silently failed in Companies section.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | MEDIUM | "N" keyboard shortcut in Companies references `st-input` (doesn't exist) instead of `st-add-input` — shortcut silently fails | Changed `getElementById('st-input')` → `getElementById('st-add-input')` at line 3277 |

---

## Category 62 — Tooltip Expansion QA (2026-07-08)

Added tooltips to dashboard widgets (12), portfolio table columns (9), and screener filters (10 new METRIC_TIPS entries). QA agent found 10 issues, 4 fixed.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | CRITICAL | `tipWrap()` uses `const t=` which shadows global `t()` i18n function — future edits adding `t()` call would crash | Renamed to `const tip=` and updated all references |
| 2 | HIGH | `tipWrap()` renders empty `<div class="tip-formula">` and `<div class="tip-bench">` when fields are undefined | Added conditional rendering matching `tipWrapObj()` pattern |
| 3 | HIGH | `tipWrapObj()` function defined but never called — dead code | Removed function, inline code in `pfTh()` and `initWidgetTips()` covers all cases |
| 4 | LOW | `initWidgetTips()` wraps text nodes in span with `data-i18n` but leaves duplicate `data-i18n` on parent div — could cause double i18n application | Added `titleEl.removeAttribute('data-i18n')` after wrapping |

**Not fixed (accepted):**
- HIGH: Tooltip texts hardcoded in English (consistent with existing METRIC_TIPS pattern — i18n for tooltips is separate effort)
- MEDIUM: Tooltips are hover-only, no keyboard/screen reader support (pre-existing cp-tip system limitation)
- MEDIUM: Top-of-viewport tooltip clipping (pre-existing CSS positioning)

---

## Category 63 — Portfolio History Chart QA (2026-07-09)

Calculated historical portfolio value chart from transactions + FMP API prices. QA agent found 12 issues, 5 fixed.

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | HIGH | Race condition: period/filter clicks during fetch are dropped, period button highlights but chart shows old data | Added generation counter `_pfChartGeneration` — stale renders trigger re-render in `finally` block |
| 2 | HIGH | `savings` asset type produces 0 values — falls through to API price lookup which returns null | Added `savings` to cash branch: `assetType==='cash'\|\|assetType==='savings'` → `price=1` |
| 3 | HIGH | Status element stays visible on API error — `catch` block only logs, doesn't hide status | Added `statusEl.style.display='none'` in `catch` block |
| 4 | MEDIUM | Asset filter chip labels hardcoded English — not using i18n `t()` function | Replaced with `t(labelKeys[at])` using existing `pf.stock`, `pf.etf`, etc. keys |
| 5 | MEDIUM | Bonds fall through to API price lookup but many bonds lack FMP data — shows as 0 | Added `bond` branch with `bondFaceValue`/`currentPrice` fallback before API lookup |

**Not fixed (accepted):**
- MEDIUM: Real estate uses current value for all historical dates (flat line) — no historical data available, inherent limitation
- MEDIUM: Price cache never invalidated within session — page reload clears; acceptable for single-session use
- LOW: Date iteration uses UTC (may show "tomorrow" after 11pm CET) — consistent with rest of codebase
- LOW: O(n) linear search for SPY fill-forward — acceptable at current data scale
- LOW: `getActiveTransactions()` called 3 times per render — minor, no perf concern
- LOW: `maxTicks` passes `undefined` for short ranges — harmless, Chart.js ignores it

---

## Category 64 — QA Sweep: CRITICAL+HIGH Fixes (2026-07-09)

**Date:** 2026-07-09 | **Fixed: 16** | **Unfixed: 0**

6-agent parallel QA sweep based on 354+ historical bug patterns. Scanned for: XSS/escaping, dedup/async guards, isFinite/nullish/parseNum, JSON.parse error handling, t() shadowing, D1 data persistence. Full report: `docs/QA-SWEEP-2026-07-03.txt`.

### Fixed (16)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 64.1 | CRITICAL | `parseInt((p.paymentDate\|\|p.date,10).slice(5,7))` — comma operator evaluates to `10`, then `10.slice()` throws TypeError, crashing dividend calendar | Moved radix to `parseInt((...).slice(5,7),10)` |
| 64.2 | HIGH | `refreshAllStocks` dedup flag `_refreshing=false` not in `finally` — exception permanently locks refresh | Wrapped body in try/finally, moved flag reset + spinner cleanup to finally block |
| 64.3 | HIGH | D1 load merges only `priceAlerts` from localStorage; `dcfMode`, `evaWacc`, `tags`, `dateAdded`, `earningsCalendar`, `sbc`, `roic` silently lost on reload | Added `mergeKeys` array, merge all 8 client-only fields from localStorage after D1 load |
| 64.4 | HIGH | `loadResearchNotes()` sets `_images:[]` for all D1-loaded notes — images exist in D1 but never read back | Merge `_images` from localStorage backup after D1 note load |
| 64.5 | HIGH | `_tagDec()` uses bare `decodeURIComponent` with no try/catch — corrupt tag data throws URIError in onclick handlers | Added try/catch with raw string fallback |
| 64.6 | HIGH | `parseInt(document.getElementById('aria-mult-count',10).value)` — radix `10` passed to getElementById, not parseInt | Fixed 8 instances: moved `,10)` to parseInt's second argument |
| 64.7 | HIGH | `parseInt(localStorage.getItem('d1_dirty_'+key,10))` — radix passed to getItem | Fixed 3 instances: moved `,10)` to parseInt's second argument |
| 64.8 | HIGH | `parseInt(slot.month.slice(5,7,10))` — stray `10` inside slice, parseInt has no radix | Fixed to `parseInt(slot.month.slice(5,7),10)` |
| 64.9-64.16 | — | 8 additional parseInt radix fixes across saveAccount, savePosition, saveTransaction, saveFwEntry, saveReview, schema_version, sync_ts, d1_dirty | All moved `,10` to correct position as parseInt's second argument |

---

## Category 65 — QA Sweep: MEDIUM Fixes (2026-07-09)

**Date:** 2026-07-09 | **Fixed: 14** | **Unfixed: 0**

### Fixed (14)

| # | Bug | Fix |
|---|-----|-----|
| 65.1 | 9 D1 load functions skip localStorage write-back — offline fallback serves stale data | Added `localStorage.setItem()` after D1 success in: loadPortfolioAccounts, loadPortfolioTransactions, loadDashFiSettings, loadDashBenchmark, loadDash52wHighs, loadDivSettings, loadDividendHistory, loadTrackerStocks, loadFramework, loadReviews |
| 65.2 | DCF model `parseFloat()||10` blocks valid 0% growth rate | Added `_numOr(v,def)` helper using `isFinite()`. Applied to all 7 DCF params (g1-g3, dr, tg, em, fade) |
| 65.3 | Price alert `isNaN(num)` allows Infinity as valid target | Changed to `!isFinite(num)` |
| 65.4 | `fetchDipData()` no dedup guard — double-click fires concurrent API batches | Added `_fetchingDip` flag with try/finally reset |
| 65.5 | `fetchEarningsCalendar()` no dedup guard — concurrent per-ticker loops | Added `_fetchingEarnings` flag with try/finally reset |
| 65.6 | `fetchEarningsCalendar` `.map(([t])=>t)` shadows global t() | Renamed to `([tk])=>tk` |
| 65.7 | `JSON.parse(cl.answer_json)` in forEach — one corrupt row kills entire stock load | Per-item try/catch with empty object fallback |
| 65.8 | `JSON.parse(rv.answers_json)` in forEach — one corrupt row kills entire reviews load | Per-item try/catch with empty object fallback |
| 65.9 | Snapshot export `JSON.parse(tracker_settings)` unguarded — corrupt localStorage crashes export | Added try/catch with empty object fallback |

### Not Fixed (3 — not real bugs)

| # | Issue | Why not a bug |
|---|-------|---------------|
| #9 | Bond coupon `parseFloat()\|\|0` blocks 0% coupon | `0\|\|0` is still `0` — zero-coupon bonds correctly get 0 |
| #14 | `decryptPayload` JSON.parse without try/catch | Caller on line 13999 already wraps in try/catch with user-facing error message |
| #16 | Worker INSERT OR IGNORE on migrate | Intentional — ON CONFLICT UPDATE would overwrite newer D1 data with older localStorage data during re-migration |

### Category 67 — QA Sweep — LOW fixes (commit `e682b59`, 2026-07-09)

8 LOW bugs fixed: dedup guards, button locks, finally blocks.

| # | Bug | Fix |
|---|-----|-----|
| 67.1 | `cloudSave()` no dedup guard — testSync can overlap with scheduled save | Added `_cloudSaving` flag with try/finally reset |
| 67.2 | `exportXlsxAll()` no button lock — double-click fires concurrent XLSX generation | Added `btn` param, disabled during export, re-enabled in finally |
| 67.3 | `generatePortfolioPdf()` no button lock — double-click fires concurrent PDF generation | Added `btn` param, disabled during generation, re-enabled in finally |
| 67.4 | `testD1()` btn.disabled not in finally — unexpected error leaves button permanently disabled | Moved `btn.disabled=false` to finally block |
| 67.5 | `testSync()` btn re-enable not in finally — error can leave button stuck | Moved btn re-enable to finally block, removed duplicated re-enables from early returns |
| 67.6 | `testWorker()` btn re-enable not in finally | Moved btn re-enable to finally block |
| 67.7 | `testFinnhub()` btn re-enable not in finally | Moved btn re-enable to finally block |
| 67.8 | `testFmp()` btn re-enable not in finally | Moved btn re-enable to finally block |

### Not Fixed (5 — not real bugs)

| # | Issue | Why not a bug |
|---|-------|---------------|
| #17 | `avgCost` `parseFloat()\|\|0` blocks $0 cost basis | Fallback IS 0 — `parseFloat("0")\|\|0` = `0\|\|0` = `0`. Same result for $0 and missing. |
| #18 | Real estate rental/costs `parseFloat()\|\|0` blocks $0 | Same — fallback = 0 = valid value. No data loss. |
| #19 | Cash `parseFloat()\|\|0` blocks $0 position | $0 cash position has no meaning + result is 0 either way |
| #20 | `csvNum` can return Infinity | Regex strips non-digit prefix: `"Infinity"` → `"nfinity"` → `NaN`. Can't produce Infinity. |
| #21 | CSV import `isNaN` should be `isFinite` | Depends on #20 — `csvNum` can't produce Infinity, so `isNaN` is sufficient here. |

### Already Fixed (2)

| # | Issue | Status |
|---|-------|--------|
| #22 | `fetchDipData` no dedup guard | Fixed in cat 65 (65.4) |
| #23 | `fetchEarningsCalendar` no dedup guard | Fixed in cat 65 (65.5) |

### Not Fixed (1 — not real bug)

| # | Issue | Why not a bug |
|---|-------|---------------|
| #27 | `_autoLockTimer` missing clearTimeout before setTimeout | `visibilitychange` alternates hidden↔visible — can't fire hidden→hidden without visible clearing the timer in between |

### Category 68 — Cross-Device Login QA (commit `bbc5856`, 2026-07-09)

1 bug found and fixed during QA of the cross-device login feature.

| # | Bug | Fix |
|---|-----|-----|
| 68.1 | `changeEncPassword()` increments `_metaVersion` locally before confirming cloud meta save — conflict leaves local version higher than cloud | Only increment `_metaVersion` after successful `cloudSaveMetaRetry()`; on conflict, keep previous version |

### Category 69 — Pre-Production Security Audit (commit `f42dfb4`, 2026-07-10)

17 bugs found and fixed during comprehensive QA audit before entering live data.

| # | Bug | Fix |
|---|-----|-----|
| 69.1 | `_csvEscape()` missing formula injection protection — `=`, `+`, `@`, `\t`, `\r` prefixed cells execute in Excel | Added apostrophe prefix for formula characters; negative numbers (`-100`) exempt |
| 69.2 | Service Worker caches D1 API responses (portfolio, transactions) in Cache API | Removed `cache.put()` for `workers.dev` GET responses — network-only with offline fallback |
| 69.3 | Cloudflare Worker has no request body size limit on `/api/` endpoints | Added `Content-Length` check, reject >5MB with 413 |
| 69.4 | Dead code `_gatherBackupSnapshot()` exports all localStorage keys including `enc_salt`, `enc_verify` | Removed the function entirely |
| 69.5 | `pos.currency` unescaped in cash position subinfo (line 4988) | Added `escH()` |
| 69.6 | Asset type filter chips: `at` unescaped in onclick handler and fallback label (line 5840) | Added `escH()` to both |
| 69.7 | Dashboard todo `t.due` date unescaped (2 locations: lines 7198, 7270) | Added `escH()` |
| 69.8 | Position sizing `risk` level unescaped (line 8480) | Added `escH()` |
| 69.9 | Summary tab: position `cur` (currency) unescaped (line 8590) | Added `escH()` |
| 69.10 | Summary tab: transaction `t.date` unescaped (line 8611) | Added `escH()` |
| 69.11 | Summary tab: transaction `t.type` unescaped (line 8612) | Added `escH()` |
| 69.12 | Summary tab: transaction `t.currency` unescaped (line 8613) | Added `escH()` |
| 69.13 | Summary tab: review `rv.date` unescaped (line 8657) | Added `escH()` |
| 69.14 | Summary tab: review `rv.type` unescaped in display but escaped in onclick (line 8658) | Added `escH()` |
| 69.15 | Insider trading `ns.lastDate` unescaped — Finnhub API data (line 8196) | Added `escH()` |
| 69.16 | Dividend calendar tooltip `p.ticker` unescaped (line 10478) | Added `escH()` |
| 69.17 | Dividend history table `d.date` and `d.paymentDate` unescaped — FMP API data (lines 10570-10571) | Added `escH()` |

---

### Category 70 — Pre-Production Full QA (A+B+C) — `61488a7` — 2026-07-10

**~175 tests across 3 priority tiers (Security/Data/Calc, Sync/Stress/Browser, Destructive/API/Edge). 7 bugs found, all fixed.**

| # | Bug | Fix |
|---|-----|-----|
| 70.1 | `parseNum("Infinity")` returns Infinity instead of 0 — breaks financial calculations | Added `if(!isFinite(n))return 0` guard |
| 70.2 | `parseNum("-Infinity")` returns -Infinity — same issue as 70.1 | Same fix as 70.1 |
| 70.3 | `parseNum("100%")` returns 100 — `parseFloat` ignores trailing `%` in fallback branch | Changed fallback from `parseFloat(s)\|\|0` to strict `return 0` (regex-only matching) |
| 70.4 | `scheduleCloudSave` silently swallows KV sync errors — `.catch(()=>{})` | Added 3 retries with exponential backoff (3s→6s→9s) + toast notification |
| 70.5 | `deleteValSnapshot` has no undo/confirm — silently deletes valuation history | Added `undoableDelete` with JSON backup + restore |
| 70.6 | `deleteDashTodo` shows toast but no undo — inconsistent with other delete functions | Added `undoableDelete` with backup; D1 delete deferred to onConfirm |
| 70.7 | `deleteTodo` (company) has no guard at all — no toast, no undo, no confirm | Added `undoableDelete` with backup; D1 delete deferred to onConfirm |

---

### Category 71: Privacy Mode QA (2026-07-10)
**Trigger:** QA agent review of privacy mode feature implementation
**Scope:** Template literal syntax, mobile UX, data leak prevention

| # | Bug | Fix |
|---|-----|-----|
| 71.1 | Template literal syntax error in P&L summary — extra `)` before `}` broke entire main script | Removed extra closing paren in template expression |
| 71.2 | Mobile privacy button only had `onclick` — could enable but never disable privacy mode (no long-press) | Refactored IIFE to `_bindPrivacyBtn()` helper, bound to both sidebar and mobile buttons |
| 71.3 | FI tracker inputs showed raw amounts in `value` attribute even in privacy mode | Inputs show empty value + `•••••` placeholder + disabled when privacy mode on |
| 71.4 | Portfolio allocation doughnut chart tooltip showed raw values (no custom callback) | Added `tooltip:{callbacks:{label:...}}` with privacy-aware `formatMoney` call |
| 71.5 | `showExportModal` displayed full raw JSON on screen without privacy warning toast | Added `_warnPrivacyExport()` call to match all other export paths |

---

## Category 72 — Field-by-Field Sync Audit & Hardening (2026-07-22 → 2026-07-23)

**Trigger:** A full field-by-field save/load/cross-device audit (5 QA agents) of every data type between the app, localStorage, and D1. Two systemic patterns dominated: **client-minted ID collisions** and **localStorage-only data wiped on reload / never synced**. Commits `36cf706`…`1d31799`. Batch strategy in `memory/project_sync-audit-2026-07-22.md`. Frontend = `web/index.html`; Worker = `web/cloudflare-worker/src/index.js`; schema = `docs/d1-schema.sql`.

### D1 upsert / duplicate-row growth (5)

| # | Bug | Fix | Commit |
|---|-----|-----|--------|
| 72.1 | Idless-insert rows used `ON CONFLICT(id)` which never fires on a fresh autoincrement → 2nd save of the same natural key raised a UNIQUE violation, 500'd the whole batch, and silently dropped the edit to localStorage. | Added `conflictTarget` (natural-key cols) to the 12 affected tables; idless branch upserts `ON CONFLICT(conflictTarget)` + `updated_at` bump; client sends `fiscal_quarter=0` (not null) for annual filings. | `36cf706` |
| 72.2 | `notes/batch` sent `note_date:null`, but `notes.note_date` is `NOT NULL DEFAULT date('now')` and SQLite skips the default on an explicit NULL → every notes batch 500'd the whole trackerStocks save. | Omit `note_date` from the payload so the column default applies. | `1c9b68f` |
| 72.3 | Company earnings/research notes sent idless with no natural key → re-INSERTed every save (duplicate pile-up). `exportCsvNotes`/`exportMarkdownNotes` iterated `s.notes` as an array but it's an object → threw for any stock with notes. | Capture each note's row id on load and re-send so the worker upserts by id (a cleared note now persists); guard note shape + iterate research+earnings notes in exports. | `90e7e82` |
| 72.4 | `snapshot_positions` and `valuations` re-INSERTed every save with no conflict target → unbounded/quadratic duplicate rows. | Worker `conflictTarget`: `snapshot_id,company_id,account_id` (snapshots) and `company_id,label` (valuations). Frontend skips snapshot positions with missing `accountId`; valuation load captures `_d1ValId`; `deleteStock` deletes the D1 valuation row. Live D1 dedup + unique index run by Peter. | `1231c52` |
| 72.5 | `saveExchangeRates` stamped `rate_date=now` every refresh → new key each time = unbounded growth; `loadExchangeRates` read `limit=500 ORDER BY id ASC` → newest rates truncated/stale past 500 rows. | Save with fixed `rate_date='latest'` (upserts one row per pair in place); load with `limit=100000`, last-wins by highest id. `lastFetched` kept in `exchange_rates_config`. | `1d31799` |

### Data-loss on reload — client-only fields wiped (8)

| # | Bug | Fix | Commit |
|---|-----|-----|--------|
| 72.6 | `loadTrackerStocks` merge whitelist kept only 8 client-only fields → `scenarios` (DCF bear/base/bull), `valuationHistory`, `overrides` (never in D1) permanently wiped on every d1Mode reload. | Add those 3 to the merge whitelist; `==null` guard keeps D1 authoritative where it has data. | `6799d0b` |
| 72.7 | Checklist answers never synced: `checklist_templates` was never seeded, so answers had no `template_id` FK → client dropped them and the worker `/full` INNER JOIN dropped them. Checklist lived only in localStorage. | Seed missing section templates via `checklist_templates/batch` (upsert by `section_key`, UNIQUE → converges all devices), re-fetch, map answers→template_id. | `4b7db52` |
| 72.8 | Checklist sections stored FLAT in memory but save serialized `sv.answers||{}` (undefined for flat sections) → `answer_json` always `{}`, content never reached D1; load nested under `{answers:ans}` → blank after reload. | New `_sectionAnswers(sv)` serializes flat answer fields (strips progress/status, unwraps legacy nesting); loader spreads answers FLAT. Covers regular fields, src_N/tenk_N checkboxes, risks.items, *_log entries, buy_sell drivers. | `815857d` |
| 72.9 | RE/cash/bond positions have no D1 company row → `company_id` null; `positions.company_id` is NOT NULL and the batch is atomic → one null row 500'd the ENTIRE positions batch (nothing synced). Load rebuilt from D1 only → localStorage-only positions dropped. | `savePortfolioPositions` excludes null-company_id rows from the D1 batch; `loadPortfolioPositions` re-merges localStorage-only positions absent from D1 (skipping soft-deleted). | `d58653b` |
| 72.10 | Research-note `excerpt`+comment (news), `action` (journal), `tags` (market) had nowhere to persist (single `content` col) → news notes blank after reload, action/tags dropped. | Schema: add `excerpt`/`action`/`tags` cols (nullable, encrypted). Worker `TABLES.notes.cols` += those. Save/load restore them per-type; legacy NULL rows recovered best-effort. Needed a live D1 `ALTER TABLE` (Peter ran it 2026-07-23). | `6eaf85a` |
| 72.11 | `checklist.idealTraitChecks`/`avoidChecks` (never in D1) and manual tracker data (revenue/profit/ocf/fcf typed into the table) wiped on every d1Mode reload / next API fetch. | Preserve idealTrait/avoid from localStorage (`==null` guard); `ensureChecklist` inits them. Route manual edits through `company_data_overrides` (`overriddenData`/`_origData`) so they persist cross-device and re-apply over fresh API data. | `8aea7eb` |
| 72.12 | Company notes have no natural key → duplicate rows; load used blind last-wins over `ORDER BY note_date DESC`, but date-only ties → OLDEST duplicate clobbered newer note (stale text cross-device). | Load picks freshest duplicate per bucket via `_noteRowNewer()` (updated_at → created_at → higher id), skips soft-deleted. Save only pushes an earnings-quarter note with text or an existing id. | `83403d9` |
| 72.13 | (Same cluster as 72.8) checklist content preserved on reload — flat sections re-rendered blank because the loader re-nested answers the flat renderer couldn't read. | Loader spreads `answer_json` FLAT onto the section value; regression-tested across all section types. | `815857d` |

### Cross-device ID collisions & delete-resurrection (2)

| # | Bug | Fix | Commit |
|---|-----|-----|--------|
| 72.14 | Client minted ids as per-device `max(id)+1` → two unsynced devices minted the SAME id for different objects; worker `ON CONFLICT(id) DO UPDATE` silently overwrote an unrelated row. Affected positions, transactions, broker_accounts, general/company todos, framework_entries, reviews, research notes. | Replace all 7 mint points with shared `_mintId()` = `(epoch-seconds << 21) \| 21-bit random-seeded per-session counter`. Monotonic per session, under `MAX_SAFE_INTEGER`, collision-resistant cross-device. Frontend-only, no migration. | `0fc3579` |
| 72.15 | Deleting a framework entry, clearing a data override, or deleting a saved valuation removed it locally but never removed the D1 row → resurrected on reload. | New Worker natural-key DELETE route + `NATURAL_DELETE` allowlist (`company_data_overrides`→company_id+metric_key, `valuations`→company_id+label); GET row cap raised 1000→100000. `deleteFwEntry` deletes by id; override-clear + `deleteStock` use the natural-key route. | `cc3c9a2` |

### Encryption at rest (3)

| # | Bug | Fix | Commit |
|---|-----|-----|--------|
| 72.16 | Note fields stored plaintext in D1 (Security v2 Phase C2c). | Encrypt research-note title/content/source_name/source_url + company-note content (title stays plaintext as structural marker). Loaders use `decStrSafe` (preserve ciphertext on decrypt failure); queryable cols stay plaintext. | `cf4dc5b` |
| 72.17 | Personal financial numbers stored plaintext in REAL columns (Phase C2d). | AES-GCM encrypt positions.shares/avg_cost; transactions.shares/price_per_share/total_amount/fees; portfolio_snapshots.total_value; snapshot_positions.shares/price_per_share/market_value. New `decNum()` helper (decrypt→Number, legacy-plaintext passthrough). No schema/worker change (SQLite non-strict). | `4799fda` |
| 72.18 | FI settings JSON (targetAmount/monthlyExpenses/monthlySavings), general_todos titles, company_todos titles stored plaintext despite holding personal data. | Route all three through `encStr`/`decStrSafe`; `decStr` passes legacy plaintext through, so existing rows load and re-encrypt on next save. | `5bc8b52` |

### UI fixes (3)

| # | Bug | Fix | Commit |
|---|-----|-----|--------|
| 72.19 | SW-update "New version available" toast showed raw HTML `<a>` as literal text (showToast uses textContent) and wasn't clickable. | Use plain i18n key `sync.newVersion` (EN+HU) + `opts.onClick` so the whole toast is clickable to activate the waiting SW and reload. | `af052d9` |
| 72.20 | No way to confirm a reload loaded the latest deploy. | Show `APP_VERSION` at sidebar bottom + in Settings. Must stay in sync with sw.js `CACHE_NAME` on each deploy. | `a720745` |
| 72.21 | D1-connected status dot (`margin-left:auto`) pushed the HU/privacy/theme buttons right; theme toggle overflowed the 240px sidebar and was clipped on desktop. | Reduce sidebar-logo gap 10→6px, horizontal padding 20→16px. | `81903d1` |

**Remaining (deferred to S2 cross-device completeness):** see `docs/KNOWN-ISSUES.md` § Sync Audit (SA.1–SA.5) and `docs/ROADMAP.md` § Data Sync Audit — localStorage-only fields → D1, non-stock positions cross-device, and soft-delete tombstones for framework/override/valuation.

---

## Category 73 — S2a Cross-Device Sync + SW Auto-Reload (2026-07-23)

**Trigger:** S2 cross-device completeness work. Two features landed (dashboard widget config + screener presets now sync to D1 via `app_settings`; Service Worker updates now auto-reload with no manual hard-refresh) plus 4 defects caught by adversarial QA agents / browser testing. Commits `e8aacb0` (S2a-1) + `8803d3c` (SW auto-reload). Frontend-only, sw.js v28→v30.

| # | Bug | Fix | Commit |
|---|-----|-----|--------|
| 73.1 | New `app_settings` keys (`widget_config`, `screener_presets`) never reached D1: the worker single-item `PUT /api/app_settings/:key` is UPDATE-only (index.js:594) → 0 rows for a brand-new key → 404 → `API.put` throws → "cloud save failed" toast, row never created. (Latent for the whole app_settings family; siblings only work because /migrate seeded their keys.) | Client savers use `POST app_settings/batch` (`INSERT OR REPLACE`, index.js:1059) which creates the row on first save. | `e8aacb0` |
| 73.2 | SW auto-reload's "pending save" guard was dead: it read `window.API`, but `API` is a top-level `const` (index.html:4967), not a window property → `window.API` is `undefined` → the whole in-flight/pending-save guard was skipped, so an auto-reload could interrupt a debounced D1 save. | Reference `API` bare via `typeof API!=='undefined'`. | `8803d3c` |
| 73.3 | SW auto-reload's lock/recovery visibility guard was dead: it used `el.offsetParent!==null`, but `offsetParent` is ALWAYS `null` for `position:fixed` elements (`#lock-screen`, `#recovery-key-modal`), so the check never tripped even when those full-screen surfaces were visible. | Test rendered size instead: `el.offsetWidth>0||el.offsetHeight>0`. | `8803d3c` |
| 73.4 | SW auto-reload could loop during a deploy's CDN propagation window: GitHub Pages edges serving different `sw.js` bytes + `visibilitychange`→`reg.update()` could ping-pong updates → reload loop the user can't escape. | `sessionStorage` 30s throttle (`_swAutoReloadTs`): if an auto-reload fired within 30s, fall back to the clickable toast instead of looping. | `8803d3c` |

**Features (tracked in ROADMAP.md § Data Sync Audit):** S2a-1 widget-config + screener-presets cross-device sync (boot hydrators `loadDbWidgetConfigD1`/`loadScreenerPresetsD1`); SW auto-reload gated on `_swUpdatePending` (never reloads on first install) + `_safeToAutoReload()` (typing / open overlay / lock / pending-save → fall back to toast) + `visibilitychange`→`reg.update()`.

---

## Category 74 — S2a-2 Per-Company Attr Sync + Single-PUT Upsert (2026-07-23)

**Trigger:** S2a-2 — sync `priceAlerts` / `tags` / `idealTraitChecks` / `avoidChecks` cross-device via 4 new `companies` columns, bundled with the systemic single-PUT→upsert worker fix flagged during S2a-1. Commit `aaff465`, sw.js v31. Requires D1 `ALTER` + `wrangler deploy`. Verified: node:sqlite round-trip (10/10) + in-browser load/save round-trip. Adversarial QA verdict SHIP.

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 74.1 | Systemic: single `PUT /api/app_settings/:key` was UPDATE-only → 404 on a brand-new key | PUT now upserts for natural-key tables (`pk!=='id'`): `INSERT ... ON CONFLICT(key) DO UPDATE`. Fixes the whole app_settings family on a fresh account (previously only worked because `/migrate` seeded keys). id-based PUT (soft-deletes) unchanged. | `aaff465` |
| 74.2 | 4 per-company attrs localStorage-only (SA.1) | 4 nullable TEXT cols on `companies` (`price_alerts` encrypted; `tags`/`ideal_trait_checks`/`avoid_checks` plaintext JSON). Save always emits concrete value; NULL = never-synced (localStorage fallback), `'{}'`/`'[]'` = cross-device clear wins. | `aaff465` |

**QA findings (all accepted, no code change):** (a) one-time transition LWW clobber if a secondary device holds richer unsynced state than the primary that saves first — mitigation: save the richest-state device first post-deploy (KNOWN-ISSUES SA.1); (b) locked-DEK reload can briefly resurrect a cleared price alert until unlock (self-heals); (c) deploy-order hazard — `ALTER` MUST precede `wrangler deploy`.

---

## Deployment Notes

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
- **Service Worker** cache version is `stratos-v3` — browsers auto-update on next visit
- **GitHub Pages** auto-deploys from `web/` via Actions

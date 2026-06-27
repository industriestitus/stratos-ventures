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
| 11 | Dashboard Widget Overflow | `pending` | 2026-06-27 | 3 | 0 |

**Total: 153 fixed, 21 potential (unfixed)**

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

## Category 11 — Dashboard Widget Overflow (`pending`)

### Fixed (3)

| # | Severity | Description | Fix | Location |
|---|----------|-------------|-----|----------|
| 1 | HIGH | FI form number inputs (168px browser minimum) overflow widget by 34px at 3-column layout, visually covering and blocking clicks on adjacent TODO Summary column | Added `min-width:0` to `.db-fi-form .input-group` so inputs shrink to grid cell width | `index.html:581` |
| 2 | MED | `.db-widget` only had `overflow:hidden` at 768px breakpoint — at desktop widths, internal content could overflow widget boundary and overlap neighboring grid cells | Moved `overflow:hidden` to base `.db-widget` rule (all viewports) | `index.html:542` |
| 3 | MED | TODO date input (`min-width:auto`) prevented flex row from shrinking, causing "Add" button to clip outside widget at 3-column widths | Added `min-width:0` to `.db-todo-input input[type=date]` | `index.html:585` |

### Unfixed (0)

None.

---

## Deployment Notes

- **Worker must be redeployed** after commits `9a06c86` (Yahoo proxy auth) and any future Worker changes:
  ```bash
  cd web/cloudflare-worker && npx wrangler deploy
  ```
- **Service Worker** cache version is `stratos-v3` — browsers auto-update on next visit
- **GitHub Pages** auto-deploys from `web/` via Actions

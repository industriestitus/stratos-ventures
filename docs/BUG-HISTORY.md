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

**Total: 496 fixed, 25 potential (unfixed)** — P.3/P.15/P.16 accepted as external limitations. (Cat 83/84/85/87 are QA-clean 0-fix batches; Cat 86 = 1 QA-caught fix; Cat 88 = 1 runtime-state fix; Cat 90 = 6 data-loss fixes from the final security sweep; Cat 91 = 5 adversarial-QA fixes folded into the encrypted-backup feature; Cat 92 = 1 QA collision-id guard in the restore-completeness batch.)

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

## Category 75 — S2a-3 Research-Note Images → D1 (2026-07-23)

**Trigger:** S2a-3 — sync research-note images cross-device via the existing (orphan) `note_images` D1 table. Commit `9c4e6ca`, sw.js v32. **Frontend-only** (table + TABLES entry + generic GET/batch/per-id-DELETE already existed — no worker/schema change). Verified: node:sqlite round-trip (6/6) + in-browser save/load round-trip. Adversarial QA verdict SHIP.

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 75.1 | Latent bug: D1-mode research-note images vanished on reload | The old D1 load path wrote images to a `_images` key, but render/editor read `images` → `e.images` was always empty after a D1 reload, and the localStorage merge also looked for `_images` (which the editor never writes). Load now populates the canonical `images` field. | `9c4e6ca` |
| 75.2 | Images localStorage-only (SA.1) → now sync to `note_images` | Save (`_syncNoteImagesD1`) runs after notes exist in D1 (FK), upserts each image by a client-minted id (no dup growth on a keyless table), encrypts `image_data`+`filename`, `sort_order`=array index (markdown refs images by index), size-chunked under the 5MB body limit; removed images deleted by diffing `_d1ImageIds`. Load groups `GET note_images` by note_id, sorts, decrypts, attaches. | `9c4e6ca` |
| 75.3 | LOW: read-failure reload could re-insert a duplicate image | Image id was minted inside the debounced save, so the synchronous localStorage snapshot held an id-less image; a `note_images` GET failure would restore it without an id and re-insert. Fixed by minting the id at add-time so localStorage always mirrors it. | `9c4e6ca` |

**Known (accepted, deferred → S2c):** cross-device image-delete has no tombstone — a `note_images` row deleted on device A can be re-upserted by a stale device B editing the same note's text. Same class as the framework/override/valuation tombstone gap (SA.3). Single-device unaffected.

---

## Category 76 — S2b Non-Stock Positions Cross-Device (2026-07-23)

**Trigger:** S2b — sync cash/RE/bond positions cross-device. Commit `b8d5778`, sw.js v33. **Needs 2 D1 `ALTER` + worker deploy.** Verified: node:sqlite round-trip (10/10) + in-browser load/save/holder-routing/guard round-trip. Adversarial QA verdict SHIP (8 invariants checked; 1 real bug caught + fixed).

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 76.1 | Non-stock positions localStorage-only (SA.2) | Synthetic holder company per non-stock ticker (`companies.holder_type`) gives the position a `company_id` anchor; kept in `_holderCompanies` (out of tStocks → auto-excluded from all tStocks-iterating views). Detail fields ride the encrypted `positions.details` JSON column (also closes the stock currentPrice/notes gap). `_migrateNonStockHolders` auto-migrates pre-existing positions on first load; `saveTrackerStocks` re-sync trigger syncs first-cycle-unresolved positions. | `b8d5778` |
| 76.2 | QA-caught: ticker collision hides a real company | If a non-stock position reused a tracked stock's ticker, the holder row and stock row fused on the UNIQUE `companies.symbol`, stamping `holder_type` on the real company → it vanished from every tStocks view. Fixed: `savePosition` rejects a non-stock ticker already in `tStocks` (and a stock ticker already a holder) with a clear message. | `b8d5778` |
| 76.3 | QA-caught (self): i18n `{ticker}` interpolated only once | The new collision message used `{ticker}` twice but `t()` replaces only the first occurrence → a literal `{ticker}` would ship. Reworded to a single placeholder. | `b8d5778` |

**Known (accepted):** deploy-window (new frontend + old worker) can briefly show a holder as a bogus company until the worker lands (self-heals); pre-existing positions `ON CONFLICT(id)` vs `UNIQUE(company_id,account_id)` offline-clash class is slightly widened (not introduced) by shared-by-ticker holders.

---

## Category 77 — S2c Soft-Delete Tombstones (2026-07-23)

**Trigger:** S2c — extend `deleted_at` soft-delete to the last four hard-delete sync paths so a delete can't be resurrected by a stale second device (KNOWN-ISSUES **SA.3**, resolved). Commit `19faaf4`, sw.js v34. **Needs 4 D1 `ALTER` + worker deploy (order MANDATORY, see Deployment Notes).** Verified: worker `node --check` OK; in-browser load (localStorage mode) clean console, all 4 handlers defined, v34 indicator. Closes the whole S2 cross-device block.

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 77.1 | framework_entries delete resurrects (SA.3) | `deleteFwEntry` now PUTs `deleted_at` (was hard `API.del`); `loadFramework` skips tombstoned rows. Entry is spliced from the local array on delete → absent from later `saveFramework` batches → tombstone sticks (id-based, re-add gets a fresh id, so no un-tombstone needed). | `19faaf4` |
| 77.2 | valuations delete resurrects (SA.3) | Natural-key delete (`deleteStock`) soft-deletes via the worker route change (no client edit); bulk-delete PUTs `deleted_at` by id; dedicated valuations load skips tombstoned rows. Live `_putSavedStocks` batch sends `deleted_at:null` so re-adding a same `(company_id,label)` valuation un-tombstones it. | `19faaf4` |
| 77.3 | company_data_overrides clear resurrects (SA.3) | Natural-key clear (`_delD1Override`) soft-deletes via the worker route change (no client edit); company-full load skips tombstoned overrides; live save batch sends `deleted_at:null` for natural-key re-add. | `19faaf4` |
| 77.4 | note_images removal resurrects (SA.3, S2a-3 gap) | Removed images PUT `deleted_at` (was hard `API.del`); load skips tombstoned rows, keeping them out of both `n.images` and the `_d1ImageIds` diff snapshot so a stale device stops re-uploading (id-based client-minted id, re-add is a fresh id). | `19faaf4` |

**Worker mechanism:** the natural-key `DELETE /api/{table}?key=…` route now `UPDATE … SET deleted_at` (soft) instead of `DELETE` when the table's `TABLES` cols include `deleted_at`; hard-delete stays for keyless tables. By-id soft-deletes use the existing `PUT {table}/{id} {deleted_at}` path (notes/reviews pattern). GET returns tombstones verbatim — client filters everywhere (no server-side `deleted_at IS NULL`), consistent with notes/reviews.

**Known (accepted):** same stale-writer window as notes/reviews — a second device that still holds the row live and saves BEFORE it loads the tombstone will re-assert it (natural-key tables send `deleted_at:null`; id-based tables just omit it, so their tombstone is stickier). Load-on-startup mitigates. No 30-day trash/purge UI for these four types (unlike notes/reviews) — a tombstone is permanent until overwritten; acceptable (single-user, low row counts).

---

## Category 78 — Tracker Metric + Override Hydration on D1 Load (2026-07-23)

**Trigger:** in D1 mode the tracker showed all-dashes on a fresh reload and a manual data override vanished until the next Refresh All — even though the override was safely persisted in D1 (`company_data_overrides`, confirmed live via `wrangler d1 execute`). Surfaced while smoke-testing S2c. Commit `af214e4`, sw.js v35. **Frontend-only — no worker/schema change, deploy = `git push`.** Verified: in-browser `_d1CompanyToTStock` mock round-trip (live override → top-level field set; tombstoned override → skipped) + cacheOnly no-op path.

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 78.1 | Manual override invisible after reload | Root cause: D1 stores live metrics only in `api_cache` (never on `companies`), and `_d1CompanyToTStock` loaded overrides into `overriddenData` but not onto the top-level metric fields the tracker cells read (`stock.marketCap` etc.) — only `_fetchStockDataInner` (~12021) did, and that runs only on an API fetch. Fix: `_d1CompanyToTStock` now applies `overriddenData` to top-level fields after building it, so an override shows on a pure reload. Tombstoned (`deleted_at`) overrides are still skipped first (S2c intact). | `af214e4` |
| 78.2 | Tracker list empty until manual Refresh All | Fix: cache-first hydration on load. `cachedFetch`/`_fetchStockDataInner`/`fetchStockData` gain a `cacheOnly` mode that reads `api_cache` **read-only and never calls the live API** (no quota/rate-limit cost); `loadTrackerStocks` backgrounds a `cacheOnly` pass over all stocks (post-paint via `setTimeout`) so the list shows last-known metrics + overrides immediately, matching localStorage-mode behavior. Stale/uncached stocks stay blank until a manual Refresh All (live data is still on-demand by design). | `af214e4` |

**Note:** metrics remain **cache** (`api_cache`, TTL-based), not permanent company columns — market data goes stale by nature. This change only makes the last-cached values visible on load instead of requiring a manual refresh. **Superseded by Cat 79** — the per-stock `cache-check` hydration this introduced was replaced (it caused a rate-limit regression).

---

## Category 79 — Tracker Hydration Rate-Limit Regression (2026-07-23)

**Trigger:** the Cat 78 (v35) hydration fired a per-stock `API.get('cache-check/{id}/stock_data')` for all ~34 tracked stocks on every tracker load. A load already makes ~55 `/api/` requests; +34 → ~90. The worker rate-limits `/api/*` at **120 req / 60s per isolate** (`RATE_LIMITS.api`), so a reload / reload+save / 2nd reload within the minute crossed 120 → intermittent **429** (returned as a normal Response → invisible in `wrangler tail`, only visible as a red 429 in the browser Network tab) → *"Cloud save failed (trackerStocks)"* + intermittent metric display. Root-caused via `wrangler tail` (34 `cache-check/N` per load + "sampling mode due to high volume"). Commit `d9c4ad6`, sw.js v36. **Needs `wrangler deploy` (worker) + `git push` (frontend) — worker FIRST.**

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 79.1 | 34-request burst per load → rate-limit 429s | Root cause: D1 keeps live metrics only in `api_cache` (not on `companies`), so v35 hydrated the tracker with 34 per-stock `cache-check` GETs. Fix: fold the cached metrics into the `/full` response the load ALREADY fetches once per company — `handleCompanyFull` returns `cachedStock` (one extra indexed `api_cache` SELECT in the existing `Promise.all`), so hydration needs **ZERO new requests**. Removed the v35 `cache-first` hydration + all `cacheOnly` plumbing. `_d1CompanyToTStock` merges `c.cachedStock` via a shared `_applyMarketData` helper (extracted from `_fetchStockDataInner`, byte-for-byte behavior) then applies overrides on top (S2c tombstones still skipped, overrides win, holders unaffected). Load request count back to ~55 (pre-v35). | `d9c4ad6` |
| 79.2 | QA-caught: `cachedStock` could ship plaintext private fields | `api_cache` `stock_data` is written as a snapshot of the WHOLE client stock object (`fetchYahooData` returns the live tStock), so a cached row carries plaintext copies of encrypted fields (thesis/notes/checklist/override values) + client-only state. Fix: `handleCompanyFull` sanitizes `cachedStock` to market-only fields (`CACHE_STOCK_STRIP` denylist) before returning it → no private/stale content in `/full`. The at-rest copy in `api_cache` itself (cache WRITE path) is a separate pre-existing concern → KNOWN-ISSUES **SV.6** + spawned task. | `d9c4ad6` |

**QA:** 4 parallel agents (correctness/regression, rate-limit root-cause, data-safety/security, deploy-safety). Correctness — behavior-preserving refactor, 1 cosmetic diff (dropped `console.warn`). Rate-limit — CONFIRMED resolved (34→0 extra requests); residual pre-existing note: 3+ rapid reloads/60s could still approach 120 via the ~34 `/full` alone. Deploy — no hazard either interleaving; worker-first recommended (no blank-tracker window). Data-safety — surfaced 79.2 (fixed via strip); load path itself data-safe (PRESERVE_FIELDS protects user fields, overrides win, tombstones honored, holders excluded).

---

## Category 80 — api_cache Write-Path Sanitize (2026-07-23)

**Trigger:** Cat 79 (79.2) fixed the READ side (`handleCompanyFull` strips private fields from `cachedStock` before `/full` returns) but the WRITE side was unchanged — `api_cache.data_json` for `stock_data` was still STORED as a whole-object snapshot, so plaintext copies of encrypted fields (thesis, notes, checklist, `overriddenData`, `_origData`) + bulky client-only state (scenarios, valuationHistory, `_bsData`/`_isData`/`_cfData`, tags, priceAlerts, …) sat at rest in D1 — partially defeating Security v2 C2 encryption-at-rest. Tracked as KNOWN-ISSUES **SV.6**. This category closes it.

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 80.1 | `api_cache` stored plaintext private fields at rest (SV.6) | `cachedFetch` persisted the raw `_fetchStockDataRaw` result verbatim; that result is `{...yahoo}` where `yahoo` starts from the live `tStocks[ticker]`, so it carried every private/client-only field. Fix: new **fail-closed allowlist** `STOCK_CACHE_FIELDS` + `_sanitizeStockCache()` in `web/index.html`; `cachedFetch` sanitizes the `stock_data` payload to market-only fields **before** the `cache-upsert` PUT (`return fresh` unchanged, so the live `_applyMarketData` merge is byte-identical — only the STORED copy is trimmed). Allowlist chosen over the worker's `CACHE_STOCK_STRIP` denylist so any future private field can never silently leak; the trade-off (a new MARKET metric must be added to the list or it won't cache) is the safe failure direction. `historical_charts` (`{incData,cfData,bsData}`), `dividend_history` (raw FMP), `insider_transactions` (raw Finnhub array) confirmed clean — not whole-object snapshots — so no fix needed there. | `5d5cf69` |
| 80.2 | QA-caught: 6 manual tracker fields would be WIPED by 80.1 | Adversarial QA of 80.1 found that `moat`/`risk`/`uncertainty`/`conviction`/`expectedReturn` (manual `edit:1` tracker columns) + `pinned` (pin-to-top) are client-only — no D1 column, not sent by `saveTrackerStocks` — and were **missing from the `loadTrackerStocks` `mergeKeys` rescue** (index.html ~11266). They survived a D1 reload only accidentally, via the same whole-object `api_cache` snapshot that 80.1 removes (and only as fresh as the last Refresh — stale-prone). Without a fix, deploying 80.1 would permanently wipe the user's assessment + pin state on the next reload. Fix: added all 6 to `mergeKeys` so they ride the established localStorage→D1-reload merge (same-device persistence, like `tags`/`scenarios`; cross-device deferred to S2). Net effect: **more** reliable than before (localStorage is always current). Verified via node merge-simulation (all 6 rescued). | `5d5cf69` |

**Verification:** node:sqlite round-trip using the constants extracted from the actual source (`STOCK_CACHE_FIELDS`, worker `CACHE_STOCK_STRIP`, `PRESERVE_FIELDS`) — asserted (a) **zero** private fields stored at rest, (b) all sampled market metrics survive store→worker-read→hydrate intact, (c) no allowlist field collides with the worker denylist. Plus a `mergeKeys` merge-simulation confirming all 6 fields from 80.2 are rescued on a D1 reload. Inline-script syntax check of the edited `index.html` passed. An **adversarial QA subagent** reviewed 80.1 across 5 dimensions (functional-regression field-by-field, hydration-consumer, write-path bypass, sanitizer correctness, typos) — it surfaced 80.2 (the only confirmed issue); A/C/D/E clean. A live browser round-trip was intentionally NOT run — it would write test rows to production D1 (against the data-safety rules); the in-memory sqlite simulation is the safer equivalent.

**One-time cleanup (PENDING PETER, live D1):** existing polluted rows only self-heal when each stock is next refreshed. Purge all at once: `DELETE FROM api_cache WHERE data_source='stock_data';` (backup first; rows self-repopulate clean on next Refresh All). No worker deploy needed for the fix (frontend-only, `web/index.html`) — ships with the next `git push` + sw.js bump.

---

## Category 81 — /api Rate-Limit Raise + app_settings 404→200-null (2026-07-23)

**Trigger:** two issues surfaced while verifying the Cat 79 tracker-hydration fix live. Worker-only (`web/cloudflare-worker/src/index.js`), commits `608c102` + `3970cae`. **Needs `wrangler deploy` (done by Peter 2026-07-23).** 2 QA agents (correctness + security) — both CLEAN, no follow-up.

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 81.1 | 3 rapid reloads still 429'd ("Cloud save failed") | The Cat 79 residual the QA flagged: v36 removed the +34 cache-check burst, but a legit tracker load still fires ~55 `/api` requests (dominated by ~34 per-company `/full`). The `/api` rate limit was **120 req/60s per isolate**, so 3 rapid reloads (~165) crossed it → 429 on the overflow → save-batch fails ("Cloud save failed (trackerStocks)") + some `/full` miss. Fix: raise `RATE_LIMITS.api` 120→**600**/60s (≈10 reloads/min headroom). Only the `api` bucket changed (yahoo/proxy/auth untouched). Single-user, auth-gated → weaker abuse cap accepted (and SV.1's per-isolate limiter never enforced a hard quota-cap anyway). | `608c102` |
| 81.2 | Optional app_settings keys spam red 404s in the console | Never-customized keys (widget_config, screener_presets, scoring_weights, …) 404'd on every load → red "Failed to load resource: 404" lines (browser-generated, not suppressible from JS) + client `.catch` `console.error`s. Fix: the generic `GET /api/{table}/{id}` returns **200 null** instead of 404 when the row is missing, **scoped to `table==='app_settings'`** (all other tables keep a real 404). Every client app_settings loader already guards the value (`if(r){…}` / `if(r&&r.value){…}` / `.catch(()=>null)`), so 200-null → "use default / keep localStorage" with no throw — which ALSO silences the client-side error logs. QA bonus: `exchange_rates_config`'s old 404-throw used to abort the whole rate-load path → now it doesn't (strictly better). | `3970cae` |

**QA:** 2 agents. Correctness — 200-null safe end-to-end (`API._fetch` parses `"null"`→null, all 8 consumers guard it), scope strict, only `api` bucket changed, `node --check` OK. Security — both changes are behind `authenticate()` (401 before the handler), brute-force `auth` bucket isolated from `api`, no info leak (the 200-vs-value existence oracle already existed via 404-vs-200). One informational note folded into KNOWN-ISSUES SV.1: the higher cap theoretically lowers the bar for a credentialed self-DoS D1-quota burn, but the per-isolate limiter never prevented that — no code change warranted.

---

## Category 82 — Security v2 C3: Encrypt Existing Cloud Rows + /migrate Gate (2026-07-23)

**Trigger:** Phase C2 (a–d) encrypted every sensitive column on WRITE, but rows written before C2 went live sat plaintext in D1 and only re-encrypted lazily when saved again (mixed state). C3 adds a one-time client-side migration (Settings → Master Password → Data Encryption → "Encrypt Existing Cloud Data"): a read-only **Scan** counts plaintext fields per table, then **Encrypt** rewrites them in place (upsert by row id, whole fetched row sent back, only affected columns replaced by ciphertext) with a verify-scan at the end. It also purges the orphaned duplicate company-note rows that predate the id-capture fix (loader's `_noteRowNewer` freshest-wins winner survives; tombstones untouched), and the worker now **blocks `POST /api/migrate` with 403** when the E2EE envelope exists (`auth_config.wrapEnc`) — that endpoint clears tables and re-imports raw plaintext client JSON, which would silently undo the encryption. Fail-closed on KV read error. Commit `d176a0a`, sw.js v38. Column rules mirror the C2 savers exactly (16 tables + `app_settings/fi_settings`; tags/checks/broker names/dividends stay plaintext by design).

**Verification:** node:sqlite dry-run harness runs the REAL client code (sliced from `index.html`) + the worker's REAL `TABLES`/batch SQL against the real `d1-schema.sql` — 61/61 assertions (full conversion, round-trip decrypt, no-clobber, tombstones preserved, dup-purge winner logic, idempotent re-run, locked-DEK and busy-guard aborts). 2 adversarial QA agents (correctness/data-safety + security/completeness): both SHIP, 0 critical; column parity confirmed 1:1 against all 23 `encStr` saver sites; DEK never rotated by password change/recovery (stale `dek_cache` is provably the same key).

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 82.1 | Dry-run-caught: partial-row write-back 500s on NOT NULL | First design sent `{id, changed-cols}` only; SQLite checks NOT NULL on the candidate row BEFORE `ON CONFLICT(id)` fires, so any NOT NULL column not sent (companies.symbol, notes.note_date, …) aborted the batch. Fix: send the WHOLE fetched row with affected columns replaced — the worker binds only allowlisted columns, so extras (created_at/updated_at) are ignored and untouched columns keep their just-fetched values. | `d176a0a` |
| 82.2 | QA-caught (F1): busy-guard TOCTOU | The pending-save check ran once, before `showConfirm` — a save scheduled while the dialog sat open (or mid-run) could race the full-row write-back and be reverted. Fix: `_c3SaveBusy()` re-checked after the dialog AND between every table inside `c3Encrypt` (throws → safe, resumable abort). | `d176a0a` |
| 82.3 | QA-caught (F2): notes written back from a stale fetch | The notes table reused the purge-step fetch (staleness window spanned the dup-DELETEs + 4 tables). Fix: every table — notes included — is re-fetched immediately before its own write-back. | `d176a0a` |
| 82.4 | QA-caught (F3): count-only batch chunking could cross the 5MB body cap | 100 large encrypted notes/checklist rows (~1.4× inflation) could exceed the worker cap → 413 abort. Fix: `_c3PostChunked` chunks by BOTH row count (100) and payload size (3MB) for every table (replaces the note_images-only special case). | `d176a0a` |
| 82.5 | QA-caught (F5/6a): misleading partial/restore messages | Verify-pass message omitted remaining dup count; restore toast undersold the merge semantics. Fix: `mp.mig.partial` now shows `{fields}/{dups}`; `sync.restoreEncBlocked` states explicitly that cloud rows absent from the backup are kept and may reappear (merge, not replace) — full encrypted clear-and-restore tracked as C3b. | `d176a0a` |

**Accepted/tracked (KNOWN-ISSUES):** server never enforces ciphertext on batch/CRUD — client-enforced invariant until B3 retires the sync key (SV.7); encrypted restore is merge-not-replace until C3b (SV.8); after migration, pre-C2 notes stop matching the (unused) server-side FTS — search is client-side, no user impact.

---

## Category 83 — Security v2 B3a/B3b-1: Token-Primary Auth + Connection-String Login Removal (2026-07-23)

**Not bug fixes — a QA-clean hardening batch** (kept here per the per-batch doc policy). Part of retiring the legacy sync key (Phase B3), phased for safety. Frontend-only; no worker change, no deploy-order hazard.

| # | Item | Detail | Commit |
|---|------|--------|--------|
| 83.1 | B3a — token-primary auth headers | `authDataHeaders()` now returns `{X-Auth-Token}` ALONE when a device token exists; the legacy `X-Sync-Key` is sent only as a fallback when no token is present. A provisioned device (Peter's) therefore authenticates token-only against the still-dual-auth Worker — which live-proves token sufficiency before the irreversible B3c drops the sync-key fallback. sw.js v39. | `ce69164` |
| 83.2 | B3b-1 — remove legacy connection-string login | Deleted the "sign in from another device" flow: `parseConnectionString`/`generateConnectionString`/`shareConnection`, the `#lock-login` lock view, `loginFromDevice()`, the Settings "Share connection" button, the lock-setup "Already have an account?" link, and `'lock-login'` from the `showLockView()` id list. Fully redundant with master-password login (which onboards a fresh device with no sync key; `DEFAULT_WORKER_URL` is baked in). The connection string only ever encoded the sync key. Unused `login.*` + `settings.shareConnection` i18n keys left in place (inert; swept in Phase D). sw.js v40. | `15f2577` |

**QA:** 4 adversarial agents over the full session diff (`b317341..HEAD`, C3 + B3a + B3b-1) — correctness/regression, security posture, live-production/data-safety, boot-lock integrity + B3b-2 de-risk map. All four **SHIP / SOUND, 0 must-fix**: every removed symbol de-referenced, `showLockView` list matches the 7 remaining lock views exactly, all handlers resolve, token-only auth composes cleanly (Worker `authenticate()` accepts either header), C3 still authenticates token-only, security posture strictly better (SV.3 resolved; one fewer sync-key entry surface). The boot-integrity agent produced the precise B3b-2 brick-hazard map (buildMeta→isEncryptionEnabled, autoLoad→showReauthScreen, boot-branch collapse) now recorded in the handoff memory.

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

## Deployment Notes

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

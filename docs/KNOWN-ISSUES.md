# Stratos Ventures — Known Issues & Tech Debt

**Last Updated:** 2026-07-01

Consolidated from `docs/BUG-HISTORY.md` audit findings, feedback memory, and code review.

---

## Critical / High Priority

### ~~P.4 — Worker: No Rate Limiting (FIXED 2026-07-01)~~
- **Fix applied:** Per-IP rate limiting with in-memory sliding window. Yahoo proxy: 30 req/min, D1 API: 120 req/min. Returns 429 with `Retry-After` header. Auto-cleanup at 1000+ tracked IPs.

### ~~P.1 — No FMP API Call Budget Tracking (FIXED 2026-07-01)~~
- **Fix applied:** localStorage-persisted daily call counter with auto-reset. Warning toast at 80% (200 calls), hard block at 250 with `rateLimited` return.

### ~~P.2 — No Client-Side Cache in Non-D1 Mode (FIXED 2026-07-01)~~
- **Fix applied:** In-memory TTL cache (`_memCache` Map) for non-D1 mode using same `CACHE_TTLS` as D1 cache. Respects `_forceRefresh` flag.

### ~~P.6 — Worker: Company DELETE Not Transaction-Safe (FIXED 2026-07-01)~~
- **Fix applied:** Notes + company DELETE wrapped in `db.batch()` for atomic execution.

### ~~P.7 — Dividend Fetch Dedup Flag Not in `finally` Block (FIXED 2026-07-01)~~
- **Fix applied:** Entire `fetchAllDividendData` body wrapped in try/finally. Flag reset and button restore in `finally` block.

### ~~P.10 — Web Crypto Without Secure-Context Guard (FIXED 2026-07-01)~~
- **Fix applied:** `deriveKey()` checks `window.isSecureContext` and `crypto.subtle` before use, throws descriptive error.

---

## Medium Priority

### P.3 — FMP `/profile` Missing Debt/Cash Data
- **Location:** `web/index.html`
- **Problem:** FMP `/profile` endpoint doesn't return `totalDebt`/`totalCash`. EV/EBIT calculations use 0 for debt/cash on FMP-only stocks.
- **Impact:** Inaccurate EV/EBIT for stocks without Yahoo data.
- **Fix:** Needs separate balance sheet API call, but FMP free tier rate limits make this expensive.

### P.5 — Worker: Yahoo Chart Missing Crumb Auth
- **Location:** `web/cloudflare-worker/src/index.js`
- **Problem:** `/quote/` uses crumb/cookie auth but `/chart/` doesn't. May break if Yahoo enforces auth on the chart endpoint.
- **Impact:** Chart data could stop working without warning.

### P.8 — Service Worker `skipWaiting()` Unconditional
- **Location:** `web/sw.js`
- **Problem:** New Service Worker activates immediately via `skipWaiting()`, potentially disrupting active sessions.
- **Fix:** Use `clients.claim()` strategy or prompt user before activating.

### P.9 — `chInited` Chart Flag Never Resets
- **Location:** `web/index.html`
- **Problem:** Flag set on first chart render, never cleared on navigation. Causes stale chart data when navigating away and back.
- **Fix:** Reset flag on route change.

### P.11 — No File Size Limit on Import
- **Location:** `web/index.html`
- **Problem:** FileReader reads entire file into memory with no size check. Loading a large file freezes the browser.
- **Fix:** Check `file.size` before reading (e.g., reject files > 10MB).

### P.13 — No `fetchStockData` Deduplication
- **Location:** `web/index.html`
- **Problem:** Concurrent calls for the same ticker waste API quota. No in-flight request map.
- **Fix:** Add dedup guard like other fetch functions already use.

### P.14 — `autoSave` Has No Debounce
- **Location:** `web/index.html` — line ~11423
- **Problem:** 100ms setTimeout on every input event causes overlapping saves when D1 sync is slow.
- **Fix:** Use proper debounce (clearTimeout + setTimeout pattern).

---

## Low Priority / Acceptable Risk

### P.12 — Two Inconsistent `parseNum()` Functions
- **Location:** `web/index.html` — lines ~4272 and ~6314
- **Problem:** One returns 0 on failure, the other returns NaN. Different callers get different behavior.
- **Impact:** Low — fallbacks handle both cases, but inconsistency could cause subtle bugs.

### P.15 — `accent-color` Needs Safari 15.4+
- **Impact:** Checkboxes show system color instead of accent — cosmetic only, graceful degradation.

### P.16 — `fetch keepalive` Ignored in Firefox 90-99
- **Impact:** Sync on page close may fail on 4+ year old Firefox. Negligible user base.

### P.17 — `renderPositions` NaN Propagation
- **Impact:** Shows 0 instead of NaN on malformed data. Has `||0` fallbacks — not ideal but non-crashing.

### P.18 — Screener Filter Score Cache Missing
- **Impact:** Recalculates scores on every filter. Unnoticeable at <50 stocks.

---

## Deep Audit Findings (Low Risk)

| ID | Problem | Risk | Notes |
|----|---------|------|-------|
| D.1 | Screener filter keys in onclick not escaped | Low | Keys from hardcoded SCREENER_DEFS constants |
| D.2 | `md.label` in innerHTML without `escH()` | Low | Internal metric definitions only |
| D.3 | `parseInt` without radix in 3 locations | Low | Modern browsers default to radix 10 |
| D.4 | CSV number parsing regex has moderate backtracking | Low | Input is anchored and bounded |
| D.5 | Portfolio grouping uses computed keys (prototype pollution risk) | Low | Ticker regex prevents `__proto__` in tracker; CSV import has no such restriction |

---

## Development Gotchas

Recurring patterns from past QA sessions. These aren't bugs — they're coding pitfalls that have caused bugs before.

### Visual Verification Required
DOM metrics (scrollWidth, offsetWidth) can report correct values while content is actually clipped or invisible. Browser chrome eats into visible area unpredictably. **Always take screenshots** after layout/overflow fixes rather than trusting JS measurements.

### Bottom Padding on Scrollable Containers
Last widget/item in any scrollable container gets cut off at the viewport or nav boundary without padding. **Always add `padding-bottom: 24px+`** to grid/list containers with dynamic content, especially with fixed bottom nav.

### Cascading Layout Fixes
One overflow fix can cause or mask another. Example: `overflow:hidden` for horizontal scroll (Category 11 fix) masked vertical clipping (Category 13/14). **After any overflow/layout fix, test the full chain:** scroll the entire section at multiple viewports, check both axes, check both ends (top/bottom).

### Transform ≠ Hidden (Safari)
Elements hidden with `transform: translateY(100%)` but still `display: block` render as visible bars in Safari. JS metrics pass because the element is technically displayed. Chrome doesn't render it, so QA misses it. **Use `display: none` as the primary hiding mechanism;** only use `transform` for interactive animation states.

### D1 Data Safety
Peter's D1 database is production-only with no staging environment. All investment data, research notes, and valuations are live. **Before any of these operations, stop and warn:**
- D1 schema changes
- `/api/migrate` calls
- Worker redeploy with schema changes
- Raw SQL via wrangler
- localStorage clearing code

**Safe operations:** HTML/CSS/JS edits, adding columns/tables, `wrangler deploy` (code only).

### Session Scope Discipline
Bundling too many tasks per session (e.g., 9 tasks, ~200 fields) compounds bugs and makes QA/rollback difficult. **Break feature expansions into 2-3 tasks per session max.** Commit and QA after each logical group.

---

## Summary

| Priority | Count | Top Action |
|----------|-------|------------|
| ~~CRITICAL~~ | ~~1~~ | ~~P.4 — FIXED 2026-07-01~~ |
| ~~HIGH~~ | ~~5~~ | ~~P.1/P.2/P.6/P.7/P.10 — ALL FIXED 2026-07-01~~ |
| MEDIUM | 6 | Various — incremental fixes |
| LOW | 4 | Acceptable risk, cosmetic |
| Deep Audit | 5 | Low risk, internal data only |
| Dev Gotchas | 6 | Process discipline, not code fixes |

No active `TODO`, `FIXME`, or `HACK` comments found in the codebase — inline technical debt markers are clean.

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

### P.3 — FMP `/profile` Missing Debt/Cash Data (ACCEPTED)
- **Status:** Won't fix — external API limitation. Yahoo Finance data provides debt/cash when available. FMP free tier doesn't expose balance sheet in `/profile`. Separate API call would consume too much quota.

### ~~P.5 — Worker: Yahoo Chart Missing Crumb Auth (FIXED 2026-07-01)~~
- **Fix applied:** Chart endpoint now uses `getCrumb()` for cookie+crumb auth, with 401/403 retry (same pattern as `/quote/`).

### ~~P.8 — Service Worker `skipWaiting()` Unconditional (FIXED 2026-07-01)~~
- **Fix applied:** Removed auto-`skipWaiting()`. New SW waits in `installed` state. User sees "New version available — reload now" toast with click-to-activate.

### ~~P.9 — `chInited` Chart Flag Never Resets (FIXED 2026-07-01)~~
- **Fix applied:** Added `resetCharts()` function, called in `showSection()` when navigating away from companies.

### ~~P.11 — No File Size Limit on Import (FIXED 2026-07-01)~~
- **Fix applied:** 10MB size check added to all 4 FileReader call sites (settings import, backup restore, CSV import, tracker import).

### ~~P.13 — No `fetchStockData` Deduplication (FIXED 2026-07-01)~~
- **Fix applied:** In-flight promise map (`_fetchStockInFlight`). Concurrent calls for the same ticker share one fetch.

### ~~P.14 — `autoSave` Has No Debounce (FIXED 2026-07-01)~~
- **Fix applied:** Proper clearTimeout+setTimeout debounce (300ms) replacing overlapping 100ms setTimeout calls.

---

## Low Priority / Acceptable Risk

### ~~P.12 — Two Inconsistent `parseNum()` Functions (FIXED 2026-07-01)~~
- **Fix applied:** CSV-local version renamed to `csvNum()` (returns NaN for validation). Global `parseNum()` returns 0 for fallback. No more name collision.

### P.15 — `accent-color` Needs Safari 15.4+ (ACCEPTED)
- **Status:** Won't fix — CSS spec limitation. Custom checkbox styling would be disproportionate effort for cosmetic-only issue.

### P.19 — Click-to-Edit Metrics Have Minimal Visual Affordance (DEFERRED)
- **Where:** Company Profile > Key Metrics grid — `cp-overridable` cards are double-click editable
- **Current state:** Has `cursor:pointer` and hover background change, plus "overridden" badge when active. Trigger is double-click (long-press on mobile).
- **Possible improvement:** Add a subtle pencil icon on hover in the card corner. Not urgent — current state is acceptable.
- **Decision:** Reviewed 2026-07-03 — user confirmed current behavior is fine. Tracker table inline edit is intentionally minimal. Revisit if user feedback suggests discoverability is a problem.

### P.16 — `fetch keepalive` Ignored in Firefox 90-99 (ACCEPTED)
- **Status:** Won't fix — browser limitation on 4+ year old Firefox. `sendBeacon()` fallback incompatible with JSON API. D1 mode uses `API.flushAll()`.

### ~~P.17 — `renderPositions` NaN Propagation (FIXED 2026-07-01)~~
- **Fix applied:** `totalPnlPct` guarded with `isFinite()` check, displays '—' instead of 'NaN'.

### ~~P.18 — Screener Filter Score Cache Missing (FIXED 2026-07-01)~~
- **Fix applied:** `_screenerScoreCache` Map caches scores per ticker. Invalidated on `saveTrackerStocks()`.

---

## ~~Deep Audit Findings~~ (ALL FIXED 2026-07-01)

| ID | Problem | Fix |
|----|---------|-----|
| ~~D.1~~ | Screener filter keys in onclick not escaped | All keys/labels escaped with `escH()` |
| ~~D.2~~ | `md.label` in innerHTML without `escH()` | Fixed alongside D.1 — `def.l` → `escH(def.l)` |
| ~~D.3~~ | `parseInt` without radix in 32 locations | Added `,10` radix to all 32 calls |
| ~~D.4~~ | CSV number parsing regex backtracking | Length guard (`s.length>30`) before regex on both `csvNum` and `parseNum` |
| ~~D.5~~ | Portfolio grouping prototype pollution risk | `Object.create(null)` for both grouping Maps |

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
| ~~MEDIUM~~ | ~~6/7~~ | ~~P.5/P.8/P.9/P.11/P.13/P.14 FIXED, P.3 accepted~~ |
| ~~LOW~~ | ~~3/5~~ | ~~P.12/P.17/P.18 FIXED, P.15/P.16 accepted~~ |
| ~~Deep Audit~~ | ~~5~~ | ~~ALL FIXED 2026-07-01~~ |
| Dev Gotchas | 6 | Process discipline, not code fixes |

No active `TODO`, `FIXME`, or `HACK` comments found in the codebase — inline technical debt markers are clean.

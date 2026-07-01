# Coding Lessons — Stratos Ventures Finance App

**Last Updated:** 2026-07-01
**Source:** 171+ bug fixes across 19+ QA sessions (Categories 1-23)

Reference for AI assistants and developers. All lessons are validated patterns from actual bugs found and fixed.

---

## Layout & CSS

### 1. Bottom Padding on Scrollable Containers

**What went wrong:** Dashboard `.db-grid` had no `padding-bottom`, causing the last widget to be clipped at the viewport bottom. DOM metrics reported "visible" even when visually clipped by the page boundary.

**Why repeatable:** Developers focus on content flow inside containers. The scroll edge is invisible until QA manually scrolls to max. `getBoundingClientRect()` doesn't account for browser chrome eating into visible area.

**Rule:** Always add `padding-bottom: 24px+` to grid/list containers with dynamic content, especially with fixed bottom nav.

---

### 2. Cascading Layout Fixes — Test the Full Chain

**What went wrong:**
- Category 11: `overflow:hidden` on `.db-widget` fixed horizontal grid overflow
- Category 13: That same fix caused vertical clipping — TODO items cut off
- Category 14: Removing `overflow:hidden` unmasked missing bottom padding

Each fix only addressed the immediate symptom.

**Why repeatable:** Overflow fixes operate on nested layers (body > content > widget > item). A fix that solves one axis can constrain the other.

**Rule:** After any overflow/layout fix:
1. Scroll the entire affected section at multiple viewport sizes
2. Check both axes (horizontal AND vertical) and both ends (top/bottom)
3. Verify no sibling or parent elements broke
4. Take screenshots to visually confirm

---

### 3. Transform Does Not Hide Elements (Safari)

**What went wrong:** Mobile `.more-menu` hidden with `transform: translateY(100%)` but still `display: block`. Safari rendered it as a visible bar at page bottom. Chrome didn't render it, so QA missed it. JS metrics passed because `display: block, height > 0`.

**Why repeatable:** Developers know `transform` doesn't remove from layout, but test only on Chrome.

**Rule:**
- Desktop CSS: `display: none` (truly hidden)
- Mobile media query: `display: block` (becomes interactive)
- Never use `transform` or `opacity` alone for hiding — only for animation between visible states

---

### 4. Responsive Grid — min-width Safety

**What went wrong:** 40+ elements overflowed viewport at 375px. Dashboard widgets were 404px wide (exceeding 375px container). CSS Grid and Flexbox default to `min-width: auto` — items won't shrink below content width.

**Rule:** Add `min-width: 0` to all grid items and flex children. Test at 8 breakpoints: 320px, 375px, 480px, 768px, 769px, 976px, 1332px, 1440px.

---

### 5. Chart.js Canvas Sizing

**What went wrong:** Chart.js renders canvas with hardcoded pixel dimensions. At 320px viewport, canvas exceeded container, pushing the entire page wider.

**Rule:** Wrap canvas in a relative-positioned container with explicit height. Set `responsive: true, maintainAspectRatio: false` in Chart.js options. Add `max-width: 100%` to canvas CSS.

---

## JavaScript Patterns

### 1. Dedup Guards with try/finally

**What went wrong:** `refreshProfileData()` called simultaneously by click + auto-load. `fetchAllDividendData()` dedup flag not in `finally` block — exception mid-fetch permanently locked the function until page reload.

**Rule:**
```javascript
let _refreshing = false;
async function refreshProfileData() {
  if (_refreshing) return;
  _refreshing = true;
  try {
    await fetchFromAPI(...);
  } finally {
    _refreshing = false;  // ALWAYS reset in finally
  }
}
```

---

### 2. fetchWithTimeout (15s default)

**What went wrong:** API calls hung indefinitely. 429 rate limits not detected. Retry applied to non-idempotent POST/PUT/DELETE, wasting quota.

**Rule:** Wrap all fetches with AbortController timeout. Detect 429 (rate limit) and 401 (auth expired) specifically. Only retry GET requests.

---

### 3. JSON.parse() Error Guard

**What went wrong:** `JSON.parse(localStorage['key'])` crashes when data is corrupted (truncated by quota exceeded, bad manual edit).

**Rule:** Always wrap `JSON.parse()` in try/catch with a fallback return value. Apply to all localStorage reads, `decodeURIComponent()`, and regex parsing.

---

### 4. RAF Debounce for Frequent Recalculations

**What went wrong:** `recalcAll()` fires on every keystroke. Chart.js instances destroyed and recreated on every call. Browser freezes on slow machines.

**Rule:**
```javascript
let _recalcScheduled = false;
function recalcAll() {
  if (_recalcScheduled) return;
  _recalcScheduled = true;
  requestAnimationFrame(() => {
    _recalcScheduled = false;
    // expensive work here
  });
}
```
For Chart.js: update existing instance (`chart.data = ...; chart.update('none')`) instead of destroying and recreating.

---

### 5. isFinite() Over isNaN()

**What went wrong:** `isNaN(Infinity)` returns false — position validation passed Infinity as valid. `||8` returns 8 when value is `0%` — financial calculations broke.

**Rule:**
- Use `isFinite(value)` instead of `!isNaN(value)` — rejects NaN AND Infinity
- Use `??` (nullish coalescing) instead of `||` for defaults — preserves 0, false, empty string

---

### 6. Single parseNum() Function

**What went wrong:** Two `parseNum()` definitions: line ~4272 returns NaN, line ~6314 returns 0 on failure. Different callers get inconsistent behavior.

**Rule:** Define ONE `parseNum(str, defaultVal = NaN)` at module top. Handle US format (1,234.56), null/undefined, Infinity, and already-parsed numbers.

---

## Data Safety

### 1. D1 Write-Through + Read-Fallback

**What went wrong:** Save functions had `if(d1Mode) { scheduleSave(); return; }` — skipped localStorage entirely. TODOs disappeared after refresh because D1 sync was slow and localStorage wasn't written.

**Rule:**
- **Save:** ALWAYS write localStorage first (instant), THEN async sync to D1
- **Load:** Try D1 first, fall back to localStorage on failure
- Pattern: save to both; load from both (D1 primary, localStorage fallback)

---

### 2. INSERT ON CONFLICT for Upserts

**What went wrong:** Worker batch endpoint used `UPDATE ... WHERE id = ?`. New items with locally-generated IDs didn't exist in D1 — UPDATE matched 0 rows, data silently dropped.

**Rule:** Use `INSERT INTO ... ON CONFLICT(id) DO UPDATE SET ...` for all batch operations. Works for both new and existing items atomically.

---

### 3. Destructive D1 Operations Require Warning

Peter's D1 is production-only — no staging environment. All investment data is live.

**STOP and warn before:**
- D1 schema changes (ALTER TABLE DROP, DROP TABLE)
- `/api/migrate` endpoint (wipes all tables first)
- Raw SQL via `wrangler d1 execute`
- Worker redeploy with schema migration code
- localStorage clearing code

**Safe operations:** HTML/CSS/JS edits, adding columns/tables, `wrangler deploy` (code only).

---

## API & Caching

### 1. FMP API Budget Tracking

**Problem:** FMP has 250 calls/day free tier. No tracking means silent quota exhaustion.

**Rule:** Add localStorage-persisted daily call counter. Warn at 80% threshold. Block calls at 100%.

---

### 2. Non-D1 Mode Needs Client Cache

**Problem:** `cachedFetch()` returns `fetchFn()` directly when D1 is off. Every profile view re-fetches everything.

**Rule:** Add sessionStorage TTL cache for non-D1 mode. TTLs: company profile 1hr, earnings 6hr, insider trading 24hr, dividends 7 days.

---

### 3. Rate-Limit Delays Between Sequential Calls

**Problem:** Loops hitting APIs without delay trigger 429 rate limits.

**Rule:** Add 300ms delay between sequential FMP/Yahoo calls in loops.

---

### 4. Service Worker Cache Versioning

**Problem:** Cache version not bumped after code changes — browsers served stale scripts. API responses cached as if static.

**Rule:** Bump `CACHE_NAME` on every deploy. Never cache API calls (FMP, Yahoo, Finnhub) in Service Worker — only static assets.

---

## Testing & QA

### 1. Visual Verification > JS Measurements

**What went wrong:** JS measured `lastItemBottom < viewportHeight` and reported "all content visible." Screenshot showed content cut off. Browser chrome eats into visible area unpredictably.

**Rule:** After any layout fix, take screenshot and visually confirm. If JS says "pass" but screenshot shows clipping — trust the screenshot.

---

### 2. QA Agent Review Before Shipping

Features shipped with: unescaped output (XSS), missing field mappings, incomplete implementations, broken D1 workflows, documentation gaps.

**Rule:** After completing any feature, run QA agent review covering: implementation completeness, security (escaping, injection), logic edge cases, integration with other modules, project hygiene (ROADMAP updated, BUG-HISTORY logged).

---

### 3. Viewport Testing at 8 Breakpoints

Responsive fixes tested at 2-3 sizes missed overflow at boundary widths.

**Rule:** Test at minimum: 320px, 375px, 480px, 768px, 769px, 976px, 1332px, 1440px. Screenshot each. Look for horizontal scrollbar, clipped content, unclickable buttons.

---

## Process

### 1. Session Scope Discipline

**What went wrong:** Phase 11 attempted 9 tasks (~200 fields) in one session. Context degradation, compounded bugs, harder QA/rollback.

**Rule:** Max 2-3 tasks per session. Commit and QA after each logical group. For checklist expansions: ~1-2 sections per session.

---

### 2. Concurrent Save Tracking

**What went wrong:** `scheduleSave` triggered concurrent overlap — duplicate D1 writes. `flushAll()` called twice (beforeunload + visibilitychange), causing race conditions.

**Rule:** Track in-flight saves with promise map. Chain saves for same key. Guard `flushAll()` against re-entrancy with boolean flag.

---

### 3. Multi-Tab Data Sync

**Problem:** Changes in one tab didn't appear in another. localStorage `storage` event only fires on other tabs.

**Rule:** Add debounced `window.addEventListener('storage', ...)` listener. Reload only the affected module, not entire app.

---

### 4. Dirty-Key Recovery for Failed Saves

**Problem:** D1 save failure loses data. No retry tracking.

**Rule:** Track failed save keys in a Set. On next load, reconcile dirty keys by merging localStorage data back. Retry with exponential backoff (2s, 4s, 6s).

---

## Summary

| Domain | Lessons | Bugs Found |
|--------|---------|-----------|
| Layout & CSS | 5 | 40+ (Categories 10-14) |
| JavaScript | 6 | 50+ (Categories 5, 8, 9, 22) |
| Data Safety | 3 | 7 (Category 15) |
| API & Caching | 4 | 30+ (Categories 5, 6, 21) |
| Testing & QA | 3 | 50+ (Categories 9-18) |
| Process | 4 | 15+ (Categories 19-23) |

**Total:** 171+ bugs fixed, 25 lessons, 6 domains.

## Related Documents

- `docs/BUG-HISTORY.md` — Complete bug log by category and commit
- `docs/KNOWN-ISSUES.md` — Remaining unfixed issues and tech debt
- `docs/ARCHITECTURE.md` — System architecture overview

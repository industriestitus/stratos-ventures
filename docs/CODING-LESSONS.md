# Coding Lessons — Stratos Ventures Finance App

**Last Updated:** 2026-07-23
**Source:** 450+ bug fixes across 25+ QA sessions (Categories 1-72)

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

### 7. Never Shadow Global Utility Functions with Local Variables

**Bugs found:** 3 (Category 34: 34.1, 34.2, 34.3 — all CRITICAL)

**Pattern:** Global utility functions (like `t()` for i18n) get shadowed by local variables with the same name. `const t=document.createElement('div')` in `undoableDelete()`, `const t=pfTransactions.find(...)` in `deleteTransaction()`, and `pfTransactions.forEach(t=>{...})` all shadowed the global `t()` translation function, causing `TypeError: t is not a function` crashes.

**Why repeatable:** Single-letter variable names (`t`, `e`, `n`) are common in minified-style code. When a global function uses a common letter, every closure that also uses that letter as a local variable creates a silent bomb.

**Rule:** Never use `t` as a local variable name in this codebase — it's the i18n translation function. Use descriptive names: `el` for DOM elements, `tx` for transactions, `ev` for events. Before introducing any single-letter global function, grep for existing uses of that letter as a local variable.

### 8. String.replace() Only Replaces First Match

**What went wrong:** `s.replace(',','.')` in CSV number parsing only replaced the first comma, so `"1,000"` became `"1.000"` (parsed as 1.0 instead of 1000). EU numbers with multiple dots (`"1.234.567"`) had the same risk.

**Rule:** Always use a regex with global flag for multi-character replacements: `s.replace(/,/g,'')`. The string overload of `.replace()` only affects the first occurrence — this is a JS footgun that silently corrupts data.

### 9. parseInt Radix Placement — Watch the Parentheses

**Bugs found:** 12 (Category 64: 64.1, 64.6-64.16 — 1 CRITICAL crash, 11 HIGH)

**What went wrong:** `parseInt(document.getElementById('id',10).value)` — the `,10` radix is inside `getElementById()`'s parentheses, not `parseInt()`'s. `getElementById` ignores the extra arg, so it works by accident, but `parseInt` runs without radix. Worst case: `parseInt((p.paymentDate||p.date,10).slice(5,7))` — the comma operator evaluates `(expr, 10)` to `10`, then `10.slice()` throws TypeError.

**Why repeatable:** When wrapping a chain like `parseInt(someCall().value)` and adding `,10`, it's easy to put the radix inside the inner call's parentheses instead of parseInt's. The code still works in most cases (modern browsers default to radix 10), so it passes testing.

**Rule:** Always put the radix as parseInt's last argument, outside all inner calls: `parseInt(document.getElementById('id').value, 10)`. Never nest radix inside inner function calls. Watch for comma operators in expressions — `(a||b, 10)` evaluates to `10`, not `a||b`.

---

### 10. `window.X` Is Undefined for Top-Level `const`/`let` Globals

**What went wrong:** A Service Worker auto-reload guard checked `if(window.API){ if(API._flushing)... }` to skip reloading during a pending save. But `API` is declared `const API={...}` at the top level (index.html:4967). In a classic script, `const`/`let`/`class` at the top level create a *global lexical binding* accessible by bare name — but they are **not** properties of `window` (only `var` and function declarations are). So `window.API` was `undefined`, the whole guard block was skipped, and the "don't reload mid-save" protection was silently dead. The code looked correct and threw no error.

**Why repeatable:** `var`/`function` globals *do* appear on `window`, so `window.X` works for most legacy globals and lulls you into assuming it works for all of them. The failure is silent — `window.X` is just `undefined`, so a guard degrades to a no-op rather than crashing.

**Rule:** To read a global that may be a `const`/`let`, reference it **bare** with a `typeof` guard (`if(typeof API!=='undefined'&&API)`), not via `window.`. Only use `window.X` for globals you *explicitly* attached to `window` (as this codebase does deliberately for `window._swUpdatePending` etc.).

---

### 11. `offsetParent` Is Always `null` for `position:fixed` — Don't Use It for Visibility

**What went wrong:** A guard tested `el.offsetParent!==null` to decide whether `#lock-screen` / `#recovery-key-modal` were visible. Both are `position:fixed`, and **`offsetParent` is always `null` for a fixed-position element regardless of visibility** (also null for `display:none` and for `<body>`/`<html>`). So the check never returned true even when those full-screen overlays were showing — the guard was dead.

**Why repeatable:** `el.offsetParent!==null` is a widely-cited "is it visible?" shortcut and works fine for normally-positioned elements, so it passes casual testing on non-fixed nodes. Modals/overlays are exactly the elements most likely to be `position:fixed`, which is precisely where it breaks.

**Rule:** For a visibility check that must also cover `position:fixed` elements, test rendered size — `el.offsetWidth>0||el.offsetHeight>0` (both are 0 under `display:none`, non-zero when laid out) — or `getComputedStyle(el).display!=='none'`. Reserve `offsetParent` for offset-position math, not visibility.

---

## Data Safety

### 1. D1 Write-Through + Read-Fallback

**What went wrong:** Save functions had `if(d1Mode) { scheduleSave(); return; }` — skipped localStorage entirely. TODOs disappeared after refresh because D1 sync was slow and localStorage wasn't written.

**Rule:**
- **Save:** ALWAYS write localStorage first (instant), THEN async sync to D1
- **Load:** Try D1 first, fall back to localStorage on failure
- Pattern: save to both; load from both (D1 primary, localStorage fallback)

---

### 2. INSERT ON CONFLICT — Use the NATURAL Key, Not `id`

**What went wrong (twice):** (a) Worker batch used `UPDATE ... WHERE id = ?`; new items with local IDs matched 0 rows and were dropped. (b) The follow-up used `INSERT ... ON CONFLICT(id) DO UPDATE`, but the client inserts many rows **without an `id`** (only a natural key). `ON CONFLICT(id)` never fires for an idless insert, so re-saving the same logical row raised a UNIQUE violation that 500'd the whole batch, or piled up duplicate rows (`snapshot_positions`, `valuations`, `exchange_rates` grew unboundedly). (Category 72, `36cf706`/`1231c52`/`1d31799`.)

**Rule:** Batch upsert must conflict on the column(s) that actually collide — the table's **natural key** (`ON CONFLICT(snapshot_id, company_id, account_id)`, `(company_id, label)`, `(rate_date, from_currency, to_currency)`, …), falling back to `id` only when the item carries one. Every table that accepts idless inserts needs a declared `conflictTarget`. A UNIQUE index on that natural key is what makes the upsert deterministic — add it in the schema, not just in code.

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

### 4. Client-Only Fields Get Wiped on Reload — Whitelist Every One

**What went wrong:** `loadTrackerStocks` rebuilds `tStocks` from D1 and overwrites localStorage, keeping only a hand-maintained whitelist of client-only fields. Any field NOT in the whitelist and NOT stored in D1 (DCF `scenarios`, `valuationHistory`, `overrides`, `idealTraitChecks`, manual tracker numbers, checklist answers) was silently erased on every d1Mode reload. The data looked saved (it was in memory and localStorage) right up until the next load. (Category 72, `6799d0b`/`8aea7eb`/`815857d`.)

**Rule:** A field that lives only client-side is a reload-erasure waiting to happen. Either (a) give it a D1 home so the load is authoritative, or (b) add it to the merge whitelist with a `local==null ? d1 : local` guard so the load never clobbers unsynced local data. When adding ANY new per-entity field, decide its persistence home in the same commit — never "it's in localStorage for now."

**Corollary — a field that persists only via a side-channel has NO real persistence.** The `moat`/`risk`/`uncertainty`/`conviction`/`expectedReturn`/`pinned` tracker fields were missing from the whitelist yet *appeared* to survive reloads — because the `api_cache` `stock_data` row was a whole-object snapshot of the live stock, so the field rode back in through the cache-hydration path. That accidental round-trip masked the missing whitelist entry for a long time, and it was stale-prone (only as fresh as the last Refresh). When a security fix sanitized the cache-write path (Category 80, `5d5cf69`), the side-channel vanished and the latent erasure became real. Rule: when you find a client-only field "already persisting," confirm it flows through the *intended* path (D1 column or merge whitelist) — not a cache/snapshot/side-channel that a future change can remove.

---

### 5. Client-Minted IDs Must Be Collision-Resistant Across Devices

**What went wrong:** Client minted ids as per-device `max(id)+1`. Two offline devices minted the *same* small id for *different* objects; on sync the upsert's `ON CONFLICT(id) DO UPDATE` overwrote one unrelated row with the other's data — cross-device data loss across 7 entity types. (Category 72, `0fc3579`.)

**Rule:** Never mint sync-bound ids from local sequence position. Use a time-plus-random scheme (`_mintId()` = `(epoch-seconds << 21) | 21-bit random-seeded counter`) so two devices can't independently produce the same id. Keep it under `MAX_SAFE_INTEGER` and monotonic within a session. Route every mint point through one shared helper — scattered `max+1` call sites are how this regresses.

---

### 6. A Local Delete Must Delete the Server Row

**What went wrong:** Deleting a framework entry / data override / valuation removed it from memory + localStorage but, because the client never captured the autoincrement `id`, issued no D1 delete. The row reappeared on the next reload (delete-resurrection). (Category 72, `cc3c9a2`.)

**Rule:** Every delete path must reach D1. If the client knows the row only by natural key, provide a **natural-key DELETE** route (allowlisted tables, full-key-required, bound params) rather than skipping the server call. Note this still leaves *cross-device* resurrection: a hard delete has no tombstone, so a stale copy on another device re-uploads it. The complete fix is a `deleted_at` soft-delete (as notes/reviews use) — track it explicitly if you ship the hard-delete interim.

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

### 5. Sanitize Cache-Write Paths with an Allowlist, Not a Denylist

**What went wrong:** The `stock_data` cache write persisted the raw fetch result verbatim. That result was built by spreading the *live* stock object (`{...tStocks[ticker]}`), so `api_cache.data_json` accumulated plaintext copies of encrypted/private fields (`thesis`, `notes`, `checklist`, `overriddenData`) and bulky client-only state — sitting at rest in D1 and partially defeating field-level encryption. A read-side denylist (`CACHE_STOCK_STRIP`) cleaned what the API *returned* but not what was *stored*. (Category 80, `5d5cf69`.)

**Rule:** When a cache/serialization write derives from an object that also carries sensitive or unbounded fields, filter to an explicit **allowlist** of the fields that path legitimately owns — never persist the object verbatim, and prefer allowlist over denylist. Allowlist fails **closed**: a newly-added private field can never silently leak; the cost (a new legitimate field must be added to the list) is a visible functional miss, which is the safe failure direction for anything security-adjacent. Sanitize at the WRITE, not only the read — a read-side strip leaves the plaintext at rest.

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

## AI Assistant Behavioral Patterns

Self-assessment based on 196+ bugs across 23 QA categories. These are recurring patterns in AI-generated code that require conscious correction.

### 1. Think Failure-First for Async Save/Load

**Pattern:** AI writes the happy path for async persistence and skips failure modes. 14 save functions had early-return bugs that skipped localStorage in D1 mode (Bug 15.1). Dedup flags not in `finally` blocks permanently lock functions on exception (P.7). Closures read live mutable state during async operations (Bug 19.6).

**Rule:** Before writing any async save/load function, answer these questions first:
1. What happens on timeout or network error?
2. What happens if this is called concurrently?
3. What happens if the async part hasn't finished when data is read back?
4. Does the dedup/lock flag reset in `finally`?
5. Does the closure snapshot mutable state at call time?

### 2. Test Both Axes, Both Ends, Both Platforms on First Write

**Pattern:** AI builds for desktop Chrome and retrofits mobile during QA. 40+ elements overflowed at 375px. Chart.js canvases exceeded containers. `transform: translateY` hiding worked in Chrome but rendered a visible bar in Safari.

**Rule:** Before committing any UI change:
- Test at 375px AND 1440px minimum
- Check both scroll axes (horizontal AND vertical)
- Scroll to the very bottom — last-element clipping is invisible without it
- Take a screenshot — JS measurements lie about visual clipping
- If hiding elements: use `display: none`, never `transform`/`opacity` alone

### 3. Apply Defensive Patterns on First Write, Not During QA

**Pattern:** AI knows all the correct defensive patterns but consistently skips them during implementation, only adding them when QA catches the bug. This accounts for 60+ bugs.

**Checklist — apply on every first write:**
- `isFinite()` over `isNaN()` (4 bugs: 8.3, 8.4, 9.2, 20.1)
- `??` over `||` for numeric defaults (2 bugs: 8.6, 8.8)
- `try/finally` on every dedup/lock flag (3+ bugs: P.7, 5.10-5.12)
- `try/catch` on every `JSON.parse()` (3+ bugs: 8.1, 9.7)
- `escH()` on every dynamic HTML insertion (16+ bugs: X.10, 16.1, D.2, 69.5-69.17)
- `_csvEscape()` must prefix `=`, `+`, `@`, `\t`, `\r` with apostrophe to prevent formula injection (bug 69.1)
- `fetchWithTimeout()` on every API call (6 bugs: 5.1, 5.4-5.7)
- `min-width: 0` on every grid/flex child (40+ overflow bugs)
- `padding-bottom` on every scrollable container (3+ clipping bugs)

### 4. Treat External APIs as Scarce Resources

**Pattern:** AI treats APIs as infinite. No call budget tracking, no client-side cache when D1 is off, no rate limiting on the proxy Worker, retry on non-idempotent methods, rate-limit responses cached as valid data.

**Rule:** For every API integration:
- Track call count against quota (warn at 80%, block at 100%)
- Cache responses client-side with appropriate TTLs
- Only retry GET requests
- Add 300ms delay between sequential calls in loops
- Never cache error/rate-limit responses

### 5. Fix the System, Not the Symptom

**Pattern:** AI optimizes for "make the current bug go away" without testing adjacent effects. Categories 11→13→14 required three separate commits for what should have been one careful fix (`overflow:hidden` → vertical clipping → missing padding).

**Rule:** After any layout or overflow fix:
1. Test the full chain of affected elements
2. Check sibling and parent elements for new breaks
3. Verify both axes at multiple viewport sizes
4. If the fix constrains one dimension, check the other

### 6. Assume Concurrency by Default

**Pattern:** AI writes async code as if it runs sequentially. Every save/load, every event handler, every auto-trigger can race with itself or other callers.

**Rule:** For every async function, ask:
- Can the user trigger this while it's already running? (click + auto-load)
- Can the browser trigger this from multiple events? (beforeunload + visibilitychange)
- Can multiple call sites invoke this simultaneously? (autoLoad from 4 places)
- Does the closure capture mutable state that changes during await?

---

## Summary

| Domain | Lessons | Bugs Found |
|--------|---------|-----------|
| Layout & CSS | 5 | 40+ (Categories 10-14) |
| JavaScript | 11 | 55+ (Categories 5, 8, 9, 22, 34, 73) |
| Data Safety | 6 | 28+ (Categories 15, 72) |
| API & Caching | 5 | 31+ (Categories 5, 6, 21, 80) |
| Testing & QA | 3 | 50+ (Categories 9-18) |
| Process | 4 | 15+ (Categories 19-23) |
| AI Behavioral | 6 | 100+ (cross-cutting) |

**Total:** 470+ bugs fixed, 34 lessons, 7 domains.

## Related Documents

- `docs/BUG-HISTORY.md` — Complete bug log by category and commit
- `docs/KNOWN-ISSUES.md` — Remaining unfixed issues and tech debt
- `docs/ARCHITECTURE.md` — System architecture overview

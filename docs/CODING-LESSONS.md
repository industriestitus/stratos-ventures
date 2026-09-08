# Coding Lessons — Stratos Ventures Finance App

**Last Updated:** 2026-08-19
**Source:** distilled from the QA audit log — see `docs/BUG-HISTORY.md` for the categories, counts
and commits. Those numbers are deliberately not restated here: a figure copied out of another
document is a figure that goes stale in one of them.

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

### 6. Out of the Layout Is Not Out of the Text (Cat 124)

**Bugs found:** 1 — a Tracker score cell whose `textContent` read `"853/4"` after the layout had already been fixed.

**Pattern:** a small `3/4` marker was appended inside a table cell to say the score rested on three pillars. Inline, it displaced the digits in a `tabular-nums` column. Moving it to `position:absolute` fixed the *visual* problem completely — and changed nothing about the *text*: an absolutely positioned element is still a child node, so the cell's `textContent` stayed `"853/4"`. A screen reader announced it as one token; a copy of the table pasted `853`. `aria-hidden="true"` plus an `aria-label` on the cell answered the screen reader and left the copy/paste mangled, because `aria-hidden` is not a text-extraction rule.

**Rule.** Positioning changes where a node is *painted*, never whether it is *read*. When a decoration must not join the content, it must not be a node: `content: attr(data-x)` on a `::before`/`::after` is in neither `textContent` nor the copy buffer, and the element's own `aria-label` supplies the meaning. Three separate readers of a cell — the eye, the accessibility tree, and `textContent` (copy/paste, CSV export, any `innerText` scrape) — and a fix aimed at one proves nothing about the other two. **Verify by reading `textContent` back**, not by looking at it.

### 7. A Shared Layer Carries Everything Derived From It — and Everything Hidden Behind It (Cat 125)

**What went wrong:** `.confirm-overlay` sat at `z-index:350` and was raised from inside a dialog at
`9999`, so a **blocking** confirm painted underneath the thing that opened it: invisible, unclickable,
and awaited forever. The profile PDF export was unusable for thirteen versions because of it. Raising
the confirm to `10050` fixed that and immediately broke three other things — none of which mentioned
`.confirm-overlay` anywhere.

**Why repeatable:** a z-index is never a property of one element; it is a position in one ordering
that everything else is implicitly measured against. Two kinds of neighbour break when you move it:

- **Derived constants.** `showPasswordPrompt` hardcoded `ov.style.zIndex='400'` — meaningful *only*
  as "+50 above the 350 base". Moving the base left the passphrase prompt below the class it is
  built from. Grep for the old number, not just the selector.
- **Things that were only ever hidden by being underneath.** The opaque lock screen (`9999`) hid the
  toast container by covering it. No rule said so: `html.app-locked` names `#sidebar`,
  `#main-content` and `#bottom-nav`, and the toast container is a body-level sibling of all three.
  Raising toasts above `9999` made them render on the lock surface — with a ticker in the text.

**Rule:** before changing a z-index, enumerate **every** z-index in the file, including inline styles
and JS-built style strings, and list which pairs can be on screen at once. Then ask the second
question, the one that has no CSS to grep: *what was relying on this element being covered?* And
prefer the smallest move — the toast bump here was reverted entirely, because it was defending
against a case (a toast during a confirm) that no flow actually depends on.

**Corollary — a modal that clears the lock screen must be answered when the app locks.** Once the
confirm outranked `#lock-screen`, a destructive confirm stayed clickable *on top of a locked app*.
`showMasterLogin()` now calls `_confirmCancel()`. Anything that can outrank the lock screen needs the
same treatment.

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

### 7. Don't Police a Shadow-Prone Global — Rename It (Cat 34, closed in Cat 117)

**Bugs found:** 3 CRITICAL (Cat 34), 2 more caught pre-ship (tooltips batch), and a four-year latent exposure across 104 scopes (P.28).

**Pattern:** the i18n translator was the global `t()`. `const t=document.createElement('div')` in `undoableDelete()`, `const t=pfTransactions.find(...)` in `deleteTransaction()` and `pfTransactions.forEach(t=>{...})` each shadowed it, so a `t('key')` in the same scope threw `TypeError: t is not a function`.

**Why the obvious fix was the wrong one.** For a year the rule was *"never use `t` as a local; use `el`, `tx`, `ev`"*, and P.28 tracked the 104 scopes still violating it as work to be done. But `t` is arguably the likeliest local name in JavaScript — transaction, todo, tab, text, tooltip, target, time — so the rule fought the language, needed a comment at each fixed site to stay fought, and would have needed a gate check forever after. **Renaming 104 locals empties the class; renaming the one global closes it.** `t()` became `i18n()`: 683 sites, one mechanical shape, and a local `t` is now just a variable.

**Rule:** a global that a caller can shadow by accident is a naming defect in the *global*, not a discipline problem in the callers. Single- and double-letter global helpers (`t`, `cv`, `fmt`) are the ones at risk — a QA pass in Cat 116 found a local `cv` over the global CSS-variable helper the same week. Give a global a name nobody would reach for as a local, and the whole class of bug stops being reachable. Corollary: **when you retire a hazard, delete the comments that warned about it** — eight `/* \`tx\`, not \`t\` … */` markers survived the rename and each one had become a lie (Cat 117.3).

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

### 12. `btoa(String.fromCharCode(...bytes))` Is a Latent Large-Input Bomb (Cat 91)

**What went wrong:** `b64(buf)` was `btoa(String.fromCharCode(...new Uint8Array(buf)))`. The spread passes every byte as a separate function argument, and once the arg count is high enough the call throws `RangeError: Maximum call stack size exceeded` (engine-dependent, roughly tens-to-hundreds of KB). It had only ever been fed small per-field values in the envelope crypto; the encrypted-backup feature was the first to push a whole dataset (with base64 note images) through it — so the **default** backup path would throw for exactly the users with the most data.

**Why repeatable:** Small-sample tests pass cleanly — the round-trip test used a tiny object and went green. The failure is a pure function of input size, so it stays invisible until real data hits it in production. `Uint8Array.from(atob(s), c=>c.charCodeAt(0))` (the decode side) has no spread and is already large-safe, which makes the asymmetry easy to miss.

**Rule:** Never spread a large/unbounded array into a function. Encode base64 in chunks: iterate the `Uint8Array` in ~32KB `subarray` slices, `String.fromCharCode.apply(null, slice)` per chunk, then `btoa`. Whenever a helper's input grows from "always small" to "possibly large", re-check every `...spread`, `String.fromCharCode`, `Math.max(...arr)`, and `apply` in it, and test at realistic size (MBs), not with a toy sample.

---

### 13. Widening a Return Type to `null` Turns Every `x ? x.y : 0` Caller Into a Liar (Cat 116)

**What went wrong:** Cat 116 made `calcTWR()` return `null` whenever a cashflow or snapshot could not be converted into the base currency — refusing the metric instead of computing it from mixed currencies. `renderDbBenchmark()` read it as `const pfReturn = twrData ? twrData.annualized : 0`, so a **refused** metric became a claim of exactly **0.0%**, and the tile then subtracted the S&P return from that fabricated zero and published the difference as *Alpha*. The batch that existed to stop the app stating wrong numbers had, in one tile, created a new one.

**Why it survives review:** the `? :` was correct when it was written — back then `null` only meant "fewer than two snapshots", where 0% is a defensible placeholder. Widening the return type gave the same `null` a second, incompatible meaning, and nothing at the call site changed or needed to. The defaults look defensive (`|| 0`, `?? 0`, `x ? x.y : 0`) and the result is a plausible number, so no test fails and no console warns.

**Rule:** when you widen a function's return type to include `null`/`undefined`, **grep every caller and read each one** — the compiler cannot help in vanilla JS. Ask of each: does this site distinguish *"not applicable"* from *"could not be computed"*? If it collapses both into a number, it will publish that number as fact. Prefer letting `null` flow to the formatter (`formatMoney(null, cur)` already renders `—`) over defaulting it at the call site, and be suspicious of any `|| 0` or `?? 0` sitting on a value that represents a measurement rather than a count.

---

### 14. `textContent =` Deletes Element Children — and Something Is Always Injected Later (Cat 118)

**Bugs found:** 1 live (all 12 dashboard widget tooltips), 1 cosmetic and still open (P.32).

**Pattern:** `applyI18n()` refreshed every `[data-i18n]` node with `el.textContent = i18n(key)`. That is correct for a node whose whole content is the translated string — and destructive for one that anything else has appended into. `initWidgetTips()` appends the tooltip bubble (`.cp-tiptext`) **inside** the node that carries `data-i18n`, so every `applyI18n()` deleted all 12 bubbles.

**Why it hid for so long.** Both functions run from `DOMContentLoaded`, in an order that happens to be safe. The damage came from a *third* call site reached much later: the dashboard widgets render **lazily** through an IntersectionObserver, so `renderDbFiTracker()`'s own `applyI18n()` fired whenever the user scrolled the FI widget into view — after the bubbles existed, with nothing restoring them until the next `renderDashboard()`. **Ordering that is safe at boot says nothing about a call site that fires on scroll.**

**Rule:** before writing `textContent` (or `innerHTML`) on a node that other code can reach, ask *who else appends into this element*. Grep for the class or tag being injected, not just for the write. When a child must survive, preserve it explicitly and scope the selector to **direct children** (`:scope > .x`) — a descendant-scoped rescue silently **re-parents** a nested node's child onto its ancestor, which is worse than losing it. And when you carve out one exception, resist a second: `applyI18n()` preserves the runtime-injected tooltip and deliberately does *not* preserve `settings.d1Connected`'s static `<span>`, because a translation function that is a list of exemptions is no longer readable (P.32).

### 15. Never Key UI State on Translated Text (Cat 121)

**Bugs found:** 12 buttons across two tab strips; invisible in English, total in Hungarian.

**Pattern:** `b.classList.toggle('active', b.textContent.toLowerCase()===name)`. It compares the button's **rendered label** to an internal identifier. In English `"Charts"` happens to equal `"charts"`, so it worked and kept working for as long as nobody switched language. In Hungarian the label is `"Grafikonok"`, nothing ever matched, and **no tab was ever marked active** — the user could not see which one they were on.

**Why it survived:** the developer and the test pass were both in English. i18n bugs of this shape are invisible from the default locale by definition, and no amount of English testing will surface one.

**Rule:** UI state binds to a stable attribute — `data-tab`, `data-section` — never to text a translator can change, and never to array index either (which the portfolio strip used, and which breaks on reordering instead of on translation). This codebase already had the right pattern in the sidebar (`b.dataset.section===name`); the two broken strips were the outliers. **When you add an i18n layer, every `===` against a user-visible string becomes a latent bug.** Grep for `textContent===`, `.textContent.toLowerCase()===` and `innerText` after any translation work — and note that `#pf-chart-periods` at `index.html:7443` still does this, safe only because `1M`/`3M`/`ALL` are not translated *yet*.

### 16. One Shape Assumption in a Shared Loop Kills Every Branch (Cat 121)

**Bugs found:** 7 in `_gsSearch` — global search returned nothing for years for anyone who had written a review.

**Pattern:** `(r.answers||[]).map(...)` where `answers` is an object. `||` only substitutes for null/undefined, so a wrong-but-truthy value sails straight through the guard that looks like it is protecting you. `.map` is undefined, the function throws — and because global search aggregates companies, positions, transactions, notes and reviews into **one** try-less function, a single malformed record in any one source silently blanks **all** of them.

**Why this class recurs:** the data is user-supplied. `doImport()` and `doRestore()` assign backup contents verbatim, so a field's type is an assumption, not a fact. The codebase already knew this in places — `p.ticker||''` when saving, array guards on `tags` — and `_gsSearch` was the one consumer that trusted everything.

**Rules.** (1) `x||[]` guards against *absence*, never against the *wrong type*; use `Array.isArray(x)?x:[]` and a `String(v??'')` normaliser at every boundary where user data meets a method call. (2) **An aggregating loop needs per-source containment**, or one bad record costs you every source. (3) When you find a shape bug, **fix the class, not the line** — the first pass here fixed the one reported instance and QA found six identical ones still live. (4) A throw in a render path that assigns its output at the end leaves the *previous* output on screen, so the failure looks like indifference rather than an error; catch and say so.

### 17. A Chokepoint Only Works If Everything Actually Goes Through It (Cat 122)

**Bugs found:** 1 CRITICAL — the Snapshots panel kept printing `0 Ft` and a fabricated `-100.0%` while every other consumer had correctly fallen back to `—`.

**Pattern:** Cat 116 built `snapshotInBase()` so that one refusal would propagate everywhere: refuse in the helper, and TWR, Alpha, the hero delta, the benchmark and net worth all degrade together. Cat 122 leaned on exactly that guarantee — and did not check who calls it. `renderCloudSnapshotsList()` printed `formatMoney(s.totalValue,…)` directly and built its own delta from `baseSum(...).add(s.totalValue)`. So on the one screen dedicated to snapshots, the refused number was still on display, next to a TWR that had already given up.

**Why this is worse than the original bug:** a wrong number everywhere is at least consistent, and a user reads it as one fact. **A screen that mixes `—` with a confident wrong number invites the reader to trust the confident one** — the dash looks like a rendering gap and the number looks like data.

**Rules.** (1) When you rely on a chokepoint, **enumerate its callers and prove each one goes through it** — `grep` for the raw field (`s.totalValue`), not for the helper. (2) A helper that is easy to bypass will be bypassed; if the raw field must never be read directly, that is worth saying in a comment at the field's source. (3) **A validity guard must not depend on data that some storage paths drop.** The first version of this fix refused only when `snap.positions` was non-empty — but `savePortfolioSnapshots()` silently drops unresolvable positions and the loader caps at 5000 rows, so the same snapshot was refused from localStorage and accepted from D1. Guard on something every path preserves, or on an invariant the writer enforces (here: `takeSnapshot()` is the only writer and already refuses an empty portfolio, so `totalValue <= 0` is sufficient by itself). (4) **Refusing is not free.** The companion guard here would have made snapshots impossible for bonds, savings and property, which have no market price by nature — under a toast telling the user to refresh prices. If you refuse, name what to fix.

### 18. Guard the Input Per Item, Never the Aggregate (Cat 123)

**Bugs found:** 1 CRITICAL, caught by QA before it shipped — a weighted P/E rendering `24.0` where the truth was `30.0`.

**Pattern:** a corrupt market cap made three valuation ratios collapse to ~1e-9, which `toFixed(1)` published as `0.0`. The first fix filtered the finished **weighted average**: if it rounded to zero, show a dash. That is indistinguishable from correct when the portfolio holds ONE position — which the reporter's did. With five positions and one broken value, the average came back **24.0**: clean, plausible, confident and wrong, and wrong in the *cheap* direction.

**Why it is worse than the bug it replaced.** `0.0` is self-evidently broken and a reader distrusts it. `24.0` is a number a person acts on. **An average is a laundering device** — it takes one impossible value and hands back a plausible one with a straight face.

**Rules.** (1) Filter at the point where a single bad datum is still identifiable — inside the loop, before weighting — not after the arithmetic that hides it. (2) Test a guard with **more than one** item; a one-element aggregate equals its element, so every aggregate-level guard passes that test. (3) When masking a bad value, ask which OTHER consumers read the same field: this one had eight (tracker cells, screener, compare, scatter, profile cards, Money Back, DCF, 10cap), so the refusal belonged at the source — `_applyMarketData`, the choke point every path already passed — with a mirror for the manual-override path that bypasses it. (4) "Positive and finite" is not "plausible": a market cap of `3` is all three. The plausibility test has to come from the domain — here `marketCap/price` is the share count, and a listed company does not have fewer than a thousand shares.

### 19. A Fix Lands in One View; The Number Lives in Several (Cat 124)

**Bugs found:** 1 CRITICAL, caught by QA — Compare mode kept crowning the company with the least data after the Tracker had been fixed.

**Pattern:** the Quality Score is renormalised over the pillars that could be computed, so a 3-pillar `91` can outrank a 4-pillar `75`. The batch marked the partial score on the Tracker and stopped there. Compare mode — whose *entire purpose* is to declare a winner, and which paints the better value green — went on awarding the crown to the score built from less data, which is the most consequential place the defect could survive.

**Rule.** Before calling a display fix done, grep for every renderer of the same field and list them; this number had four (Tracker cell, Compare row, profile PDF, help text). Cat 123 had already taught the same lesson about `marketCap` and its eight consumers. And note the second half: in Compare a *label* was not enough, because the green highlight is an independent claim. **When a view ranks or highlights, ask whether the comparison is still valid, not just whether the number is annotated** — a "best" across two different denominators is an assertion, not a comparison, and the right answer was to withhold it.

## Data Safety

### 0. Before a Purge-and-Reinsert, Strip EVERY Cached FK Row-Id (C3b / Cat 86)

**What went wrong:** C3b clears the cloud then re-inserts local data. `companies.id` has no `AUTOINCREMENT`, so re-inserted rows get fresh rowids. Objects that cached the OLD numeric `company_id` (positions, transactions, notes, reviews) would re-insert with a stale FK → the atomic batch hits an `ON DELETE`/FK violation → **the whole batch 500s and every row in it is dropped** → the next reload's D1→local load overwrites localStorage → permanent data loss. The first implementation stripped the id cache on positions but MISSED transactions/notes/reviews (a QA agent caught it).

**Rule:**
- Before purging + re-inserting, enumerate **every** place a resolved FK row-id is cached — not just the obvious one. Grep the savers for `.companyId`/`.accountId`/`_d1Id`/`_d1ValId` assignments.
- Strip them all so the re-save re-resolves via a STABLE key (ticker/natural key), not a volatile rowid. Give every dependent saver a natural-key fallback (`_tickerToD1Id(ticker)`) so a stripped cache resolves instead of inserting a null/broken FK.
- Prefer `INTEGER PRIMARY KEY AUTOINCREMENT` if rowids must be stable across delete+reinsert — or design the flow to not depend on rowid stability (resolve by natural key).
- Keep the local store as the source of truth during the operation: never read D1→local mid-flow, so a partial failure can't overwrite good local data.

### 0b. Removing the Writer Doesn't Remove Already-Written State (Cat 88)

**What went wrong:** B3b-2 removed the legacy client-side encryption and made `buildMeta()` stop writing `enc_salt`/`enc_verify`/`enc_recovery`. But the OLD values (a brute-forceable password verifier) stayed in KV `user_meta` because nothing overwrote them. The final code-only security sweep missed it — it audited the code, not the stored state. Peter caught it in the browser console.

**Rule:**
- When you retire a field/table/credential, also **migrate or purge the data already written** — deleting the writer leaves stale (possibly sensitive) state at rest.
- A security review must sweep runtime/stored STATE (KV, D1, localStorage, backups), not just the code paths. Grep the actual stored values, not only the savers.
- Prefer a self-healing overwrite on next boot (idempotent, self-terminating) over a one-off manual cleanup, so every device converges.

### 0c. A Helper That Swallows Errors Turns Failure Into Silent Success (Cat 90.2)

**What went wrong:** the C3b restore guard was "clear the `c3b_incomplete` flag only after a fully successful re-save; if it throws, keep the flag → recover next boot." Correct in principle — but the re-save ran through `flushAllAwait`, which did `fn().catch(e=>console.error(e))` + `Promise.allSettled(...)`, so it **always resolved even when every save rejected** (network drop). The guard cleared over a purged-but-empty D1 → total loss, with a green "success" toast.

**Rule:**
- When a **guard, rollback, or commit decision keys off "did it throw?"**, every step it awaits must actually propagate failure. Audit the awaited helpers: a `.catch()` that only logs, `Promise.allSettled`, `try{}catch{/*ignore*/}`, or a fire-and-forget `.catch(()=>{})` all convert failure into a resolved promise.
- Make such helpers **report success explicitly** (`return !anyFailed`) and have the caller act on it, rather than relying on rejection.
- Test the failure path directly (inject a rejecting operation and assert the guard/flag survives) — the happy path passing tells you nothing about the recovery contract.

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

### 7. Upsert-by-id Rescues UNIQUE Conflicts, NOT NULL Ones — Partial Rows Abort

**What went wrong:** The C3 migration's first design updated single columns by sending `{id, changed_col}` through the batch upsert (`INSERT ... ON CONFLICT(id) DO UPDATE`). SQLite evaluates **NOT NULL (and CHECK) constraints on the candidate row BEFORE conflict resolution** — `ON CONFLICT` only rescues uniqueness failures — so any NOT NULL column missing from the item (`companies.symbol`, `notes.note_date`, …) aborted the whole batch with a constraint error even though the target row existed. Caught by the node:sqlite dry-run before it ever touched live data. (Category 82, `d176a0a`.)

**Rule:** An upsert-shaped write is an INSERT first. To do a partial update through an upsert endpoint, either send the **whole row** (fetch → mutate → send back; the worker's column allowlist drops extras) or use a true `UPDATE` path (the PUT-by-id route). And dry-run any bulk write against the real schema — this class of bug is invisible in code review and fatal against live data.

---

### 8. A Restore Must Rehydrate DERIVED Caches, Not Just Authoritative Rows (Cat 92)

**What went wrong:** Restore re-inserted the authoritative `companies` rows (user data + overrides) but left the regenerable `api_cache` (tracker market metrics — price, marketCap, margins, ROIC…) empty, because those live in the cache, not the row. Immediately after restore the in-memory data still showed the metrics, so it looked fine — but the **next reload** hydrated the market cells from the now-empty cache and they vanished, leaving only the persistent overrides. It read as data loss (it wasn't — the metrics were in the backup all along) and was masked until an external API drift meant the live re-fetch couldn't silently repopulate the cache.

**Why repeatable:** "The backup has the data and the restore ran" feels complete, and the gap only shows on a later reload (not right after restore) — the two events are far enough apart that testing the restore itself passes. Any value the app treats as a regenerable cache (derived metrics, computed rollups, fetched marks) is invisible to a row-level restore.

**Rule:** A "complete restore" must re-populate every DERIVED/regenerable cache from the restored data, not only the authoritative rows — otherwise the app self-heals only when the source (API) is up. And when a restore resolves a foreign-key id from restored data (which may carry another device's stale autoincrement id), **re-validate that id against the freshly-rebuilt id map before using it as a write target** (`idMap[cid]===key`) — a stale/colliding id would otherwise write onto the wrong parent's cache.

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

### 4. A Condition That Can Never Be True Hides the Call It Guards

**What went wrong (Cat 113):** `_reRenderCurrentSection()` refreshed the open portfolio sub-tab with `const at=document.querySelector('.pf-tab.active'); if(at)switchPfTab(...)`. The markup is `.pf-tabs .tab`, so the selector never matched — and `switchPfTab` is defined **nowhere in the file**. A `ReferenceError` was one truthy `at` away; instead the app ran for months with the Positions and Transactions panels quietly never refreshing. Someone later patched the dividends tab with a separate line directly below it: the symptom got a workaround, the cause was never read.

**Why it survives review:** it looks like defensive code. `if(x)` around an optional element is idiomatic, so the eye skips it — and because the guard is always false there is no error, no log, and nothing to contradict it. Same shape as this project's fail-open checkers (§ AI Behavioral #14), one layer down: there a guard passed work it should have caught, here a guard suppressed work it was supposed to do.

**Rule:** a call behind a guard is not verified until you have seen the guard be **true** at least once. Check that the selector matches something before trusting the branch, and confirm every function you call is actually defined — a name that appears exactly once in the file is either dead or a typo. When you catch yourself adding a special-case line beside an existing branch that "should" already cover it, read that branch instead of routing around it.

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

### 7. Verify Every Caller Before Deleting a Symbol — a Removal List Can Be Wrong (B3b-2 / Cat 84)

**Pattern:** A large deletion driven by a prepared list (a handoff, a checklist, "remove all these functions") is only as safe as the list. During B3b-2 the removal list named `deriveKey` for deletion, but the **kept** master-password recovery flow calls `recoveryWrapKey`→`deriveKey`. Deleting it would have silently broken recovery (and any low-level helper shared between removed and kept code is the same trap: `hashKey`, `generateRecoveryKey`, `b64`/`unb64` were all shared).

**Rule:** Before deleting ANY symbol, `grep` every reference and classify each caller as *removed* or *kept*. A symbol is only safe to delete when **all** its callers are in the removal set. For shared low-level helpers, default to keeping them. Never trust a removal list verbatim — it predates the current code.

### 8. Never Leave a Boot Gate That Can Hide the Whole App With No Escape (B3b-2 / Cat 84)

**Pattern:** A pre-paint guard (`html.app-locked` → `visibility:hidden` on the shell) is set before JS decides what to show. If any reachable boot branch neither clears the guard nor shows a visible gate, the app is bricked — blank chrome, no way in — and it looks identical to a crash.

**Rule:** When a pre-paint lock exists, prove that **every** terminal boot state either (a) removes the lock and renders the app, or (b) shows a visible gate (which may keep the lock on). Enumerate the branches (token+DEK, token+no-DEK, no-token online/offline, first-run) and verify each in-browser (`offsetHeight>0` on the gate element; a `bricked` assertion = locked ∧ no gate ∧ no shell). Collapsing branches to a single `showMasterLogin()` fallback is safer than N special-cased screens.

### 9. A Cross-Cutting Guard "Before Every X" — Enumerate X by the PRIMITIVE, Not the Call Sites (Cat 95)

**Pattern:** Adding a required gate "before every sensitive export" (an unencrypted-export warning), the obvious pass gated the six Settings-page exporters — and missed four others: a full-dataset "Download JSON" (CRITICAL), a per-company PDF, and two portfolio bulk-CSV exporters that built their own blob inline instead of going through the shared `_downloadCsv`. Listing the call sites you can think of always under-counts; inline/bulk variants and one-off modal buttons bypass the shared helpers.

**Rule:** Find every site by grepping the LOW-LEVEL primitive the action must funnel through — here `a.download=` / `doc.save(` / `URL.createObjectURL` — then classify each as gated / intentionally-ungated (with a reason) / gap. Gate at the shared choke point when one exists (`_downloadCsv`), and for the inline hold-outs add the gate directly. The same method applies to any "before every write/delete/network-call" guard: enumerate by the primitive, not by memory.

### 10. Count Success Where the Data Will Actually Be READ From (Cat 96)

**Pattern:** A restore helper reported "historical data restored for N companies" by incrementing its counter right after writing an in-memory cache — but in D1 mode that in-memory cache is never consulted (`cachedFetch` only reads `_memCache` when `!d1Mode`). So after a failed cloud step (empty id map → every upsert skipped) the user got a green success toast for data that had landed nowhere, then reloaded to empty charts. The same batch had a second flavour: an opt-in checkbox that silently produced nothing when the source cache was cold, still reporting plain success.

**Rule:** A success counter must increment at the point where the write reaches the store that the READ path uses, per mode — not at the first plausible write. And "zero results" from an operation the user explicitly asked for is a WARNING, never a silent success: if the user ticked a box and nothing came of it, say so. Green toasts that overstate what happened are worse than errors — they stop the user from taking the recovery action they still could.

### 11. Grep Every New Top-Level Function Name Before You Write It (Cat 97)

**Pattern:** A new cloud-snapshot module added `deleteSnapshot(id)` to a 17k-line single-file app that already had a `deleteSnapshot(id)` for PORTFOLIO snapshots. Two `function` declarations with the same name in one script are silently legal — the later one wins — so the new Delete button called `API.del('portfolio_snapshots/<id>')`. Both tables start at id 1, both confirm dialogs read "Delete snapshot", and the cloud row stayed in the list afterwards, so the only symptom was a portfolio history point quietly disappearing from the value chart and TWR.

**Rule:** In a single-file app there is no module scope to protect you. Before adding any top-level function, `grep -c "function <name>("` the whole file — and when the new feature shares a noun with an existing one ("snapshot", "backup", "export"), namespace the entire new API (`createCloudSnapshot`, `deleteCloudSnapshot`, …) rather than the one name that happens to collide today. Run a duplicate-declaration scan over all new names as a batch, not one at a time.

### 12. Probe a Drifted External API Before Migrating It — Docs Won't Tell You Which Half Broke (Cat 98)

**Pattern:** FMP's API drifted and five features broke with a mix of 404s and 402s. The vendor docs could not distinguish the causes: they showed the new endpoint names, but marked `limit` merely as "Limited Access", which could have meant the parameter, its value, or the endpoint needed a paid plan. Guessing would have produced a plausible migration that still 402'd. A 17-endpoint probe run through the app's own authenticated proxy (so no API key had to be handled anywhere) answered it in one round trip: `limit<=5` → 200, `limit=10` → 402, i.e. the VALUE was the gate. The same probe also surfaced a **sixth** broken endpoint nobody had noticed (`earning-calendar` → `earnings-calendar`) and confirmed which endpoints were still fine, so they could be left alone.

**Rule:** When an external API drifts, measure before you migrate — a short probe script through the app's existing authenticated path costs one round trip and converts every assumption into a fact, including the ones you didn't think to question. And when migrating a response format, make the parser accept BOTH shapes (`_fmpRows` takes the new flat array and the legacy `{historical:[…]}` wrapper): cached payloads written by the old code outlive the deploy.

**Corollary — never cache a failure.** A fetch wrapper that returns `{a:null,b:null,c:null}` when all its calls failed looks like a valid payload to a TTL cache, so the outage gets frozen in for the full TTL and the fix appears not to work. Distinguish `null` (the request failed → don't cache, don't retry) from `[]` (it succeeded with nothing → cacheable) at every layer.

### 13. A 200 With the Right Shape Can Still Be the Wrong Data — Verify API Migrations Live (Cat 99)

**Pattern:** An FMP migration shipped after unit tests (stubbed responses), an adversarial QA agent, and a documentation review. Running the migrated code against the REAL API in the browser immediately exposed that `/stable/earnings-calendar?symbol=AAPL` returns HTTP 200, a well-formed array, the exact expected fields — and **other companies' rows**. It is the market-wide calendar; `symbol` is silently ignored. The app would have stamped an unrelated company's earnings date, EPS and revenue onto every tracked ticker and synced it to the cloud.

**Rule:** Stubs verify your parsing; only a live call verifies the API's *semantics*. After any external-API migration, execute each migrated call against the real service and assert on the CONTENT, not just the status and shape — "did I get rows for the entity I asked about?" Add the identity filter to the client too (`filter(e=>e.symbol===ticker)`): a parameter the server ignores today may be ignored again tomorrow, and the cost of the guard is one line.

---

### 14. A Checker That Fails Open Is Worse Than No Checker — and `pipefail` + `grep -q` Makes One (Cat 100)

**Pattern:** `docs/check.sh` was written with `set -uo pipefail`. Its secrets check ran `git log --all -S"$KEY" | grep -q .` and reported **"no key in git history"** for a key that is provably in three commits. Cause: `grep -q` exits at the first match, which SIGPIPEs `git`, so the pipeline's status is 141 — non-zero — and under `pipefail` the "found it" branch never runs. A separate defect in the same script searched the whole file instead of the summary table, which masked a missing category row behind an unrelated table; and a helper turned an unmatched regex into a non-fatal warning, so rewording a heading would have silently deleted a check while the script still exited 0.

**Rule:** Verification code needs stricter review than the code it verifies, because a false green stops anyone from looking again. Two habits: (1) **fail closed** — an unmatched pattern, an unparsable cell or an empty capture is a FAIL, never a pass, since "I could not find the claim" is indistinguishable from "the claim is wrong"; (2) **test a checker against a known-bad input** and confirm it actually goes red. Avoid `producer | grep -q` under `pipefail` entirely — capture the output first, then test it.

**Instances nine and ten, both in one batch, and each teaches something the first eight did not (Cat 114).**

*Ninth — a check whose input comes from outside the repo.* Check 10, the only mechanical guard on the handoff, began `if [ ! -d "$MEMDIR" ]; then warn "…status check skipped"`. `MEMDIR` is derived from `$HOME` plus the checkout path, so on any machine where that resolves differently, **every assertion about `STATUS.md` vanished and the gate still exited 0**. Reproduced with a fake `$HOME` before touching it. **A check whose input comes from outside the repo will one day not find that input, and "skipped" renders as green.** Decide the missing-input verdict in advance and make it the same verdict as the defect — a missing directory and a missing `STATUS.md` both mean "the handoff does not exist". Corollary for any CI plan: never let an environment-dependent check quietly no-op in the environment that lacks it; mark it not-applicable explicitly and name which run is authoritative.

*Tenth — an assertion parked in a branch the prescribed invocation never takes.* Check 6's conventional-prefix and `docs:`-purity tests sat in `elif` arms beneath `if [ -n "$DIRTY" ]`, so they ran **only on a clean tree** — while this very script's header and CLAUDE.md § Shipping a Batch step 7 both mandate running it *with the docs edits still uncommitted*. In the one invocation the process actually prescribes, neither assertion had ever executed. It was not that the check was weak; it was not running. Demonstrated on a throwaway clone: HEAD amended to a subject with no prefix at all went FAIL on a clean tree and **ok** on a dirty one.

**The rule the tenth adds: test a checker in the invocation your process prescribes, not in the one that is convenient to type.** A green run proves nothing about the branch it did not enter, and "I ran it and it passed" is the sentence that hides this class of bug. When a check mixes *properties of the commit* with *state of the working tree*, split them — the first are true regardless of the second, and burying them together is what let this survive ten batches. Related: § JavaScript 0b (a condition that can never be true hides the call inside it).

**Eleventh — the check answered a question nobody had asked (Cat 115).** Check 1 compared `APP_VERSION` against `sw.js` `CACHE_NAME` and reported them equal. They *were* equal — and would have been equal just as reliably if app code had shipped with no bump at all, which is the failure that actually costs you a deploy. **Two values that never moved are also in agreement.** The rule is about *motion*; the check measured *position*. Rewritten to assert that the last commit touching app code moved both markers in that same commit.

**And then the fix repeated the defect.** The replacement asserted that the last app-code commit's diff *added lines mentioning* both markers — which a re-add of the identical value satisfies. QA reproduced it: reflow those two lines, ship a real app change, and the check reported `ok … moved both markers together` while nothing had moved. **A batch written to stop a check measuring position instead of motion shipped a check measuring position instead of motion.** The working version reads both parsed values on both sides of the commit, requires them to differ, and prints the transition (`v56 → v57`) so the claim is legible rather than merely asserted. *If you catch yourself writing "necessary but not sufficient" about someone else's check, read your replacement back with the same sentence.*

**Twelfth — and the first outside a checker: the same defect in a SCOPE COUNT (Cat 116).** `KNOWN-ISSUES` P.29 stated the bug lived at **16 sites**, and showed its work: `grep -c 'convertCurrency(.*)||'`. The real figure was **34 across 17 functions** — `?? amt` and `isFinite(cv)?…:else if(isFinite(raw))` are the identical fallback in different syntax, and the grep asked *"how many places spell it with `||`"* when the question was *"how many places add an unconverted foreign amount to a base-currency sum"*. **A number with its method written beside it is more persuasive, not more true.** Worse, **4 further sites mixed currencies without ever calling `convertCurrency()`** — a snapshot-to-snapshot delta, an index-to-100 chart, an account rollup, a tooltip labelling a dollar amount with the base currency code — so no grep for that function could ever have reached them; they were found only by opening the app and reading a `+33900.0%` off the screen.

**Thirteenth — the corrected instrument has a shape too (Cat 117).** Cat 116's lesson was *use a parser, not a grep*, and Cat 117 did: `acorn` scope-resolution replaced P.28's grep census and corrected **~110 scopes** to **104**, split 13/90/1 rather than 15/91/4. It also answered the question the grep could not — how many of those scopes *call* `t()` — and the answer, **zero**, is the one that tells you whether an entry is urgent. But the AST census still missed **2 live call sites**, because they sit in a static inline `onclick` attribute: HTML text, not JavaScript, until the browser makes it so. They surfaced only by diffing the file's **691 textual `t(` occurrences** against the **680** the parser accounted for and reading all ten of the remainder by eye. **Every census has a blind spot exactly where its input stops being the thing it parses.** So the discipline is not "use the better instrument" — it is *cross-check two instruments with different blind spots and account for the residue, item by item*.

**Fourteenth — measuring downstream of the code you are repairing (Cat 118).** The sharpest of the four, because the measurement was not merely incomplete — it could only ever report the behaviour under repair. Fixing `applyI18n()`'s destruction of child nodes needed to know how many `[data-i18n]` elements have element children. The census was run **in the live DOM**, and returned *"12 with children, **0** whose first child is not a text node"* — a number produced entirely by the old `textContent` having already flattened every node before the tape measure arrived. The source markup says **one** element has a child, and it *begins* with that child, so the fix built on that census inserted the translation in front of the surviving English and duplicated a paragraph. Re-measured by fetching the page and parsing it with `DOMParser` — the markup as served, on which no script has run — the answer was immediate and different.

**Fifteenth — a break-test you designed yourself measures your imagination, not your code (Cat 119).** The i18n gate check was break-tested before anyone was asked to trust it: **nine** deliberately broken copies of `index.html`, every one correctly failed, in the invocation the process prescribes. QA then wrote thirty and found **five fail-opens** — in a script whose own header states *"a check must never fail OPEN"*. The worst let a comment satisfy the contract: the assertion matched a regex from `function applyI18n(){` to the first newline, and `applyI18n` is the last thing on its line, so a trailing `// TODO restore :scope > .cp-tiptext and documentElement.lang =` satisfied **both** halves while both defects were fully reintroduced. Another reproduced check 4's *"enumerates the one spelling it has seen"* antipattern verbatim, written by an author who had read that warning in the same file an hour before.

**Sixteenth — a green gate and a clean QA pass certify the repository, not the product (Cat 121).** Five consecutive batches shipped with `docs/check.sh` green, an adversarial QA agent run over each, and a "Verified live" section in the handoff. Then the app's owner spent an hour with `TEST-PLAN.md` and found that **global search had never worked** for anyone with a single review, that **no tab was ever highlighted in Hungarian**, and that a documented keyboard shortcut **could not work in any browser**. None of the three is subtle. All three were invisible to everything the project had built to catch defects, for the same reason: an agent verifies the code it just changed, against data it seeded itself, in the language it wrote the code in.

**What this changes in practice.** KNOWN-ISSUES **P.30** says the gate cannot see whether QA ran or whether anyone opened the app; this is what that costs. The mitigations are cheap and were all absent: **switch the language before testing** (an English-only pass cannot see an i18n bug by construction); **read the console** — the `TypeError` that killed the search had been sitting there the whole time, and the owner's pasted console log diagnosed in seconds what a symptom description could not; and **seed data with the shapes production actually produces**, not the tidy ones you have in mind — the same lesson as Cat 120's D1-shaped checklist, one level up.

**Why the nine proved so little:** they were the failure modes the author had in mind *while writing the checks*, so they test the same model twice. The mutations that found holes were the ones nobody had modelled — an attribute in a different quote style, a lazily-loaded script tag, `t` used as a value rather than called, a dictionary that is not an object literal.

**Rules.** (1) **Assert contracts on the syntax tree, not on text.** A comment cannot satisfy an AST, and reformatting cannot break one; a textual assertion fails both ways at once. (2) **A `continue` inside a checker is a fail-open with a friendly face** — every "cannot read this, move on" must be a FAIL that names what it could not read. (3) **Have someone else write the break-tests**, or at minimum write them from the *defect* you fear rather than from the code you wrote. (4) **A false positive is a fail-open by a longer route:** a gate that red-lights correct work gets `--no-verify`'d, after which it guards nothing — which is why five of this batch's fixes were for checks that were too strict, not too loose.

**The rule this adds: when you measure to justify changing X, make sure X has not already run on what you are measuring.** A DOM is not markup; it is markup plus everything that has executed since. Prefer the artifact as served, as parsed, as committed — and when only the live state is available, say which one you measured and why it is the right one. Instances twelve through fourteen are the same defect at three altitudes (grep, AST, DOM), which is the argument for stating a count's *provenance* beside it every time.

**The rule this adds: a scope count is a claim, and it inherits the shape of the query that produced it.** Before trusting one, state the defect in prose, then ask whether the query you ran could miss an instance that matches the prose but not the syntax. And when the defect is "two things that should not be combined get combined", the authoritative search is over the *combining*, not over the helper that usually does it — the instances that skip the helper entirely are both the hardest to find and the most wrong.

**The generalisation, and the reason this one is worth its own entry: all four leaks in that batch were the same defect wearing different clothes — a check that returns a verdict on a question adjacent to the rule rather than the rule itself.** Comparing two values that both stood still. Warning about a rule stated without exception, where the entire failure mode is that nobody notices — which is what a non-blocking warning guarantees. Asserting that a handoff has the right five headings and calling it verified, while its body described a tree two commits stale. And a gate that only ran when someone remembered to run it. Every one of them printed `ok`. **When you write a check, say out loud the sentence it licenses — "therefore the version was bumped", "therefore the handoff is current" — and then ask whether the code actually establishes that sentence or merely something near it.** A fail-open at least has the decency to be silent; this class speaks, and says the wrong thing confidently.

---

## Summary

| Domain | Lessons | Bugs Found |
|--------|---------|-----------|
| Layout & CSS | 6 | 40+ (Categories 10-14, 124) |
| JavaScript | 19 | 55+ (Categories 5, 8, 9, 22, 34, 73, 116, 121-124) |
| Data Safety | 11 | 34+ (Categories 15, 72, 82, 86) |
| API & Caching | 5 | 40+ (Categories 5, 6, 21, 80, 98, 99) |
| Testing & QA | 4 | 50+ (Categories 9-18, 113) |
| Process | 4 | 15+ (Categories 19-23, 100) |
| AI Behavioral | 14 | 100+ (cross-cutting, incl. Cat 84 removal-safety + boot-gate, Cat 96 honest-success-reporting, Cat 97 name-collision safety) |

**Total:** 64 lessons across 7 domains.

## Related Documents

- `docs/BUG-HISTORY.md` — Complete bug log by category and commit
- `docs/KNOWN-ISSUES.md` — Remaining unfixed issues and tech debt
- `docs/ARCHITECTURE.md` — System architecture overview

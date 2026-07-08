# Stratos Ventures — Architecture Decision Records

**Last Updated:** 2026-07-03  
**Format:** ADR (Architecture Decision Record) — context, decision, consequences, date

---

## ADR-001: Monolithic HTML File (No Build Process)

**Status:** Accepted (Foundation)

**Context:**  
The app needed to be deployable without npm, webpack, or build infrastructure. Cloudflare Pages requires static assets. Peter preferred minimal deployment friction.

**Decision:**  
Single `web/index.html` file (11,602 lines) containing all HTML, CSS, and inline JavaScript. No build process, no transpilation.

**Consequences:**
- ✅ **Gained:** Zero-config deployment, instant local dev (`python3 -m http.server`), no npm dependencies, 100% static hosting on GitHub Pages or Cloudflare Pages
- ✅ **Gained:** Asset versioning via Git commit hash (no cache busting needed)
- ❌ **Lost:** Code organization — single file is difficult to navigate at 11K+ lines
- ❌ **Lost:** CSS/JS code reuse patterns (no modules or imports)

**Alternative Considered:**  
Single-page app (SPA) build with Parcel, Vite, or Rollup. Rejected due to added build complexity and npm dependency.

**Date:** 2026-03-xx (Phase 0, early foundation)

---

## ADR-002: No Frameworks (Vanilla JavaScript)

**Status:** Accepted (Foundation)

**Context:**  
Initial app had minimal interactive requirements. React/Vue would add 40-80 KB overhead. Peter wanted fast load, easy debugging, and no abstraction.

**Decision:**  
All interaction via vanilla JavaScript: manual DOM manipulation, event listeners, direct localStorage reads/writes. External dependencies limited to Chart.js, Marked, and DOMPurify (loaded via CDN, not npm).

**Consequences:**
- ✅ **Gained:** Minimal bundle (only 3 CDN dependencies: Chart.js 200 KB, Marked 65 KB, DOMPurify 100 KB). Total ~1.5 MB including worker JS.
- ✅ **Gained:** Fast rendering — no virtual DOM overhead, direct DOM updates
- ✅ **Gained:** Full control over lifecycle — no hidden framework re-renders
- ❌ **Lost:** Automatic state synchronization — manual tracking of `tStocks`, `pfPositions`, `researchNotes`, etc.
- ❌ **Lost:** Component reusability — tabs, cards, modals duplicated in HTML/CSS/JS
- ❌ **Lost:** TypeScript type safety — all code is dynamic

**Alternative Considered:**  
Lightweight framework (Preact, Alpine.js). Rejected because vanilla JS was simpler for one-person team and didn't justify added dependency.

**Date:** 2026-03-xx (Phase 0)

---

## ADR-003: localStorage-First Architecture

**Status:** Accepted (Foundation → Superseded by ADR-009)

**Context:**  
Need for offline-first behavior, instant feedback on user edits, and data persistence without cloud dependency. localStorage is available in all browsers.

**Decision:**  
All app data stored in localStorage by default. Structured into versioned keys (`*_v1`, `*_v2`, etc.):
- `tracker_stocks_v1` — company data
- `portfolio_positions_v1` — holdings
- `research_notes_v1` — investment journal
- etc. (16 keys total, see ARCHITECTURE.md § 3)

**Consequences:**
- ✅ **Gained:** Offline capability — app works without internet for reads
- ✅ **Gained:** Instant saves — localStorage sync is <1ms
- ✅ **Gained:** No server dependency for MVP
- ❌ **Lost:** Storage limit ~5-10 MB per origin (can exceed with large note libraries)
- ❌ **Lost:** Data loss if user clears browser cache
- ❌ **Lost:** No structured queries — all data is JSON strings, app-side filtering only
- ❌ **Lost:** No multi-device sync — each device has independent data

**Date:** 2026-03-xx (Phase 0)

---

## ADR-004: Last-Write-Wins (LWW) Conflict Resolution

**Status:** Accepted (Foundation)

**Context:**  
App data can be edited from multiple sources (browser, Worker/D1, manual JSON import). Need a deterministic conflict resolution strategy.

**Decision:**  
All conflicts resolved by timestamp: the entity with the latest `updated_at` timestamp wins. At sync time, use `INSERT ... ON CONFLICT DO UPDATE SET` (SQLite upsert) to replace entire entity, not field-level merge.

**Consequences:**
- ✅ **Gained:** Simple, deterministic resolution — no merge logic needed
- ✅ **Gained:** Works for single-user, single-device primary use case
- ✅ **Gained:** Dirty tracking prevents re-uploading unchanged data
- ❌ **Lost:** No field-level merge — if user edits field A remotely and field B locally, one wins entirely
- ❌ **Lost:** No conflict detection across devices — silent overwrites possible
- ❌ **Lost:** Manual conflict resolution required for truly concurrent edits (rare in single-user app)

**Alternative Considered:**  
CRDT (Conflict-free Replicated Data Type) or vector clocks. Rejected due to complexity and single-user model.

**Date:** 2026-06-27 (Phase 9, D1 migration)

---

## ADR-005: Cloudflare Workers + D1 (Not Firebase/Supabase)

**Status:** Accepted (Foundation)

**Context:**  
Need backend for Yahoo Finance proxy (CORS), cloud data sync, and structured queries. Evaluated Firebase, Supabase, Vercel Postgres, self-hosted VPS, and Cloudflare.

**Decision:**  
Use Cloudflare Workers (edge compute) + D1 (SQLite database). Cloudflare free tier covers 100K requests/day and 5GB D1 storage.

**Comparison:**
| Provider | Cost | Ease | Scale | Notes |
|----------|------|------|-------|-------|
| **Cloudflare** | Free tier sufficient | High | 100K req/day | ✅ Chosen — edge workers, D1 SQLite, free tier covers all needs |
| Firebase | Pay-as-you-go (~$10/mo) | High | Unlimited | No structured queries; Firestore harder to reason about |
| Supabase | Free tier + $25/mo | Medium | Good | PostgreSQL great, but overkill for single-user app; cold starts |
| Vercel Postgres | Pay-as-you-go | High | Good | Same as Supabase, tied to Vercel platform |
| Self-hosted VPS | $3-6/mo + ops | Low | Unlimited | Ongoing maintenance burden; not worth it for hobby app |

**Consequences:**
- ✅ **Gained:** Free tier sufficient for single-user, unlimited data structure flexibility (relational, FTS, FK cascades)
- ✅ **Gained:** Edge compute — Yahoo proxy runs at data center closest to request
- ✅ **Gained:** Integrated with Cloudflare Pages (where app is hosted), no extra integrations
- ✅ **Gained:** SQLite already familiar from desktop reference app
- ❌ **Lost:** Vendor lock-in to Cloudflare ecosystem
- ❌ **Lost:** D1 is newer (2022), less mature than Supabase/Firebase
- ❌ **Lost:** Limited docs compared to Firebase/Supabase (improving)
- ❌ **Lost:** No real-time subscriptions (would need polling or WebSocket)

**Date:** 2026-06-15 (Phase 0, infrastructure research)

---

## ADR-006: Yahoo Finance via Cloudflare Worker Proxy

**Status:** Accepted

**Context:**  
Yahoo Finance has no official API, but unofficial endpoints work via browser user-agent + cookies. Direct browser requests fail due to CORS. Need real-time quotes for European stocks (e.g., `EVO.ST`, `MC.PA`).

**Decision:**  
Cloudflare Worker endpoint `/quote/*` and `/chart/*` proxies Yahoo Finance requests, handling:
- User-agent spoofing
- Cookie and crumb token management (Yahoo's anti-bot measure)
- Response parsing and reformatting
- Automatic retry on transient failures

**Consequences:**
- ✅ **Gained:** Access to 60+ year historical price data for any ticker
- ✅ **Gained:** European stock support (FMP limited to 250/day)
- ✅ **Gained:** Fallback when FMP daily limit exhausted
- ✅ **Gained:** No API key required
- ❌ **Lost:** Yahoo could change endpoint format or disable scraping (fragile)
- ❌ **Lost:** Extra latency vs direct API
- ❌ **Lost:** Rate limiting is soft (no explicit limit, relies on good behavior)

**Alternative Considered:**  
Paid API (PolygonIO, EODHD). Rejected — free tier sufficient, Yahoo is acceptable fallback.

**Date:** 2026-04-xx (Phase 2+, during company profile development)

---

## ADR-007: FMP + Finnhub + Yahoo API Mix (Free Tier Only)

**Status:** Accepted (Foundation)

**Context:**  
App needs fundamentals (balance sheet, income), real-time prices, insider trading, earnings calendar, and news. No budget for paid APIs. Evaluated coverage of 250+ APIs.

**Decision:**  
Three-source strategy:
1. **FMP** (250 calls/day free) — fundamentals, financials (30+ yr), earnings calendar, dividends, insider trading
2. **Finnhub** (60 calls/min free) — real-time prices, analyst recommendations, news, insider sentiment, metrics
3. **Yahoo** (via Worker proxy) — European stocks, historical prices, dividend history, backup when FMP exhausted

**Coverage Matrix:**
| Feature | Source | Cost |
|---------|--------|------|
| Income Statement (30 yr) | FMP | Free |
| Balance Sheet (30 yr) | FMP | Free |
| Cash Flow (30 yr) | FMP | Free |
| Real-time prices | Finnhub | Free |
| Earnings calendar | FMP + Finnhub | Free |
| Dividends | FMP + Yahoo | Free |
| Insider trading | FMP + Finnhub | Free |
| EU stocks | Yahoo (Worker) + FMP | Free |
| News | Finnhub | Free |
| Analyst targets | Finnhub | Free |
| Stock scores (custom calc) | App logic | N/A |

**Consequences:**
- ✅ **Gained:** Comprehensive coverage across all app features
- ✅ **Gained:** No API costs (free tier sufficient for single-user)
- ✅ **Gained:** Redundancy — if FMP quota hit, can use Finnhub or Yahoo
- ✅ **Gained:** Data diversity — less dependent on single vendor changes
- ❌ **Lost:** Rate limit juggling — must track FMP 250/day budget
- ❌ **Lost:** API call overhead — must call 2-3 APIs for full company profile
- ❌ **Lost:** Inconsistent data — different providers have different definitions (EPS, dividend amounts)

**Paid Tier Alternative (Not Used):**  
FMP Starter ($29/mo) alone covers everything. Rejected to keep app free.

**Date:** 2026-06-15 (Phase 0, infrastructure research)

---

## ADR-008: Hash-Based Routing (No Server-Side Routing)

**Status:** Accepted (Phase 9)

**Context:**  
App is static HTML hosted on GitHub Pages / Cloudflare Pages. No server-side routing (no Express, no HTTP rewrite). Navigation must work entirely in browser.

**Decision:**  
All navigation via URL hash fragments:
- `#dashboard` → Dashboard tab
- `#companies` → Companies tab
- `#companies/AAPL` → AAPL company profile
- `#portfolio` → Portfolio tab
- etc.

Browser `hashchange` event listener triggers view switching. Browser back/forward button works via `popstate` listener. Each hash change is logged for recovery on refresh.

**Consequences:**
- ✅ **Gained:** No server routing required — works on any static host
- ✅ **Gained:** Browser back/forward button works natively
- ✅ **Gained:** URL bookmarkable — each view has unique URL
- ✅ **Gained:** No page reloads — single-page app behavior
- ❌ **Lost:** Ugly URLs with `#` (not SEO-friendly, but not needed for private app)
- ❌ **Lost:** Hash fragments sent to server only as path — server can't do auth on hash
- ❌ **Lost:** History stack size (browser limit, but not practical limit)

**Alternative Considered:**  
History API (`pushState`). Rejected because it requires server-side redirect rules (not available on static hosts).

**Date:** 2026-06-27 (Phase 9.1, export/routing session)

---

## ADR-009: D1-Only Cloud Mode (No Offline After Migration)

**Status:** Accepted (Phase 9)

**Context:**  
localStorage limits (5-10 MB) constrain app with large research libraries. D1 offers unlimited storage + queries. Decision: migrate to D1 as primary store, keep localStorage as fallback cache.

**Decision:**  
After Phase 9 migration:
- **Primary:** D1 (cloud) — all writes go to Worker `/api/*` endpoints
- **Fallback:** localStorage — used if Worker unreachable (retry 3x, exponential backoff)
- **Offline:** App requires internet for full functionality (reads work offline via SW cache, writes fail with toast)

**Old offline-capable behavior removed:** Previously, app worked fully offline with localStorage. After D1 migration, offline reads only.

**Consequences:**
- ✅ **Gained:** Unlimited storage, structured queries, FTS search, FK cascades
- ✅ **Gained:** Cloud sync — data accessible from any device
- ✅ **Gained:** Data validation at database layer (FK constraints, triggers)
- ❌ **Lost:** Full offline capability — must be online to edit
- ❌ **Lost:** Offline-first UX promise — users expect mobile-like offline behavior
- ❌ **Lost:** Local data autonomy — users who want to avoid cloud must disable D1 mode

**Alternative Considered:**  
Keep localStorage + D1 sync indefinitely (dual-write). Would add complexity for minimal benefit in single-user model.

**Date:** 2026-06-27 (Phase 9.2, D1 migration session)

---

## ADR-010: Encryption Removed for D1 Data

**Status:** Accepted (Phase 9)

**Context:**  
Phase 0 implemented client-side E2E encryption (AES-256-GCM) for localStorage and KV sync. After D1 migration, data must be queryable server-side (FTS, filters, FK cascades). Encryption prevents these operations.

**Decision:**  
D1 data stored **unencrypted**. Security model shifts to:
1. **Authentication:** `X-Sync-Key` header (custom secret) prevents unauthorized API access
2. **Transport:** HTTPS (Cloudflare enforced)
3. **CORS:** Restricted to configured origins
4. **Cloudflare ToS:** Cloudflare can technically see data, but bound by privacy terms
5. **App-level lock screen:** Optional password protect UI access (doesn't encrypt cloud data)

**Consequences:**
- ✅ **Gained:** Structured queries, FTS search, FK cascades, relational integrity
- ✅ **Gained:** Simpler backup/restore (no decryption needed)
- ✅ **Gained:** Server-side data validation and audit trails possible
- ❌ **Lost:** E2E encryption — Cloudflare admins could theoretically access data
- ❌ **Lost:** Encryption-at-rest for ultra-sensitive data (filings, financial data)
- ❌ **Lost:** User peace-of-mind on privacy (depends on trust in Cloudflare)

**Why Acceptable:**
- App contains research notes + positions, not ultra-sensitive (no bank accounts, no 2FA seeds)
- Threat model: opportunistic hacker, not targeted nation-state
- Alternative (keep encryption + localStorage only) rejected due to lack of cloud features
- Users can continue using app without enabling D1 mode (stay on localStorage only)

**Date:** 2026-06-27 (Phase 9.1, before Session 2; Peter reviewed and approved)

---

## ADR-011: Progressive Web App (PWA) with Service Worker

**Status:** Accepted (Phase 10b)

**Context:**  
Users need to access app from mobile without installation. App should work offline for reads (stale data cached). Need installable home screen icon on iOS/Android.

**Decision:**  
Implement PWA stack:
- **Service Worker** (`sw.js`) — cache-first for assets, network-first for API calls, network-only for external APIs
- **Web App Manifest** (`manifest.json`) — standalone display, theme colors, icons
- **Meta tags** — apple-touch-icon, apple-mobile-web-app-capable, theme-color
- **Icons** — 192x192 and 512x512 PNG with SV branding

**Cache Strategy:**
| Request Type | Strategy | TTL |
|---|---|---|
| HTML, CSS, JS assets | Pre-cache on install | Version update only |
| CDN libs (Chart.js, Marked) | Pre-cache | Fallback if offline |
| Worker/D1 calls | Network-first | Cache fallback |
| External APIs (FMP, Finnhub) | Network-only | No cache |

**Consequences:**
- ✅ **Gained:** Installable on home screen (iOS/Android)
- ✅ **Gained:** Offline reads (cached data visible)
- ✅ **Gained:** Faster repeat loads (cached assets)
- ✅ **Gained:** Standalone display (no browser chrome)
- ❌ **Lost:** SW cache management complexity (must version correctly)
- ❌ **Lost:** Offline writes still fail (no write capability without D1)
- ❌ **Lost:** Cache stale data false comfort — users see old numbers

**Date:** 2026-06-27 (Phase 10b)

---

## ADR-012: Dark Theme Default, Light Theme Toggle

**Status:** Accepted (Phase 10a)

**Context:**  
Initial design used dark theme (bg `#0f1117`, accent `#6c5ce7`). Users might prefer light theme for daytime use. No framework for automatic theme detection.

**Decision:**  
- **Default:** Dark theme (app loads in dark immediately to prevent flash)
- **Toggle:** Sun/moon icon in sidebar header (desktop) and More menu (mobile)
- **Persistence:** localStorage key `app_theme` saves choice
- **Implementation:** CSS variables — `:root` for dark, `[data-theme="light"]` for light override

**Colour Schemes:**

Dark:
```
bg: #0f1117, surface: #1a1d27, text: #e4e7f1, accent: #6c5ce7
```

Light:
```
bg: #f5f6fa, surface: #ffffff, text: #1a1d27, accent: #6c5ce7
```

**Consequences:**
- ✅ **Gained:** User preference support — no eye strain at night or day
- ✅ **Gained:** Modern UX expectation
- ✅ **Gained:** Accessibility for low-light environments
- ❌ **Lost:** No automatic detection (would require `prefers-color-scheme` + observer)
- ❌ **Lost:** Theme persistence requires localStorage (adds 100 bytes)

**Date:** 2026-06-27 (Phase 10a)

---

## ADR-013: Hungarian UI Text, English Code

**Status:** Accepted (Foundation)

**Context:**  
Peter is Hungarian; app is personal financial tracker. Prefer UI in Hungarian for comfort, code in English for maintainability.

**Decision:**  
All user-facing text (buttons, labels, placeholders, error messages) in Hungarian. All code identifiers (variables, functions, classes, comments) in English.

**Examples:**
```html
<!-- ✅ Hungarian UI -->
<button>Mentés</button> <!-- Save -->
<label>Szimbólum</label> <!-- Symbol -->

<!-- ✅ English code -->
const pfPositions = []; // Hungarian: portfólió pozíciók
function savePositions() { /* ... */ }
const d1_dirty_positions = false; // Dirty tracking flag
```

**Consequences:**
- ✅ **Gained:** Comfortable UX for Hungarian user
- ✅ **Gained:** Maintainable code (English code universal)
- ✅ **Gained:** Translation later possible (extract Hungarian strings, replace with i18n)
- ❌ **Lost:** Not accessible to English speakers without translation
- ❌ **Lost:** Translation cost if app expands to others
- ❌ **Lost:** Mixed language UX (app is private, not open-source concern)

**Date:** 2026-03-xx (Phase 0, project setup)

---

## ADR-014: Free Tier APIs Only (No Paid Tiers)

**Status:** Accepted (Foundation)

**Context:**  
App built for personal use with $0/month target. Paid APIs would add operating costs (FMP Starter $29/mo, Finnhub Pro $12/mo, etc.).

**Decision:**  
Use only free tiers of external APIs:
- FMP: 250 calls/day (free tier sufficient for one-user app)
- Finnhub: 60 calls/minute (sufficient for real-time updates)
- Yahoo: Via Worker proxy (no key)
- ExchangeRate API: 1500 calls/month (free tier)

**Consequences:**
- ✅ **Gained:** $0 API costs
- ✅ **Gained:** App remains viable hobby project
- ✅ **Gained:** No recurring billing decision required
- ❌ **Lost:** Rate limits constrain batch operations (e.g., comparing 100+ stocks at once)
- ❌ **Lost:** Feature parity with paid competitors (no earnings call transcripts, no advanced metrics)
- ❌ **Lost:** No SLA or priority support

**When to Reconsider:**  
If app becomes commercial or user base grows to 100+ users, consider paid tiers for scale.

**Date:** 2026-06-15 (Phase 0, infrastructure research)

---

## ADR-015: GitHub Pages Deployment (Static Hosting)

**Status:** Accepted (Foundation)

**Context:**  
App is static HTML. Peter uses GitHub for version control. Free, simple deployment option.

**Decision:**  
Deploy to GitHub Pages:
- Source: `web/` directory pushed to GitHub
- Build: None (static files only)
- Domain: `peterkolozsi.github.io/Finance` (or custom domain)
- SSL: GitHub Pages provides HTTPS

**Alternative Hosts:**
- **Cloudflare Pages:** Similar (pages.dev), preferred for edge compute (Workers co-located)
- **Netlify:** Slightly better UI, same cost
- **Vercel:** Overkill for static app
- **Custom VPS:** Too much ops overhead

**Current Setup:**  
App deployed to both GitHub Pages (backup) and Cloudflare Pages (primary). Cloudflare also hosts Worker backend.

**Consequences:**
- ✅ **Gained:** Free hosting, no ops overhead
- ✅ **Gained:** Git-based deployment (push to deploy)
- ✅ **Gained:** HTTPS included
- ✅ **Gained:** CDN distributed (GitHub Pages on Fastly)
- ❌ **Lost:** No server-side logic (all logic in Worker)
- ❌ **Lost:** Can't do HTTP rewrites (hash routing required)
- ❌ **Lost:** No analytics built-in (privacy benefit, but useful for UX)

**Date:** 2026-03-xx (Phase 0, project setup)

---

## ADR-016: Data Versioning & Schema Migrations

**Status:** Accepted (Phase 9)

**Context:**  
Over 9+ phases, data schema evolved: new fields added, data types changed. Need backward compatibility.

**Decision:**  
Implement versioning system:
1. **SCHEMA_VERSION** constant (currently 8)
2. **MIGRATIONS** array — each entry handles upgrade from version N to N+1
3. **Auto-upgrade on load** — `autoLoad()` checks version, applies pending migrations
4. **Backward compatibility** — old data upgraded transparently, no data loss

**Example Migration:**
```javascript
{
  version: 7,
  run: () => {
    const notes = loadFromLocalStorage('research_notes_v1', []);
    notes.forEach(n => {
      if (!n.id) n.id = generateId(); // Add missing id field
    });
    saveToLocalStorage('research_notes_v1', notes);
  }
}
```

**Consequences:**
- ✅ **Gained:** Safe feature additions without breaking old data
- ✅ **Gained:** Transparent upgrade path
- ✅ **Gained:** No data loss on version jump
- ✅ **Gained:** Test safety — can test migrations before production
- ❌ **Lost:** Migration complexity grows with schema changes
- ❌ **Lost:** Debugging old data format issues (must support all versions)
- ❌ **Lost:** Performance cost (O(n) data scan on load)

**Date:** 2026-06-27 (Phase 9.1, versioning session)

---

## ADR-017: Local-First Architecture with Progressive Cloud Sync

**Status:** Accepted (Foundation)

**Context:**  
Peter values data ownership and offline access. Cloud sync desired but not required. Initial requirement: localStorage, later D1 optional enhancement.

**Decision:**  
Three-tier data layer:
1. **Tier 1: In-Memory** — JS variables (`tStocks`, `pfPositions`, etc.) — page session only
2. **Tier 2: localStorage** — JSON strings — indefinite (until browser cleared)
3. **Tier 3: D1 (opt-in)** — structured SQL — cloud sync for multi-device

**Write Path:**
```
User edit → In-memory update → localStorage write → (if D1 enabled) → D1 sync
```

**Read Path:**
```
On load: D1 (if enabled) → localStorage (fallback) → in-memory (cache)
```

**Consequences:**
- ✅ **Gained:** Works completely offline with localStorage
- ✅ **Gained:** Can opt-in to D1 for cloud sync without data reformat
- ✅ **Gained:** Multiple fallback layers ensure data isn't lost
- ✅ **Gained:** Performance — in-memory fast reads, localStorage fast writes
- ❌ **Lost:** Complexity — must manage 3 layers, keep in sync
- ❌ **Lost:** Debugging — where is data stored? Which layer is authoritative?
- ❌ **Lost:** D1 sync introduces race conditions (resolved by LWW)

**Date:** 2026-03-xx (Phase 0, initial architecture)

---

## ADR-018: Dirty Tracking for D1 Sync

**Status:** Accepted (Phase 9)

**Context:**  
D1 API has rate limits (though generous). Re-uploading unchanged data wastes quota. Need to track which entities changed since last sync.

**Decision:**  
For each data entity type, store dirty flag in localStorage:
- `d1_dirty_positions` — true if `pfPositions` changed since last sync
- `d1_dirty_notes` — true if `researchNotes` changed
- etc.

On save, check flag before POST:
```javascript
if (localStorage.getItem('d1_dirty_positions')) {
  await API.post('/api/positions/batch', { items: pfPositions });
  localStorage.removeItem('d1_dirty_positions');
}
```

**Consequences:**
- ✅ **Gained:** Avoid redundant API calls
- ✅ **Gained:** Respect rate limits, even generous ones
- ✅ **Gained:** Faster saves (fewer network calls)
- ❌ **Lost:** Dirty flag can get out of sync if save fails
- ❌ **Lost:** Extra complexity — must track flags per entity type
- ❌ **Lost:** Debugging — must inspect localStorage flags to understand sync state

**Date:** 2026-06-27 (Phase 9.3, API client implementation)

---

## ADR-019: Debounced Saves (1500ms Coalesce Window)

**Status:** Accepted (Phase 9)

**Context:**  
User might rapidly edit fields (typing in calculator, clicking buttons). Each keystroke shouldn't trigger API call.

**Decision:**  
`API.scheduleSave(key, callback)` debounces saves with 1500ms window:
- First edit → schedule save in 1500ms
- Edit within 1500ms → delay save to 1500ms from now (coalesce)
- After 1500ms of inactivity → execute save

**Consequences:**
- ✅ **Gained:** Reduced API calls during rapid editing (10+ edits → 1 sync)
- ✅ **Gained:** Better perceived performance (no lag from network calls)
- ✅ **Gained:** Respect rate limits, even generous ones
- ❌ **Lost:** Slight delay (up to 1.5s) before data synced to cloud
- ❌ **Lost:** Risk of data loss if tab closed during debounce (mitigated by `beforeunload` flush)

**Date:** 2026-06-27 (Phase 9.3, API client implementation)

---

## ADR-020: Exponential Backoff Retry (2s → 4s → 6s)

**Status:** Accepted (Phase 9)

**Context:**  
D1 sync might fail due to transient network errors. Need automatic recovery without overwhelming server.

**Decision:**  
On sync failure, retry up to 3 times with exponential backoff:
- Attempt 1: Immediate
- Failure → Wait 2s, retry (Attempt 2)
- Failure → Wait 4s, retry (Attempt 3)
- Failure → Wait 6s, then give up
- On final failure: show toast, keep data in localStorage, retry on next save

**Consequences:**
- ✅ **Gained:** Automatic recovery from transient failures
- ✅ **Gained:** Doesn't hammer server with retries
- ✅ **Gained:** User doesn't lose data
- ❌ **Lost:** Up to 12s delay before giving up (user sees stale data briefly)
- ❌ **Lost:** Complexity — must track retry state

**Date:** 2026-06-27 (Phase 9.3, API client implementation)

---

## ADR-021: No Real-Time Subscriptions (Polling Instead)

**Status:** Accepted

**Context:**  
D1 doesn't support real-time subscriptions (like Firebase or Supabase). Multi-device sync would require WebSocket or polling.

**Decision:**  
App is single-user, single-device primary. Real-time sync not implemented. If user accesses from two tabs, last-write-wins. No event-driven sync.

Future: If multi-device sync needed, could add:
- Polling endpoint (`GET /api/sync-since/{timestamp}`)
- SharedWorker to sync between tabs
- WebSocket for real-time (would require Worker upgrade)

**Consequences:**
- ✅ **Gained:** Simpler architecture, no WebSocket overhead
- ✅ **Gained:** Fits single-user model
- ❌ **Lost:** No real-time sync across devices
- ❌ **Lost:** If user edits on two tabs, one edit silently overwrites the other

**Date:** 2026-06-27 (Phase 9, design decision)

---

## ADR-022: CDN Dependencies via jsDelivr (Not npm)

**Status:** Accepted (Foundation)

**Context:**  
No build process means no npm. External libraries loaded from CDN. jsDelivr chosen for reliability.

**Decision:**  
Load dependencies from CDN at specific versions:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked@15.0.7/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js"></script>
```

**Consequences:**
- ✅ **Gained:** No npm install, no node_modules bloat
- ✅ **Gained:** Automatic CDN caching, global edge distribution
- ✅ **Gained:** Explicit versions prevent breakage
- ❌ **Lost:** Depends on jsDelivr availability (mitigation: multiple CDNs possible)
- ❌ **Lost:** No local fallback if CDN fails
- ❌ **Lost:** No bundling — must load all libraries even if unused

**Date:** 2026-03-xx (Phase 0, project setup)

---

## ADR-023: Web Crypto API for Client-Side Encryption (Removed for D1)

**Status:** Superseded (Phase 9)

**Context:**  
Phase 0 implemented AES-256-GCM encryption using Web Crypto API (native browser support, no library). Removed in Phase 9 when switching to D1 (requires unencrypted data for queries).

**Decision (Phase 0):**  
Encrypt localStorage + KV sync using:
- **Key Derivation:** PBKDF2 with 600K iterations (slow, prevents brute-force)
- **Encryption:** AES-256-GCM (authenticated, no padding oracle)
- **Recovery Key:** 128-bit entropy, regenerable

**Removal (Phase 9):**  
D1 data must be unencrypted (FTS search, filters, FK cascades won't work on encrypted data). Encryption removed, replaced by API auth + CORS.

**Consequences:**
- ✅ **Gained (Phase 0):** E2E encryption, user owns encryption keys, Cloudflare can't see data
- ❌ **Lost (Phase 9):** App-level encryption — D1 data visible to Cloudflare admins

**Migration Path:**  
Users who want encryption can disable D1 sync, stay on localStorage with encryption (feature still in code, but disabled by default).

**Date:** 2026-06-15 (Phase 0 implementation), 2026-06-27 (Phase 9 removal)

---

## ADR-024: Cascade Deletes (No Orphaned Data)

**Status:** Accepted (Phase 9)

**Context:**  
D1 schema has foreign key relationships (positions link to companies, notes link to companies). Deleting a company should clean up all related data.

**Decision:**  
D1 schema uses `ON DELETE CASCADE` for all FK relationships:
```sql
CREATE TABLE positions (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  ...
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES broker_accounts(id) ON DELETE CASCADE
);
```

Client also implements cascade deletes:
```javascript
function deleteCompany(ticker) {
  API.del(`/api/companies/${ticker}`); // Worker handles cascade
  tStocks = tStocks.filter(s => s.ticker !== ticker);
  pfPositions = pfPositions.filter(p => p.company !== ticker);
  researchNotes = researchNotes.filter(n => n.company !== ticker);
  // ... etc
}
```

**Consequences:**
- ✅ **Gained:** No orphaned data in D1
- ✅ **Gained:** Data integrity guaranteed at DB level
- ✅ **Gained:** Cleaner deletion logic
- ❌ **Lost:** Can't soft-delete (archived) — hard deletes only
- ❌ **Lost:** No undo after cascade (would need audit log, not implemented)

**Date:** 2026-06-27 (Phase 9.2, D1 schema design)

---

## ADR-025: FTS5 Full-Text Search for Research Notes

**Status:** Accepted (Phase 9)

**Context:**  
Research notes can be large library (100+ notes). Filtering by text search needed but slow on client-side (O(n) scan).

**Decision:**  
D1 `notes` table uses SQLite FTS5 extension:
```sql
CREATE VIRTUAL TABLE notes_fts USING fts5(title, content, company);
```

Worker endpoint `/api/notes/search?q=buffer%20overflow` performs server-side search.

**Consequences:**
- ✅ **Gained:** Fast full-text search, even with 1000+ notes
- ✅ **Gained:** Supports prefix search, phrase search, boolean operators
- ✅ **Gained:** Reduces client memory (don't load all notes to search)
- ❌ **Lost:** Search index must be maintained (auto-maintained by SQLite)
- ❌ **Lost:** FTS5 is SQLite-specific (not portable to other databases)

**Date:** 2026-06-27 (Phase 9.2, D1 schema design)

---

## ADR-026: Manual CSV Import (Not Automatic Brokerage Sync)

**Status:** Accepted (Phase 4)

**Context:**  
Automatic brokerage sync (SnapTrade, Plaid) costs $100-500/mo. Single-user app doesn't justify cost.

**Decision:**  
Support manual CSV import from broker exports (IBKR, Degiro format). User exports CSV, uploads to app, app parses and merges into portfolio.

**Supported Formats:**
- Interactive Brokers CSV
- Degiro CSV
- Generic (ticker, shares, avgCost)

**Consequences:**
- ✅ **Gained:** $0 cost, works with any broker
- ✅ **Gained:** User data ownership (manual upload, not third-party access to broker)
- ✅ **Gained:** Works even if broker changes API
- ❌ **Lost:** Manual process (user remembers to import monthly)
- ❌ **Lost:** No real-time position updates (monthly refreshes typical)
- ❌ **Lost:** No transaction details beyond import (dividends must be logged manually)

**Reconsideration Trigger:**  
If user portfolio grows to 50+ positions, revisit SnapTrade integration.

**Date:** 2026-05-xx (Phase 4, portfolio module)

---

## ADR-027: TWR + MWR/XIRR + Simple P&L (Three Return Metrics)

**Status:** Accepted (Phase 4)

**Context:**  
Different return metrics serve different purposes. User wants to compare personal performance against benchmarks.

**Decision:**  
Calculate and display all three:
1. **TWR (Time-Weighted Return)** — removes cash flow effects, comparable to benchmark (S&P 500)
2. **MWR/XIRR** — money-weighted return, accounts for timing of cash flows, true personal performance
3. **Simple P&L** — unrealized + realized gains, easiest to understand

**Formulas:**
- **TWR:** (end_value / start_value) ^ (1 / years) - 1
- **XIRR:** IRR of cash flows (numerical solver)
- **P&L:** sum(current_value) - sum(cost_basis) + sum(proceeds)

**Consequences:**
- ✅ **Gained:** User understands performance from multiple angles
- ✅ **Gained:** Can compare TWR to S&P 500 (benchmark)
- ✅ **Gained:** XIRR shows true personal performance (when buys/sells matter)
- ❌ **Lost:** Three metrics can be confusing (which one is "real"?)
- ❌ **Lost:** Calculation complexity (XIRR requires numerical solver)
- ❌ **Lost:** Edge cases (negative cash flows, zero returns edge cases)

**Date:** 2026-05-xx (Phase 4, portfolio module)

---

## ADR-028: Multi-Currency Support with Live FX Rates

**Status:** Accepted (Phase 4)

**Context:**  
Peter holds positions in EUR (Europe) and USD (US). Portfolio must convert to common currency (EUR).

**Decision:**  
- Store positions in native currency (shares × price in original currency)
- Store exchange rates (EUR/USD, EUR/GBP, etc.) from ExchangeRate API
- Portfolio total calculated in base currency (EUR)
- P&L separates stock return from FX return

**Consequences:**
- ✅ **Gained:** Accurate multi-currency portfolio value
- ✅ **Gained:** Transparency on FX impact
- ✅ **Gained:** Can track FX rates over time
- ❌ **Lost:** Complexity — must fetch FX rates, handle missing rates
- ❌ **Lost:** FX timing issues (buy in USD, but convert to EUR later → FIFO ambiguity)

**Date:** 2026-05-xx (Phase 4, portfolio module)

---

## ADR-029: Dark UI with Accent #6c5ce7 (Purple)

**Status:** Accepted (Foundation)

**Context:**  
Visual design choice. Peter prefers dark theme, specific accent color.

**Decision:**  
- Background: `#0f1117` (GitHub-inspired dark)
- Surface: `#1a1d27`
- Text: `#e4e7f1`
- Accent: `#6c5ce7` (purple, calming for financial data)

**CSS Variables:**
```css
:root {
  --bg: #0f1117;
  --surface: #1a1d27;
  --text: #e4e7f1;
  --accent: #6c5ce7;
  /* ... others */
}
```

**Consequences:**
- ✅ **Gained:** Distinct visual identity, not generic
- ✅ **Gained:** Easy theming (CSS variables, one change updates all)
- ✅ **Gained:** Light theme variant added in ADR-012
- ❌ **Lost:** Fixed color choice (not user-customizable, would need color picker)

**Date:** 2026-03-xx (Phase 0, visual design)

## ADR-030: Client-Side PDF Export with jsPDF

**Status:** Accepted (2026-07-01)

**Context:**  
Need per-company research report export as PDF. Options: server-side (Cloudflare Worker), CSS print, or client-side library.

**Decision:**  
- jsPDF 2.5.2 via CDN (`cdn.jsdelivr.net`), lazy-loaded on first export click
- Client-side only — no Worker dependency
- Section chooser dialog lets user pick which data sections to include
- Continuous-flow layout — sections don't force page breaks unless needed

**Alternatives Rejected:**
- **Server-side (Worker):** Adds complexity, Cloudflare Workers have limited PDF support
- **CSS @media print:** Limited control over layout, no section selection, browser-dependent
- **html2canvas + jsPDF:** Heavier, slower, renders as image (not selectable text)

**Consequences:**
- ✅ **Gained:** Works offline, no server dependency, selectable text in PDF
- ✅ **Gained:** Lazy loading means zero impact on app startup
- ❌ **Lost:** No embedded charts (jsPDF can't render Chart.js canvases without html2canvas)
- ❌ **Lost:** Limited to Helvetica font (jsPDF built-in, no custom fonts without large font files)

**Date:** 2026-07-01 (Standalone feature, post-expansion)

---

## ADR-031: 8-Level CSS Typography Scale

**Status:** Accepted (2026-07-03)

**Context:**  
The codebase had inconsistent font sizes — arbitrary values like 9px, 17px, 22px scattered across 285 CSS declarations. Dialog headings ranged from 14px to 22px, hero numbers from 18px to 24px. No systematic scale existed.

**Decision:**  
- 8-level CSS variable scale: `--fs-xs` (10px) through `--fs-3xl` (20px)
- Eliminated all non-standard sizes (9px → 10px, 17px → 16px, 22px → 20px)
- Consolidated dialog headings to 16px (`--fs-xl`), hero numbers to 20px (`--fs-3xl`)
- All 285 affected CSS declarations converted to use variables

**Alternatives Rejected:**
- **Tailwind-style utility classes:** Conflicts with no-framework principle (ADR-002)
- **rem-based scale:** Unnecessary complexity for a single-page app with no user font-size control
- **Fewer levels (4-5):** Insufficient granularity for financial data tables vs. headings vs. labels

**Consequences:**
- ✅ **Gained:** Consistent typography — every font size maps to a named variable
- ✅ **Gained:** Theme-safe — light/dark mode can override the scale if needed
- ✅ **Gained:** Easier to maintain — changing a size level updates all usages
- ❌ **Lost:** Migration required touching 285 declarations (one-time cost, done)

**Date:** 2026-07-03 (UX/UI Audit Session 2)

---

## Summary Table

| ADR | Decision | Status | Date |
|-----|----------|--------|------|
| 001 | Monolithic HTML | Accepted | Phase 0 |
| 002 | Vanilla JS, no frameworks | Accepted | Phase 0 |
| 003 | localStorage-first | Accepted → Superseded | Phase 0 → 9 |
| 004 | Last-write-wins sync | Accepted | Phase 9 |
| 005 | Cloudflare Workers + D1 | Accepted | Phase 0 |
| 006 | Yahoo proxy via Worker | Accepted | Phase 2+ |
| 007 | FMP + Finnhub + Yahoo API mix | Accepted | Phase 0 |
| 008 | Hash-based routing | Accepted | Phase 9 |
| 009 | D1-only cloud mode | Accepted | Phase 9 |
| 010 | Encryption removed for D1 | Accepted | Phase 9 |
| 011 | PWA + Service Worker | Accepted | Phase 10b |
| 012 | Dark theme default | Accepted | Phase 10a |
| 013 | Hungarian UI, English code | Accepted | Phase 0 |
| 014 | Free tier APIs only | Accepted | Phase 0 |
| 015 | GitHub Pages deployment | Accepted | Phase 0 |
| 016 | Data versioning + migrations | Accepted | Phase 9 |
| 017 | Local-first with progressive sync | Accepted | Phase 0 |
| 018 | Dirty tracking for D1 | Accepted | Phase 9 |
| 019 | Debounced saves (1500ms) | Accepted | Phase 9 |
| 020 | Exponential backoff retry | Accepted | Phase 9 |
| 021 | No real-time subscriptions | Accepted | Phase 9 |
| 022 | CDN dependencies (jsDelivr) | Accepted | Phase 0 |
| 023 | Web Crypto encryption | Superseded | Phase 0 → 9 |
| 024 | Cascade deletes in D1 | Accepted | Phase 9 |
| 025 | FTS5 for notes search | Accepted | Phase 9 |
| 026 | Manual CSV import | Accepted | Phase 4 |
| 027 | TWR + MWR + P&L metrics | Accepted | Phase 4 |
| 028 | Multi-currency with FX rates | Accepted | Phase 4 |
| 029 | Dark UI, purple accent | Accepted | Phase 0 |
| 030 | Client-side PDF with jsPDF | Accepted | 2026-07-01 |
| 031 | 8-level CSS typography scale | Accepted | 2026-07-03 |

---

## Related Documentation

- **ARCHITECTURE.md** — system overview, data flow, cache layers
- **API-REFERENCE.md** — Worker endpoints, request/response schemas
- **ROADMAP.md** — phase tracker, project status
- **d1-schema.sql** — D1 database schema (22 tables)
- **CLAUDE.md** — development commands, code standards

---

**End of Document**  
Last updated: 2026-07-03

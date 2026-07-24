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

## ADR-032: Server-Side API Keys via Worker Proxy

**Status:** Accepted (2026-07-21)

**Context:**  
FMP and Finnhub API keys were stored in browser localStorage and sent from the client directly to the upstream APIs as URL query parameters (`?apikey=...`, `?token=...`). This exposed the keys in the browser network tab, browser history, and any intermediary logs, and required re-entering them on every device. This is the first step of the Security v2 overhaul (see `memory/project_security-v2-plan.md`), which aims for a single-master-password model with no per-device credential entry.

**Decision:**  
- Add `/proxy/fmp/{endpoint}` and `/proxy/finnhub/{endpoint}` routes to the Cloudflare Worker.
- API keys live as Worker secrets (`FMP_KEY`, `FINNHUB_KEY`), injected server-side and never sent to the client.
- The proxy strips any client-supplied key param (case-insensitive), forces the server key last, and scrubs the secret from the response body as defense-in-depth.
- SSRF/open-proxy prevented via fixed per-provider base host + strict endpoint regex; `Object.hasOwn` provider lookup; `redirect: 'manual'`; dedicated 60/min rate-limit bucket.

**Alternatives Rejected:**
- **Sync API keys to D1 (encrypted):** Still delivers the key to every client; larger attack surface than never sending it at all.
- **Keep keys client-side:** The status quo — exposes keys in URLs and requires per-device entry.

**Consequences:**
- ✅ **Gained:** Keys never leave the server; not in browser, URLs, history, or logs.
- ✅ **Gained:** No per-device API key entry — works automatically on any device.
- ✅ **Gained:** Central rate-limit and quota control point.
- ⚠️ **Note:** Proxy is currently gated by the sync key (`X-Sync-Key`); this becomes token-based auth in Phase B. Anyone with the sync key can consume the owner's API quota (acceptable for a single-user app).
- ❌ **Lost:** One extra network hop (client → Worker → upstream) adds minor latency.

**Date:** 2026-07-21 (Security v2, Phase A1)

---

## ADR-033: Master-Password Auth with Device Tokens (retiring the sync key)

**Status:** Accepted (2026-07-21) — Phase B1 backend landed; client UI (B2) and sync-key retirement (B3) pending

**Context:**  
Auth was a single shared `SYNC_SECRET` (the "sync key") sent as `X-Sync-Key` on every request — no per-device tokens, no expiry, no revocation, and (critically) in D1 mode the encryption password was decorative: anyone with the sync key had full read/write. The Security v2 goal is a single master password that both authenticates and (Phase C) encrypts, with no per-device credential entry.

**Decision:**  
- Master password → `PBKDF2(600k, SHA-256)` → HKDF-Expand into `authKey` (sent to server) and `encKey` (stays on device, for Phase C E2EE). Distinct HKDF info labels make the two keys cryptographically independent, so disclosing `authKey` reveals nothing about `encKey`.
- Server stores only `SHA-256(authKey)`; a KV leak cannot yield the password (256-bit preimage) or impersonate.
- `/auth/login` issues a 256-bit device bearer token (stored hashed, 180-day TTL, individually revocable).
- **Dual-auth transition:** data endpoints accept the sync key OR a device token, so nothing breaks while devices migrate. `/auth/setup` is bootstrapped by the sync key; `/auth/change` (session + old-password proof) provides rotation/recovery so the account stays changeable after the sync key is retired. A password change **revokes all device tokens**, so it doubles as "log out everywhere" for remediating a stolen token.

**Alternatives Rejected:**
- **Keep the shared sync key:** no revocation, no per-device identity, and it doubles as the API-quota guard.
- **Store `authKey` directly on the server:** a KV leak would be a full account takeover; storing the hash avoids this.
- **Per-account brute-force lockout:** rejected in favor of per-IP (avoids a targeted lockout-DoS of the sole legitimate user); weak-password risk is instead mitigated by enforcing a strong master password at setup (B2).

**Consequences:**
- ✅ **Gained:** one master password across devices, per-device revocable tokens, no decorative-password gap.
- ✅ **Gained:** `encKey` foundation ready for Phase C envelope encryption.
- ⚠️ **Sequencing:** `SYNC_SECRET` must NOT be removed (B3) until a recovery path exists — `/auth/change` covers rotation; forgotten-password recovery needs the Phase C recovery key. So sync-key retirement follows Phase C.
- ⚠️ **Transition:** while the sync key exists it can overwrite auth (re-setup) — treat it as a root credential until B3.
- ❌ **Lost:** slight per-request latency (token KV lookup) and PBKDF2 cost on login.

**Date:** 2026-07-21 (Security v2, Phase B1)

---

## ADR-034: Collision-Resistant Client-Minted IDs (`_mintId`)

**Status:** Accepted (2026-07-22) — Sync Audit, data-loss-stop batch (`0fc3579`)

**Context:**  
D1 tables use autoincrement `id` PKs, but the client mints ids locally so an object has a stable id before it ever reaches the server. The old scheme was per-device `max(existing id)+1`. With two devices editing offline, each would mint the *same* small id for *different* objects; on sync the batch upsert's `ON CONFLICT(id) DO UPDATE` silently overwrote one unrelated row with the other's data — a genuine cross-device data-loss bug affecting positions, transactions, broker accounts, general/company todos, framework entries, reviews, and research notes.

**Decision:**  
All seven mint points delegate to a single helper:
```js
let _idCtr = Math.floor(Math.random()*0x200000);
function _mintId(){ return Math.floor(Date.now()/1000)*0x200000 + ((_idCtr++)&0x1FFFFF); }
```
Format: **`(epoch-seconds << 21) | 21-bit per-session counter`**, the counter seeded to a random start and masked to 21 bits. Properties: monotonic within a session; time-ordered across sessions; max value ≈3.7e15 stays well under `MAX_SAFE_INTEGER` (ceiling ~year 2106); coexists with legacy small ids; two devices minting concurrently share a second-granularity high part but diverge on the random-seeded counter, so a collision is effectively impossible for a single-user, low-write dataset.

**Alternatives Rejected:**
- **UUID strings:** would require changing every `id` column from INTEGER and all id-typed client code — disproportionate.
- **Server-assigned ids only:** breaks the local-first model (objects need an id before the debounced sync fires) and offline creation.
- **Per-device id prefix ranges:** needs a device registry and coordination the single-user app doesn't have.

**Consequences:**
- ✅ Cross-device concurrent creates no longer clobber each other. Frontend-only; no schema change, no migration.
- ⚠️ Legacy ids minted by the old scheme are left as-is (no back-fill) — residual collision risk on *pre-fix* ids only, accepted as negligible (KNOWN-ISSUES SA.4).
- ❌ IDs are larger integers now (cosmetic; still JSON-safe numbers).

**Date:** 2026-07-22 (Sync Audit)

---

## ADR-035: Natural-Key Upsert & Natural-Key DELETE for Cross-Device Sync

**Status:** Accepted (2026-07-22 → 2026-07-23) — Sync Audit (`36cf706`, `cc3c9a2`)

**Context:**  
Two related defects surfaced in the field-by-field sync audit. (1) The batch upsert used `ON CONFLICT(id) DO UPDATE` unconditionally, but the client inserts many rows **without** an `id` (it only knows their natural key). `ON CONFLICT(id)` never fires for an idless insert, so re-saving the same logical row either raised a UNIQUE violation that 500'd the whole batch (dropping the edit to localStorage) or piled up duplicate rows (`snapshot_positions`, `valuations`, `exchange_rates` grew unboundedly). (2) Deleting a framework entry / data override / valuation removed it locally but, lacking a captured `id`, never issued a D1 delete — so it resurrected on the next reload.

**Decision:**  
- **Natural-key upsert:** each affected table declares a `conflictTarget` (its natural key) in the Worker's `TABLES` map; idless inserts upsert on that key with an `updated_at` bump. Examples: `snapshot_positions(snapshot_id, company_id, account_id)`, `valuations(company_id, label)`, `exchange_rates(rate_date, from_currency, to_currency)`, `checklist_templates(section_key)`.
- **Natural-key DELETE route:** `DELETE /api/{table}?col=val&col2=val2`, gated by a fixed `NATURAL_DELETE` allowlist (`company_data_overrides`→`company_id,metric_key`; `valuations`→`company_id,label`). The **full** key is mandatory (partial key → 400), column names come only from the allowlist (never request input), and values are bound params — so it targets exactly one logical row and can't degrade into a mass delete. GET list cap was raised 1000→100000 in the same change so large tables aren't truncated.

**Alternatives Rejected:**
- **Always capture the server id round-trip before delete:** extra latency and a fetch the local-first flow doesn't otherwise need; fails when the row was created offline and never synced.
- **`INSERT OR REPLACE`:** would reset autoincrement ids and break FK children; `ON CONFLICT DO UPDATE` preserves the row identity.
- **Soft-delete tombstones for these three types (the fully-correct fix):** deferred at the time — hard delete stopped the *same-device* resurrection; cross-device resurrection via a stale copy was left open (SA.3 / S2c). **Now done — see ADR-038.**

**Consequences:**
- ✅ Duplicate-row growth stopped; batches no longer 500 on natural-key re-saves; local deletes propagate to D1.
- ✅ Cross-device delete-resurrection since resolved by S2c soft-delete tombstones (ADR-038, `19faaf4`); the natural-key DELETE route now soft-deletes when the table has a `deleted_at` column.
- ⚠️ Worker redeploy required for both commits; a one-time live D1 dedup + unique-index add was run for `snapshot_positions`/`valuations`.

**Date:** 2026-07-23 (Sync Audit)

---

## ADR-036: Per-Company Attrs as Columns + Single-PUT Upsert (S2a-2)

**Status:** Accepted (2026-07-23) — S2a-2 (`aaff465`)

**Context:**  
Four per-company attributes — `priceAlerts`, `tags`, `idealTraitChecks`, `avoidChecks` — were localStorage-only: correct on the writing device, invisible on any other (SA.1). They needed a D1 home. Separately, the single-item `PUT /api/{table}/:key` was UPDATE-only, so a PUT to a **new** `app_settings` key affected 0 rows → 404; the whole `app_settings` family only worked because keys had been seeded via `/migrate`, and a fresh account would 404 on its first save.

**Decision:**  
- **Columns, not a side table:** add 4 nullable `TEXT` columns to `companies` (`price_alerts`, `tags`, `ideal_trait_checks`, `avoid_checks`). They ride the existing `companies/batch` upsert (keyed on `symbol`) — no new endpoint, no new load round-trip (the `/full` load already returns the company row). `price_alerts` is encrypted (financial thresholds); the rest are plaintext (labels/booleans).
- **NULL vs empty semantics:** the client **always** emits a concrete value (`'{}'`/`'[]'`/ciphertext), never omits. `NULL` therefore means "never synced" → the load skips it and the localStorage `mergeKeys` fallback keeps the same-device copy; a concrete empty value means "explicitly cleared" and wins over a stale copy on another device.
- **Single-PUT upsert:** for natural-key tables (`pk !== 'id'`) the PUT handler now does `INSERT ... ON CONFLICT(pk) DO UPDATE`, creating the row if absent. id-based tables keep UPDATE-only semantics (a PUT to a nonexistent id stays 404), so soft-deletes are unaffected.

**Alternatives Rejected:**
- **A key-value `app_settings` blob per attribute** (like widget config): companies already have a row and a batch path — columns are cheaper and load for free with `/full`.
- **A one-time union-merge on first sync** to avoid the transition last-writer-wins: added state and ambiguity for a single-user tool; accepted the documented one-time caveat instead (KNOWN-ISSUES SA.1).

**Consequences:**
- ✅ The 4 fields sync cross-device; the whole `app_settings` family now works on a fresh account.
- ⚠️ **Deploy order is mandatory:** `ALTER TABLE companies ADD COLUMN ...` (×4) must run **before** `wrangler deploy`, else the new `TABLES.companies.cols` make the batch INSERT reference missing columns and 500 the whole companies sync. Frontend is safe to go live first (old worker ignores unknown cols).
- ⚠️ One-time transition LWW clobber possible if a secondary device holds richer unsynced state than the primary (SA.1 caveat). Locked-DEK reload can briefly resurrect a cleared price alert until unlock (self-heals).

**Date:** 2026-07-23 (S2a-2)

---

## ADR-037: Synthetic Holder Companies + positions.details Blob (S2b)

**Status:** Accepted (2026-07-23) — S2b (`b8d5778`)

**Context:**  
Non-stock positions (cash / real-estate / bond) were localStorage-only: `positions.company_id` is NOT NULL and non-stock positions have no real company, so they were excluded from the D1 positions batch (the B-position-poison fix). Their detail fields (assetType, RE/bond/cash specifics) — plus `currentPrice`/`notes` even for stocks — also had no D1 home (merged from localStorage via `lsExtra`).

**Decision:**  
- **Synthetic holder company:** each non-stock ticker gets a `companies` row tagged `holder_type` ('cash'|'real_estate'|'bond'), giving its position a `company_id` anchor. Holders are kept in a client `_holderCompanies` map and deliberately NOT in `tStocks`, so the ~30 views that iterate `tStocks` exclude them for free (chosen over filtering each render site — fewer, more testable touch-points). `_d1CompanyMap` still carries the holder id so positions resolve their ticker on load.
- **positions.details:** one nullable encrypted JSON column holds all position client-only fields. Chosen over ~14 typed columns because the app filters/sorts entirely client-side, so column-level queryability buys nothing; the blob is a smaller surface, encrypts everything at once, and also closes the stock currentPrice/notes gap.
- **Collision guard:** a ticker is EITHER a tracked stock OR a holder (UNIQUE `companies.symbol`). `savePosition` rejects a non-stock ticker already in `tStocks` (and vice-versa) — else the two rows would fuse and `holder_type` would hide the real company.
- **Auto-migration:** `_migrateNonStockHolders` creates holders for pre-existing localStorage-only non-stock positions on first load; the `saveTrackerStocks` re-sync trigger then syncs the positions.

**Alternatives Rejected:**
- **Make `positions.company_id` nullable:** requires recreating the positions table (SQLite can't drop NOT NULL) on live financial data — too risky.
- **A new `company_type` marker value:** blocked by the CHECK constraint on `company_type` (SQLite can't ALTER a CHECK) → a dedicated `holder_type` column instead.
- **Typed detail columns / a separate nonstock table:** more schema + duplicated position logic for no user-visible benefit (client-side filtering only).

**Consequences:**
- ✅ Non-stock positions and all position detail fields sync cross-device; net-worth snapshots now include non-stock breakdowns.
- ⚠️ **Deploy order MANDATORY:** both `ALTER`s (`companies.holder_type`, `positions.details`) before `wrangler deploy`.
- ⚠️ Deploy-window (new frontend + old worker): a holder briefly persists without `holder_type` → shows as a bogus company until the worker lands; self-heals. Avoid adding non-stock positions mid-deploy.

**Date:** 2026-07-23 (S2b)

---

## ADR-038: Soft-Delete Tombstones for framework/override/valuation/note_images (S2c)

**Status:** Accepted (2026-07-23) — S2c (`19faaf4`)

**Context:**  
ADR-035 made deletes of framework entries / data overrides / valuations propagate to D1, but as **hard** deletes. `note_images` (ADR — S2a-3) had the same gap. A second device holding a stale copy could re-upload the row on its next batch upsert, resurrecting a deleted item (KNOWN-ISSUES SA.3). Notes/reviews/positions/transactions already avoid this with a `deleted_at` tombstone. This is the last hard-delete path in the cross-device sync surface.

**Decision:**  
- **Extend the `deleted_at` tombstone pattern** to `framework_entries`, `company_data_overrides`, `valuations`, `note_images` (nullable `TEXT` column, ISO timestamp; `NULL` = live). Same convention as notes/reviews — snake_case `deleted_at` on the client object, wire payload, and D1 column.
- **Worker natural-key DELETE → soft-delete:** the `NATURAL_DELETE` route now `UPDATE … SET deleted_at` (instead of `DELETE`) when the table's `TABLES` cols include `deleted_at`. This converts the override + valuation natural-key deletes with **zero client change**. Hard-delete stays for keyless tables (and the by-id DELETE route stays hard, preserving the notes/reviews permanent-purge/trash flow).
- **By-id soft-deletes** (framework, note_images, valuation bulk) use the existing `PUT {table}/{id} {deleted_at}` path — the established notes/reviews mechanism — so the hard by-id DELETE route is untouched.
- **Load filtering:** every consumer skips tombstoned rows (`loadFramework`, dedicated valuations load, company-full overrides load, note_images load — the last keeps tombstones out of both `n.images` and the `_d1ImageIds` diff snapshot so a stale device stops re-uploading).
- **Re-add un-tombstone:** natural-key tables (override, valuation) send `deleted_at:null` on every live upsert, so re-adding the same `(company_id, metric_key)` / `(company_id, label)` clears a stale tombstone. Id-based tables (framework, note_images) omit `deleted_at` on live batches — re-adds get a fresh id, so their tombstone is stickier (a stale device's live re-upsert can't clobber it via the column).

**Alternatives Rejected:**
- **Make the by-id DELETE route globally soft-delete:** would break the notes/reviews permanent-purge (empty-trash) flow, which relies on a true hard delete. Kept soft-delete = PUT-`deleted_at`, hard/permanent = DELETE.
- **A dedicated natural-key soft-delete endpoint:** the existing natural-key DELETE route already carries the full-key safety guarantees; branching it on `deleted_at` reuses that surface with no new route.
- **Keep the deleted item in the local array (full notes-style lifecycle) + 30-day trash UI:** more render-site filters for framework and awkward for the map-shaped override/valuation stores; not worth it for four low-volume, single-user types. Tombstone-write + drop-from-local-set + load-filter is sufficient.

**Consequences:**
- ✅ Cross-device delete-resurrection closed for all four types (SA.3 resolved); the entire S2 cross-device block is complete.
- ⚠️ **Deploy order MANDATORY:** the 4 `deleted_at` `ALTER`s before `wrangler deploy` (else the new `TABLES` cols reference missing columns → 500s the batch). All nullable `ADD COLUMN`s, non-destructive.
- ⚠️ Same accepted stale-writer window as notes/reviews (a device that saves before it loads the tombstone re-asserts it); load-on-startup mitigates. No 30-day trash/purge UI for these four — a tombstone is permanent until overwritten.

**Date:** 2026-07-23 (S2c)

---

## ADR-039: Retire Legacy Client-Side Encryption + Legacy KV Sync (B3b-2)

**Status:** Accepted (2026-07-24) — B3b-2 (`681354b`, v41)

**Context:**  
The app carried two overlapping, now-obsolete subsystems from before Security v2:
1. A **password-based client-side encryption** system (`enc_salt`/`enc_verify`/`enc_recovery` in localStorage, PBKDF2→AES-GCM `encryptPayload`/`decryptPayload`, an idle-lock timer, and the `#lock-unlock`/`#lock-setup`/`#lock-recovery*` gate views).
2. A **legacy KV `/sync` cloud path** (`cloudSave`/`cloudLoad`/`testSync`/`scheduleCloudSave` against `/sync/save|load`, sync-key-authed).

Both were superseded by Phase B/C: the master-password auth (device token, ADR-033) plus envelope/E2EE encryption (random DEK wrapped by the password- and recovery-key, C1/C2/C3) and D1 CRUD (ADR-005). Keeping the legacy systems meant a second lock UI, a second at-rest crypto scheme, and a sync-key-authed write path — all attack/maintenance surface with no live user. The boot gate branched across both the legacy and the new system, which is fragile: getting it wrong strands the app behind `html.app-locked` (`visibility:hidden` on the whole shell) with no gate to clear it.

**Decision:**  
- **Remove the legacy client-side encryption system** and its lock UI; boot/auth keys **solely** off `getAuthToken()` + the envelope DEK.
- **Remove the legacy KV `/sync` client path**; all data flows through D1 CRUD.
- **Collapse the boot gate:** a pre-paint IIFE unconditionally sets `app-locked`; the async boot clears it only on the token+DEK success path (→`autoLoad`), otherwise routes **every** no-token/no-DEK case to `showMasterLogin()` (which shows a visible gate and keeps `app-locked`). Invariant: **no reachable boot state leaves `app-locked` on with no visible gate.**
- **Keep, deliberately:** `deriveKey`/`hashKey`/`generateRecoveryKey`/`recoveryWrapKey`/`b64`/`unb64` — the envelope recovery-key flow (`recoveryWrapKey`→`deriveKey`) depends on them; and the token-authed `/sync/meta` path (`cloudSaveMeta`/`cloudLoadMeta`/`buildMeta`/`_metaVersion`) as vestigial-but-harmless (only the dead `/sync/load|save|restore-backup` routes are dropped, in B3c). `buildMeta` now reports `has_encryption:false`, `enc_*:null`.

**Alternatives Rejected:**
- **Keep the legacy encryption as an offline fallback:** two at-rest crypto schemes on the same data is a correctness/maintenance hazard; envelope E2EE already covers at-rest, and offline reads use the cached DEK.
- **Remove `/sync/meta` too, now:** it's token-authed and cheap; removing it is a worker change better bundled with B3c's irreversible worker cleanup.
- **Trust the handoff's removal list verbatim:** it listed `deriveKey` for removal — wrong, since the kept recovery flow needs it. Verified every removed symbol's callers first (the correction is the key lesson).

**Consequences:**
- ✅ One lock UI, one at-rest crypto scheme, one authenticated data path. −521 lines. Attack/maintenance surface reduced; security posture strictly better.
- ✅ Boot integrity verified in-browser across every path (no-token, token-invalid-DEK, `autoLoad` body): all land app-visible or on a visible gate (`bricked:false`).
- ⚠️ Frontend-only, but it changes the **production boot/auth flow** — a token-holding device (the provisioned account) must boot via the token path; a device with only a sync key and no token would now hit the master-login gate (intended end state; the sync key is retired in B3c).
- ⚠️ The `X-Sync-Key` fallback in `authDataHeaders` + client `setupMasterPassword`/`/auth/setup` are the last remaining client sync-key uses, retired with the Worker branch in **B3c**.

**Date:** 2026-07-24 (B3b-2)

---

## ADR-040: Retire the Sync Key — Token-Only Auth (B3c)

**Status:** Accepted (2026-07-24) — B3c (`2ba0019`, v42). Completes Phase B.

**Context:**  
The original backend authenticated every data request with a single shared "sync key" (`X-Sync-Key` header, compared against the `SYNC_SECRET` Worker secret). Security v2 replaced it with per-device master-password tokens (ADR-033) + envelope E2EE (ADR-039), but kept `authenticate()` **dual-auth** (sync key OR token) through the transition (B1/B2/B3a/B3b) so nothing broke mid-migration. While the sync key remained valid it was a root credential: one static secret granting full data access, and — via the sync-key-gated `POST /auth/setup` — the ability to overwrite the master-password verifier (silent account takeover; KNOWN-ISSUES SV.2). B3a proved a provisioned device authenticates token-only; B3b-1/B3b-2 removed the client's sync-key entry UI and legacy client-enc/KV path. B3c is the final, **irreversible** cut.

**Decision:**  
- **Worker `authenticate()` is token-only:** a request authenticates solely by a valid `X-Auth-Token` (KV `token_<sha256>` lookup). The `X-Sync-Key`/`SYNC_SECRET` branch is removed; `SYNC_SECRET` is unset after deploy.
- **Remove `POST /auth/setup`** (sync-key-gated one-time bootstrap) and the legacy KV blob routes `/sync/load|save|restore-backup`. **Keep `/sync/meta`** (token-authed, vestigial). Drop `X-Sync-Key` from CORS.
- **Client is token-only:** `authDataHeaders`/`hasDataAuth`/`API._fetch` use the token alone; remove `authSetup`/`setupMasterPassword`/`getSyncKey` + the sync-key Settings field.
- **Accepted, recorded per Peter's request:** removing `/auth/setup` means **there is no in-app from-scratch new-account provisioning anymore.** The single account is already provisioned; password *changes* go through `/auth/change` and forgotten-password *recovery* through `/auth/recover` (recovery key). Re-enabling new-account bootstrap in the future would require restoring a `/auth/setup` (or equivalent) route.

**Alternatives Rejected:**
- **Keep dual-auth indefinitely:** leaves a static root secret and the SV.2 takeover path alive forever — defeats the purpose of Phase B.
- **Keep `/auth/setup` behind a token instead of the sync key:** a token-gated setup is circular (you need an account to get a token) and serves no one for a single provisioned account; dropping it is simpler and closes the verifier-overwrite path.
- **Also delete `/sync/meta` now:** it's token-authed and cheap; the client still calls it (buildMeta/cloudSaveMeta/cloudLoadMeta). Left as vestigial rather than doing a coordinated client+worker removal.

**Consequences:**
- ✅ No static root credential; SV.2 resolved, SV.7 downgraded to LOW. One auth mechanism (device token) across the whole surface.
- ⚠️ **IRREVERSIBLE + lockout-sensitive:** any device holding only a sync key (no token) 401s instantly after deploy. Mitigated by confirming every active device is token-authed first; `/auth/login` and `/auth/recover` stay public, and existing KV device tokens are independent of `SYNC_SECRET` (they survive the secret unset). Recovery key is the ultimate backstop.
- ⚠️ **Deploy order (Peter):** `wrangler deploy` → verify the token device still loads/saves → `wrangler secret delete SYNC_SECRET`. Frontend (v42) auto-deploys via GitHub Pages and is safe against the pre-deploy dual-auth worker.
- ⚠️ No in-app new-account bootstrap (see Decision). Orphaned KV `user_data`/`user_data_backup` entries are inert.

**Date:** 2026-07-24 (B3c)

---

## ADR-041: Encrypted Clear-and-Restore via a Client-Driven Purge (C3b)

**Status:** Accepted (2026-07-24) — C3b (`feb4b4b`, v43)

**Context:**  
"Restore from Backup" should REPLACE the user's data. In plaintext mode it does — `POST /api/migrate` clears the tables server-side then re-inserts. But once E2EE is active, `/migrate` is blocked (403; the worker has no DEK and would write plaintext), so the encrypted restore fell back to pushing the backup through the normal savers as **upserts** — a MERGE. Cloud rows absent from the backup were never deleted and resurrected after a reload (KNOWN-ISSUES SV.8). A true encrypted replace needs a clear step, but the worker can't do the re-insert (no key) and the client can't reuse `/migrate`.

**Decision:**  
- **Split the operation:** the worker only CLEARS (it needs no key for that); the client RE-INSERTS via its normal encrypted savers.
- **New token-authed `POST /api/purge`** deletes the user-entity tables (`companies`, `notes`, `broker_accounts`, `portfolio_snapshots`, `exchange_rates`, `general_todos`, `framework_entries`, `reviews`, `valuations`); child tables cascade via `ON DELETE CASCADE`. It leaves `app_settings` (key-value config, upserted by key — no resurrection problem) and lets `api_cache` clear via the companies cascade (regenerable). Shared `userDataClearStmts()` is the same clear `handleMigrate` already used.
- **Client `_c3bClearAndRestore()`**: cancel the scheduled merge-writes → purge → `_stripD1Refs()` (drop cached D1 row ids so re-saves INSERT fresh and re-resolve FKs) → phase 1 (companies/accounts) → GET /companies to recapture the new ids → phase 2 (children).
- **Data-safety invariant:** the flow NEVER reads D1→local and never rolls back localStorage. localStorage stays the source of truth throughout, so a mid-flow failure leaves the restored data intact (worst case = D1 incomplete, re-syncs on next save) — strictly better than the old merge, never data-loss.

**Alternatives Rejected:**
- **Pre-encrypt the payload + a "tolerant" `/migrate`:** would require duplicating the worker's field→column mapping on the client to know which nested payload fields to encrypt — fragile and easy to drift from the C2 column set.
- **Purge then `location.reload()` to re-migrate:** a reload re-runs autoLoad which loads D1→local; if the re-insert were incomplete the reload would overwrite local with the partial cloud → data loss. Rejected in favor of no-reload, local-as-truth.
- **Per-row client DELETE instead of a purge route:** thousands of requests, tombstone interactions, slow and fragile.

**Consequences:**
- ✅ Encrypted restore is a true replace; SV.8 resolved.
- ✅ Reusable token-authed purge primitive; `handleMigrate` and purge share one clear helper (can't drift).
- ⚠️ **`companies.id` has no AUTOINCREMENT** → post-purge re-inserts get fresh rowids, so EVERY cached numeric `company_id` must be stripped before re-save or the atomic FK batch 500s and drops the whole batch. The QA pass caught the initial strip missing `companyId` on transactions/notes/reviews (only positions was covered) — a real data-loss path, fixed. Lesson: enumerate every cached FK id, not just the obvious one.
- ⚠️ Worker needs `wrangler deploy`. Until then `/api/purge` 400s → the client catches it and safely degrades to the old merge + a "restored locally" warning. Destructive op, gated behind the existing typed-`RESTORE` confirm + "back up first" warning.

**Date:** 2026-07-24 (C3b)

---

## ADR-042: Encrypted Backup with a Standalone Passphrase (Batch A)

**Status:** Accepted (2026-07-24) — Batch A (`6e5735f`, v47)

**Context:**  
Security v2 put all D1 data behind envelope E2EE, but the "Download Backup" export was still a **plaintext** `.json` — the one artifact that leaves the encryption envelope. If it lands in a cloud-sync folder, an email, or a lost drive, the whole E2EE posture is bypassed (theses, notes, positions, amounts in cleartext).

**Decision:**  
- The **default** backup is now encrypted: prompt for a passphrase → PBKDF2-SHA256-600k → AES-256-GCM → download a `{v,format,kdf,cipher,salt,iv,ct}` blob as `.enc.json`. Reuses the existing `deriveKey`/`b64`/`unb64` primitives — no new crypto. Fresh 16-byte salt + 12-byte IV per export.
- **Standalone passphrase, NOT the master password.** A backup must stay restorable after a master-password change; coupling it to the master password (or the DEK) would strand old backups. Decoupling costs the user one remembered secret but is the robust choice for a disaster-recovery artifact. Min length 10 (matches the master password; the encrypted file is offline-brute-forceable, unlike the online-only master password).
- **Plaintext export retained** behind a separate button + explicit "unencrypted — handle with care" confirm (CSV/XLSX/PDF interop still needs it).
- **Restore auto-detects** the encrypted shape and decrypts **before any destructive mutation or version check**; wrong/cancelled passphrase → clean early return, data untouched (AES-GCM tag mismatch throws).

**Alternatives Rejected:**
- **Couple to master password / DEK:** a password change or DEK rotation would make prior backups undecryptable — the opposite of what a backup is for.
- **Encrypt only on cloud upload, keep local export plaintext:** the local file is precisely the leak vector; encrypting elsewhere misses it.
- **Keep plaintext default, add encrypted as an option:** leaves the security gap one click away; the whole point is to close it by default.

**Consequences:**
- ✅ The last plaintext data path is closed; a leaked backup file is now just ciphertext.
- ✅ Reusable `showPasswordPrompt()` (confirm field + min-length) for future passphrase prompts.
- ⚠️ A forgotten backup passphrase = an unrecoverable backup (stated in the prompt copy). This is inherent to client-side encryption with a standalone secret.
- ⚠️ Encrypted base64 is ~1.33x larger — the restore file-size guard was raised 10MB → 50MB (a real image-bearing backup produced a 10.7MB ciphertext).
- Adversarial QA folded 5 fixes into the feature (see BUG-HISTORY Cat 91); the notable one: `b64()`'s `String.fromCharCode(...bytes)` spread overflowed on large buffers (CODING-LESSONS JS #12).

**Date:** 2026-07-24 (Batch A)

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
| 032 | Server-side API keys via Worker proxy | Accepted | 2026-07-21 |
| 033 | Master-password auth + device tokens | Accepted | 2026-07-21 |
| 034 | Collision-resistant client-minted IDs (`_mintId`) | Accepted | 2026-07-22 |
| 035 | Natural-key upsert & natural-key DELETE | Accepted | 2026-07-23 |
| 036 | Per-company attr columns + single-PUT upsert (S2a-2) | Accepted | 2026-07-23 |
| 037 | Synthetic holder companies + positions.details blob (S2b) | Accepted | 2026-07-23 |
| 038 | Soft-delete tombstones for framework/override/valuation/note_images (S2c) | Accepted | 2026-07-23 |
| 039 | Retire legacy client-side encryption + legacy KV sync (B3b-2) | Accepted | 2026-07-24 |
| 040 | Retire the sync key — token-only auth (B3c) | Accepted | 2026-07-24 |
| 041 | Encrypted clear-and-restore via client-driven purge (C3b) | Accepted | 2026-07-24 |
| 042 | Encrypted backup with a standalone passphrase (Batch A) | Accepted | 2026-07-24 |

---

## Related Documentation

- **ARCHITECTURE.md** — system overview, data flow, cache layers
- **API-REFERENCE.md** — Worker endpoints, request/response schemas
- **ROADMAP.md** — phase tracker, project status
- **d1-schema.sql** — D1 database schema (22 tables)
- **CLAUDE.md** — development commands, code standards

---

**End of Document**  
Last updated: 2026-07-24

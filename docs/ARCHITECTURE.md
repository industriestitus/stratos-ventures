# Stratos Ventures — System Architecture

**Last Updated:** 2026-07-01

---

## Overview

Stratos Ventures is a single-page investment management app with a **local-first, progressive cloud sync** architecture. All data lives in localStorage initially and optionally syncs to Cloudflare D1 via a Worker backend.

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│                                                         │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │ index.   │   │ localStorage │   │ Service Worker  │  │
│  │ html     │──>│ (primary     │   │ (sw.js)         │  │
│  │ (11.6K   │   │  data store) │   │ Cache: stratos- │  │
│  │  lines)  │   └──────┬───────┘   │ v5, max 200     │  │
│  └────┬─────┘          │           └────────────────┘  │
│       │                │                                 │
└───────┼────────────────┼─────────────────────────────────┘
        │                │
        │  fetch()       │  API.scheduleSave() (debounced 1500ms)
        │                │
┌───────┼────────────────┼─────────────────────────────────┐
│       │         Cloudflare Worker                        │
│       │         /web/cloudflare-worker/src/index.js       │
│       │                │                                  │
│  ┌────┴──────┐   ┌─────┴──────┐   ┌──────────────────┐  │
│  │ Yahoo     │   │ D1 CRUD    │   │ KV Sync          │  │
│  │ Proxy     │   │ /api/*     │   │ /sync/load|save  │  │
│  │ /quote/*  │   │ 22 tables  │   │ (legacy backup)  │  │
│  │ /chart/*  │   └─────┬──────┘   └──────────────────┘  │
│  │ /batch    │         │                                  │
│  └────┬──────┘   ┌─────┴──────┐                          │
│       │          │ D1 SQLite  │                           │
│       │          │ (22 tables)│                           │
│       │          └────────────┘                           │
└───────┼──────────────────────────────────────────────────┘
        │
┌───────┼──────────────────────────────────────────────────┐
│       │            External APIs                         │
│  ┌────┴──────┐  ┌────────────┐  ┌─────────────────────┐ │
│  │ Yahoo     │  │ FMP        │  │ Finnhub             │ │
│  │ Finance   │  │ (direct)   │  │ (direct)            │ │
│  │ (proxied) │  │ 11 endpts  │  │ insider trades      │ │
│  └───────────┘  └────────────┘  └─────────────────────┘ │
│                 ┌────────────┐                           │
│                 │ ExchangeRate│                          │
│                 │ API (FX)    │                          │
│                 └────────────┘                           │
└──────────────────────────────────────────────────────────┘
```

---

## 1. Components

### 1.1 Frontend — web/index.html
Single monolithic HTML file (11,602 lines) containing all HTML, CSS, and JavaScript.
No build process, no frameworks, no npm — vanilla JS with CDN libraries.

**CDN Dependencies:**
- Chart.js v4.4.7 — charting
- Marked v15.0.7 — markdown rendering
- DOMPurify v3.2.4 — XSS protection
- jsPDF v2.5.2 — PDF export (lazy-loaded on first use)

**Six main views** (hash-routed):
| View | Purpose |
|------|---------|
| `#dashboard` | Net worth, alerts, benchmarks, quality score, FI tracker |
| `#companies` | Stock calculator, tracker, company profiles, charts |
| `#portfolio` | Multi-broker positions, transactions, snapshots, TWR/XIRR |
| `#research` | Notes (journal/news/market), earnings, filings, TODOs |
| `#framework` | Investment principles, 12-section checklist |
| `#reviews` | Periodic investment reviews, conviction tracking |

### 1.2 Backend — Cloudflare Worker (843 lines)
Serverless edge compute handling:
- Yahoo Finance proxy (CORS workaround + crumb/cookie auth)
- D1 database CRUD API (22 tables)
- KV sync endpoints (legacy)
- Data migration (localStorage → D1)

### 1.3 Database — Cloudflare D1 (SQLite)
22 tables for all app data. See `docs/d1-schema.sql` for full schema.

### 1.4 PWA — sw.js + manifest.json
Installable app with offline caching. Cache name: `stratos-v5`.

---

## 2. Data Flow

### 2.1 Read Flow (Loading Data)

```
User opens app
     │
     ├── D1 mode ON?
     │      │
     │      YES → fetch from Worker /api/* endpoint
     │      │         │
     │      │         ├── Success → use D1 data, write to localStorage as backup
     │      │         │
     │      │         └── Failure → fall back to localStorage
     │      │
     │      NO → load from localStorage directly
     │
     └── Populate in-memory variables (tStocks, pfAccounts, etc.)
```

**Fallback chain:** D1 → localStorage → hard-coded defaults

### 2.2 Write Flow (Saving Data)

```
User edits data (e.g., adds position)
     │
     ├── 1. Update in-memory variable (pfPositions[])
     │
     ├── 2. Write to localStorage immediately (synchronous, <1ms)
     │      localStorage.setItem('portfolio_positions_v1', JSON.stringify(...))
     │
     └── 3. If D1 mode ON:
            API.scheduleSave('pfPositions', callback)
                 │
                 ├── Debounce 1500ms (coalesce rapid edits)
                 ├── Mark dirty: localStorage key d1_dirty_pfPositions
                 ├── POST /api/positions/batch {items: [...]}
                 │      │
                 │      ├── Success → mark clean, clear dirty flag
                 │      │
                 │      └── Failure → retry up to 3x (exponential backoff: 2s, 4s, 6s)
                 │                    │
                 │                    └── All retries fail → keep in localStorage,
                 │                        show toast warning, sync on next save
                 │
                 └── D1 batch upsert: INSERT ... ON CONFLICT DO UPDATE
```

### 2.3 Conflict Resolution
**Strategy: Last-Write-Wins (LWW)**
- Each entity has implicit `updated_at` timestamp
- Batch upsert uses `INSERT ... ON CONFLICT DO UPDATE SET`
- No field-level merge — entire entity is replaced
- Dirty tracking prevents re-uploading unchanged data

---

## 3. Cache Layers

```
┌──────────────────────────────────────────────────┐
│ Layer 1: In-Memory (JS variables)                │
│ TTL: Page session only                           │
│ Examples: _savedStocksCache, _d1CompanyMap,       │
│           _recalcRAF, Chart.js instances          │
├──────────────────────────────────────────────────┤
│ Layer 2: localStorage                            │
│ TTL: Indefinite (until user clears browser)      │
│ Size: ~5-10 MB per origin                        │
│ Versioned keys: *_v1 suffix                      │
│ Schema version tracking (currently v7)           │
├──────────────────────────────────────────────────┤
│ Layer 3: Service Worker Cache (stratos-v5)       │
│ Strategy: Cache-first for assets,                │
│           Network-first for Worker calls,        │
│           Network-only for external APIs         │
│ Max entries: 200 (FIFO eviction)                 │
├──────────────────────────────────────────────────┤
│ Layer 4: D1 api_cache table                      │
│ TTL: Configurable per data_source (1-24 hours)   │
│ Stores: company_id, data_source, data_json,      │
│         fetched_at                               │
├──────────────────────────────────────────────────┤
│ Layer 5: Worker in-memory                        │
│ Yahoo crumb cache: 5 minutes                     │
│ Finnhub cache: 1 hour memory, 12 hour D1         │
└──────────────────────────────────────────────────┘
```

### localStorage Keys

| Key | Data | Module |
|-----|------|--------|
| `tracker_stocks_v1` | tStocks — company data, prices | Companies |
| `portfolio_accounts_v1` | pfAccounts — broker accounts | Portfolio |
| `portfolio_positions_v1` | pfPositions — holdings | Portfolio |
| `portfolio_transactions_v1` | pfTransactions — trade history | Portfolio |
| `portfolio_snapshots_v1` | pfSnapshots — point-in-time values | Portfolio |
| `portfolio_exchange_rates_v1` | pfExchangeRates — FX rates | Portfolio |
| `research_notes_v1` | researchNotes — journal/news/market | Research |
| `valuation_stocks` | Saved valuations (DCF, etc.) | Calculator |
| `dashboard_todos_v1` | dbTodos — general TODOs | Dashboard |
| `dashboard_fi_settings_v1` | dbFiSettings — FI calculator | Dashboard |
| `dashboard_benchmark_v1` | dbBenchmark — S&P 500 data | Dashboard |
| `dashboard_52w_highs_v1` | db52wHighs — 52-week tracking | Dashboard |
| `dividend_history_v1` | divHistory — per-ticker dividends | Dividends |
| `dividend_settings_v1` | divSettings — tracking config | Dividends |
| `framework_v1` | fwData — principles, rules | Framework |
| `reviews_v1` | rvData — investment reviews | Reviews |
| `d1_dirty_*` | Dirty tracking flags for D1 sync | Sync |
| `schema_version` | Data format version (currently 7) | Core |

---

## 4. External API Usage

| API | Access | Primary Use | Auth | Rate Limit |
|-----|--------|------------|------|------------|
| FMP | Direct from browser | Fundamentals, financials, earnings, historical prices | API key in query param | ~250/month (free tier) |
| Finnhub | Direct from browser | Insider transactions | API key in header | 60/minute (free) |
| Yahoo Finance | Via Worker proxy | Real-time quotes, EU stocks, chart data | Worker handles crumb/cookie | No explicit limit |
| ExchangeRate API | Direct from browser | FX rates for multi-currency portfolio | None (free tier) | ~1500/month |

**Fallback chain for stock data:** Yahoo (via proxy) → FMP (direct)

See `docs/API-REFERENCE.md` for complete endpoint documentation.

---

## 5. D1 Database Schema

22 tables organized by domain:

| Domain | Tables | Key Table |
|--------|--------|-----------|
| Companies | companies, company_todos, company_data_overrides | companies (symbol PK) |
| Research | notes, note_images | notes (FTS5 search) |
| Portfolio | broker_accounts, positions, transactions, portfolio_snapshots, snapshot_positions | positions (company_id + account_id) |
| Financials | earnings_timeline, filing_tracking, dividend_history, exchange_rates | earnings_timeline |
| Valuations | valuations | valuations (inputs_json, results_json) |
| Framework | framework_entries, checklist_templates, checklist_answers | checklist_answers |
| Reviews | reviews | reviews (company_id, review_date) |
| System | app_settings, api_cache, general_todos | app_settings (key-value) |

All tables have `id` (auto-increment) and most have `updated_at` (auto-updated).

Full schema: `docs/d1-schema.sql`

---

## 6. Sync & Migration

### 6.1 First-Time Migration (localStorage → D1)

```
User configures Worker URL + Sync Secret
     │
     └── Click "Migrate to Cloud"
              │
              ├── _gatherAllData() — collect all localStorage data
              ├── POST /api/migrate — send full payload
              │      │
              │      Worker: Clear all D1 tables
              │      Worker: INSERT all data (companies, notes, positions, etc.)
              │      Worker: Return migration stats
              │
              └── Fetch companies back, build _d1CompanyMap
                  Future saves go to D1 automatically
```

### 6.2 Ongoing Sync
- **Trigger:** Every data write calls `API.scheduleSave(key, callback)`
- **Debounce:** 1500ms default (coalesces rapid edits)
- **Batch upsert:** `INSERT ... ON CONFLICT DO UPDATE` (max 1000 items)
- **Dirty tracking:** localStorage flags (`d1_dirty_*`) prevent re-uploading unchanged data
- **Retry:** Up to 3 attempts with exponential backoff (2s → 4s → 6s)

### 6.3 Export/Import (Manual Sync)
- **Export:** `_gatherAllData()` → JSON file download
- **Import:** Parse JSON → merge via `_mergeArrayById()` → save to localStorage + D1

---

## 7. Security

### 7.1 API Key Storage
All API keys stored in localStorage only (never in source code):
- `st-apikey` — FMP API key
- `st-finnhub` — Finnhub API key
- `st-worker` — Worker URL
- `st-sync-secret` — Sync authentication secret

### 7.2 Worker Authentication
- All D1/sync endpoints require `X-Sync-Key` header
- Timing-safe comparison (`timingSafeEqual()`) prevents timing attacks
- CORS restricted to configured origins + `ALLOWED_ORIGINS` env var

### 7.3 Optional Encryption
- Password-based encryption for entire app (Web Crypto API)
- Scheme: PBKDF2 (key derivation) + AES-GCM (256-bit encryption)
- Recovery key available (SHA-256 hash)
- Encrypts localStorage data only (D1 data is unencrypted)

### 7.4 Content Security Policy
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
connect-src 'self' https://*.workers.dev https://financialmodelingprep.com
            https://finnhub.io https://api.exchangerate-api.com
            https://query1.finance.yahoo.com https://query2.finance.yahoo.com;
```

---

## 8. PWA & Offline Behavior

### Service Worker Strategy (sw.js)
| Request Type | Strategy |
|---|---|
| Local assets (HTML, icons) | Pre-cached on install |
| CDN libraries (Chart.js, etc.) | Pre-cached, failure ignored |
| External APIs (FMP, Finnhub) | Network-only |
| Worker/D1 calls | Network-first, cache fallback |
| Other assets | Cache-first, network fallback |

### Offline Behavior
- **Read:** Served from Service Worker cache
- **Write:** Saved to localStorage, synced when back online
- **API calls:** Return error with 503 status
- **User feedback:** Toast notification "Cloud save failed — data kept locally"

---

## 9. Key Architectural Decisions

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| Monolithic HTML file | No build process, easy static deploy | Poor code organization at 11.6K lines |
| No frameworks (vanilla JS) | Minimal bundle, fast load, no npm | Manual DOM manipulation, no reactivity |
| localStorage-first | Offline-first, immediate feedback | 5-10 MB limit, data loss risk if cleared |
| Last-write-wins sync | Simple implementation | No conflict detection across devices |
| Worker as Yahoo proxy | CORS workaround, secrets isolation | Extra latency vs direct API |
| D1 as optional cloud store | Progressive enhancement, works without | Dual read/write paths increase complexity |

See `docs/DECISIONS.md` (planned) for detailed ADRs.

---

## 10. File Organization

```
stratos-ventures/
├── CLAUDE.md                          — Dev guide (tech stack, commands, rules)
├── web/
│   ├── index.html                     — Main app (11,602 lines, all-in-one)
│   ├── sw.js                          — Service worker (caching)
│   ├── manifest.json                  — PWA manifest
│   ├── icon-192.png, icon-512.png     — App icons
│   └── cloudflare-worker/
│       ├── src/index.js               — Worker code (843 lines)
│       ├── wrangler.toml              — Cloudflare config (D1 binding, KV)
│       └── package.json
└── docs/
    ├── ARCHITECTURE.md                — This document
    ├── API-REFERENCE.md               — Complete API endpoint reference
    ├── ROADMAP.md                     — Phase tracker (0-18, all complete)
    ├── EXPANSION-PLAN.md              — Phase 11-18 detailed specs
    ├── BUG-HISTORY.md                 — QA audit (168 fixes, 21 categories)
    ├── DEVELOPMENT-WORKFLOW.md        — Session workflow guide
    ├── INVESTMENT-CHECKLIST.md        — Investment philosophy reference
    ├── d1-schema.sql                  — D1 database schema (22 tables)
    └── reference-desktop-schema.sql   — Legacy desktop schema (archive)
```

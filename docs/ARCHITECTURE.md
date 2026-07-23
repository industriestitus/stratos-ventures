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
Single monolithic HTML file (14,634 lines) containing all HTML, CSS, and JavaScript.
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

### 1.2 Backend — Cloudflare Worker (~1340 lines)
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
- Batch upsert uses `INSERT ... ON CONFLICT(<key>) DO UPDATE SET`
- No field-level merge — entire entity is replaced
- Dirty tracking prevents re-uploading unchanged data

**Natural-key upsert (fixed `36cf706`):** For rows the client inserts without an `id`, the conflict target is the table's **natural key** (e.g. `snapshot_positions` → `(snapshot_id, company_id, account_id)`, `valuations` → `(company_id, label)`, `exchange_rates` → `(rate_date, from_currency, to_currency)`), not `id`. The earlier `ON CONFLICT(id)` never fired for idless inserts, so re-saving the same logical row raised a UNIQUE violation (500'd the whole batch) or piled up duplicate rows. Each affected table now declares a `conflictTarget` in the Worker's `TABLES` map.

**Collision-resistant IDs (fixed `0fc3579`):** Client-minted ids formerly used per-device `max(id)+1`, so two offline devices could mint the *same* id for different objects and silently overwrite each other on sync. All client mint points now use `_mintId()` = `(epoch-seconds << 21) | 21-bit per-session counter` (random-seeded) — monotonic within a session, under `MAX_SAFE_INTEGER`, and effectively collision-free across devices. See ADR-034.

**Delete propagation (`cc3c9a2` → soft-delete `19faaf4`):** Rows the client only knows by natural key (framework entries, data overrides, valuations) are deleted via the Worker's natural-key DELETE route (`NATURAL_DELETE` allowlist), so a local delete propagates to D1. As of S2c (`19faaf4`) these are **soft** deletes: the natural-key DELETE route `UPDATE … SET deleted_at` (instead of `DELETE`) when the table has a `deleted_at` column, by-id deletes PUT `deleted_at`, and loads filter tombstones — so a stale second device can no longer resurrect the row (KNOWN-ISSUES SA.3 resolved). `framework_entries` / `company_data_overrides` / `valuations` / `note_images` now all carry `deleted_at`, matching notes/reviews. Natural-key tables send `deleted_at:null` on live upsert so re-adding the same key un-tombstones it.

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

**Tracker load hydration (`af214e4`):** D1 keeps live metrics only in Layer 4 (`api_cache`), never on the `companies` row. So on a fresh D1-mode reload `loadTrackerStocks` backgrounds a **cache-first** pass — `cachedFetch(...,cacheOnly=true)` reads `api_cache` read-only and never calls the live API — so the tracker shows last-known metrics + manual overrides immediately instead of all-dashes-until-Refresh-All. `_d1CompanyToTStock` also applies `overriddenData` onto the top-level metric fields so overrides survive a reload without a fetch. Live refresh stays on-demand (Refresh All / opening a company).

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

### 5.1 Client-Side Data Structures

The app uses global JavaScript variables as its primary data store. Each variable maps to a localStorage key (local mode) or D1 table (cloud mode).

#### tStocks[ticker] — Company/Stock Object

Map of ticker strings to company data objects. This is the central data structure — almost every module reads from it.

| Field | Type | Description |
|-------|------|-------------|
| `ticker` | string | Symbol (e.g. "AAPL") |
| `name` | string | Company name |
| `price` | number\|null | Current stock price |
| `marketCap` | number\|null | Market capitalization |
| `currency` | string | Trading currency |
| `exchange` | string | Stock exchange |
| `sector` | string | GICS sector |
| `pipeline` | string | Stage: watchlist / review / buy_target / owned / archived |
| `companyType` | string | slow / medium / fast / cyclical / turnaround / asset |
| `dateAdded` | string | ISO date when first tracked |
| `archivedAt` | string\|null | ISO timestamp if archived |
| `sortOrder` | number | Display order in tracker |
| `pinned` | boolean | Pinned to top of tracker |
| `tags` | string[] | User-defined tags |
| **Financial Data (from API)** | | |
| `revenue` | number | Total revenue |
| `revenueGrowth` | number | YoY revenue growth % |
| `revCAGR` | number | 3-year revenue CAGR |
| `revGrowthY` | number | Revenue growth YoY |
| `epsDiluted` | number | Diluted EPS |
| `epsGrowth` | number | EPS growth % |
| `grossMargin` | number | Gross margin % |
| `operatingMargin` | number | Operating margin % |
| `netMargin` | number | Net margin % |
| `roe` | number | Return on equity % |
| `roic` | number | Return on invested capital % |
| `roa` | number | Return on assets % |
| `debtEquity` | number | Debt/equity ratio |
| `currentRatio` | number | Current ratio |
| `totalDebt` | number | Total debt |
| `totalCash` | number | Total cash & equivalents |
| `dividendYield` | number | Dividend yield % |
| `ebit` | number | EBIT |
| `ebitda` | number | EBITDA |
| `fcf` | number | Free cash flow |
| `ocf` | number | Operating cash flow |
| `sbc` | number | Stock-based compensation |
| `fcfSbc` | number | FCF minus SBC |
| `ocfSbc` | number | OCF minus SBC |
| **Preserved Fields (not overwritten by API refresh)** | | |
| `overrides` | object | Manual metric overrides {field: value} |
| `overriddenData` | object | Applied override values |
| `checklist` | object | 14-section analysis checklist data |
| `todos` | object[] | Per-company TODO items |
| `valuations` | object[] | Saved valuation snapshots |
| `valuationHistory` | object[] | Historical valuation snapshots |
| `scenarios` | object | Bear/Base/Bull scenario builder data |
| `thesis` | string | Investment thesis text |
| `notes` | string | Company notes |
| `earnings` | object | Per-quarter earnings grid data |
| `earningsCalendar` | object[] | Upcoming earnings dates |
| `filings` | object | 10K/10Q filing tracking |
| `sellTriggers` | object | Sell trigger conditions |
| `priceAlerts` | object | {above: number, below: number} — D1: `companies.price_alerts` (encrypted JSON, S2a-2) |
| `dcfMode` | string | "fcf" or "fcff" DCF mode |
| `evaWacc` | number | WACC for EVA calculation |
| `expectedReturn` | object | Expected return breakdown data |
| `conviction` | number | Current conviction level (1-10) |
| `convictionHistory` | object[] | [{date, level, notes}] timeline |
| `learningLog` | object[] | "Where I was wrong" entries |
| `followSources` | object | External URL links |
| `pipelineStatus` | string | Pipeline sub-status |
| **Transient Fields (not persisted)** | | |
| `_d` | object | Raw FMP profile data |
| `_cfData` | object[] | Cash flow statement data (3yr) |
| `_bsData` | object[] | Balance sheet data (3yr) |
| `_isData` | object[] | Income statement data (3yr) |
| `_origData` | object | Original API data before overrides |
| `_source` | string | Data source ("fmp" or "yahoo") |
| `_d1Id` | number | D1 database row ID |

**localStorage key:** `tracker_stocks_v1`
**D1 table:** `companies` + child tables

---

#### pfPositions[] — Portfolio Position

Array of position objects. Supports multiple asset types with type-specific extra fields.

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique ID (auto-generated) |
| `ticker` | string | Ticker symbol or identifier |
| `name` | string | Display name |
| `accountId` | number | FK to pfAccounts[].id |
| `assetType` | string | stock / etf / bond / real_estate / cash / crypto / other |
| `shares` | number | Number of shares/units |
| `avgCost` | number | Average cost per share |
| `currentPrice` | number\|null | Manual price override (null = auto-fetch) |
| `currency` | string | Position currency (e.g. "USD") |
| `notes` | string | Free-text notes |
| `pinned` | boolean | Pinned to top of list |
| `companyId` | string | D1 company ID (cloud sync) |
| `deleted_at` | string\|null | Soft-delete timestamp |
| `createdAt` | string | ISO creation timestamp |
| `updatedAt` | string | ISO last update timestamp |

**Real Estate extra fields** (`assetType === "real_estate"`):

| Field | Type | Description |
|-------|------|-------------|
| `reLocation` | string | Property location/address |
| `rePurchaseDate` | string | Purchase date (YYYY-MM-DD) |
| `rePurchasePrice` | number | Original purchase price |
| `reCurrentValue` | number | Current estimated value |
| `reMonthlyRental` | number | Monthly rental income |
| `reAnnualCosts` | number | Annual costs (tax/maintenance) |

**Bond extra fields** (`assetType === "bond"`):

| Field | Type | Description |
|-------|------|-------------|
| `bondType` | string | E.g. "MÁP+", "US Treasury" |
| `bondFaceValue` | number | Face/par value |
| `bondCouponRate` | number | Annual coupon rate % |
| `bondMaturityDate` | string | Maturity date (YYYY-MM-DD) |
| `bondPaymentFreq` | string | annual / semi-annual / quarterly / monthly |

**Cash extra fields** (`assetType === "cash"`):

| Field | Type | Description |
|-------|------|-------------|
| `cashAmount` | number | Cash amount held |

**localStorage key:** `portfolio_positions_v1`
**D1 table:** `positions`

---

#### pfAccounts[] — Broker Account

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique ID |
| `name` | string | Account name (e.g. "IBKR", "Revolut") |
| `currency` | string | Base currency for the account |
| `isActive` | boolean | Whether account is active |
| `createdAt` | string | ISO creation timestamp |

**localStorage key:** `portfolio_accounts_v1`
**D1 table:** `broker_accounts`

---

#### pfTransactions[] — Transaction

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique ID |
| `type` | string | buy / sell / dividend |
| `date` | string | Transaction date (YYYY-MM-DD) |
| `ticker` | string | Stock ticker symbol |
| `accountId` | number | FK to pfAccounts[].id |
| `shares` | number | Number of shares |
| `pricePerShare` | number | Price per share |
| `totalAmount` | number | Total transaction amount |
| `fees` | number | Transaction fees (default 0) |
| `currency` | string | Inherited from linked account |
| `notes` | string | Free-text notes |
| `companyId` | number | D1 company ID |
| `deleted_at` | string\|null | Soft-delete timestamp |
| `createdAt` | string | ISO creation timestamp |

**localStorage key:** `portfolio_transactions_v1`
**D1 table:** `transactions`

---

#### pfSnapshots[] — Portfolio Snapshot

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique ID |
| `date` | string | Snapshot date (YYYY-MM-DD, one per day) |
| `totalValue` | number | Total portfolio value in base currency |
| `baseCurrency` | string | Base currency at time of snapshot |
| `notes` | string | Free-text notes |
| `positions` | object[] | Array of position snapshots (see below) |
| `createdAt` | string | ISO creation timestamp |

**Snapshot position fields** (each element in `positions[]`):

| Field | Type | Description |
|-------|------|-------------|
| `ticker` | string | Stock ticker |
| `accountId` | number | FK to pfAccounts[].id |
| `assetType` | string | Asset type at snapshot time |
| `shares` | number | Shares held |
| `pricePerShare` | number | Price at snapshot time |
| `marketValue` | number | shares × price in position currency |
| `currency` | string | Position currency |
| `valueInBase` | number | Converted to base currency (local only, not persisted to D1) |

**localStorage key:** `portfolio_snapshots_v1`
**D1 tables:** `portfolio_snapshots` + `snapshot_positions`

---

#### researchNotes — Research Notes

Object with three note arrays plus an ID counter.

```
{journal: NoteEntry[], news: NoteEntry[], market: NoteEntry[], _nextId: number}
```

**NoteEntry fields** (shared base, type-specific extras):

| Field | Type | Used by | Description |
|-------|------|---------|-------------|
| `id` | number | all | Unique ID |
| `date` | string | all | Note date (YYYY-MM-DD) |
| `pinned` | boolean | all | Pinned to top |
| `content` | string | journal, market | Body text (Markdown) |
| `comment` | string | news | Body text for news entries |
| `ticker` | string | journal, news | Associated company ticker |
| `action` | string | journal | note / buy / sell / add / trim |
| `title` | string | market | Entry title |
| `tags` | string[] | market | Category tags |
| `source` | string | news | Source name |
| `sourceUrl` | string | news | Source URL |
| `excerpt` | string | news | Key excerpt |
| `quarter` | string\|null | all | Associated quarter (e.g. "Q1 2026") |
| `images` | object[] | all | [{data: base64, name: filename}] |
| `deleted_at` | string\|null | all | Soft-delete timestamp |
| `createdAt` | string | all | ISO creation timestamp |

**localStorage key:** `research_notes_v1`
**D1 table:** `notes` + `note_images`

---

#### rvData — Reviews

```
{entries: ReviewEntry[], _nextId: number}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique ID |
| `type` | string | weekly / monthly / quarterly |
| `date` | string | Review date (YYYY-MM-DD) |
| `companyTicker` | string | Associated ticker (quarterly reviews) |
| `companyId` | number\|null | D1 company FK |
| `answers` | object | {questionId: answerText} map (e.g. {w1:"...", m3:"..."}) |
| `summary` | string | Free-text summary |
| `deleted_at` | string\|null | Soft-delete timestamp |
| `createdAt` | string | ISO creation timestamp |

**Answer keys:** Weekly w1-w9, Monthly m1-m11, Quarterly q1-q13 (from `RV_QUESTIONS`).

**localStorage key:** `reviews_v1`
**D1 table:** `reviews`

---

#### fwData — Framework

```
{principles: FwCard[], portfolioRules: FwCard[], idealTraits: FwItem[], avoidList: FwItem[],
 scoringWeights: {cagr, conviction, risk}, _nextId: number}
```

**FwCard fields** (principles, portfolioRules):

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique ID |
| `title` | string | Card heading |
| `content` | string | Body text (Markdown) |
| `sortOrder` | number | Display order |

**FwItem fields** (idealTraits, avoidList):

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique ID |
| `label` | string | Display label |
| `category` | string | Grouping category |
| `sortOrder` | number | Display order |

**localStorage key:** `framework_v1`
**D1 table:** `framework_entries` + `app_settings` (scoring weights)

---

#### dbTodos[] — Dashboard TODOs

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique ID |
| `text` | string | Task description |
| `due` | string | Due date (YYYY-MM-DD or "") |
| `done` | boolean | Completion status |
| `createdAt` | string | ISO creation timestamp |

**localStorage key:** `dashboard_todos_v1`
**D1 table:** `general_todos`

---

#### divHistory — Dividend History

Object keyed by ticker. Each `divHistory[ticker]` contains:

| Field | Type | Description |
|-------|------|-------------|
| `history` | object[] | Individual payment records (see below) |
| `lastFetched` | string | ISO timestamp of last API fetch |
| `yield` | number\|null | TTM dividend yield % |
| `payoutRatio` | number\|null | Payout ratio % |
| `annualDPS` | number | Trailing-twelve-month dividends per share |
| `frequency` | string | Detected payment frequency |
| `growthRate1y` | number\|null | 1-year dividend growth CAGR |
| `growthRate3y` | number\|null | 3-year dividend growth CAGR |
| `growthRate5y` | number\|null | 5-year dividend growth CAGR |
| `growthRate10y` | number\|null | 10-year dividend growth CAGR |

**Dividend payment record** (each element in `history[]`):

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Ex-dividend date |
| `paymentDate` | string | Payment date |
| `adjDividend` | number | Adjusted dividend amount |
| `dividend` | number | Raw dividend amount |

**localStorage key:** `dividend_history_v1`
**D1 table:** `dividend_history`

---

#### pfExchangeRates — Exchange Rates

| Field | Type | Description |
|-------|------|-------------|
| `baseCurrency` | string | User's base currency (default "HUF") |
| `rates` | object | Currency pair rates — D1: "FROM/TO" keys (e.g. "USD/EUR"), local: currency code keys |
| `lastFetched` | string\|null | ISO timestamp of last fetch |

**localStorage key:** `portfolio_exchange_rates_v1`
**D1 tables:** `exchange_rates` (rates) + `app_settings` key `exchange_rates_config`

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
- **Batch upsert:** `INSERT ... ON CONFLICT(<natural key or id>) DO UPDATE` (max 1000 items). See §2.3 for the natural-key upsert fix.
- **Dirty tracking:** localStorage flags (`d1_dirty_*`) prevent re-uploading unchanged data
- **Retry:** Up to 3 attempts with exponential backoff (2s → 4s → 6s)
- **IDs:** new rows get collision-resistant ids from `_mintId()` (see §2.3)
- **Client-only fields:** all now sync cross-device — widget config + screener presets (S2a-1, `app_settings`), priceAlerts/tags/idealTrait+avoid checks (S2a-2, `companies` columns), research-note images (S2a-3, `note_images`), and non-stock positions + all position detail fields incl. stock currentPrice/notes (S2b, `positions.details` blob + synthetic `companies.holder_type` anchor). Delete propagation is soft-delete across the board (S2c, `deleted_at` on framework/override/valuation/note_images). **The S2 cross-device batch is complete.**
- **Synthetic holder companies (S2b):** a non-stock position (cash/RE/bond) needs a `company_id` (positions.company_id is NOT NULL) but has no real company. It gets a synthetic `companies` row tagged `holder_type`, held in the client `_holderCompanies` map — deliberately NOT in `tStocks`, so every view that iterates `tStocks` (tracker/screener/comparison/dividends/search/dashboard) excludes it automatically. `_d1CompanyMap` still carries the holder id so the position resolves its ticker on load. A ticker is EITHER a tracked stock OR a holder, never both (UNIQUE `companies.symbol`).

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
│   ├── index.html                     — Main app (14,634 lines, all-in-one)
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

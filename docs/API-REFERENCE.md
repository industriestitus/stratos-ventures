# Stratos Ventures Finance App - API Reference

**Last Updated:** 2026-07-01
**App Version:** Multi-platform (Web with Cloudflare Worker backend)
**Base URL:** Configured per API provider

---

## Table of Contents

1. [Cloudflare Worker Endpoints](#cloudflare-worker-endpoints)
2. [Financial Modeling Prep (FMP) API](#fmp-api)
3. [Finnhub API](#finnhub-api)
4. [Yahoo Finance API (via Proxy)](#yahoo-finance-api)
5. [Cloudflare D1 Database](#cloudflare-d1-database)
6. [Rate Limiting & Throttling](#rate-limiting--throttling)
7. [API Key Management](#api-key-management)
8. [Error Handling & Fallbacks](#error-handling--fallbacks)
9. [Caching Strategy](#caching-strategy)

---

## Cloudflare Worker Endpoints

**Base URL:** `https://{WORKER_NAME}.workers.dev` (User-configured)

### Health Check
- **Endpoint:** `GET /` or `GET /health`
- **Auth:** None
- **Response:** `{status: "ok", ts: "ISO-8601-timestamp"}`
- **Line:** cloudflare-worker/src/index.js:745

### Yahoo Finance Quote - Single Symbol
- **Endpoint:** `GET /quote/{SYMBOL}`
- **Auth:** Required - `X-Sync-Key` header (timing-safe comparison)
- **Query Parameters:**
  - `modules` (optional): Comma-separated list of data modules to fetch
    - Default: `price,financialData,incomeStatementHistory,cashflowStatementHistory,defaultKeyStatistics,balanceSheetHistory`
    - Example: `price,financialData,defaultKeyStatistics`
- **Response:** Yahoo quoteSummary JSON structure
- **Line:** cloudflare-worker/src/index.js:750-763
- **Implementation:**
  - Handles Yahoo's crumb/cookie authentication server-side
  - Retries with fresh crumb if 401/403 received
  - Caches crumb + cookie for 5 minutes
  - User-Agent: Mozilla/5.0 Chrome 120.0.0.0

### Yahoo Finance Quote - Batch
- **Endpoint:** `GET /batch?symbols=AAPL,GOOGL,MSFT`
- **Auth:** Required - `X-Sync-Key` header
- **Query Parameters:**
  - `symbols`: Comma-separated ticker list (required)
  - `modules` (optional): Same as single quote endpoint
- **Response:** `{AAPL: {...}, GOOGL: {...}, ...}` or `{SYMBOL: {error: HTTP_STATUS}}`
- **Limits:** Max 10 symbols per request
- **Line:** cloudflare-worker/src/index.js:766-780
- **Implementation:**
  - Sequential processing to avoid rate limits
  - Individual error handling per symbol

### Yahoo Finance Chart Data
- **Endpoint:** `GET /chart/{SYMBOL}`
- **Auth:** Required - `X-Sync-Key` header
- **Query Parameters:**
  - `range` (optional): `1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max` (default: `1y`)
  - `interval` (optional): `1m, 5m, 15m, 30m, 60m, 1d, 1wk, 1mo, 3mo` (default: `1wk`)
- **Response:** Chart data with `{chart: {result: [{timestamp: [...], indicators: {quote: [{close: [...], ...}]}}]}}`
- **Line:** cloudflare-worker/src/index.js:813-828
- **Implementation:**
  - Calls Yahoo's v8/finance/chart endpoint directly
  - Proxies response with CORS headers

### Data API Proxy (FMP / Finnhub)
- **Endpoint:** `GET /proxy/{provider}/{endpoint}`
  - `provider`: `fmp` or `finnhub`
  - `endpoint`: upstream API path (e.g. `profile`, `stock/insider-transactions`)
- **Auth:** Required - `X-Sync-Key` header (timing-safe comparison)
- **Method:** GET only (others → 405)
- **Query Parameters:** Forwarded to the upstream API. The client's `apikey`/`token`/keyParam values are stripped (case-insensitive) and replaced with the Worker's server-side secret.
- **Response:** Upstream JSON passed through verbatim, with the secret scrubbed from the body as defense-in-depth. Upstream status codes (401/403/429) surface unchanged.
- **Purpose:** Keeps FMP/Finnhub API keys server-side (`FMP_KEY`, `FINNHUB_KEY` secrets) so they never reach the browser or appear in URLs.
- **Security:**
  - SSRF/open-proxy prevented: fixed per-provider base host + endpoint regex `^[A-Za-z0-9/_.,-]+$` (dots/commas allowed for symbols like `EVO.ST` and batch `AAPL,MSFT`; explicit `..` block prevents traversal; no scheme, host, or query injection)
  - Provider lookup uses `Object.hasOwn` (prototype-safe)
  - `redirect: 'manual'` on the upstream fetch
  - Dedicated rate-limit bucket: 60 requests/min per IP
- **Line:** cloudflare-worker/src/index.js — `handleProxy`, `PROXY_UPSTREAMS`, `/proxy/` dispatch

### Master-Password Auth (`/auth/*`) — Security v2 / Phase B
Token-based auth derived from a single master password. Runs alongside the legacy
sync key during the transition: **all data endpoints accept `X-Sync-Key` OR `X-Auth-Token`** (`authenticate()` helper, dual-auth).

Client derivation: `masterBits = PBKDF2(password, salt, 600k, SHA-256)` → HKDF-Expand into `authKey` (info `stratos-auth-v1`, sent to server) and `encKey` (info `stratos-enc-v1`, never leaves the device; used for Phase C E2EE). Server stores only `SHA-256(authKey)` as the verifier.

- **`GET /auth/salt`** — public. Returns `{salt, initialized}` so the client can derive its authKey before login.
- **`POST /auth/setup`** — one-time bootstrap, **gated by `X-Sync-Key`** (only the existing owner can establish auth). Body `{salt, authVerifier}`. Allows overwrite (re-setup) while the sync key exists.
- **`POST /auth/login`** — public, brute-force limited. Body `{authKey, device}`. On match issues a 256-bit bearer token (stored hashed in KV, 180-day TTL). Returns `{token, device}`.
- **`POST /auth/change`** — change master password. Requires a live session (`X-Auth-Token`/`X-Sync-Key`) **AND** proof of the current password (`oldAuthKey`). Body `{oldAuthKey, salt, authVerifier}`. **Revokes ALL device tokens** (deletes every `token_*` key) so a compromised token cannot survive a password change — every device must sign in again. The client re-logs-in immediately to refresh the current device's token. This is the recovery/rotation path that keeps the account changeable after the sync key is retired.
- **`GET /auth/devices`** — list active device tokens (requires auth). Returns opaque ids (token-hash prefixes), never the tokens.
- **`POST /auth/revoke`** — revoke a device token by id (requires auth). Body `{id}`.
- **Brute-force:** per-IP KV counter (`authfail_<ip>`), 10 fails → 15-min lockout; plus a 20/min per-IP rate-limit bucket. `CF-Connecting-IP` is edge-set (not spoofable).
- **KV keys:** `auth_config` (salt + verifier), `token_<sha256(token)>` (device tokens), `authfail_<ip>` (brute-force). Reuses the existing `SYNC_DATA` binding — no new secret required.
- **Line:** cloudflare-worker/src/index.js — `handleAuth`, `authenticate`, `/auth/` dispatch

### Data Sync - Load
- **Endpoint:** `GET /sync/load`
- **Auth:** Required - `X-Sync-Key` header
- **Response:** `{ok: true, data: {...} | null}`
- **Storage:** Cloudflare KV binding (`SYNC_DATA`)
- **Line:** cloudflare-worker/src/index.js:788-796
- **Use:** Loads user data from KV storage (async sync)

### Data Sync - Save
- **Endpoint:** `POST /sync/save`
- **Auth:** Required - `X-Sync-Key` header
- **Request Body:** JSON object with user state
- **Response:** `{ok: true, savedAt: "ISO-8601-timestamp"}`
- **Line:** cloudflare-worker/src/index.js:797-809
- **Implementation:**
  - Backup existing data to `user_data_backup` before overwrite
  - Stores to `user_data` key in KV

### Sync Meta (Encryption Metadata)
- **Endpoint:** `GET /sync/meta`
- **Auth:** Required - `X-Sync-Key` header
- **Response:** `{ok: true, meta: {meta_version, mode, has_encryption, enc_salt, enc_verify, enc_recovery}}`
- **Note:** Returns `null` meta if no metadata exists yet

- **Endpoint:** `POST /sync/meta`
- **Auth:** Required - `X-Sync-Key` header
- **Request Body:** `{meta: {...}, expected_version: N}` — expected_version enables optimistic locking (409 on conflict)
- **Response:** `{ok: true, savedAt: "ISO-8601-timestamp"}` or `{error: "Version conflict", current_version: N}` (409)

### Sync Restore Backup
- **Endpoint:** `POST /sync/restore-backup`
- **Auth:** Required - `X-Sync-Key` header
- **Response:** `{ok: true, restoredAt: "ISO-8601-timestamp"}` or `{error: "No backup available"}` (404)
- **Note:** Restores `user_data` from `user_data_backup` (created automatically on each /sync/save)

### Sync Save — enc_version Guard
- `/sync/save` now accepts optional `enc_version` field in the request body
- If `enc_version < meta.meta_version`, the save is rejected with 409 (prevents overwriting with stale encryption)

### D1 Database CRUD - Generic API
- **Endpoint:** `GET|POST|PUT|DELETE /api/{table}[/{id}]`
- **Auth:** Required - `X-Sync-Key` header (timing-safe comparison)
- **Base Path:** cloudflare-worker/src/index.js:831-838

#### GET (List all rows)
- **Endpoint:** `GET /api/{table}`
- **Query Parameters:**
  - `limit` (default: 500, max: 1000)
  - `offset` (default: 0)
  - `filter` (optional): Column name to filter by
  - `filter_value` (required if filter set)
- **Response:** `{data: [{...}], total: int, limit: int, offset: int}`
- **Line:** cloudflare-worker/src/index.js:159-182

#### GET (Fetch single row)
- **Endpoint:** `GET /api/{table}/{id}`
- **Response:** Single row object or `{error: "Not found"}` (404)
- **Line:** cloudflare-worker/src/index.js:185-188

#### POST (Create new row)
- **Endpoint:** `POST /api/{table}`
- **Request Body:** JSON object with column values
- **Response:** `{...created_row, id: auto_increment}` (201)
- **Constraints:** UNIQUE, FOREIGN KEY checked; returns 409 on violation
- **Line:** cloudflare-worker/src/index.js:191-215

#### PUT (Update row)
- **Endpoint:** `PUT /api/{table}/{id}`
- **Request Body:** JSON object with column values to update
- **Response:** Updated row object
- **Auto-Fields:** `updated_at` set to `datetime('now')` if table has it
- **Line:** cloudflare-worker/src/index.js:217-242

#### DELETE (Remove row)
- **Endpoint:** `DELETE /api/{table}/{id}`
- **Response:** `{ok: true, deleted: {...previous_row}}`
- **Cascades:** Enforced via FOREIGN KEY constraints; notes on companies explicitly deleted
- **Line:** cloudflare-worker/src/index.js:245-254

#### Batch Upsert
- **Endpoint:** `POST /api/{table}/batch`
- **Request Body:** `{items: [{...}, {...}]}`
- **Limits:** Max 1000 items per batch
- **Logic:** INSERT OR REPLACE (upsert) on primary key conflict
- **Auto-Fields:** `updated_at` set if table supports it
- **Response:** `{ok: true, results: [{id/key: ..., action: "upserted"}, ...]}`
- **Line:** cloudflare-worker/src/index.js:653-709

#### Special Endpoints

**Company Full Profile:**
- **Endpoint:** `GET /api/companies/{symbol|id}/full`
- **Response:** Company + all related data (todos, earnings, filings, overrides, notes, checklists, reviews, valuations, positions, dividends)
- **Line:** cloudflare-worker/src/index.js:621-623, 259-298

**Notes Search:**
- **Endpoint:** `POST /api/notes/search?q={query}`
- **Query:** Min 2 chars, max 200 chars
- **FTS:** Uses FTS5 if available, falls back to LIKE
- **Response:** `{data: [{...notes}], query: "...", fallback?: true}`
- **Line:** cloudflare-worker/src/index.js:624-626, 300-320

**Cache Check:**
- **Endpoint:** `GET /api/cache-check/{company_id}/{data_source}`
- **Response:** `{cached: true, data: {...}, fetched_at: "..."}` or `{cached: false}`
- **Line:** cloudflare-worker/src/index.js:628-634

**Cache Upsert:**
- **Endpoint:** `PUT /api/cache-upsert`
- **Request Body:** `{company_id: int, data_source: string, data_json: object}`
- **Response:** `{ok: true}`
- **Line:** cloudflare-worker/src/index.js:635-642

**Data Migration:**
- **Endpoint:** `POST /api/migrate`
- **Request Body:** Legacy app state (trackerStocks, researchNotes, portfolioAccounts, etc.)
- **Response:** `{ok: true, stats: {companies: X, todos: Y, ...}, errors?: [...]}`
- **Line:** cloudflare-worker/src/index.js:643-650, 322-609

---

### D1 Database Tables

| Table | Columns | PK | hasUpdatedAt |
|-------|---------|----|----|
| `companies` | symbol, name, sector, currency, exchange, company_type, pipeline_status, thesis, sort_order | id | ✓ |
| `company_todos` | company_id, title, due_date, is_done, sort_order | id | ✓ |
| `earnings_timeline` | company_id, year, quarter, is_reported, is_reviewed, report_date | id | ✓ |
| `filing_tracking` | company_id, filing_type, fiscal_year, fiscal_quarter, is_read, filed_date, notes | id | ✓ |
| `company_data_overrides` | company_id, metric_key, original_value, override_value, reason | id | ✓ |
| `notes` | company_id, note_type, title, content, note_date, quarter, source_name, source_url, is_pinned | id | ✓ |
| `note_images` | note_id, filename, mime_type, image_data, sort_order | id | ✗ |
| `broker_accounts` | name, currency, is_active | id | ✓ |
| `positions` | company_id, account_id, shares, avg_cost | id | ✓ |
| `transactions` | company_id, account_id, transaction_type, transaction_date, shares, price_per_share, total_amount, fees, currency, notes | id | ✗ |
| `portfolio_snapshots` | snapshot_date, total_value, base_currency, notes | id | ✗ |
| `snapshot_positions` | snapshot_id, company_id, account_id, shares, price_per_share, market_value, currency, intent | id | ✗ |
| `exchange_rates` | rate_date, from_currency, to_currency, rate | id | ✗ |
| `dividend_history` | company_id, ex_date, pay_date, amount, currency, frequency | id | ✗ |
| `framework_entries` | category, title, content, sort_order | id | ✓ |
| `checklist_templates` | section_key, title, description, fields_json, sort_order | id | ✓ |
| `checklist_answers` | company_id, template_id, answer_json, progress, status | id | ✓ |
| `reviews` | review_type, review_date, company_id, answers_json, summary | id | ✓ |
| `valuations` | company_id, method, label, currency, scale, inputs_json, results_json, intrinsic_value, upside_pct, is_primary, valuation_date | id | ✓ |
| `general_todos` | title, due_date, is_done, sort_order | id | ✓ |
| `app_settings` | key, value | key (unique) | ✗ |
| `api_cache` | company_id, data_source, data_json, fetched_at | (company_id, data_source) | ✗ |

---

## FMP API

**Base URL:** `https://financialmodelingprep.com/stable`
**Auth:** Query parameter `apikey` (URL-encoded)
**Key Storage:** `stSettings().apiKey` from localStorage (`st-apikey` input)
**Timeout:** 15 seconds default

### Profile
- **Endpoint:** `GET /profile?symbol={TICKER}&apikey={KEY}`
- **Response:** Array with single company object: `[{companyName, price, marketCap, totalDebt, cashAndCashEquivalents, ...}]`
- **Line:** web/index.html:8435
- **Usage:** Fallback stock data when Yahoo unavailable; primary source for: companyName, price, marketCap, totalDebt, totalCash

### Income Statement
- **Endpoint:** `GET /income-statement?symbol={TICKER}&limit={N}&apikey={KEY}`
- **Response:** Array of annual statements (newest first): `[{revenue, netIncome, operatingIncome, grossProfit, epsDiluted, ...}]`
- **Typical Limit:** 1-10
- **Line:** web/index.html:8436, 8448
- **Usage:** Extract revenue, profit, EBIT, EPS, margins; historical data for charts

### Cash Flow Statement
- **Endpoint:** `GET /cash-flow-statement?symbol={TICKER}&limit={N}&apikey={KEY}`
- **Response:** Array of annual statements: `[{operatingCashFlow, freeCashFlow, capitalExpenditure, stockBasedCompensation, commonStockRepurchased, depreciationAndAmortization, ...}]`
- **Typical Limit:** 1-10
- **Line:** web/index.html:8437, 8457
- **Usage:** OCF, FCF, SBC, buyback, D&A; used for valuation models

### Balance Sheet Statement
- **Endpoint:** `GET /balance-sheet-statement?symbol={TICKER}&limit={N}&apikey={KEY}`
- **Response:** Array of statements: `[{totalCurrentAssets, totalCurrentLiabilities, totalDebt, totalStockholdersEquity, cashAndCashEquivalents, ...}]`
- **Typical Limit:** 1-3
- **Line:** web/index.html:6850
- **Usage:** Working capital delta, goodwill/intangibles; historical charts

### Financial Growth
- **Endpoint:** `GET /financial-growth?symbol={TICKER}&limit={N}&apikey={KEY}`
- **Response:** Array of metrics: `[{revenueGrowth (as decimal), epsgrowth, epsdilutedGrowth, ...}]`
- **Typical Limit:** 1
- **Line:** web/index.html:8438
- **Usage:** Revenue growth %, EPS growth % (multiplied by 100)

### Key Metrics (TTM - Trailing Twelve Months)
- **Endpoint:** `GET /key-metrics-ttm?symbol={TICKER}&limit={N}&apikey={KEY}`
- **Response:** Array: `[{roicTTM, roeTTM, debtToEquityTTM, currentRatioTTM, grossProfitMarginTTM, ...}]`
- **Typical Limit:** 1
- **Line:** web/index.html:8446, 8459
- **Usage:** ROIC, ROE, debt ratios, current ratio, gross margin (if Yahoo missing)

### Historical Dividends
- **Endpoint:** `GET /historical-price-full/stock_dividend/{TICKER}?apikey={KEY}`
- **Response:** `{historical: [{date, paymentDate, adjDividend, dividend, ...}]}`
- **Line:** web/index.html:7914
- **Usage:** Dividend history; calculates yield, growth rates, payout ratio

### Earnings Calendar
- **Endpoint:** `GET /earning-calendar?symbol={TICKER}&apikey={KEY}`
- **Response:** Array of earnings dates: `[{date, symbol, quarter, ...}]`
- **Line:** web/index.html:5282
- **Usage:** Earnings dates for company tracking

### Historical Prices (for benchmark data)
- **Endpoint:** `GET /historical-price-full/SPY?from={YYYY-MM-DD}&to={YYYY-MM-DD}&apikey={KEY}`
- **Response:** `{historical: [{date, close, ...}]}`
- **Line:** web/index.html:5017
- **Usage:** S&P 500 benchmark performance for dashboard comparisons

### Batch Quote
- **Endpoint:** `GET /quote/{TICKER1},{TICKER2},{TICKER3}?apikey={KEY}`
- **Response:** Array: `[{symbol, price, change, ...}]`
- **Line:** web/index.html:5101
- **Usage:** Quick price updates for multiple tickers

### Error Handling
- **429 Rate Limit:** Shown as toast "FMP rate limit — wait a moment"
- **401/403 Invalid Key:** Shown as toast "FMP API key invalid"
- **No Error Message:** Returns `null` and logs warning
- **Line:** web/index.html:8265-8284

---

## Finnhub API

**Base URL:** `https://finnhub.io/api/v1`
**Auth:** Query parameter `token` (URL-encoded)
**Key Storage:** `stSettings().finnhubKey` from localStorage (`st-finnhub` input)
**Timeout:** 15 seconds default

### Insider Transactions
- **Endpoint:** `GET /stock/insider-transactions?symbol={TICKER}&token={KEY}`
- **Response:** `{data: [{name, transactionDate, transactionCode (P/S/A/M/F/G), change (shares), transactionPrice, share (shares after), ...}]}`
- **Transaction Codes:**
  - `P` = Open Market Purchase (Buy)
  - `S` = Open Market Sale (Sell)
  - `A` = Grant, Award or other Acquisition
  - `M` = Exercise of in-the-money Derivative Security
  - `F` = Payment for exercise of Derivative Security
  - `G` = Gift
- **Caching:** In-memory cache for 1 hour; also uses D1 cache-upsert with TTL 12 hours
- **Line:** web/index.html:6188
- **Usage:** Render insider trading summary, transaction history, insider activity trends
- **Error Handling:**
  - **429 Rate Limit:** Returns `{rateLimited: true}`
  - **401/403 Invalid Key:** Toast "Finnhub API key invalid" + returns null
  - **!ok:** Logs warning, returns null

---

## Yahoo Finance API

**Proxy URL:** User-configured Cloudflare Worker URL (e.g., `https://yahoo-proxy.username.workers.dev`)
**Base Path:** Worker intercepts and handles auth

### Crumb Authentication (Internal)
- **Purpose:** Yahoo requires crumb (CSRF token) for protected endpoints
- **Implementation:**
  1. GET consent cookies from `https://fc.yahoo.com` (redirect manual)
  2. GET crumb from `{YAHOO}/v1/test/getcrumb` with cookies
  3. Cache both for 5 minutes
- **Line:** cloudflare-worker/src/index.js:49-80
- **User-Agent:** Mozilla/5.0 Chrome 120.0.0.0

### Quote Summary (via Worker)
- **Endpoint:** `GET /quote/{SYMBOL}`
- **Internal Yahoo Call:** `https://query2.finance.yahoo.com/v10/finance/quoteSummary/{SYMBOL}?modules={MODULES}&crumb={CRUMB}`
- **Modules (default):** price, financialData, incomeStatementHistory, cashflowStatementHistory, defaultKeyStatistics, balanceSheetHistory
- **Usage in App:**
  - Fetches Yahoo data first if worker URL configured
  - Falls back to FMP if no marketCap in Yahoo response
  - Line: web/index.html:8353-8427

### Chart Data (via Worker)
- **Endpoint:** `GET /chart/{SYMBOL}?range=1y&interval=1wk`
- **Internal Yahoo Call:** `https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}?range={RANGE}&interval={INTERVAL}`
- **Ranges:** 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
- **Intervals:** 1m, 5m, 15m, 30m, 60m, 1d, 1wk, 1mo, 3mo
- **Response:** Timestamps + close prices + currency
- **Line:** web/index.html:9447-9463

---

## Cloudflare D1 Database

**Type:** SQLite on Cloudflare edge
**Access:** Via worker API endpoints (see D1 CRUD section above)
**Environment Binding:** `env.DB`

### Key Features
- FOREIGN KEY constraints enforced (`PRAGMA foreign_keys = ON`)
- FTS5 virtual table for notes search
- Auto-incrementing IDs on most tables
- Batch operations support (max 1000 items)
- Upsert via INSERT ... ON CONFLICT(...) DO UPDATE

### Data Sync via KV
- **Load Endpoint:** `GET /sync/load` — reads `user_data` key
- **Save Endpoint:** `POST /sync/save` — writes to `user_data`, backs up to `user_data_backup`
- **Use Case:** Backup user state to cloud (optional async sync)

---

## Rate Limiting & Throttling

### FMP Rate Limiting
- **Limit:** Depends on API key tier (free ~250 calls/month)
- **Detection:** HTTP 429 response
- **Handling:** Show toast "FMP rate limit — wait a moment"; return null
- **Line:** web/index.html:8272

### Finnhub Rate Limiting
- **Limit:** Depends on tier (free 60 calls/minute)
- **Detection:** HTTP 429 response
- **Handling:** Return `{rateLimited: true}` flag; show user-facing message
- **Line:** web/index.html:6189

### Yahoo Rate Limiting
- **Detection:** HTTP 429 on chart/quote
- **Handling:** Log warning; return null; no automatic retry
- **Line:** web/index.html:9453

### App-Level Throttling
- **Stock Refresh:** Sequential calls with 350ms delays between multiple tickers to avoid overwhelming servers
- **Chart Loading:** Parallel batches of 6 tickers max
- **Line:** web/index.html:8947-8956, 9474-9479

### Request Timeout
- **Default:** 15 seconds
- **Mechanism:** AbortController + setTimeout
- **Line:** web/index.html:7629-7633

---

## API Key Management

### Storage
- **Location:** Browser localStorage
- **Format:** Plain text (not encrypted at rest in localStorage)
- **Input Elements:**
  - `st-apikey`: FMP API key
  - `st-finnhub`: Finnhub API key
  - `st-worker`: Cloudflare Worker base URL
  - `st-synckey`: Sync/auth key for worker requests
  - `st-g1`, `st-g2`, `st-g3`, `st-dr`, `st-tg`, `st-em`, `st-fade`: Valuation model defaults

### Retrieval in Code
```javascript
function stSettings() {
  return {
    apiKey: document.getElementById('st-apikey')?.value || '',
    finnhubKey: document.getElementById('st-finnhub')?.value || '',
    workerUrl: (document.getElementById('st-worker')?.value || '').replace(/\/$/, ''),
    syncKey: document.getElementById('st-synckey')?.value || '',
    // ... other settings
  };
}
```

### Key Validation
- **FMP:** Checked via API call to `/profile`; if 401/403, show "FMP API key invalid"
- **Finnhub:** Checked via API call to `/stock/insider-transactions`; if 401/403, show "Finnhub API key invalid"
- **Worker URL:** Verified at app startup with `GET {URL}/health`

### Security Notes
- Keys are sent in query parameters (not ideal for production; consider using headers or server proxies)
- Sync key uses timing-safe comparison in worker to prevent timing attacks

---

## Error Handling & Fallbacks

### Stock Data Fetching Chain
1. **Primary:** Fetch from Yahoo (if worker URL configured)
   - Contains: price, marketCap, revenue, OCF, FCF, EBIT, margins, ROE, debt ratios
2. **Fallback:** If no marketCap from Yahoo, fetch from FMP:
   - Calls: profile, income-statement, cash-flow-statement, financial-growth, key-metrics-ttm
   - Slower but covers missing data
3. **Last Resort:** Keep existing stock data; show warning
4. **Special Case:** Ethereum (ETH) skips fetching; returns stub
- **Line:** web/index.html:8429-8495

### Historical Charts Fallback
- **Primary:** FMP endpoints (income-statement, cash-flow-statement, balance-sheet-statement)
- **Fallback:** If no data, show "No historical data available"
- **Line:** web/index.html:6843-6907

### Insider Trading Fallback
- **Required:** Finnhub API key
- **If No Key:** Show settings reminder + link to finnhub.io
- **If Rate Limit:** Show "Finnhub rate limit reached — try again in a minute"
- **If No Data:** Show "No insider trading data available for {TICKER}"
- **Line:** web/index.html:6181-6275

### Dividend History Fallback
- **Primary:** FMP API call
- **If Failure:** Show "No dividend data for {TICKER}"; offer retry button
- **Line:** web/index.html:7913-7926

### Exchange Rate Fallback
- **Primary:** `https://api.exchangerate-api.com`
- **Fallback:** Use cached rates from localStorage/D1
- **Line:** web/index.html:4405

### Network Error Handling
- **On Fetch Failure:** Log error; return null
- **On JSON Parse Failure:** Log "invalid JSON"; return null
- **Retry Logic:** 
  - GET requests: retry once after 1 second delay if first attempt fails
  - Line: web/index.html:3216-3217

---

## Caching Strategy

### Memory Cache (in-app)
- **Insider Transactions:** 1 hour TTL
- **Stock Chart Selector:** Prevents duplicate fetches during same session
- **Line:** web/index.html:6184-6196

### D1 API Cache (Cloud)
- **Tables Used:** `api_cache` (company_id, data_source, data_json, fetched_at)
- **TTL Configuration:** 
  ```javascript
  CACHE_TTLS = {
    stock_data: 1,             // 1 hour
    historical_charts: 24,     // 1 day
    dividend_history: 24,      // 1 day
    insider_transactions: 12   // 12 hours
  }
  ```
- **Check Endpoint:** `GET /api/cache-check/{company_id}/{data_source}`
- **Upsert Endpoint:** `PUT /api/cache-upsert`
- **Force Refresh:** `_forceRefresh` flag skips cache check
- **Line:** web/index.html:8286-8313

### Browser localStorage Cache
- **Tracker Stocks:** Serialized company data + overrides
- **Portfolio Data:** Accounts, positions, transactions, snapshots
- **Dividend History:** Per-ticker dividend records
- **Key:** `tracker_stocks_v1`, `portfolio_*`, `dividend_history_v1`
- **Fallback:** Used when D1 mode unavailable
- **Line:** web/index.html:7714-7762

### CloudFlare KV Cache
- **Used for:** Async sync data backup
- **Keys:** `user_data` (current), `user_data_backup` (previous)
- **Format:** JSON stringified full app state
- **Automatic:** Every save to KV, previous version copied to backup
- **Line:** cloudflare-worker/src/index.js:800-802

### Cache Validation Flow
```
1. Check D1 cache-check endpoint
2. If cached and age < TTL: return cached data
3. Else: fetch fresh data from FMP/Finnhub/Yahoo
4. If fetch succeeds: upsert to D1 api_cache
5. If fetch fails: try returning cached data anyway (stale-while-revalidate)
```
- **Line:** web/index.html:8290-8313

---

## Data Flow: Example Stock Profile Load

1. **User opens company profile for AAPL**
   - App calls `showProfile('AAPL')`
   
2. **Stock Data Fetch**
   - App calls `fetchStockData('AAPL')`
   - Checks D1 cache for `stock_data`; if < 1 hour old, use cached
   - Else, call `fetchYahooData('AAPL')`
     - POST to worker `/quote/AAPL?modules=price,financialData,...`
     - Worker authenticates with Yahoo's crumb system
     - Worker returns quoteSummary JSON
     - App extracts: price, marketCap, revenue, OCF, FCF, margins, ROE, debt ratios
   - If no marketCap from Yahoo, fall back to FMP:
     - Call FMP `/profile`, `/income-statement`, `/cash-flow-statement`, `/financial-growth`, `/key-metrics-ttm`
     - Merge results into stock object
   - Upsert to D1 cache
   - Save to tStocks in-memory
   - Save to localStorage

3. **Historical Charts Load**
   - App calls `fetchHistoricalCharts('AAPL')`
   - Checks D1 cache for `historical_charts`; if < 24 hours old, use cached
   - Else, call FMP 3 endpoints in parallel:
     - `/income-statement?limit=10`
     - `/cash-flow-statement?limit=10`
     - `/balance-sheet-statement?limit=3`
   - Render charts for revenue, FCF, EPS, margins
   - Store response in tStocks._isData, _cfData, _bsData
   - Upsert to D1 cache

4. **Insider Trading Load (if Finnhub key configured)**
   - App calls `fetchInsiderTrading('AAPL')`
   - Check in-memory cache; if < 1 hour old, use cached
   - Else, check D1 cache for `insider_transactions`; if < 12 hours old, use cached
   - Else, call Finnhub `/stock/insider-transactions?symbol=AAPL&token={KEY}`
   - Render insider summary + transaction table
   - Store in _insiderCache (1 hour TTL)
   - Upsert to D1 cache

5. **Dividend History Load**
   - App calls `fetchDividendHistory('AAPL')`
   - Check D1 cache for `dividend_history`; if < 24 hours old, use cached
   - Else, call FMP `/historical-price-full/stock_dividend/AAPL`
   - Parse and store in divHistory global
   - Upsert to D1 cache

6. **All Data Synced to D1**
   - App calls `API.post('companies/batch', [{symbol, name, sector, ...}])`
   - Batch upserts company to D1
   - Saves company ID in `_d1CompanyMap` for later reference
   - App calls `API.post('company_todos/batch', [...])`
   - Continues for earnings, filings, notes, etc.

---

## Summary of API Endpoints

| Service | Method | Path | Purpose | Auth |
|---------|--------|------|---------|------|
| **Worker** | GET | `/health` | Health check | None |
| **Worker** | GET | `/quote/{SYMBOL}` | Yahoo quote data | X-Sync-Key |
| **Worker** | GET | `/batch?symbols=A,B,C` | Yahoo batch quotes | X-Sync-Key |
| **Worker** | GET | `/chart/{SYMBOL}` | Yahoo chart data | X-Sync-Key |
| **Worker** | GET/POST | `/sync/load` | Load sync data | X-Sync-Key |
| **Worker** | POST | `/sync/save` | Save sync data (enc_version guard) | X-Sync-Key |
| **Worker** | GET | `/sync/meta` | Load encryption metadata | X-Sync-Key |
| **Worker** | POST | `/sync/meta` | Save encryption metadata (optimistic lock) | X-Sync-Key |
| **Worker** | POST | `/sync/restore-backup` | Restore data from backup | X-Sync-Key |
| **D1 API** | GET/POST/PUT/DELETE | `/api/{table}` | CRUD operations | X-Sync-Key |
| **D1 API** | POST | `/api/{table}/batch` | Batch upsert | X-Sync-Key |
| **D1 API** | GET | `/api/companies/{symbol}/full` | Company full profile | X-Sync-Key |
| **D1 API** | POST | `/api/notes/search?q={query}` | Notes search | X-Sync-Key |
| **D1 API** | GET | `/api/cache-check/{cid}/{source}` | Cache status | X-Sync-Key |
| **D1 API** | PUT | `/api/cache-upsert` | Cache update | X-Sync-Key |
| **D1 API** | POST | `/api/migrate` | Data migration | X-Sync-Key |
| **FMP** | GET | `/profile?symbol={TICKER}` | Company profile | apikey |
| **FMP** | GET | `/income-statement?symbol={TICKER}` | Income data | apikey |
| **FMP** | GET | `/cash-flow-statement?symbol={TICKER}` | Cash flow data | apikey |
| **FMP** | GET | `/balance-sheet-statement?symbol={TICKER}` | Balance sheet | apikey |
| **FMP** | GET | `/financial-growth?symbol={TICKER}` | Growth metrics | apikey |
| **FMP** | GET | `/key-metrics-ttm?symbol={TICKER}` | TTM metrics | apikey |
| **FMP** | GET | `/historical-price-full/stock_dividend/{TICKER}` | Dividends | apikey |
| **FMP** | GET | `/earning-calendar?symbol={TICKER}` | Earnings dates | apikey |
| **FMP** | GET | `/quote/{TICKERS}` | Price quotes | apikey |
| **Finnhub** | GET | `/stock/insider-transactions?symbol={TICKER}` | Insider trades | token |
| **ExchangeRate** | GET | `/latest?base={FROM}&symbols={TO}` | FX rates | (none) |

---

**End of API Reference**

-- ============================================================
-- Stratos Ventures — Cloudflare D1 Schema
-- Single-user investment management app
-- All timestamps: ISO 8601 TEXT
-- All IDs: INTEGER PRIMARY KEY (SQLite rowid alias, auto-increment)
-- ============================================================

-- IMPORTANT: PRAGMA foreign_keys is session-level in SQLite/D1.
-- The Worker must run this at the start of each request that uses D1.
PRAGMA foreign_keys = ON;

-- ============================================================
-- 1. SETTINGS
-- ============================================================

CREATE TABLE app_settings (
    key   TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
);

-- ============================================================
-- 2. COMPANIES (Phase 2 — the central entity)
-- ============================================================

CREATE TABLE companies (
    id             INTEGER PRIMARY KEY,
    symbol         TEXT NOT NULL,
    name           TEXT NOT NULL,
    sector         TEXT NOT NULL DEFAULT '',
    currency       TEXT NOT NULL DEFAULT 'USD',
    exchange       TEXT NOT NULL DEFAULT '',
    company_type   TEXT NOT NULL DEFAULT '' CHECK (company_type IN ('', 'slow', 'medium', 'fast', 'cyclical', 'turnaround', 'asset')),
    pipeline_status TEXT NOT NULL DEFAULT 'watchlist' CHECK (pipeline_status IN ('watchlist', 'under_review', 'buy_target', 'owned', 'sold', 'archived')),
    thesis         TEXT NOT NULL DEFAULT '',
    sort_order     INTEGER NOT NULL DEFAULT 0,
    archived_at    TEXT DEFAULT NULL,
    created_at     TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_companies_symbol ON companies(symbol);
CREATE INDEX idx_companies_pipeline ON companies(pipeline_status);
CREATE INDEX idx_companies_type ON companies(company_type);

-- ============================================================
-- 3. COMPANY TODO ITEMS (Phase 2)
-- ============================================================

CREATE TABLE company_todos (
    id          INTEGER PRIMARY KEY,
    company_id  INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    due_date    TEXT,
    is_done     INTEGER NOT NULL DEFAULT 0,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_todos_company ON company_todos(company_id);
CREATE INDEX idx_todos_due ON company_todos(due_date) WHERE due_date IS NOT NULL;

-- ============================================================
-- 4. EARNINGS TIMELINE (Phase 2)
-- ============================================================

CREATE TABLE earnings_timeline (
    id          INTEGER PRIMARY KEY,
    company_id  INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    year        INTEGER NOT NULL,
    quarter     INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
    is_reported INTEGER NOT NULL DEFAULT 0,
    is_reviewed INTEGER NOT NULL DEFAULT 0,
    report_date TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(company_id, year, quarter)
);

-- ============================================================
-- 5. SEC FILING TRACKING (Phase 2 — 10K/10Q)
-- ============================================================

CREATE TABLE filing_tracking (
    id             INTEGER PRIMARY KEY,
    company_id     INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    filing_type    TEXT NOT NULL CHECK (filing_type IN ('10K', '10Q', 'annual_report', 'investor_pres', 'other')),
    fiscal_year    INTEGER NOT NULL,
    fiscal_quarter INTEGER,
    is_read        INTEGER NOT NULL DEFAULT 0,
    filed_date     TEXT,
    notes          TEXT NOT NULL DEFAULT '',
    created_at     TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(company_id, filing_type, fiscal_year, fiscal_quarter)
);

-- ============================================================
-- 6. DATA OVERRIDES (Phase 2)
-- ============================================================

CREATE TABLE company_data_overrides (
    id             INTEGER PRIMARY KEY,
    company_id     INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    metric_key     TEXT NOT NULL,
    original_value REAL,
    override_value REAL NOT NULL,
    reason         TEXT NOT NULL DEFAULT '',
    created_at     TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(company_id, metric_key)
);

-- ============================================================
-- 7. NOTES (Phase 3 — unified notes table)
-- ============================================================

CREATE TABLE notes (
    id          INTEGER PRIMARY KEY,
    company_id  INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    note_type   TEXT NOT NULL CHECK (note_type IN ('journal', 'earnings', 'news', 'market')),
    title       TEXT NOT NULL DEFAULT '',
    content     TEXT NOT NULL DEFAULT '',
    note_date   TEXT NOT NULL DEFAULT (date('now')),
    quarter     TEXT,
    source_name TEXT,
    source_url  TEXT,
    is_pinned   INTEGER NOT NULL DEFAULT 0,
    excerpt     TEXT,   -- news: key quote (encrypted). NULL on legacy rows (pre-2026-07-23).
    action      TEXT,   -- journal: action badge, e.g. buy/sell/note (encrypted). NULL = none/legacy.
    tags        TEXT,   -- market: JSON array of tags (encrypted). NULL = none/legacy.
    deleted_at  TEXT DEFAULT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_notes_company ON notes(company_id) WHERE company_id IS NOT NULL;
CREATE INDEX idx_notes_type ON notes(note_type);
CREATE INDEX idx_notes_date ON notes(note_date);
CREATE INDEX idx_notes_quarter ON notes(company_id, quarter) WHERE quarter IS NOT NULL;

CREATE TABLE note_images (
    id         INTEGER PRIMARY KEY,
    note_id    INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    filename   TEXT NOT NULL DEFAULT '',
    mime_type  TEXT NOT NULL DEFAULT 'image/png',
    image_data TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_note_images_note ON note_images(note_id);

-- NOTE: ON DELETE CASCADE on notes may not fire AFTER DELETE triggers.
-- When deleting a company, delete its notes explicitly first, or run:
--   INSERT INTO notes_fts(notes_fts) VALUES('rebuild')
-- after cascade deletes to clean up orphaned FTS entries.
CREATE VIRTUAL TABLE notes_fts USING fts5(
    title,
    content,
    content='notes',
    content_rowid='id'
);

CREATE TRIGGER notes_ai AFTER INSERT ON notes BEGIN
    INSERT INTO notes_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
END;

CREATE TRIGGER notes_ad AFTER DELETE ON notes BEGIN
    INSERT INTO notes_fts(notes_fts, rowid, title, content) VALUES ('delete', old.id, old.title, old.content);
END;

CREATE TRIGGER notes_au AFTER UPDATE ON notes BEGIN
    INSERT INTO notes_fts(notes_fts, rowid, title, content) VALUES ('delete', old.id, old.title, old.content);
    INSERT INTO notes_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
END;

-- ============================================================
-- 8. PORTFOLIO — ACCOUNTS & POSITIONS (Phase 4)
-- ============================================================

CREATE TABLE broker_accounts (
    id         INTEGER PRIMARY KEY,
    name       TEXT NOT NULL UNIQUE,
    currency   TEXT NOT NULL DEFAULT 'USD',
    is_active  INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE positions (
    id          INTEGER PRIMARY KEY,
    company_id  INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    account_id  INTEGER NOT NULL REFERENCES broker_accounts(id) ON DELETE CASCADE,
    shares      REAL NOT NULL DEFAULT 0,
    avg_cost    REAL NOT NULL DEFAULT 0,
    deleted_at  TEXT DEFAULT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(company_id, account_id)
);

CREATE INDEX idx_positions_company ON positions(company_id);
CREATE INDEX idx_positions_account ON positions(account_id);

CREATE TABLE transactions (
    id               INTEGER PRIMARY KEY,
    company_id       INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    account_id       INTEGER NOT NULL REFERENCES broker_accounts(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'sell', 'dividend', 'split', 'transfer')),
    transaction_date TEXT NOT NULL,
    shares           REAL,
    price_per_share  REAL,
    total_amount     REAL NOT NULL DEFAULT 0,
    fees             REAL NOT NULL DEFAULT 0,
    currency         TEXT NOT NULL DEFAULT 'USD',
    notes            TEXT NOT NULL DEFAULT '',
    deleted_at       TEXT DEFAULT NULL,
    created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_transactions_company ON transactions(company_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_account ON transactions(account_id);

-- ============================================================
-- 9. PORTFOLIO SNAPSHOTS (Phase 4)
-- ============================================================

CREATE TABLE portfolio_snapshots (
    id              INTEGER PRIMARY KEY,
    snapshot_date   TEXT NOT NULL UNIQUE,
    total_value     REAL,
    base_currency   TEXT NOT NULL DEFAULT 'USD',
    notes           TEXT NOT NULL DEFAULT '',
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE snapshot_positions (
    id              INTEGER PRIMARY KEY,
    snapshot_id     INTEGER NOT NULL REFERENCES portfolio_snapshots(id) ON DELETE CASCADE,
    company_id      INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    account_id      INTEGER NOT NULL REFERENCES broker_accounts(id) ON DELETE CASCADE,
    shares          REAL NOT NULL,
    price_per_share REAL NOT NULL,
    market_value    REAL NOT NULL,
    currency        TEXT NOT NULL DEFAULT 'USD',
    intent          TEXT NOT NULL DEFAULT 'hold' CHECK (intent IN ('hold', 'buy_more', 'reduce', 'sell'))
);

CREATE INDEX idx_snap_positions_snapshot ON snapshot_positions(snapshot_id);
-- Natural key: one row per (snapshot, company, account). Lets the batch upsert on this key
-- instead of blindly INSERTing every save (which caused quadratic duplicate-row growth).
CREATE UNIQUE INDEX idx_snap_positions_natural ON snapshot_positions(snapshot_id, company_id, account_id);

-- ============================================================
-- 10. EXCHANGE RATES (Phase 4)
-- ============================================================

CREATE TABLE exchange_rates (
    id            INTEGER PRIMARY KEY,
    rate_date     TEXT NOT NULL,
    from_currency TEXT NOT NULL,
    to_currency   TEXT NOT NULL,
    rate          REAL NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(rate_date, from_currency, to_currency)
);

CREATE INDEX idx_exchange_rates_date ON exchange_rates(rate_date);

-- ============================================================
-- 11. DIVIDENDS (Phase 6)
-- ============================================================

CREATE TABLE dividend_history (
    id            INTEGER PRIMARY KEY,
    company_id    INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    ex_date       TEXT NOT NULL,
    pay_date      TEXT,
    amount        REAL NOT NULL,
    currency      TEXT NOT NULL DEFAULT 'USD',
    frequency     TEXT CHECK (frequency IN ('monthly', 'quarterly', 'semi_annual', 'annual', 'special', NULL)),
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(company_id, ex_date)
);

CREATE INDEX idx_dividends_company ON dividend_history(company_id);
CREATE INDEX idx_dividends_date ON dividend_history(ex_date);

-- ============================================================
-- 12. FRAMEWORK (Phase 7)
-- ============================================================

CREATE TABLE framework_entries (
    id         INTEGER PRIMARY KEY,
    category   TEXT NOT NULL CHECK (category IN ('principle', 'portfolio_rule', 'ideal_trait', 'avoid', 'other')),
    title      TEXT NOT NULL,
    content    TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_framework_category ON framework_entries(category);

-- ============================================================
-- 13. CHECKLIST TEMPLATES & ANSWERS (Phase 7)
-- ============================================================

CREATE TABLE checklist_templates (
    id          INTEGER PRIMARY KEY,
    section_key TEXT NOT NULL UNIQUE,
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    fields_json TEXT NOT NULL DEFAULT '[]',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE checklist_answers (
    id          INTEGER PRIMARY KEY,
    company_id  INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    template_id INTEGER NOT NULL REFERENCES checklist_templates(id) ON DELETE CASCADE,
    answer_json TEXT NOT NULL DEFAULT '{}',
    progress    INTEGER NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'complete')),
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(company_id, template_id)
);

CREATE INDEX idx_checklist_answers_company ON checklist_answers(company_id);

-- ============================================================
-- 14. REVIEWS (Phase 7)
-- ============================================================

CREATE TABLE reviews (
    id            INTEGER PRIMARY KEY,
    review_type   TEXT NOT NULL CHECK (review_type IN ('weekly', 'monthly', 'quarterly')),
    review_date   TEXT NOT NULL,
    company_id    INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    answers_json  TEXT NOT NULL DEFAULT '{}',
    summary       TEXT NOT NULL DEFAULT '',
    deleted_at    TEXT DEFAULT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_reviews_date ON reviews(review_date);
CREATE INDEX idx_reviews_type ON reviews(review_type);
CREATE INDEX idx_reviews_company ON reviews(company_id) WHERE company_id IS NOT NULL;

-- ============================================================
-- 15. VALUATIONS (Phase 2)
-- ============================================================

CREATE TABLE valuations (
    id              INTEGER PRIMARY KEY,
    company_id      INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    method          TEXT NOT NULL CHECK (method IN ('dcf', 'reverse_dcf', 'aria', 'money_back', 'pe', 'peg', 'combined')),
    label           TEXT NOT NULL DEFAULT '',
    currency        TEXT NOT NULL DEFAULT 'USD',
    scale           TEXT NOT NULL DEFAULT 'M' CHECK (scale IN ('', 'K', 'M', 'B')),
    inputs_json     TEXT NOT NULL DEFAULT '{}',
    results_json    TEXT NOT NULL DEFAULT '{}',
    intrinsic_value REAL,
    upside_pct      REAL,
    is_primary      INTEGER NOT NULL DEFAULT 0,
    valuation_date  TEXT NOT NULL DEFAULT (date('now')),
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_valuations_company ON valuations(company_id);
CREATE INDEX idx_valuations_date ON valuations(company_id, valuation_date);
-- Natural key: one saved valuation per (company, label). Lets the batch upsert on this key
-- instead of INSERTing a new row every save (which caused unbounded duplicate-row growth).
CREATE UNIQUE INDEX idx_valuations_company_label ON valuations(company_id, label);

-- ============================================================
-- 16. GENERAL TODO LIST (Phase 5)
-- ============================================================

CREATE TABLE general_todos (
    id         INTEGER PRIMARY KEY,
    title      TEXT NOT NULL,
    due_date   TEXT,
    is_done    INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_general_todos_due ON general_todos(due_date) WHERE due_date IS NOT NULL;

-- ============================================================
-- 17. API CACHE (optional)
-- ============================================================

CREATE TABLE api_cache (
    id           INTEGER PRIMARY KEY,
    company_id   INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    data_source  TEXT NOT NULL DEFAULT 'fmp',
    data_json    TEXT NOT NULL DEFAULT '{}',
    fetched_at   TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(company_id, data_source)
);

// Yahoo Finance Proxy — Cloudflare Worker
// Handles crumb+cookie auth server-side, returns CORS-enabled JSON

const YAHOO = 'https://query2.finance.yahoo.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let cachedCrumb = null;
let cachedCookie = null;
let crumbExpiry = 0;

const ALLOWED_ORIGINS = [
  'http://localhost:8765',
  'http://127.0.0.1:8765',
  'https://industriestitus.github.io',
  'https://stratos-ventures.pages.dev',
];

function getAllowedOrigin(requestOrigin, env) {
  const extra = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const all = [...ALLOWED_ORIGINS, ...extra];
  if (all.includes(requestOrigin)) return requestOrigin;
  return null;
}

function cors(allowedOrigin) {
  return {
    'Access-Control-Allow-Origin': allowedOrigin || 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Sync-Key',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  };
}

function jsonResp(data, status, allowedOrigin) {
  return new Response(JSON.stringify(data), { status, headers: cors(allowedOrigin) });
}

async function getCrumb() {
  if (cachedCrumb && cachedCookie && Date.now() < crumbExpiry) {
    return { crumb: cachedCrumb, cookie: cachedCookie };
  }

  // Step 1: get consent cookie from Yahoo
  const cookieResp = await fetch('https://fc.yahoo.com', { redirect: 'manual', headers: { 'User-Agent': UA } });
  let cookies = '';
  // Collect all Set-Cookie headers
  const raw = cookieResp.headers.getAll ? cookieResp.headers.getAll('set-cookie') : [];
  if (raw.length) {
    cookies = raw.map(c => c.split(';')[0]).join('; ');
  } else {
    const sc = cookieResp.headers.get('set-cookie') || '';
    cookies = sc.split(',').map(c => c.split(';')[0].trim()).filter(Boolean).join('; ');
  }

  // Step 2: get crumb using cookie
  const crumbResp = await fetch(`${YAHOO}/v1/test/getcrumb`, {
    headers: { 'Cookie': cookies, 'User-Agent': UA }
  });
  const crumb = await crumbResp.text();

  if (!crumb || crumb.includes('error') || crumb.includes('<')) {
    throw new Error('Failed to get Yahoo crumb');
  }

  cachedCrumb = crumb;
  cachedCookie = cookies;
  crumbExpiry = Date.now() + 5 * 60 * 1000; // 5 min cache
  return { crumb, cookie: cookies };
}

async function fetchQuote(symbol, modules, allowedOrigin) {
  const { crumb, cookie } = await getCrumb();
  const url = `${YAHOO}/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=${modules}&crumb=${encodeURIComponent(crumb)}`;
  const resp = await fetch(url, { headers: { 'Cookie': cookie, 'User-Agent': UA } });

  if (resp.status === 401 || resp.status === 403) {
    // Crumb expired, reset and retry once
    cachedCrumb = null;
    const retry = await getCrumb();
    const url2 = `${YAHOO}/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=${modules}&crumb=${encodeURIComponent(retry.crumb)}`;
    const resp2 = await fetch(url2, { headers: { 'Cookie': retry.cookie, 'User-Agent': UA } });
    return jsonResp(await resp2.json(), resp2.status, allowedOrigin);
  }

  return jsonResp(await resp.json(), resp.status, allowedOrigin);
}

// Batch endpoint: fetch multiple symbols in one call
async function fetchBatch(symbols, modules, allowedOrigin) {
  const results = {};
  // Process sequentially to avoid rate limits
  for (const sym of symbols) {
    try {
      const { crumb, cookie } = await getCrumb();
      const url = `${YAHOO}/v10/finance/quoteSummary/${encodeURIComponent(sym)}?modules=${modules}&crumb=${encodeURIComponent(crumb)}`;
      const resp = await fetch(url, { headers: { 'Cookie': cookie, 'User-Agent': UA } });
      if (resp.ok) {
        results[sym] = await resp.json();
      } else if (resp.status === 401 || resp.status === 403) {
        cachedCrumb = null;
        const retry = await getCrumb();
        const url2 = `${YAHOO}/v10/finance/quoteSummary/${encodeURIComponent(sym)}?modules=${modules}&crumb=${encodeURIComponent(retry.crumb)}`;
        const resp2 = await fetch(url2, { headers: { 'Cookie': retry.cookie, 'User-Agent': UA } });
        if (resp2.ok) results[sym] = await resp2.json();
        else results[sym] = { error: resp2.status };
      } else {
        results[sym] = { error: resp.status };
      }
    } catch (e) {
      results[sym] = { error: e.message };
    }
  }
  return jsonResp(results, 200, allowedOrigin);
}

// ====== D1 CRUD API ======

const TABLES = {
  companies:             { cols: ['symbol','name','sector','currency','exchange','company_type','pipeline_status','thesis','sort_order'], hasUpdatedAt: true },
  company_todos:         { cols: ['company_id','title','due_date','is_done','sort_order'], hasUpdatedAt: true },
  earnings_timeline:     { cols: ['company_id','year','quarter','is_reported','is_reviewed','report_date'], hasUpdatedAt: true },
  filing_tracking:       { cols: ['company_id','filing_type','fiscal_year','fiscal_quarter','is_read','filed_date','notes'], hasUpdatedAt: true },
  company_data_overrides:{ cols: ['company_id','metric_key','original_value','override_value','reason'], hasUpdatedAt: true },
  notes:                 { cols: ['company_id','note_type','title','content','note_date','quarter','source_name','source_url','is_pinned'], hasUpdatedAt: true },
  note_images:           { cols: ['note_id','filename','mime_type','image_data','sort_order'], hasUpdatedAt: false },
  broker_accounts:       { cols: ['name','currency','is_active'], hasUpdatedAt: true },
  positions:             { cols: ['company_id','account_id','shares','avg_cost'], hasUpdatedAt: true },
  transactions:          { cols: ['company_id','account_id','transaction_type','transaction_date','shares','price_per_share','total_amount','fees','currency','notes'], hasUpdatedAt: false },
  portfolio_snapshots:   { cols: ['snapshot_date','total_value','base_currency','notes'], hasUpdatedAt: false },
  snapshot_positions:    { cols: ['snapshot_id','company_id','account_id','shares','price_per_share','market_value','currency','intent'], hasUpdatedAt: false },
  exchange_rates:        { cols: ['rate_date','from_currency','to_currency','rate'], hasUpdatedAt: false },
  dividend_history:      { cols: ['company_id','ex_date','pay_date','amount','currency','frequency'], hasUpdatedAt: false },
  framework_entries:     { cols: ['category','title','content','sort_order'], hasUpdatedAt: true },
  checklist_templates:   { cols: ['section_key','title','description','fields_json','sort_order'], hasUpdatedAt: true },
  checklist_answers:     { cols: ['company_id','template_id','answer_json','progress','status'], hasUpdatedAt: true },
  reviews:               { cols: ['review_type','review_date','company_id','answers_json','summary'], hasUpdatedAt: true },
  valuations:            { cols: ['company_id','method','label','currency','scale','inputs_json','results_json','intrinsic_value','upside_pct','is_primary','valuation_date'], hasUpdatedAt: true },
  general_todos:         { cols: ['title','due_date','is_done','sort_order'], hasUpdatedAt: true },
  app_settings:          { cols: ['key','value'], hasUpdatedAt: false, pk: 'key' },
  api_cache:             { cols: ['company_id','data_source','data_json','fetched_at'], hasUpdatedAt: false },
};

async function handleCrud(table, method, id, body, url, db, origin) {
  const cfg = TABLES[table];
  if (!cfg) return jsonResp({ error: 'Unknown table' }, 404, origin);
  const pk = cfg.pk || 'id';

  if (method === 'GET' && !id) {
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '500'), 1000);
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const filterCol = url.searchParams.get('filter');
    const filterVal = url.searchParams.get('filter_value');
    let sql = `SELECT * FROM ${table}`;
    const binds = [];
    if (filterCol && filterVal && cfg.cols.includes(filterCol)) {
      sql += ` WHERE ${filterCol} = ?`;
      binds.push(filterVal);
    }
    sql += ` ORDER BY ${pk === 'key' ? 'key' : 'id'} LIMIT ? OFFSET ?`;
    binds.push(limit, offset);
    const rows = await db.prepare(sql).bind(...binds).all();
    let countSql = `SELECT count(*) as c FROM ${table}`;
    const countBinds = [];
    if (filterCol && filterVal && cfg.cols.includes(filterCol)) {
      countSql += ` WHERE ${filterCol} = ?`;
      countBinds.push(filterVal);
    }
    const count = countBinds.length
      ? await db.prepare(countSql).bind(...countBinds).first()
      : await db.prepare(countSql).first();
    return jsonResp({ data: rows.results, total: count.c, limit, offset }, 200, origin);
  }

  if (method === 'GET' && id) {
    const row = await db.prepare(`SELECT * FROM ${table} WHERE ${pk} = ?`).bind(id).first();
    if (!row) return jsonResp({ error: 'Not found' }, 404, origin);
    return jsonResp(row, 200, origin);
  }

  if (method === 'POST') {
    const cols = [];
    const vals = [];
    const placeholders = [];
    for (const col of cfg.cols) {
      if (body[col] !== undefined) {
        cols.push(col);
        vals.push(body[col]);
        placeholders.push('?');
      }
    }
    if (!cols.length) return jsonResp({ error: 'No valid columns provided' }, 400, origin);
    const sql = `INSERT INTO ${table} (${cols.join(',')}) VALUES (${placeholders.join(',')})`;
    try {
      const result = await db.prepare(sql).bind(...vals).run();
      const newId = pk === 'key' ? body.key : result.meta.last_row_id;
      const row = await db.prepare(`SELECT * FROM ${table} WHERE ${pk} = ?`).bind(newId).first();
      return jsonResp(row, 201, origin);
    } catch (e) {
      if (e.message.includes('UNIQUE') || e.message.includes('FOREIGN')) {
        return jsonResp({ error: 'Constraint violation', detail: e.message }, 409, origin);
      }
      throw e;
    }
  }

  if (method === 'PUT' && id) {
    const sets = [];
    const vals = [];
    for (const col of cfg.cols) {
      if (body[col] !== undefined) {
        sets.push(`${col} = ?`);
        vals.push(body[col]);
      }
    }
    if (!sets.length) return jsonResp({ error: 'No valid columns to update' }, 400, origin);
    if (cfg.hasUpdatedAt) {
      sets.push("updated_at = datetime('now')");
    }
    vals.push(id);
    const sql = `UPDATE ${table} SET ${sets.join(',')} WHERE ${pk} = ?`;
    try {
      await db.prepare(sql).bind(...vals).run();
      const row = await db.prepare(`SELECT * FROM ${table} WHERE ${pk} = ?`).bind(id).first();
      if (!row) return jsonResp({ error: 'Not found' }, 404, origin);
      return jsonResp(row, 200, origin);
    } catch (e) {
      if (e.message.includes('UNIQUE') || e.message.includes('FOREIGN') || e.message.includes('CHECK')) {
        return jsonResp({ error: 'Constraint violation', detail: e.message }, 409, origin);
      }
      throw e;
    }
  }

  if (method === 'DELETE' && id) {
    const row = await db.prepare(`SELECT * FROM ${table} WHERE ${pk} = ?`).bind(id).first();
    if (!row) return jsonResp({ error: 'Not found' }, 404, origin);
    // For companies: delete notes explicitly first so FTS triggers fire (CASCADE won't trigger them)
    if (table === 'companies') {
      await db.prepare('DELETE FROM notes WHERE company_id = ?').bind(id).run();
    }
    await db.prepare(`DELETE FROM ${table} WHERE ${pk} = ?`).bind(id).run();
    return jsonResp({ ok: true, deleted: row }, 200, origin);
  }

  return jsonResp({ error: 'Method not allowed' }, 405, origin);
}

async function handleCompanyFull(symbolOrId, db, origin) {
  let company;
  if (/^\d+$/.test(symbolOrId)) {
    company = await db.prepare('SELECT * FROM companies WHERE id = ?').bind(parseInt(symbolOrId)).first();
  } else {
    company = await db.prepare('SELECT * FROM companies WHERE symbol = ?').bind(symbolOrId).first();
  }
  if (!company) return jsonResp({ error: 'Company not found' }, 404, origin);
  const cid = company.id;
  const [todos, earnings, filings, overrides, notes, checklist, reviews, valuations, positions, dividends] = await Promise.all([
    db.prepare('SELECT * FROM company_todos WHERE company_id = ? ORDER BY sort_order').bind(cid).all(),
    db.prepare('SELECT * FROM earnings_timeline WHERE company_id = ? ORDER BY year DESC, quarter DESC').bind(cid).all(),
    db.prepare('SELECT * FROM filing_tracking WHERE company_id = ? ORDER BY fiscal_year DESC').bind(cid).all(),
    db.prepare('SELECT * FROM company_data_overrides WHERE company_id = ?').bind(cid).all(),
    db.prepare('SELECT * FROM notes WHERE company_id = ? ORDER BY note_date DESC').bind(cid).all(),
    db.prepare('SELECT ca.*, ct.section_key, ct.title as template_title FROM checklist_answers ca JOIN checklist_templates ct ON ca.template_id = ct.id WHERE ca.company_id = ?').bind(cid).all(),
    db.prepare('SELECT * FROM reviews WHERE company_id = ? ORDER BY review_date DESC').bind(cid).all(),
    db.prepare('SELECT * FROM valuations WHERE company_id = ? ORDER BY valuation_date DESC').bind(cid).all(),
    db.prepare('SELECT p.*, ba.name as account_name, ba.currency as account_currency FROM positions p JOIN broker_accounts ba ON p.account_id = ba.id WHERE p.company_id = ?').bind(cid).all(),
    db.prepare('SELECT * FROM dividend_history WHERE company_id = ? ORDER BY ex_date DESC').bind(cid).all(),
  ]);
  // Fetch note images via JOIN (avoids D1 bind parameter limit)
  const noteImages = await db.prepare(
    `SELECT ni.* FROM note_images ni JOIN notes n ON ni.note_id = n.id WHERE n.company_id = ? ORDER BY ni.sort_order`
  ).bind(cid).all();
  return jsonResp({
    ...company,
    todos: todos.results,
    earnings: earnings.results,
    filings: filings.results,
    overrides: overrides.results,
    notes: notes.results,
    noteImages: noteImages.results,
    checklist: checklist.results,
    reviews: reviews.results,
    valuations: valuations.results,
    positions: positions.results,
    dividends: dividends.results,
  }, 200, origin);
}

async function handleNotesSearch(query, db, origin) {
  if (!query || query.length < 2) return jsonResp({ error: 'Query must be at least 2 characters' }, 400, origin);
  const ftsQuery = query.replace(/['"]/g, '').split(/\s+/).filter(Boolean).map(w => w + '*').join(' ');
  try {
    const rows = await db.prepare(`
      SELECT n.*, notes_fts.rank
      FROM notes_fts
      JOIN notes n ON n.id = notes_fts.rowid
      WHERE notes_fts MATCH ?
      ORDER BY rank
      LIMIT 50
    `).bind(ftsQuery).all();
    return jsonResp({ data: rows.results, query }, 200, origin);
  } catch (e) {
    const rows = await db.prepare(
      `SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY note_date DESC LIMIT 50`
    ).bind(`%${query}%`, `%${query}%`).all();
    return jsonResp({ data: rows.results, query, fallback: true }, 200, origin);
  }
}

async function handleMigrate(body, db, origin) {
  const stats = { companies: 0, todos: 0, notes: 0, accounts: 0, positions: 0, transactions: 0, snapshots: 0, dividends: 0, framework: 0, reviews: 0, valuations: 0, settings: 0 };
  const errors = [];
  const companyIdMap = {};
  const accountIdMap = {};

  // Clear existing data (FK cascades handle child tables)
  const clearTables = ['companies','notes','broker_accounts','portfolio_snapshots','exchange_rates','general_todos','framework_entries','reviews','valuations'];
  for (const t of clearTables) { try { await db.prepare(`DELETE FROM ${t}`).run(); } catch(e) {} }
  try { await db.prepare("DELETE FROM app_settings WHERE key NOT IN ('schema_version')").run(); } catch(e) {}

  // 1. Companies from trackerStocks
  const trackerStocks = body.trackerStocks || {};
  for (const [ticker, s] of Object.entries(trackerStocks)) {
    try {
      const result = await db.prepare(
        `INSERT INTO companies (symbol, name, sector, currency, exchange, company_type, pipeline_status, thesis, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        ticker, s.name || ticker, s.sector || '', s.currency || 'USD',
        s.exchange || '', s.companyType || '', s.pipeline || s.pipelineStatus || 'watchlist',
        s.thesis || '', s.sortOrder || 0
      ).run();
      companyIdMap[ticker] = result.meta.last_row_id;
      stats.companies++;

      const cid = companyIdMap[ticker];

      // Company todos
      if (Array.isArray(s.todos)) {
        for (const t of s.todos) {
          await db.prepare(
            `INSERT INTO company_todos (company_id, title, due_date, is_done, sort_order) VALUES (?, ?, ?, ?, ?)`
          ).bind(cid, t.title || '', t.dueDate || null, t.isDone ? 1 : 0, t.sortOrder || 0).run();
          stats.todos++;
        }
      }

      // Earnings timeline
      if (s.earnings) {
        for (const [key, val] of Object.entries(s.earnings)) {
          const m = key.match(/^(\d{4})Q(\d)$/);
          if (m) {
            await db.prepare(
              `INSERT OR IGNORE INTO earnings_timeline (company_id, year, quarter, is_reported, is_reviewed, report_date) VALUES (?, ?, ?, ?, ?, ?)`
            ).bind(cid, parseInt(m[1]), parseInt(m[2]), val.reported ? 1 : 0, val.reviewed ? 1 : 0, val.reportDate || null).run();
          }
        }
      }

      // Filings
      if (s.filings) {
        for (const [key, val] of Object.entries(s.filings)) {
          const parts = key.split('_');
          const ftype = parts[0] || '10K';
          const fy = parseInt(parts[1]) || 2024;
          const fq = parts[2] ? parseInt(parts[2]) : null;
          await db.prepare(
            `INSERT OR IGNORE INTO filing_tracking (company_id, filing_type, fiscal_year, fiscal_quarter, is_read, filed_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`
          ).bind(cid, ftype, fy, fq, val.read ? 1 : 0, val.filedDate || null, val.notes || '').run();
        }
      }

      // Data overrides
      if (s.overriddenData) {
        for (const [metric, value] of Object.entries(s.overriddenData)) {
          const orig = s._origData && s._origData[metric] != null ? s._origData[metric] : null;
          await db.prepare(
            `INSERT OR IGNORE INTO company_data_overrides (company_id, metric_key, original_value, override_value) VALUES (?, ?, ?, ?)`
          ).bind(cid, metric, orig, value).run();
        }
      }

      // Company earnings notes
      if (Array.isArray(s.notes)) {
        for (const n of s.notes) {
          await db.prepare(
            `INSERT INTO notes (company_id, note_type, title, content, note_date, quarter) VALUES (?, 'earnings', ?, ?, ?, ?)`
          ).bind(cid, n.title || n.quarter || '', n.content || '', n.date || '', n.quarter || null).run();
          stats.notes++;
        }
      }

      // Checklist answers
      if (s.checklist && s.checklist.sections) {
        for (const [sectionKey, data] of Object.entries(s.checklist.sections)) {
          const tmpl = await db.prepare('SELECT id FROM checklist_templates WHERE section_key = ?').bind(sectionKey).first();
          if (tmpl) {
            await db.prepare(
              `INSERT OR IGNORE INTO checklist_answers (company_id, template_id, answer_json, progress, status) VALUES (?, ?, ?, ?, ?)`
            ).bind(cid, tmpl.id, JSON.stringify(data.answers || data), data.progress || 0, data.status || 'not_started').run();
          }
        }
      }
    } catch (e) {
      console.error(`Migration error for ${ticker}:`, e.message);
    }
  }

  // 2. Research notes
  const rn = body.researchNotes || {};
  for (const noteType of ['journal', 'news', 'market']) {
    const arr = rn[noteType] || [];
    for (const n of arr) {
      try {
        const companyId = n.ticker && companyIdMap[n.ticker] ? companyIdMap[n.ticker] : null;
        const result = await db.prepare(
          `INSERT INTO notes (company_id, note_type, title, content, note_date, source_name, source_url, is_pinned) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(companyId, noteType, n.title || '', n.content || n.excerpt || n.comment || '',
          n.date || '', n.sourceName || n.source || '', n.sourceUrl || '', n.isPinned ? 1 : 0).run();
        stats.notes++;
        if (Array.isArray(n._images)) {
          const noteId = result.meta.last_row_id;
          for (let i = 0; i < n._images.length; i++) {
            const img = n._images[i];
            await db.prepare(
              `INSERT INTO note_images (note_id, filename, mime_type, image_data, sort_order) VALUES (?, ?, ?, ?, ?)`
            ).bind(noteId, img.filename || '', img.mimeType || 'image/png', img.imageData_base64 || img.imageData || '', i).run();
          }
        }
      } catch (e) { errors.push(`Note ${noteType}: ${e.message}`); }
    }
  }

  // 3. Broker accounts
  const accounts = body.portfolioAccounts || [];
  for (const a of accounts) {
    try {
      const result = await db.prepare(
        `INSERT INTO broker_accounts (name, currency, is_active) VALUES (?, ?, ?)`
      ).bind(a.name, a.currency || 'USD', a.isActive !== false ? 1 : 0).run();
      accountIdMap[a.id] = result.meta.last_row_id;
      stats.accounts++;
    } catch (e) { errors.push(`Broker account ${a.name}: ${e.message}`); }
  }

  // 4. Positions
  for (const p of (body.portfolioPositions || [])) {
    try {
      const cid = companyIdMap[p.ticker];
      const aid = accountIdMap[p.accountId];
      if (cid && aid) {
        await db.prepare(
          `INSERT OR IGNORE INTO positions (company_id, account_id, shares, avg_cost) VALUES (?, ?, ?, ?)`
        ).bind(cid, aid, p.shares || 0, p.avgCost || 0).run();
        stats.positions++;
      }
    } catch (e) { errors.push(`Position ${p.ticker}: ${e.message}`); }
  }

  // 5. Transactions
  for (const t of (body.portfolioTransactions || [])) {
    try {
      const cid = companyIdMap[t.ticker];
      const aid = accountIdMap[t.accountId];
      if (cid && aid) {
        await db.prepare(
          `INSERT INTO transactions (company_id, account_id, transaction_type, transaction_date, shares, price_per_share, total_amount, fees, currency, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(cid, aid, t.type || 'buy', t.date || '', t.shares || null, t.pricePerShare || null, t.totalAmount || 0, t.fees || 0, t.currency || 'USD', t.notes || '').run();
        stats.transactions++;
      }
    } catch (e) { errors.push(`Transaction: ${e.message}`); }
  }

  // 6. Snapshots
  for (const snap of (body.portfolioSnapshots || [])) {
    try {
      const result = await db.prepare(
        `INSERT INTO portfolio_snapshots (snapshot_date, total_value, base_currency, notes) VALUES (?, ?, ?, ?)`
      ).bind(snap.date || '', snap.totalValue || null, snap.baseCurrency || 'USD', snap.notes || '').run();
      const snapId = result.meta.last_row_id;
      if (Array.isArray(snap.positions)) {
        for (const sp of snap.positions) {
          const cid = companyIdMap[sp.ticker];
          const aid = accountIdMap[sp.accountId];
          if (cid && aid) {
            await db.prepare(
              `INSERT INTO snapshot_positions (snapshot_id, company_id, account_id, shares, price_per_share, market_value, currency, intent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(snapId, cid, aid, sp.shares || 0, sp.pricePerShare || 0, sp.marketValue || 0, sp.currency || 'USD', sp.intent || 'hold').run();
          }
        }
      }
      stats.snapshots++;
    } catch (e) { /* skip duplicate snapshot dates */ }
  }

  // 7. Exchange rates
  const exRates = body.portfolioExchangeRates || {};
  if (exRates.rates) {
    for (const [pair, rate] of Object.entries(exRates.rates)) {
      try {
        const [from, to] = pair.includes('/') ? pair.split('/') : [pair.slice(0, 3), pair.slice(3)];
        if (from && to) {
          await db.prepare(
            `INSERT OR IGNORE INTO exchange_rates (rate_date, from_currency, to_currency, rate) VALUES (?, ?, ?, ?)`
          ).bind(exRates.lastFetched || '', from, to, rate).run();
        }
      } catch (e) { errors.push(`Exchange rate ${pair}: ${e.message}`); }
    }
  }

  // 8. Dividends
  const divHist = body.dividendHistory || {};
  for (const [ticker, divs] of Object.entries(divHist)) {
    const cid = companyIdMap[ticker];
    if (!cid || !Array.isArray(divs)) continue;
    for (const d of divs) {
      try {
        await db.prepare(
          `INSERT OR IGNORE INTO dividend_history (company_id, ex_date, pay_date, amount, currency, frequency) VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(cid, d.exDate || d.date || '', d.payDate || null, d.amount || 0, d.currency || 'USD', d.frequency || null).run();
        stats.dividends++;
      } catch (e) { errors.push(`Dividend ${ticker}: ${e.message}`); }
    }
  }

  // 9. Framework
  try {
    const fw = body.frameworkData || {};
    const fwMap = { principles: 'principle', portfolioRules: 'portfolio_rule', idealTraits: 'ideal_trait', avoidList: 'avoid' };
    for (const [arrKey, category] of Object.entries(fwMap)) {
      const items = fw[arrKey] || [];
      for (let i = 0; i < items.length; i++) {
        await db.prepare(
          `INSERT INTO framework_entries (category, title, content, sort_order) VALUES (?, ?, ?, ?)`
        ).bind(category, items[i].title || '', items[i].content || '', i).run();
        stats.framework++;
      }
    }
  } catch (e) { errors.push(`Framework: ${e.message}`); }

  // 10. Reviews
  const rv = body.reviewsData || {};
  for (const e of (rv.entries || [])) {
    try {
      const cid = e.companyTicker && companyIdMap[e.companyTicker] ? companyIdMap[e.companyTicker] : null;
      await db.prepare(
        `INSERT INTO reviews (review_type, review_date, company_id, answers_json, summary) VALUES (?, ?, ?, ?, ?)`
      ).bind(e.type || 'weekly', e.date || '', cid, JSON.stringify(e.answers || {}), e.summary || '').run();
      stats.reviews++;
    } catch (err) { errors.push(`Review: ${err.message}`); }
  }

  // 11. Calculator saved valuations
  const savedStocks = body.savedStocks || {};
  for (const [name, v] of Object.entries(savedStocks)) {
    try {
      const ticker = v.name || name;
      const cid = companyIdMap[ticker];
      if (cid) {
        await db.prepare(
          `INSERT INTO valuations (company_id, method, label, currency, scale, inputs_json, results_json) VALUES (?, 'combined', ?, ?, ?, ?, ?)`
        ).bind(cid, name, v.currency || 'USD', v.scale || 'M', JSON.stringify(v), '{}').run();
        stats.valuations++;
      }
    } catch (e) { errors.push(`Valuation ${name}: ${e.message}`); }
  }

  // 12. Dashboard todos
  for (const t of (body.dashboardTodos || [])) {
    try {
      await db.prepare(
        `INSERT INTO general_todos (title, due_date, is_done, sort_order) VALUES (?, ?, ?, ?)`
      ).bind(t.title || '', t.dueDate || null, t.isDone ? 1 : 0, t.sortOrder || 0).run();
      stats.todos++;
    } catch (e) { errors.push(`Todo: ${e.message}`); }
  }

  // 13. App settings
  try {
    const settingsMap = {
      fi_settings: body.dashboardFiSettings,
      benchmark: body.dashboardBenchmark,
      '52w_highs': body.dashboard52wHighs,
      dividend_settings: body.dividendSettings,
      exchange_rates_config: { baseCurrency: exRates.baseCurrency || 'HUF', lastFetched: exRates.lastFetched },
    };
    for (const [key, val] of Object.entries(settingsMap)) {
      if (val) {
        await db.prepare(`INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)`).bind(key, JSON.stringify(val)).run();
        stats.settings++;
      }
    }
  } catch (e) { errors.push(`Settings: ${e.message}`); }

  return jsonResp({ ok: true, stats, errors: errors.length ? errors : undefined }, 200, origin);
}

async function handleApi(path, method, url, request, env, origin) {
  const db = env.DB;
  await db.prepare('PRAGMA foreign_keys = ON').run();

  const segments = path.split('/').filter(Boolean);
  const table = segments[0];
  const idOrAction = segments[1];
  const subAction = segments[2];

  // Special endpoints
  if (table === 'companies' && idOrAction && subAction === 'full') {
    return handleCompanyFull(idOrAction, db, origin);
  }
  if (table === 'notes' && idOrAction === 'search' && method === 'POST') {
    const q = url.searchParams.get('q') || '';
    return handleNotesSearch(q, db, origin);
  }
  if (table === 'migrate' && method === 'POST') {
    try {
      const body = await request.json();
      return handleMigrate(body, db, origin);
    } catch (e) {
      return jsonResp({ error: 'Migration failed: ' + e.message }, 500, origin);
    }
  }

  // Batch upsert: POST /api/{table}/batch
  if (TABLES[table] && idOrAction === 'batch' && method === 'POST') {
    try {
      const body = await request.json();
      if (!Array.isArray(body.items)) return jsonResp({ error: 'Expected { items: [...] }' }, 400, origin);
      const cfg = TABLES[table];
      const pk = cfg.pk || 'id';
      const results = [];
      for (const item of body.items) {
        if (pk === 'key' && item.key) {
          // Text PK (app_settings) — use INSERT OR REPLACE for upsert
          const cols = [];
          const vals = [];
          const ph = [];
          for (const col of cfg.cols) {
            if (item[col] !== undefined) { cols.push(col); vals.push(item[col]); ph.push('?'); }
          }
          if (cols.length) {
            await db.prepare(`INSERT OR REPLACE INTO ${table} (${cols.join(',')}) VALUES (${ph.join(',')})`).bind(...vals).run();
            results.push({ [pk]: item.key, action: 'upserted' });
          }
        } else if (item[pk]) {
          // Numeric PK — update existing
          const sets = [];
          const vals = [];
          for (const col of cfg.cols) {
            if (item[col] !== undefined) { sets.push(`${col} = ?`); vals.push(item[col]); }
          }
          if (sets.length && cfg.hasUpdatedAt) sets.push("updated_at = datetime('now')");
          if (sets.length) {
            vals.push(item[pk]);
            await db.prepare(`UPDATE ${table} SET ${sets.join(',')} WHERE ${pk} = ?`).bind(...vals).run();
          }
          results.push({ [pk]: item[pk], action: 'updated' });
        } else {
          // Insert new
          const cols = [];
          const vals = [];
          const ph = [];
          for (const col of cfg.cols) {
            if (item[col] !== undefined) { cols.push(col); vals.push(item[col]); ph.push('?'); }
          }
          if (cols.length) {
            const r = await db.prepare(`INSERT OR REPLACE INTO ${table} (${cols.join(',')}) VALUES (${ph.join(',')})`).bind(...vals).run();
            results.push({ [pk]: r.meta.last_row_id, action: 'inserted' });
          }
        }
      }
      return jsonResp({ ok: true, results }, 200, origin);
    } catch (e) {
      return jsonResp({ error: 'Batch failed: ' + e.message }, 500, origin);
    }
  }

  // Generic CRUD
  if (!TABLES[table]) {
    return jsonResp({ error: 'Unknown resource: ' + table }, 404, origin);
  }

  let body = null;
  if (method === 'POST' || method === 'PUT') {
    try { body = await request.json(); }
    catch (e) { return jsonResp({ error: 'Invalid JSON body' }, 400, origin); }
  }

  const id = idOrAction || null;
  try {
    return await handleCrud(table, method, id, body, url, db, origin);
  } catch (e) {
    return jsonResp({ error: e.message }, 500, origin);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const requestOrigin = request.headers.get('Origin');
    const allowedOrigin = getAllowedOrigin(requestOrigin, env);

    if (request.method === 'OPTIONS') {
      if (!allowedOrigin) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: cors(allowedOrigin) });
    }

    const path = url.pathname;

    // Health check
    if (path === '/' || path === '/health') {
      return jsonResp({ status: 'ok', ts: new Date().toISOString() }, 200, allowedOrigin);
    }

    // Single quote: GET /quote/AAPL
    if (path.startsWith('/quote/')) {
      const symbol = decodeURIComponent(path.slice(7));
      if (!symbol) return jsonResp({ error: 'Symbol required' }, 400, allowedOrigin);
      const modules = url.searchParams.get('modules') ||
        'price,financialData,incomeStatementHistory,cashflowStatementHistory,defaultKeyStatistics,balanceSheetHistory';
      try {
        return await fetchQuote(symbol, modules, allowedOrigin);
      } catch (e) {
        return jsonResp({ error: e.message }, 500, allowedOrigin);
      }
    }

    // Batch: GET /batch?symbols=AAPL,GOOGL,MSFT
    if (path === '/batch') {
      const syms = (url.searchParams.get('symbols') || '').split(',').map(s => s.trim()).filter(Boolean);
      if (!syms.length) return jsonResp({ error: 'symbols parameter required' }, 400, allowedOrigin);
      if (syms.length > 10) return jsonResp({ error: 'Max 10 symbols per batch' }, 400, allowedOrigin);
      const modules = url.searchParams.get('modules') ||
        'price,financialData,incomeStatementHistory,cashflowStatementHistory,defaultKeyStatistics';
      try {
        return await fetchBatch(syms, modules, allowedOrigin);
      } catch (e) {
        return jsonResp({ error: e.message }, 500, allowedOrigin);
      }
    }

    // Sync: GET /sync/load or POST /sync/save
    if (path.startsWith('/sync/')) {
      const key = request.headers.get('X-Sync-Key') || url.searchParams.get('key');
      if (key !== env.SYNC_SECRET) return jsonResp({ error: 'Unauthorized' }, 401, allowedOrigin);

      const action = path.slice(6); // 'load' or 'save'
      if (action === 'load' && request.method === 'GET') {
        try {
          const data = await env.SYNC_DATA.get('user_data', 'json');
          return jsonResp({ ok: true, data: data || null }, 200, allowedOrigin);
        } catch (e) {
          return jsonResp({ error: e.message }, 500, allowedOrigin);
        }
      }
      if (action === 'save' && request.method === 'POST') {
        try {
          const body = await request.json();
          const prev = await env.SYNC_DATA.get('user_data', 'text');
          if (prev) await env.SYNC_DATA.put('user_data_backup', prev);
          await env.SYNC_DATA.put('user_data', JSON.stringify(body));
          return jsonResp({ ok: true, savedAt: new Date().toISOString() }, 200, allowedOrigin);
        } catch (e) {
          return jsonResp({ error: e.message }, 500, allowedOrigin);
        }
      }
      return jsonResp({ error: 'Use GET /sync/load or POST /sync/save' }, 400, allowedOrigin);
    }

    // Chart: GET /chart/AAPL?range=1y&interval=1wk
    if (path.startsWith('/chart/')) {
      const symbol = decodeURIComponent(path.slice(7));
      if (!symbol) return jsonResp({ error: 'Symbol required' }, 400, allowedOrigin);
      const range = url.searchParams.get('range') || '1y';
      const interval = url.searchParams.get('interval') || '1wk';
      try {
        const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
        const resp = await fetch(chartUrl, { headers: { 'User-Agent': UA } });
        return jsonResp(await resp.json(), resp.status, allowedOrigin);
      } catch (e) {
        return jsonResp({ error: e.message }, 500, allowedOrigin);
      }
    }

    // D1 CRUD API: /api/*
    if (path.startsWith('/api/')) {
      const key = request.headers.get('X-Sync-Key') || url.searchParams.get('key');
      if (key !== env.SYNC_SECRET) {
        return jsonResp({ error: 'Unauthorized' }, 401, allowedOrigin);
      }
      const apiPath = path.slice(5); // strip '/api/'
      return handleApi(apiPath, request.method, url, request, env, allowedOrigin);
    }

    return jsonResp({ error: 'Not found. Use /quote/{SYMBOL}, /batch?symbols=A,B,C, /chart/{SYMBOL}, or /api/*' }, 404, allowedOrigin);
  }
};

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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    return jsonResp({ error: 'Not found. Use /quote/{SYMBOL}, /batch?symbols=A,B,C, or /chart/{SYMBOL}' }, 404, allowedOrigin);
  }
};

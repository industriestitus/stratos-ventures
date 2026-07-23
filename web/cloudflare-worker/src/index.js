// Yahoo Finance Proxy — Cloudflare Worker
// Handles crumb+cookie auth server-side, returns CORS-enabled JSON

const YAHOO = 'https://query2.finance.yahoo.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let cachedCrumb = null;
let cachedCookie = null;
let crumbExpiry = 0;

// --- Per-IP Rate Limiting ---
const rateLimitMap = new Map();
const RATE_LIMITS = {
  yahoo: { max: 30, windowMs: 60_000 },
  api:   { max: 120, windowMs: 60_000 },
  proxy: { max: 60, windowMs: 60_000 },
  auth:  { max: 20, windowMs: 60_000 },
};

function checkRateLimit(ip, bucket) {
  const limit = RATE_LIMITS[bucket];
  if (!limit) return null;
  const key = `${ip}:${bucket}`;
  const now = Date.now();
  let entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + limit.windowMs };
    rateLimitMap.set(key, entry);
  }
  entry.count++;
  if (entry.count > limit.max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return retryAfter;
  }
  // Periodic cleanup: if map grows beyond 1000 entries, prune expired
  if (rateLimitMap.size > 1000) {
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
  }
  return null;
}

const ALLOWED_ORIGINS = [
  'http://localhost:8765',
  'http://127.0.0.1:8765',
  'http://localhost:8767',
  'http://127.0.0.1:8767',
  'https://industriestitus.github.io',
  'https://stratos-ventures.pages.dev',
];

function getAllowedOrigin(requestOrigin, env) {
  const extra = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const all = [...ALLOWED_ORIGINS, ...extra];
  if (all.includes(requestOrigin)) return requestOrigin;
  return null;
}

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const len = Math.max(a.length, b.length);
  let result = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    result |= (a.charCodeAt(i % a.length) || 0) ^ (b.charCodeAt(i % b.length) || 0);
  }
  return result === 0;
}

// ====== Master-password auth (Security v2 / Phase B) ======
// The client derives an authKey from the master password (PBKDF2 + HKDF) and
// sends it to /auth/login. The server stores only SHA-256(authKey) and issues a
// per-device bearer token. All data endpoints accept EITHER the legacy sync key
// (X-Sync-Key) OR a valid device token (X-Auth-Token) during the transition.

async function sha256b64(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function genToken() {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

const TOKEN_TTL_SECONDS = 180 * 24 * 60 * 60; // 180 days
const AUTH_LOCK_MAX = 10;                       // failed attempts before lockout
const AUTH_LOCK_WINDOW_MS = 15 * 60 * 1000;     // 15-minute lockout window

// True if the request carries a valid sync key OR a live device token.
async function authenticate(request, env) {
  const syncKey = request.headers.get('X-Sync-Key');
  if (syncKey && env.SYNC_SECRET && timingSafeEqual(syncKey, env.SYNC_SECRET)) return true;
  const token = request.headers.get('X-Auth-Token');
  if (token && env.SYNC_DATA) {
    try {
      const rec = await env.SYNC_DATA.get('token_' + (await sha256b64(token)), 'json');
      if (rec) return true;
    } catch (e) { /* fall through to unauthorized */ }
  }
  return false;
}

// Per-IP brute-force gate for /auth/login, persisted in KV so it survives
// across Worker isolates.
async function authBruteLocked(env, ip) {
  try {
    const rec = await env.SYNC_DATA.get('authfail_' + ip, 'json');
    return !!(rec && rec.count >= AUTH_LOCK_MAX && Date.now() < rec.resetAt);
  } catch (e) { return false; }
}
async function authRecordFail(env, ip) {
  try {
    let rec = await env.SYNC_DATA.get('authfail_' + ip, 'json');
    if (!rec || Date.now() > rec.resetAt) rec = { count: 0, resetAt: Date.now() + AUTH_LOCK_WINDOW_MS };
    rec.count++;
    await env.SYNC_DATA.put('authfail_' + ip, JSON.stringify(rec), { expirationTtl: 3600 });
  } catch (e) { /* best-effort */ }
}
async function authClearFail(env, ip) {
  try { await env.SYNC_DATA.delete('authfail_' + ip); } catch (e) { /* best-effort */ }
}
// Revoke every device token, following the KV list cursor so nothing is missed past
// the first page. Used after a password change or recovery reset. Returns true on a
// fully-completed sweep, false if a page failed (caller can treat that as non-silent).
async function revokeAllTokens(env) {
  let cursor;
  try {
    do {
      const list = await env.SYNC_DATA.list({ prefix: 'token_', cursor });
      for (const k of list.keys) await env.SYNC_DATA.delete(k.name);
      cursor = list.list_complete ? undefined : list.cursor;
    } while (cursor);
    return true;
  } catch (e) { return false; }
}

function cors(allowedOrigin) {
  return {
    'Access-Control-Allow-Origin': allowedOrigin || '',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Sync-Key, X-Auth-Token',
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

// ====== Data API Proxy (FMP / Finnhub) ======
// Keys live in Worker secrets (FMP_KEY, FINNHUB_KEY) — never sent to the client.

const PROXY_UPSTREAMS = {
  fmp:     { base: 'https://financialmodelingprep.com/stable', keyParam: 'apikey', envKey: 'FMP_KEY' },
  finnhub: { base: 'https://finnhub.io/api/v1',                keyParam: 'token',  envKey: 'FINNHUB_KEY' },
};

async function handleProxy(provider, endpoint, url, env, allowedOrigin) {
  if (!Object.hasOwn(PROXY_UPSTREAMS, provider)) return jsonResp({ error: 'Unknown provider' }, 404, allowedOrigin);
  const cfg = PROXY_UPSTREAMS[provider];

  const secret = env[cfg.envKey];
  if (!secret) return jsonResp({ error: 'Provider not configured on Worker' }, 503, allowedOrigin);

  // Endpoint sanitization: path segments only — no scheme, no query tricks.
  // Dots and commas are allowed for symbols (e.g. EVO.ST, batch AAPL,MSFT);
  // the explicit '..' block still prevents path traversal.
  if (!/^[A-Za-z0-9/_.,-]+$/.test(endpoint) || endpoint.includes('..')) {
    return jsonResp({ error: 'Invalid endpoint' }, 400, allowedOrigin);
  }

  // Forward query params, but never let the client override the API key.
  // Case-insensitive strip so no casing variant of a key param slips through.
  const params = new URLSearchParams();
  for (const [k, v] of url.searchParams) {
    const lk = k.toLowerCase();
    if (lk === cfg.keyParam || lk === 'apikey' || lk === 'token') continue;
    params.set(k, v);
  }
  params.set(cfg.keyParam, secret);

  const upstreamUrl = `${cfg.base}/${endpoint}?${params}`;
  try {
    const resp = await fetch(upstreamUrl, { redirect: 'manual' });
    let text = await resp.text();
    // Defense-in-depth: scrub the secret from the body in case an upstream error
    // page ever reflects the request URL back verbatim.
    if (text.includes(secret)) text = text.split(secret).join('[REDACTED]');
    // Pass through status + body; upstream errors (429/401) surface to the client unchanged
    return new Response(text, { status: resp.status, headers: cors(allowedOrigin) });
  } catch (e) {
    console.error('Proxy error (' + provider + '/' + endpoint + '):', e.message);
    return jsonResp({ error: 'Upstream fetch failed' }, 502, allowedOrigin);
  }
}

// ====== Auth endpoints (/auth/*) ======

async function handleAuth(action, request, url, env, allowedOrigin, clientIP) {
  if (!env.SYNC_DATA) return jsonResp({ error: 'Auth store unavailable' }, 503, allowedOrigin);

  // GET /auth/salt — public. Returns the account salt so the client can derive
  // its authKey before logging in. `initialized` tells the client whether an
  // account has been set up yet.
  if (action === 'salt' && request.method === 'GET') {
    const cfg = await env.SYNC_DATA.get('auth_config', 'json');
    return jsonResp({ ok: true, salt: cfg ? cfg.salt : null, initialized: !!cfg }, 200, allowedOrigin);
  }

  // POST /auth/setup — one-time bootstrap. Gated by the legacy sync key so only
  // the existing owner can establish master-password auth. Body: {salt, authVerifier}.
  if (action === 'setup' && request.method === 'POST') {
    const syncKey = request.headers.get('X-Sync-Key');
    if (!syncKey || !env.SYNC_SECRET || !timingSafeEqual(syncKey, env.SYNC_SECRET)) {
      return jsonResp({ error: 'Setup requires the sync key' }, 401, allowedOrigin);
    }
    let body;
    try { body = await request.json(); } catch (e) { return jsonResp({ error: 'Invalid JSON' }, 400, allowedOrigin); }
    if (!body.salt || !body.authVerifier) return jsonResp({ error: 'salt and authVerifier required' }, 400, allowedOrigin);
    const existing = await env.SYNC_DATA.get('auth_config', 'json');
    // Allow overwrite (password change / re-setup) since the caller proved the sync key.
    await env.SYNC_DATA.put('auth_config', JSON.stringify({
      salt: body.salt, authVerifier: body.authVerifier,
      created: existing ? existing.created : new Date().toISOString(),
      updated: new Date().toISOString(),
    }));
    return jsonResp({ ok: true, replaced: !!existing }, 200, allowedOrigin);
  }

  // POST /auth/login — public but brute-force limited. Body: {authKey, device}.
  // On success issues a per-device bearer token.
  if (action === 'login' && request.method === 'POST') {
    if (await authBruteLocked(env, clientIP)) {
      return jsonResp({ error: 'Too many attempts — try again later' }, 429, allowedOrigin);
    }
    let body;
    try { body = await request.json(); } catch (e) { return jsonResp({ error: 'Invalid JSON' }, 400, allowedOrigin); }
    const cfg = await env.SYNC_DATA.get('auth_config', 'json');
    if (!cfg) return jsonResp({ error: 'No account — run setup first' }, 404, allowedOrigin);
    if (!body.authKey) return jsonResp({ error: 'authKey required' }, 400, allowedOrigin);
    const verifier = await sha256b64(body.authKey);
    if (!timingSafeEqual(verifier, cfg.authVerifier)) {
      await authRecordFail(env, clientIP);
      return jsonResp({ error: 'Invalid password' }, 401, allowedOrigin);
    }
    await authClearFail(env, clientIP);
    const token = genToken();
    const device = (typeof body.device === 'string' ? body.device : '').slice(0, 60) || 'Unknown device';
    await env.SYNC_DATA.put('token_' + (await sha256b64(token)), JSON.stringify({
      device, created: new Date().toISOString(),
    }), { expirationTtl: TOKEN_TTL_SECONDS });
    return jsonResp({ ok: true, token, device }, 200, allowedOrigin);
  }

  // POST /auth/change — change the master password. Requires a live session
  // (token or sync key) AND proof of the current password (oldAuthKey), so a
  // stolen bearer token alone cannot change it. Body: {oldAuthKey, salt, authVerifier}.
  // This is the recovery path that keeps the account changeable after the sync
  // key is retired in Phase B3.
  if (action === 'change' && request.method === 'POST') {
    if (!(await authenticate(request, env))) return jsonResp({ error: 'Unauthorized' }, 401, allowedOrigin);
    let body;
    try { body = await request.json(); } catch (e) { return jsonResp({ error: 'Invalid JSON' }, 400, allowedOrigin); }
    if (!body.oldAuthKey || !body.salt || !body.authVerifier) return jsonResp({ error: 'oldAuthKey, salt and authVerifier required' }, 400, allowedOrigin);
    const cfg = await env.SYNC_DATA.get('auth_config', 'json');
    if (!cfg) return jsonResp({ error: 'No account — run setup first' }, 404, allowedOrigin);
    const oldVerifier = await sha256b64(body.oldAuthKey);
    if (!timingSafeEqual(oldVerifier, cfg.authVerifier)) {
      await authRecordFail(env, clientIP);
      return jsonResp({ error: 'Current password incorrect' }, 401, allowedOrigin);
    }
    // The new password derives a new encKey, so the envelope's encKey-wrapped DEK
    // must be re-wrapped (client sends newWrapEnc). The recovery wrap (wrapRec) and
    // its verifier are untouched, so the recovery key still works. Envelope fields
    // live inside auth_config, so this single put updates auth + wrapEnc ATOMICALLY —
    // no window where the password and the DEK wrapper disagree.
    const changed = {
      salt: body.salt, authVerifier: body.authVerifier,
      created: cfg.created, updated: new Date().toISOString(),
      wrapEnc: body.newWrapEnc || cfg.wrapEnc || null,
      wrapRec: cfg.wrapRec || null, recVerifier: cfg.recVerifier || null,
    };
    await env.SYNC_DATA.put('auth_config', JSON.stringify(changed));
    // Security: a password change revokes ALL device tokens, so a compromised
    // token cannot survive the remediation. Every device must sign in again.
    const revoked = await revokeAllTokens(env);
    return jsonResp({ ok: true, tokensRevoked: revoked }, 200, allowedOrigin);
  }

  // GET /auth/devices — list active device tokens (requires auth). Returns
  // opaque ids (token-hash prefixes), never the tokens themselves.
  if (action === 'devices' && request.method === 'GET') {
    if (!(await authenticate(request, env))) return jsonResp({ error: 'Unauthorized' }, 401, allowedOrigin);
    const list = await env.SYNC_DATA.list({ prefix: 'token_' });
    const devices = [];
    for (const k of list.keys) {
      const rec = await env.SYNC_DATA.get(k.name, 'json');
      if (rec) devices.push({ id: k.name.slice('token_'.length, 'token_'.length + 12), device: rec.device, created: rec.created });
    }
    return jsonResp({ ok: true, devices }, 200, allowedOrigin);
  }

  // POST /auth/revoke — revoke a device token by id prefix (requires auth).
  if (action === 'revoke' && request.method === 'POST') {
    if (!(await authenticate(request, env))) return jsonResp({ error: 'Unauthorized' }, 401, allowedOrigin);
    let body;
    try { body = await request.json(); } catch (e) { return jsonResp({ error: 'Invalid JSON' }, 400, allowedOrigin); }
    if (!body.id) return jsonResp({ error: 'id required' }, 400, allowedOrigin);
    const list = await env.SYNC_DATA.list({ prefix: 'token_' });
    let revoked = 0;
    for (const k of list.keys) {
      if (k.name.slice('token_'.length, 'token_'.length + 12) === body.id) { await env.SYNC_DATA.delete(k.name); revoked++; }
    }
    return jsonResp({ ok: true, revoked }, 200, allowedOrigin);
  }

  // POST /auth/recover — recovery-key password reset (public, brute-force limited).
  // Two phases keyed on the body: {proof} alone returns wrapRec so the client can
  // unwrap the DEK; {proof, salt, authVerifier, newWrapEnc} commits the new password.
  // `proof` is SHA-256(recoveryKey), compared timing-safe against the stored verifier.
  // The DEK is unchanged (wrapRec/recVerifier preserved), so encrypted data survives.
  if (action === 'recover' && request.method === 'POST') {
    if (await authBruteLocked(env, clientIP)) {
      return jsonResp({ error: 'Too many attempts — try again later' }, 429, allowedOrigin);
    }
    let body;
    try { body = await request.json(); } catch (e) { return jsonResp({ error: 'Invalid JSON' }, 400, allowedOrigin); }
    if (!body.proof) return jsonResp({ error: 'proof required' }, 400, allowedOrigin);
    const cfg = await env.SYNC_DATA.get('auth_config', 'json');
    if (!cfg || !cfg.recVerifier) return jsonResp({ error: 'No recovery key set up' }, 404, allowedOrigin);
    // Parity with /auth/login: the stored recVerifier is SHA-256 of the submitted proof,
    // so the stored value is NOT itself a usable proof. A read-only KV leak of auth_config
    // therefore cannot be replayed to pass recovery.
    if (!timingSafeEqual(await sha256b64(body.proof), cfg.recVerifier)) {
      await authRecordFail(env, clientIP);
      return jsonResp({ error: 'Invalid recovery key' }, 401, allowedOrigin);
    }
    await authClearFail(env, clientIP);
    // Phase 1: hand back wrapRec so the client can unwrap the DEK with the recovery key.
    if (!body.salt || !body.authVerifier || !body.newWrapEnc) {
      return jsonResp({ ok: true, wrapRec: cfg.wrapRec || null }, 200, allowedOrigin);
    }
    // Phase 2: commit the reset — single atomic put, then revoke every device token.
    // The client rotates the recovery key (the old one may be compromised — that's why
    // we're here), so newWrapRec/newRecVerifier replace the old ones when provided.
    await env.SYNC_DATA.put('auth_config', JSON.stringify({
      salt: body.salt, authVerifier: body.authVerifier,
      created: cfg.created, updated: new Date().toISOString(),
      wrapEnc: body.newWrapEnc,
      wrapRec: body.newWrapRec || cfg.wrapRec,
      recVerifier: body.newRecVerifier || cfg.recVerifier,
    }));
    const revoked = await revokeAllTokens(env);
    return jsonResp({ ok: true, reset: true, tokensRevoked: revoked }, 200, allowedOrigin);
  }

  // GET /auth/dek — return the envelope's encKey-wrapped DEK (requires auth). The
  // wrapEnc blob is only decryptable with the caller's encKey (never sent to us),
  // so this leaks nothing usable. `exists` tells the client whether to provision.
  // Envelope fields live inside auth_config (one object → atomic password changes).
  if (action === 'dek' && request.method === 'GET') {
    if (!(await authenticate(request, env))) return jsonResp({ error: 'Unauthorized' }, 401, allowedOrigin);
    const cfg = await env.SYNC_DATA.get('auth_config', 'json');
    return jsonResp({ ok: true, exists: !!(cfg && cfg.wrapEnc), wrapEnc: cfg ? (cfg.wrapEnc || null) : null }, 200, allowedOrigin);
  }

  // PUT /auth/dek — one-time envelope provisioning. Stores the DEK wrapped by encKey
  // AND by the recovery key, plus SHA-256(recoveryKey) for the C1b reset flow. Beyond
  // a valid session it also requires `authProof` (the caller's authKey) that hashes to
  // the account verifier — so a bare stolen token cannot plant an envelope the real
  // owner can't open. Rejected if already provisioned (re-wrap goes through /auth/change).
  if (action === 'dek' && request.method === 'PUT') {
    if (!(await authenticate(request, env))) return jsonResp({ error: 'Unauthorized' }, 401, allowedOrigin);
    let body;
    try { body = await request.json(); } catch (e) { return jsonResp({ error: 'Invalid JSON' }, 400, allowedOrigin); }
    if (!body.wrapEnc || !body.wrapRec || !body.recVerifier || !body.authProof) return jsonResp({ error: 'wrapEnc, wrapRec, recVerifier and authProof required' }, 400, allowedOrigin);
    const cfg = await env.SYNC_DATA.get('auth_config', 'json');
    if (!cfg) return jsonResp({ error: 'No account — run setup first' }, 404, allowedOrigin);
    if (!timingSafeEqual(await sha256b64(body.authProof), cfg.authVerifier)) {
      await authRecordFail(env, clientIP);
      return jsonResp({ error: 'Password proof invalid' }, 401, allowedOrigin);
    }
    if (cfg.wrapEnc) return jsonResp({ error: 'Envelope already provisioned' }, 409, allowedOrigin);
    cfg.wrapEnc = body.wrapEnc;
    cfg.wrapRec = body.wrapRec;
    cfg.recVerifier = body.recVerifier;
    cfg.updated = new Date().toISOString();
    await env.SYNC_DATA.put('auth_config', JSON.stringify(cfg));
    return jsonResp({ ok: true }, 200, allowedOrigin);
  }

  return jsonResp({ error: 'Use GET /auth/salt, POST /auth/setup, POST /auth/login, POST /auth/change, POST /auth/recover, GET /auth/devices, POST /auth/revoke, GET|PUT /auth/dek' }, 400, allowedOrigin);
}

// ====== D1 CRUD API ======

// conflictTarget: for rows inserted WITHOUT an id, the natural-key UNIQUE constraint to
// upsert on. Without it the idless INSERT uses ON CONFLICT(id) — which never fires (id is
// a fresh autoincrement) — so a second save of the same natural key raises a UNIQUE
// violation and the whole batch fails, silently dropping edits. Tables whose client saver
// always sends the row id (transactions, reviews, valuations, framework, general_todos,
// company_todos) don't need one. Tables with no natural key (notes, snapshot_positions,
// note_images) intentionally have none (they insert-only).
const TABLES = {
  companies:             { cols: ['symbol','name','sector','currency','exchange','company_type','pipeline_status','thesis','sort_order','archived_at','price_alerts','tags','ideal_trait_checks','avoid_checks','holder_type'], hasUpdatedAt: true, conflictTarget: 'symbol' },
  company_todos:         { cols: ['company_id','title','due_date','is_done','sort_order'], hasUpdatedAt: true },
  earnings_timeline:     { cols: ['company_id','year','quarter','is_reported','is_reviewed','report_date'], hasUpdatedAt: true, conflictTarget: 'company_id, year, quarter' },
  filing_tracking:       { cols: ['company_id','filing_type','fiscal_year','fiscal_quarter','is_read','filed_date','notes'], hasUpdatedAt: true, conflictTarget: 'company_id, filing_type, fiscal_year, fiscal_quarter' },
  company_data_overrides:{ cols: ['company_id','metric_key','original_value','override_value','reason','deleted_at'], hasUpdatedAt: true, conflictTarget: 'company_id, metric_key' },
  notes:                 { cols: ['company_id','note_type','title','content','note_date','quarter','source_name','source_url','is_pinned','excerpt','action','tags','deleted_at'], hasUpdatedAt: true },
  note_images:           { cols: ['note_id','filename','mime_type','image_data','sort_order','deleted_at'], hasUpdatedAt: false },
  broker_accounts:       { cols: ['name','currency','is_active'], hasUpdatedAt: true, conflictTarget: 'name' },
  positions:             { cols: ['company_id','account_id','shares','avg_cost','deleted_at','details'], hasUpdatedAt: true, conflictTarget: 'company_id, account_id' },
  transactions:          { cols: ['company_id','account_id','transaction_type','transaction_date','shares','price_per_share','total_amount','fees','currency','notes','deleted_at'], hasUpdatedAt: false },
  portfolio_snapshots:   { cols: ['snapshot_date','total_value','base_currency','notes'], hasUpdatedAt: false, conflictTarget: 'snapshot_date' },
  snapshot_positions:    { cols: ['snapshot_id','company_id','account_id','shares','price_per_share','market_value','currency','intent'], hasUpdatedAt: false, conflictTarget: 'snapshot_id, company_id, account_id' },
  exchange_rates:        { cols: ['rate_date','from_currency','to_currency','rate'], hasUpdatedAt: false, conflictTarget: 'rate_date, from_currency, to_currency' },
  dividend_history:      { cols: ['company_id','ex_date','pay_date','amount','currency','frequency'], hasUpdatedAt: false, conflictTarget: 'company_id, ex_date' },
  framework_entries:     { cols: ['category','title','content','sort_order','deleted_at'], hasUpdatedAt: true },
  checklist_templates:   { cols: ['section_key','title','description','fields_json','sort_order'], hasUpdatedAt: true, conflictTarget: 'section_key' },
  checklist_answers:     { cols: ['company_id','template_id','answer_json','progress','status'], hasUpdatedAt: true, conflictTarget: 'company_id, template_id' },
  reviews:               { cols: ['review_type','review_date','company_id','answers_json','summary','deleted_at'], hasUpdatedAt: true },
  valuations:            { cols: ['company_id','method','label','currency','scale','inputs_json','results_json','intrinsic_value','upside_pct','is_primary','valuation_date','deleted_at'], hasUpdatedAt: true, conflictTarget: 'company_id, label' },
  general_todos:         { cols: ['title','due_date','is_done','sort_order'], hasUpdatedAt: true },
  app_settings:          { cols: ['key','value'], hasUpdatedAt: false, pk: 'key' },
  api_cache:             { cols: ['company_id','data_source','data_json','fetched_at'], hasUpdatedAt: false, conflictTarget: 'company_id, data_source' },
};

// Whitelist for natural-key DELETE (DELETE /api/{table}?col=val...). Only these tables allow it, and
// ONLY when the FULL key below is supplied — so it can delete exactly one logical row and can never
// degrade into a partial-key mass delete (e.g. wiping every override/position of a company).
const NATURAL_DELETE = {
  company_data_overrides: ['company_id', 'metric_key'],
  valuations:             ['company_id', 'label'],
};

async function handleCrud(table, method, id, body, url, db, origin) {
  const cfg = TABLES[table];
  if (!cfg) return jsonResp({ error: 'Unknown table' }, 404, origin);
  const pk = cfg.pk || 'id';

  if (method === 'GET' && !id) {
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '500'), 100000);
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
        return jsonResp({ error: 'Constraint violation' }, 409, origin);
      }
      throw e;
    }
  }

  if (method === 'PUT' && id) {
    // Natural-key (pk !== 'id') tables — app_settings — UPSERT: a PUT to a key that doesn't
    // exist yet must CREATE the row. The old UPDATE-only path affected 0 rows → 404, so the
    // whole app_settings family (fi_settings/benchmark/52w_highs/dividend_settings/
    // scoring_weights/exchange_rates_config) only worked because those keys had been seeded
    // via /migrate; a fresh account 404'd on its first save. INSERT ... ON CONFLICT fixes it.
    // id-based tables keep UPDATE-only semantics (a PUT to a nonexistent id stays a 404).
    if (pk !== 'id') {
      const cols = [pk];
      const vals = [id];
      const ph = ['?'];
      for (const col of cfg.cols) {
        if (col === pk) continue;
        if (body[col] !== undefined) { cols.push(col); vals.push(body[col]); ph.push('?'); }
      }
      if (cols.length < 2) return jsonResp({ error: 'No valid columns to update' }, 400, origin);
      const updateCols = cols.slice(1);
      const updates = updateCols.map(c => `${c} = excluded.${c}`).join(',');
      const updatedAtClause = cfg.hasUpdatedAt ? `, updated_at = datetime('now')` : '';
      const sql = `INSERT INTO ${table} (${cols.join(',')}) VALUES (${ph.join(',')}) ON CONFLICT(${pk}) DO UPDATE SET ${updates}${updatedAtClause}`;
      try {
        await db.prepare(sql).bind(...vals).run();
        const row = await db.prepare(`SELECT * FROM ${table} WHERE ${pk} = ?`).bind(id).first();
        return jsonResp(row, 200, origin);
      } catch (e) {
        if (e.message.includes('UNIQUE') || e.message.includes('FOREIGN') || e.message.includes('CHECK')) {
          return jsonResp({ error: 'Constraint violation' }, 409, origin);
        }
        throw e;
      }
    }
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
        return jsonResp({ error: 'Constraint violation' }, 409, origin);
      }
      throw e;
    }
  }

  if (method === 'DELETE' && id) {
    const row = await db.prepare(`SELECT * FROM ${table} WHERE ${pk} = ?`).bind(id).first();
    if (!row) return jsonResp({ error: 'Not found' }, 404, origin);
    if (table === 'companies') {
      await db.batch([
        db.prepare('DELETE FROM notes WHERE company_id = ?').bind(id),
        db.prepare(`DELETE FROM ${table} WHERE ${pk} = ?`).bind(id),
      ]);
    } else {
      await db.prepare(`DELETE FROM ${table} WHERE ${pk} = ?`).bind(id).run();
    }
    return jsonResp({ ok: true, deleted: row }, 200, origin);
  }

  // Natural-key delete: DELETE /api/{table}?col=val&col2=val2 — lets the client remove a row it only
  // knows by natural key (e.g. clearing a company_data_overrides entry by company_id+metric_key)
  // instead of by an id it never captured. Restricted to the NATURAL_DELETE allowlist and requires
  // the FULL key (every listed column, each non-empty) so it targets exactly one logical row and can
  // never become a partial-key mass delete.
  if (method === 'DELETE' && !id) {
    const keyCols = NATURAL_DELETE[table];
    if (!keyCols) return jsonResp({ error: 'Natural-key delete not allowed for this table' }, 400, origin);
    const binds = [];
    for (const k of keyCols) {
      const v = url.searchParams.get(k);
      if (v === null || v === '') return jsonResp({ error: 'Missing key column: ' + k }, 400, origin);
      binds.push(v);
    }
    const where = keyCols.map(k => `${k} = ?`).join(' AND ');
    // Soft-delete (tombstone) when the table tracks deleted_at: the row stays in D1 with
    // deleted_at set instead of being removed, so a stale second device that still holds the
    // row live can't resurrect it — the tombstone propagates on that device's next load. A
    // later live upsert of the same natural key sends deleted_at:null, which un-tombstones it
    // (re-add works). Hard-delete only for natural-key tables with no deleted_at column.
    if (cfg.cols.includes('deleted_at')) {
      const uaClause = cfg.hasUpdatedAt ? `, updated_at = datetime('now')` : '';
      const res = await db.prepare(`UPDATE ${table} SET deleted_at = ?${uaClause} WHERE ${where}`).bind(new Date().toISOString(), ...binds).run();
      return jsonResp({ ok: true, softDeleted: res.meta ? res.meta.changes : undefined }, 200, origin);
    }
    const res = await db.prepare(`DELETE FROM ${table} WHERE ${where}`).bind(...binds).run();
    return jsonResp({ ok: true, deleted: res.meta ? res.meta.changes : undefined }, 200, origin);
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
  if (query.length > 200) return jsonResp({ error: 'Query too long (max 200 chars)' }, 400, origin);
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
  const clearStmts = clearTables.map(t => db.prepare(`DELETE FROM ${t}`));
  clearStmts.push(db.prepare("DELETE FROM app_settings WHERE key NOT IN ('schema_version')"));
  try { await db.batch(clearStmts); } catch(e) { console.error('Clear tables failed:', e); }

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
  const cl = parseInt(request.headers.get('Content-Length') || '0', 10);
  if (cl > 5 * 1024 * 1024) return new Response(JSON.stringify({ error: 'Request body too large (max 5MB)' }), { status: 413, headers: cors(origin) });
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
  // Cache check: GET /api/cache-check/:company_id/:data_source
  if (table === 'cache-check' && idOrAction && subAction && method === 'GET') {
    const row = await db.prepare('SELECT data_json, fetched_at FROM api_cache WHERE company_id = ? AND data_source = ?').bind(Number(idOrAction), subAction).first();
    if (!row) return jsonResp({ cached: false }, 200, origin);
    try { return jsonResp({ cached: true, data: JSON.parse(row.data_json), fetched_at: row.fetched_at }, 200, origin); }
    catch (e) { return jsonResp({ cached: false, error: 'Corrupted cache entry' }, 200, origin); }
  }
  // Cache upsert: PUT /api/cache-upsert
  if (table === 'cache-upsert' && method === 'PUT') {
    const body = await request.json();
    const { company_id, data_source, data_json } = body;
    if (!company_id || !data_source || !data_json) return jsonResp({ error: 'Missing company_id, data_source, or data_json' }, 400, origin);
    await db.prepare("INSERT INTO api_cache (company_id, data_source, data_json, fetched_at) VALUES (?, ?, ?, datetime('now')) ON CONFLICT(company_id, data_source) DO UPDATE SET data_json = excluded.data_json, fetched_at = excluded.fetched_at").bind(company_id, data_source, JSON.stringify(data_json)).run();
    return jsonResp({ ok: true }, 200, origin);
  }
  if (table === 'migrate' && method === 'POST') {
    try {
      const body = await request.json();
      return handleMigrate(body, db, origin);
    } catch (e) {
      console.error('Migration error:', e.message);
      return jsonResp({ error: 'Migration failed' }, 500, origin);
    }
  }

  // Batch upsert: POST /api/{table}/batch
  if (TABLES[table] && idOrAction === 'batch' && method === 'POST') {
    try {
      const body = await request.json();
      if (!Array.isArray(body.items)) return jsonResp({ error: 'Expected { items: [...] }' }, 400, origin);
      if (body.items.length > 1000) return jsonResp({ error: 'Max 1000 items per batch' }, 400, origin);
      const cfg = TABLES[table];
      const pk = cfg.pk || 'id';
      const stmts = [];
      const results = [];
      for (const item of body.items) {
        if (pk === 'key' && item.key) {
          const cols = [];
          const vals = [];
          const ph = [];
          for (const col of cfg.cols) {
            if (item[col] !== undefined) { cols.push(col); vals.push(item[col]); ph.push('?'); }
          }
          if (cols.length) {
            stmts.push(db.prepare(`INSERT OR REPLACE INTO ${table} (${cols.join(',')}) VALUES (${ph.join(',')})`).bind(...vals));
            results.push({ [pk]: item.key, action: 'upserted' });
          }
        } else if (item[pk]) {
          const cols = [pk];
          const vals = [item[pk]];
          const ph = ['?'];
          for (const col of cfg.cols) {
            if (item[col] !== undefined) { cols.push(col); vals.push(item[col]); ph.push('?'); }
          }
          if (cols.length > 1) {
            const updateCols = cols.slice(1);
            const updates = updateCols.map(c => `${c} = excluded.${c}`).join(',');
            const updatedAtClause = cfg.hasUpdatedAt ? `, updated_at = datetime('now')` : '';
            stmts.push(db.prepare(`INSERT INTO ${table} (${cols.join(',')}) VALUES (${ph.join(',')}) ON CONFLICT(${pk}) DO UPDATE SET ${updates}${updatedAtClause}`).bind(...vals));
          }
          results.push({ [pk]: item[pk], action: 'upserted' });
        } else {
          const cols = [];
          const vals = [];
          const ph = [];
          for (const col of cfg.cols) {
            if (item[col] !== undefined) { cols.push(col); vals.push(item[col]); ph.push('?'); }
          }
          if (cols.length) {
            // Upsert on the table's natural key when defined (rows sent without an id),
            // else fall back to the id target (insert-only for keyless tables). This is
            // what lets a second save of the same natural key UPDATE instead of raising a
            // UNIQUE violation that fails the whole batch.
            const target = cfg.conflictTarget || pk;
            const updatedAtClause = cfg.hasUpdatedAt ? `, updated_at = datetime('now')` : '';
            const updates = cols.map(c => `${c} = excluded.${c}`).join(',');
            stmts.push(db.prepare(`INSERT INTO ${table} (${cols.join(',')}) VALUES (${ph.join(',')}) ON CONFLICT(${target}) DO UPDATE SET ${updates}${updatedAtClause}`).bind(...vals));
            results.push({ action: 'upserted' });
          }
        }
      }
      if (stmts.length) await db.batch(stmts);
      return jsonResp({ ok: true, results }, 200, origin);
    } catch (e) {
      console.error('Batch error:', e.message);
      return jsonResp({ error: 'Batch operation failed' }, 500, origin);
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
    console.error('CRUD error:', table, method, e.message);
    return jsonResp({ error: 'Internal server error' }, 500, origin);
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
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

    // Rate limit Yahoo proxy endpoints
    if (path.startsWith('/quote/') || path === '/batch' || path.startsWith('/chart/')) {
      const retryAfter = checkRateLimit(clientIP, 'yahoo');
      if (retryAfter) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...cors(allowedOrigin), 'Retry-After': String(retryAfter) },
        });
      }
    }

    // Rate limit D1 API endpoints
    if (path.startsWith('/api/')) {
      const retryAfter = checkRateLimit(clientIP, 'api');
      if (retryAfter) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...cors(allowedOrigin), 'Retry-After': String(retryAfter) },
        });
      }
    }

    // Rate limit data API proxy endpoints
    if (path.startsWith('/proxy/')) {
      const retryAfter = checkRateLimit(clientIP, 'proxy');
      if (retryAfter) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...cors(allowedOrigin), 'Retry-After': String(retryAfter) },
        });
      }
    }

    // Rate limit auth endpoints (login brute-force also gated per-account in KV)
    if (path.startsWith('/auth/')) {
      const retryAfter = checkRateLimit(clientIP, 'auth');
      if (retryAfter) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...cors(allowedOrigin), 'Retry-After': String(retryAfter) },
        });
      }
    }

    // Health check
    if (path === '/' || path === '/health') {
      return jsonResp({ status: 'ok', ts: new Date().toISOString() }, 200, allowedOrigin);
    }

    // Auth: /auth/salt, /auth/setup, /auth/login, /auth/devices, /auth/revoke
    if (path.startsWith('/auth/')) {
      return handleAuth(path.slice(6), request, url, env, allowedOrigin, clientIP);
    }

    // Single quote: GET /quote/AAPL
    if (path.startsWith('/quote/')) {
      if (!(await authenticate(request, env))) return jsonResp({ error: 'Unauthorized' }, 401, allowedOrigin);
      const symbol = decodeURIComponent(path.slice(7));
      if (!symbol) return jsonResp({ error: 'Symbol required' }, 400, allowedOrigin);
      const modules = url.searchParams.get('modules') ||
        'price,financialData,incomeStatementHistory,cashflowStatementHistory,defaultKeyStatistics,balanceSheetHistory';
      try {
        return await fetchQuote(symbol, modules, allowedOrigin);
      } catch (e) {
        console.error('Quote error:', symbol, e.message);
        return jsonResp({ error: 'Quote fetch failed' }, 500, allowedOrigin);
      }
    }

    // Batch: GET /batch?symbols=AAPL,GOOGL,MSFT
    if (path === '/batch') {
      if (!(await authenticate(request, env))) return jsonResp({ error: 'Unauthorized' }, 401, allowedOrigin);
      const syms = (url.searchParams.get('symbols') || '').split(',').map(s => s.trim()).filter(Boolean);
      if (!syms.length) return jsonResp({ error: 'symbols parameter required' }, 400, allowedOrigin);
      if (syms.length > 10) return jsonResp({ error: 'Max 10 symbols per batch' }, 400, allowedOrigin);
      const modules = url.searchParams.get('modules') ||
        'price,financialData,incomeStatementHistory,cashflowStatementHistory,defaultKeyStatistics';
      try {
        return await fetchBatch(syms, modules, allowedOrigin);
      } catch (e) {
        console.error('Batch quote error:', e.message);
        return jsonResp({ error: 'Batch quote fetch failed' }, 500, allowedOrigin);
      }
    }

    // Sync: GET /sync/load or POST /sync/save
    if (path.startsWith('/sync/')) {
      if (!(await authenticate(request, env))) return jsonResp({ error: 'Unauthorized' }, 401, allowedOrigin);

      const action = path.slice(6);
      if (action === 'meta' && request.method === 'GET') {
        try {
          const meta = await env.SYNC_DATA.get('user_meta', 'json');
          return jsonResp({ ok: true, meta: meta || null }, 200, allowedOrigin);
        } catch (e) {
          console.error('Sync meta load error:', e.message);
          return jsonResp({ error: 'Failed to load meta' }, 500, allowedOrigin);
        }
      }
      if (action === 'meta' && request.method === 'POST') {
        try {
          const body = await request.json();
          if (typeof body.expected_version === 'number') {
            const current = await env.SYNC_DATA.get('user_meta', 'json');
            if (current && current.meta_version !== body.expected_version) {
              return jsonResp({ error: 'Version conflict', current_version: current.meta_version }, 409, allowedOrigin);
            }
          }
          const meta = body.meta || body;
          if (meta.expected_version !== undefined) delete meta.expected_version;
          await env.SYNC_DATA.put('user_meta', JSON.stringify(meta));
          return jsonResp({ ok: true, savedAt: new Date().toISOString() }, 200, allowedOrigin);
        } catch (e) {
          console.error('Sync meta save error:', e.message);
          return jsonResp({ error: 'Failed to save meta' }, 500, allowedOrigin);
        }
      }
      if (action === 'load' && request.method === 'GET') {
        try {
          const data = await env.SYNC_DATA.get('user_data', 'json');
          return jsonResp({ ok: true, data: data || null }, 200, allowedOrigin);
        } catch (e) {
          console.error('Sync load error:', e.message);
          return jsonResp({ error: 'Failed to load sync data' }, 500, allowedOrigin);
        }
      }
      if (action === 'save' && request.method === 'POST') {
        try {
          const body = await request.json();
          if (typeof body.enc_version === 'number') {
            const meta = await env.SYNC_DATA.get('user_meta', 'json');
            if (meta && typeof meta.meta_version === 'number' && body.enc_version < meta.meta_version) {
              return jsonResp({ error: 'Stale encryption version', current_meta_version: meta.meta_version }, 409, allowedOrigin);
            }
          }
          const prev = await env.SYNC_DATA.get('user_data', 'text');
          if (prev) await env.SYNC_DATA.put('user_data_backup', prev);
          await env.SYNC_DATA.put('user_data', JSON.stringify(body));
          return jsonResp({ ok: true, savedAt: new Date().toISOString() }, 200, allowedOrigin);
        } catch (e) {
          console.error('Sync save error:', e.message);
          return jsonResp({ error: 'Failed to save sync data' }, 500, allowedOrigin);
        }
      }
      if (action === 'restore-backup' && request.method === 'POST') {
        try {
          const backup = await env.SYNC_DATA.get('user_data_backup', 'text');
          if (!backup) return jsonResp({ error: 'No backup available' }, 404, allowedOrigin);
          await env.SYNC_DATA.put('user_data', backup);
          return jsonResp({ ok: true, restoredAt: new Date().toISOString() }, 200, allowedOrigin);
        } catch (e) {
          console.error('Sync restore error:', e.message);
          return jsonResp({ error: 'Failed to restore backup' }, 500, allowedOrigin);
        }
      }
      return jsonResp({ error: 'Use GET /sync/load, POST /sync/save, GET|POST /sync/meta, or POST /sync/restore-backup' }, 400, allowedOrigin);
    }

    // Chart: GET /chart/AAPL?range=1y&interval=1wk
    if (path.startsWith('/chart/')) {
      if (!(await authenticate(request, env))) return jsonResp({ error: 'Unauthorized' }, 401, allowedOrigin);
      const symbol = decodeURIComponent(path.slice(7));
      if (!symbol) return jsonResp({ error: 'Symbol required' }, 400, allowedOrigin);
      const range = url.searchParams.get('range') || '1y';
      const interval = url.searchParams.get('interval') || '1wk';
      try {
        const { crumb, cookie } = await getCrumb();
        const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&crumb=${encodeURIComponent(crumb)}`;
        const resp = await fetch(chartUrl, { headers: { 'Cookie': cookie, 'User-Agent': UA } });
        if (resp.status === 401 || resp.status === 403) {
          cachedCrumb = null;
          const retry = await getCrumb();
          const chartUrl2 = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&crumb=${encodeURIComponent(retry.crumb)}`;
          const resp2 = await fetch(chartUrl2, { headers: { 'Cookie': retry.cookie, 'User-Agent': UA } });
          return jsonResp(await resp2.json(), resp2.status, allowedOrigin);
        }
        return jsonResp(await resp.json(), resp.status, allowedOrigin);
      } catch (e) {
        console.error('Chart error:', symbol, e.message);
        return jsonResp({ error: 'Chart fetch failed' }, 500, allowedOrigin);
      }
    }

    // Data API proxy: GET /proxy/fmp/{endpoint} or GET /proxy/finnhub/{endpoint}
    if (path.startsWith('/proxy/')) {
      if (!(await authenticate(request, env))) return jsonResp({ error: 'Unauthorized' }, 401, allowedOrigin);
      if (request.method !== 'GET') return jsonResp({ error: 'GET only' }, 405, allowedOrigin);
      const rest = path.slice(7); // strip '/proxy/'
      const slash = rest.indexOf('/');
      if (slash < 1 || slash === rest.length - 1) return jsonResp({ error: 'Use /proxy/{provider}/{endpoint}' }, 400, allowedOrigin);
      const provider = rest.slice(0, slash);
      const endpoint = rest.slice(slash + 1);
      return handleProxy(provider, endpoint, url, env, allowedOrigin);
    }

    // D1 CRUD API: /api/*
    if (path.startsWith('/api/')) {
      if (!(await authenticate(request, env))) {
        return jsonResp({ error: 'Unauthorized' }, 401, allowedOrigin);
      }
      const apiPath = path.slice(5); // strip '/api/'
      return handleApi(apiPath, request.method, url, request, env, allowedOrigin);
    }

    return jsonResp({ error: 'Not found. Use /quote/{SYMBOL}, /batch?symbols=A,B,C, /chart/{SYMBOL}, /proxy/{provider}/*, or /api/*' }, 404, allowedOrigin);
  }
};

# Stratos Ventures — Deployment Guide

**Last Updated:** 2026-08-05

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Pages (Frontend)                   │
│       https://industriestitus.github.io/stratos-ventures/   │
│       Auto-deploys from web/ on every main push             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Cloudflare Worker (API Backend)                 │
│   https://yahoo-finance-proxy.stockvaluation.workers.dev    │
│   Yahoo/FMP/Finnhub proxy · D1 CRUD · auth · sync meta      │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┴────────────┐
     ┌────▼────┐          ┌────────▼────────┐
     │ D1 DB   │          │ KV Store        │
     │ (Data)  │          │ (auth + meta)   │
     └─────────┘          └─────────────────┘
```

---

## 1. Frontend — GitHub Pages

### Configuration

- **Repo:** `industriestitus/stratos-ventures` (public)
- **Source branch:** `main`
- **Artifact path:** `web/` directory
- **URL:** `https://industriestitus.github.io/stratos-ventures/`
- **Auto-deploy:** Every `git push origin main` triggers GitHub Actions

### Workflow File

`.github/workflows/deploy.yml` — uploads `web/` as a GitHub Pages artifact and deploys it. Deployment completes in ~1 minute.

### Deploy Frontend

```bash
git add web/
git commit -m "feat: update dashboard"
git push origin main
# Auto-deploys via GitHub Actions
```

### Verify

```bash
gh run list --workflow=deploy.yml     # view recent deployments
gh run view <RUN_ID>                  # view specific run
```

---

## 2. Cloudflare Worker

### Configuration

File: `web/cloudflare-worker/wrangler.toml`

| Setting | Value |
|---------|-------|
| **Name** | `yahoo-finance-proxy` |
| **Main** | `src/index.js` |
| **URL** | `https://yahoo-finance-proxy.stockvaluation.workers.dev` |
| **D1 Binding** | `DB` → `stratos-ventures-db` |
| **D1 Database ID** | `52a43c92-6fc1-4f00-ab14-7a98e6a88a66` |
| **KV Binding** | `SYNC_DATA` → namespace `78d0e84e13da47cbbe0d13ea57361c9e` |

### Deploy Worker

```bash
cd web/cloudflare-worker
npm run deploy          # equivalent to: wrangler deploy
```

### Verify

```bash
curl https://yahoo-finance-proxy.stockvaluation.workers.dev/health
# {"status":"ok","ts":"2026-07-01T..."}
```

### Worker Logs

```bash
wrangler tail                               # real-time logs
wrangler tail --format json | grep /api/    # filter by path
```

---

## 3. Environment Variables & Secrets

| Variable | Type | Required | Purpose |
|----------|------|----------|---------|
| `SYNC_SECRET` | Secret | ~~Yes~~ **RETIRED (B3c)** | Was the legacy sync-key auth. B3c makes `authenticate()` token-only and unsets this secret. No longer referenced by the Worker. |
| `FMP_KEY` | Secret | **Yes** | FMP API key for `/proxy/fmp/*` (server-side, never sent to client) |
| `FINNHUB_KEY` | Secret | **Yes** | Finnhub API key for `/proxy/finnhub/*` (server-side, never sent to client) |
| `ALLOWED_ORIGINS` | Env var | No | Extra CORS origins (comma-separated) — see `wrangler.toml` |
| `DB` | Binding | Yes | D1 database (configured in wrangler.toml) |
| `SYNC_DATA` | Binding | Yes | KV namespace (configured in wrangler.toml) |

`FMP_KEY` and `FINNHUB_KEY` are required **now**, not eventually: since Phase A2 the client routes
every FMP/Finnhub call through `/proxy/*` (`web/index.html:11512`). Without them the proxy returns
503 and all fundamentals data breaks. A freshly provisioned Worker must have both set.

### Setting Secrets

`SYNC_SECRET` is **not** in this list — it was retired in B3c and is no longer read by any code
path. Do not re-add it.

```bash
cd web/cloudflare-worker
wrangler secret put FMP_KEY           # FMP API key (for /proxy/fmp/*)
wrangler secret put FINNHUB_KEY       # Finnhub API key (for /proxy/finnhub/*)
wrangler secret put ALLOWED_ORIGINS   # optional
wrangler secret list                  # verify
```

For local `wrangler dev` testing, put the same keys in `web/cloudflare-worker/.dev.vars` (git-ignored) instead of using `wrangler secret put`.

### B3c — Retiring the sync key (`SYNC_SECRET`) — ✅ DONE 2026-07-24, kept as history

*This procedure has already been carried out; nothing here is outstanding. It is retained so the
current token-only auth model is traceable to how it was reached.*

Since B3c (`2ba0019`, v42) the Worker authenticates data requests ONLY by a
master-password device token (`X-Auth-Token`). `SYNC_SECRET` is no longer read by
any code path. Deploy order (do NOT unset the secret before every active device
has a token, and keep the recovery key — it's the lockout backstop):

```bash
cd web/cloudflare-worker
npx wrangler deploy                    # 1. ship the token-only worker
# 2. verify: reload the app on a token device, confirm it loads + a save succeeds
npx wrangler secret delete SYNC_SECRET # 3. remove the now-unused secret
```

Any device that held ONLY a sync key (no token) will 401 after step 1. New devices
sign in via `POST /auth/login` (public); a forgotten password resets via
`POST /auth/recover` (recovery key). Existing device tokens live in KV and are
independent of `SYNC_SECRET`, so they survive the deletion.

Never commit secrets to git. They are encrypted in Cloudflare's vault.

### Default CORS Origins (Hardcoded)

- `http://localhost:8765` / `http://127.0.0.1:8765` — local dev (legacy port)
- `http://localhost:8767` / `http://127.0.0.1:8767` — local dev (current port, `.claude/launch.json`)
- `https://industriestitus.github.io` — GitHub Pages (production)
- `https://stratos-ventures.pages.dev` — Cloudflare Pages (kept as a fallback origin; the app is
  not deployed there — production hosting is GitHub Pages)

Extra origins can be added at runtime via the `ALLOWED_ORIGINS` secret (comma-separated).

---

## 4. D1 Database

### Details

- **Name:** `stratos-ventures-db`
- **Region:** EEUR (Vienna)
- **Tables:** 24 (see `docs/d1-schema.sql`)
- **Free tier:** 5GB storage, 5M reads/month, 100K writes/month

### Schema Operations

```bash
# View tables
wrangler d1 execute stratos-ventures-db \
  --command="SELECT name FROM sqlite_master WHERE type='table';"

# View table structure
wrangler d1 execute stratos-ventures-db \
  --command="PRAGMA table_info(companies);"

# Apply full schema (first time)
wrangler d1 execute stratos-ventures-db --file=docs/d1-schema.sql

# Add a column (safe — no data loss)
wrangler d1 execute stratos-ventures-db \
  --command="ALTER TABLE companies ADD COLUMN new_field TEXT DEFAULT '';"
```

### ⚠️ Schema change ordering — MANDATORY

**Run the DDL on live D1 FIRST, then `wrangler deploy`, and only then push the frontend.**
A push to `main` auto-deploys the frontend in ~1 minute, so any other order leaves a client
talking to a backend that does not yet have the columns or tables it writes to.
The exact commands for each shipped schema change are recorded in
`docs/BUG-HISTORY.md` → **Deployment Notes**; add yours there and note the date it was run.

### Data Migration (localStorage to D1)

The Worker `/api/migrate` endpoint imports data from the old localStorage format, triggered from
the app's Settings panel ("Migrate to Cloud Database" button).

**Warning:** `/api/migrate` clears your data before re-importing. Always export first.
Precisely, it deletes the 9 tables in `USER_DATA_CLEAR_TABLES` (`index.js:776`) plus every
`app_settings` row except `schema_version`; child rows go with their parents via cascade.
`checklist_templates`, `backups` and `backup_chunks` survive — the same exclusion that protects
`/api/purge` protects migrate.

**On an encrypted account `/api/migrate` returns 403** (`index.js:1129`, since C3): once the E2EE
envelope exists (`auth_config.wrapEnc`), plaintext migrate/restore is disabled. The encrypted
path is `POST /api/purge` + a client-side re-upload — that is what "clear and restore" in the
app's backup UI uses. `backups` and `backup_chunks` are deliberately excluded from the worker's
`USER_DATA_CLEAR_TABLES`, so a purge can never destroy the cloud snapshots you would roll back to.

---

## 5. KV Namespace

- **Binding:** `SYNC_DATA`
- **Namespace ID:** `78d0e84e13da47cbbe0d13ea57361c9e`
- **Purpose:** auth state and sync metadata — the account's `auth_config` (password verifier,
  recovery key, E2EE envelope), the device tokens, and `user_meta` for `GET|POST /sync/meta`.
  plus the per-IP brute-force counters (`authfail_<ip>`).
  It is **not** a data store: all user data lives in D1. The legacy whole-blob routes
  (`/sync/load`, `/sync/save`, `/sync/restore-backup`) were removed in B3c.

```bash
# wrangler 3 syntax (pinned in package.json); wrangler 4 drops the colons: `wrangler kv key list`
wrangler kv:key list --namespace-id=78d0e84e13da47cbbe0d13ea57361c9e
wrangler kv:key get --namespace-id=78d0e84e13da47cbbe0d13ea57361c9e user_meta
```

**Device tokens live here and are independent of any secret** — deleting or rotating a Worker
secret does not sign anyone out.

---

## 6. PWA Cache

### Service Worker: `web/sw.js`

- **Cache name:** `stratos-v56` (current — bumped every deploy)
- **Max entries:** 200 (FIFO eviction)
- **Strategy:** Cache-first for local assets, network-only for external APIs

### Updating Cache Version — bump BOTH, always

When deploying new HTML/CSS/JS that users should get immediately:

1. Increment `CACHE_NAME` in `web/sw.js`: `stratos-v56` → `stratos-v57`
2. **Increment `APP_VERSION` in `web/index.html` to the same `vNN`, in the same commit**
3. Commit and push
4. On next page load, the browser detects the new version and re-caches; the sidebar build
   indicator shows `APP_VERSION`, so a reload can be confirmed at a glance

If the two ever diverge, the Service Worker keeps serving the old build and your changes appear
not to apply at all — a failure that looks like a code bug and costs a whole debugging session.
`bash docs/check.sh` fails when they diverge.

If users report stale content, they can force-refresh with Ctrl+Shift+Delete or unregister the Service Worker in DevTools > Application > Service Workers.

---

## 7. Local Development

### Frontend

```bash
cd /Users/peterkolozsi/Claude/Finance/web
python3 -m http.server 8767
# Open: http://localhost:8767/index.html
```

### Worker (Local)

```bash
cd web/cloudflare-worker
npm install       # first time only
npm run dev       # starts local Worker on http://localhost:8787
```

Note: localStorage is isolated per origin — data on localhost is separate from GitHub Pages.

---

## 8. Pre-Deployment Checklist

In order (see CLAUDE.md § Shipping a Batch):

- [ ] **Schema DDL run on live D1 first** — before the worker deploy, before the push
- [ ] **Worker deployed** (`npx wrangler deploy`) before the frontend push, for any batch that
      changes both — a push auto-deploys the frontend within a minute
- [ ] `APP_VERSION` (`web/index.html`) and `CACHE_NAME` (`web/sw.js`) bumped **together**
- [ ] Frontend change verified live in the browser, not only reviewed
- [ ] Worker code runs locally (`wrangler dev`)
- [ ] `bash docs/check.sh` exits 0
- [ ] Git commits logical (one batch per commit, conventional prefix)
- [ ] Branch is `main`

---

## 9. Rollback

### Frontend (GitHub Pages)

```bash
# Preferred: create a revert commit
git revert HEAD
git push origin main
# Re-deploys previous version via GitHub Actions

# Emergency: force-push to older commit (caution: rewrites history)
git reset --hard <COMMIT_HASH>
git push origin main --force
```

### Worker (Cloudflare)

```bash
wrangler deployments list     # view deployment history
wrangler rollback             # select and rollback to previous version
```

### Database (D1)

D1 has no built-in rollback. For schema changes, write an inverse migration:

```sql
-- If you added a column and need to revert
ALTER TABLE companies DROP COLUMN new_field;
```

Best practice: test migrations locally or on a dev database first. Always export data before destructive operations.

---

## 10. API Endpoints Reference

**Auth: everything requires an `X-Auth-Token` header** — a master-password device token
(`index.js:93`) — **except `/health`, `/` and the three public sign-in routes
`GET /auth/salt`, `POST /auth/login`, `POST /auth/recover`.** The rest of `/auth/*` is
token-authed like any other route. The legacy `X-Sync-Key` credential was retired in B3c and no
code path reads it; sending it authenticates nothing.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` (and `/`) | Health check (no auth) |
| GET | `/auth/salt` | Password salt for the KDF (**no token**, rate-limited) |
| POST | `/auth/login` · `/auth/recover` | Sign in / recover with the recovery key (**no token**) |
| POST | `/auth/change` · `/auth/revoke` | Password change, device revoke (token required) |
| GET | `/auth/devices` | List device tokens (token required) |
| GET/PUT | `/auth/dek` | E2EE envelope — fetch / one-time provision of the wrapped DEK |
| GET | `/quote/<SYMBOL>` | Yahoo Finance quote (proxied) |
| GET | `/batch?symbols=A,B,C` | Yahoo batch quotes (max 10) |
| GET | `/chart/<SYMBOL>?range=1y` | Yahoo historical chart |
| GET | `/proxy/fmp/*` · `/proxy/finnhub/*` | Server-side keyed proxy, GET only (keys never reach the client; 503 if the secret is unset) |
| GET/POST/PUT/DELETE | `/api/<table>[/<ID>]` | **Generic CRUD over every registered table** (`TABLES`, `index.js:468`) — this is the main data surface, not a companies-only API |
| POST | `/api/<table>/batch` | Generic batch upsert, max 1000 rows |
| GET | `/api/companies/<ID>/full` | Full company with all related rows (one round-trip) |
| DELETE | `/api/<table>?<natural keys>` | Natural-key delete — `company_data_overrides`, `valuations` only (`NATURAL_DELETE`, `index.js:502`) |
| POST | `/api/notes/search?q=...` | Full-text search (FTS5) |
| GET/POST | `/sync/meta` | Sync metadata in KV (the only surviving `/sync/*` route) |
| POST | `/api/migrate` | Legacy localStorage import — **403 on an encrypted account** |
| POST | `/api/purge` | Clear user data tables (the encrypted clear-and-restore path) |
| GET | `/api/cache-check/<ID>/<SOURCE>` | Check API cache freshness |
| PUT | `/api/cache-upsert` | Update API cache |

Cloud snapshots use the generic CRUD surface on the `backups` and `backup_chunks` tables
(`index.js:495-496`) — there is no dedicated snapshot route.

Removed and **no longer available** (all retired in B3c): `GET /sync/load`, `POST /sync/save`,
`POST /sync/restore-backup`, `POST /auth/setup`.

See `docs/API-REFERENCE.md` for complete documentation.

---

## Quick Reference

```bash
# Frontend deploy — LAST, after any schema DDL and worker deploy
git push origin main

# Worker deploy
cd web/cloudflare-worker && npm run deploy

# Local dev
cd web && python3 -m http.server 8767

# Worker logs
cd web/cloudflare-worker && wrangler tail

# D1 query
wrangler d1 execute stratos-ventures-db --command="SELECT * FROM companies LIMIT 5;"

# Set secret (FMP_KEY / FINNHUB_KEY / ALLOWED_ORIGINS — never SYNC_SECRET, retired in B3c)
cd web/cloudflare-worker && wrangler secret put FMP_KEY

# Pre-commit consistency gate
bash docs/check.sh

# GitHub Actions status
gh run list --workflow=deploy.yml
```

# Stratos Ventures — Deployment Guide

**Last Updated:** 2026-07-01

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
│   Yahoo Finance proxy · D1 CRUD · KV sync (legacy)         │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┴────────────┐
     ┌────▼────┐          ┌───────▼────┐
     │ D1 DB   │          │ KV Store   │
     │ (Data)  │          │ (Legacy)   │
     └─────────┘          └────────────┘
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
| `SYNC_SECRET` | Secret | Yes | Auth key for all API/sync endpoints (X-Sync-Key header) |
| `FMP_KEY` | Secret | No* | FMP API key for `/proxy/fmp/*` (server-side, never sent to client) |
| `FINNHUB_KEY` | Secret | No* | Finnhub API key for `/proxy/finnhub/*` (server-side, never sent to client) |
| `ALLOWED_ORIGINS` | Secret | No | Extra CORS origins (comma-separated) |
| `DB` | Binding | Yes | D1 database (configured in wrangler.toml) |
| `SYNC_DATA` | Binding | Yes | KV namespace (configured in wrangler.toml) |

*Required once the client uses the `/proxy/*` routes for live data (Phase A2). Without them the proxy returns 503.

### Setting Secrets

```bash
cd web/cloudflare-worker
wrangler secret put SYNC_SECRET       # prompted for value
wrangler secret put FMP_KEY           # FMP API key (for /proxy/fmp/*)
wrangler secret put FINNHUB_KEY       # Finnhub API key (for /proxy/finnhub/*)
wrangler secret put ALLOWED_ORIGINS   # optional
wrangler secret list                  # verify
```

For local `wrangler dev` testing, put the same keys in `web/cloudflare-worker/.dev.vars` (git-ignored) instead of using `wrangler secret put`.

Never commit secrets to git. They are encrypted in Cloudflare's vault.

### Default CORS Origins (Hardcoded)

- `http://localhost:8765` — local dev
- `http://127.0.0.1:8765` — local dev (IP)
- `https://industriestitus.github.io` — GitHub Pages
- `https://stratos-ventures.pages.dev` — Cloudflare Pages (backup)

---

## 4. D1 Database

### Details

- **Name:** `stratos-ventures-db`
- **Region:** EEUR (Vienna)
- **Tables:** 22 (see `docs/d1-schema.sql`)
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

### Data Migration (localStorage to D1)

The Worker `/api/migrate` endpoint imports data from the old localStorage format. This is triggered from the app's Settings panel ("Migrate to Cloud" button).

**Warning:** `/api/migrate` wipes all D1 tables before re-importing. Always export data first.

---

## 5. KV Namespace (Legacy)

- **Binding:** `SYNC_DATA`
- **Namespace ID:** `78d0e84e13da47cbbe0d13ea57361c9e`
- **Purpose:** Cloud sync for legacy app version (being replaced by D1)

```bash
wrangler kv:key list --namespace-id=78d0e84e13da47cbbe0d13ea57361c9e
wrangler kv:key get --namespace-id=78d0e84e13da47cbbe0d13ea57361c9e user_data
```

---

## 6. PWA Cache

### Service Worker: `web/sw.js`

- **Cache name:** `stratos-v5`
- **Max entries:** 200 (FIFO eviction)
- **Strategy:** Cache-first for local assets, network-only for external APIs

### Updating Cache Version

When deploying new HTML/CSS/JS that users should get immediately:

1. Increment cache name in `web/sw.js`: `stratos-v5` → `stratos-v6`
2. Commit and push
3. On next page load, browser detects new version and re-caches

If users report stale content, they can force-refresh with Ctrl+Shift+Delete or unregister the Service Worker in DevTools > Application > Service Workers.

---

## 7. Local Development

### Frontend

```bash
cd /Users/peterkolozsi/Claude/Finance/web
python3 -m http.server 8765
# Open: http://localhost:8765/index.html
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

- [ ] Frontend changes tested locally or on GitHub Pages
- [ ] Service Worker cache name incremented (if HTML/CSS/JS changed)
- [ ] No secrets in source: `grep -r "SYNC_SECRET\|api_key" web/ --exclude-dir=node_modules`
- [ ] Worker code runs locally (`wrangler dev`)
- [ ] D1 schema compatible (no breaking changes without migration)
- [ ] Git commits logical (one feature per commit)
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

All endpoints except `/health` require `X-Sync-Key` header.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check (no auth) |
| GET | `/quote/<SYMBOL>` | Yahoo Finance quote (proxied) |
| GET | `/batch?symbols=A,B,C` | Yahoo batch quotes (max 10) |
| GET | `/chart/<SYMBOL>?range=1y` | Yahoo historical chart |
| GET | `/api/companies` | List companies |
| GET | `/api/companies/<ID>/full` | Full company with related data |
| POST | `/api/companies/batch` | Batch upsert (max 1000) |
| DELETE | `/api/companies/<ID>` | Delete company (cascades) |
| POST | `/api/notes/search?q=...` | Full-text search (FTS5) |
| GET | `/sync/load` | Load KV sync data (legacy) |
| POST | `/sync/save` | Save KV sync data (legacy) |
| POST | `/api/migrate` | Full data migration |
| GET | `/api/cache-check/<ID>/<SOURCE>` | Check API cache freshness |
| PUT | `/api/cache-upsert` | Update API cache |

See `docs/API-REFERENCE.md` for complete documentation.

---

## Quick Reference

```bash
# Frontend deploy
git push origin main

# Worker deploy
cd web/cloudflare-worker && npm run deploy

# Local dev
cd web && python3 -m http.server 8765

# Worker logs
cd web/cloudflare-worker && wrangler tail

# D1 query
wrangler d1 execute stratos-ventures-db --command="SELECT * FROM companies LIMIT 5;"

# Set secret
cd web/cloudflare-worker && wrangler secret put SYNC_SECRET

# GitHub Actions status
gh run list --workflow=deploy.yml
```

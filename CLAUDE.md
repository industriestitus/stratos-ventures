# Stratos Ventures — Investment Management Platform

## Commands
```bash
# Web app — serve locally
cd web && python3 -m http.server 8765
# Then open: http://localhost:8765/index.html
```

## Tech Stack
- **Web app**: Vanilla HTML/JS/CSS, Chart.js, localStorage + D1 cloud sync
- **Backend**: Cloudflare Workers + D1 (SQLite), KV (legacy sync)
- **Data APIs**: FMP (fundamentals), Finnhub (real-time/insider), Yahoo Finance (EU stocks, via CF Worker proxy)
- **Hosting**: GitHub Pages (frontend), Cloudflare Workers (backend)

## Architecture
```
web/
  index.html          — Main app (11.6K lines, all-in-one SPA)
  sw.js               — Service Worker (PWA caching, stratos-v5)
  manifest.json       — PWA manifest
  cloudflare-worker/  — Yahoo Finance proxy + D1 CRUD + sync backend
docs/
  ARCHITECTURE.md     — System architecture, data flow, cache layers
  API-REFERENCE.md    — All API endpoints (Worker, FMP, Finnhub, Yahoo)
  GLOSSARY.md         — Financial formulas, metrics, scoring thresholds
  CODING-LESSONS.md   — 25 validated coding pitfalls from 171+ bug fixes
  KNOWN-ISSUES.md     — Unfixed issues, tech debt, dev gotchas
  DECISIONS.md        — 29 Architecture Decision Records (ADRs)
  DEPLOYMENT.md       — Deploy guide (GitHub Pages, Worker, D1, secrets)
  ROADMAP.md          — Project phases and progress
  d1-schema.sql       — D1 database schema (22 tables)
  BUG-HISTORY.md      — QA audit log (171+ fixes, 19 categories)
  EXPANSION-PLAN.md   — Phase 11-18 detailed specs
```

## Code Standards
- Dark theme UI: bg #0f1117, surface #1a1d27, text #e4e7f1, accent #6c5ce7
- CSS variables for theming
- Mobile-first responsive design
- No frameworks in web app (vanilla JS) — keep bundle minimal
- Hungarian variable names NOT allowed — all code in English
- User-facing text: Hungarian or English based on context

## Security Rules — NEVER
- Never hardcode API keys, passwords, or secrets in source files
- Never commit .env files or credentials
- The FMP API key in settings.local.json must NOT be copied into source code
- Sync secrets go in Cloudflare Worker environment variables, not source

## Git
- Commit messages in English, concise
- One feature per commit
- Branch per major feature: `feature/portfolio`, `feature/notes`, etc.

## Documentation Maintenance
Do a **docs pass at the end of every batch** (each shippable feature/fix, not just once per session) — a dedicated `docs:` commit right after the code commit, so the repo is never left in a code-without-docs state (see `memory/feedback_doc-maintenance.md` for full rules):
- **Every batch:** ROADMAP.md checkboxes, BUG-HISTORY.md (new Category + top summary-table row + running total)
- **Feature work:** KNOWN-ISSUES.md, CODING-LESSONS.md, GLOSSARY.md
- **Architecture changes:** ARCHITECTURE.md, API-REFERENCE.md, DECISIONS.md (new ADR + summary-table row), DEPLOYMENT.md
- **Schema changes:** d1-schema.sql, ARCHITECTURE.md § 5, and add the exact `ALTER … BEFORE wrangler deploy` commands to BUG-HISTORY Deployment Notes

## Project Status
See `docs/ROADMAP.md` for current phase, tasks, and progress.
See `.claude/projects/*/memory/` for detailed plans, API strategy, competitor analysis.

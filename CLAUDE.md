# Stratos Ventures — Investment Management Platform

## Commands
```bash
# Web app — serve locally
cd web && python3 -m http.server 8765
# Then open: http://localhost:8765/index.html
```

## Tech Stack
- **Web app**: Vanilla HTML/JS/CSS, Chart.js, localStorage + Cloudflare KV sync
- **Backend**: Cloudflare Workers + KV (migrating to D1)
- **Data APIs**: FMP (fundamentals), Finnhub (real-time), Yahoo Finance (EU stocks, via CF Worker proxy)

## Architecture
```
web/
  index.html          — Main app (calculator + tracker + charts + settings)
  cloudflare-worker/  — Yahoo Finance proxy + data sync backend
  server.py           — Local dev server
  serve.sh            — Local dev startup script
docs/
  ROADMAP.md          — Project phases and progress
  reference-desktop-schema.sql — Old desktop SQLite schema (for D1 design reference)
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

## Project Status
See `docs/ROADMAP.md` for current phase, tasks, and progress.
See `.claude/projects/*/memory/` for detailed plans, API strategy, competitor analysis.

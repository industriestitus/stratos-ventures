# Stratos Ventures — Investment Management Platform

## Commands
```bash
# Web app — serve locally
cd web && python3 -m http.server 8767
# Then open: http://localhost:8767/index.html
# Consistency gate — run before every docs commit
bash docs/check.sh
```

## Tech Stack
- **Web app**: Vanilla HTML/JS/CSS, Chart.js, localStorage + D1 cloud sync
- **Backend**: Cloudflare Workers + D1 (SQLite), KV (auth config, device tokens, sync meta)
- **Data APIs**: FMP (fundamentals), Finnhub (real-time/insider), Yahoo Finance (EU stocks, via CF Worker proxy)
- **Hosting**: GitHub Pages (frontend), Cloudflare Workers (backend)

## Architecture
```
web/
  index.html          — Main app (all-in-one SPA)
  sw.js               — Service Worker (PWA caching; cache name = APP_VERSION, see Shipping a Batch)
  manifest.json       — PWA manifest
  cloudflare-worker/  — Yahoo/FMP/Finnhub proxy + D1 CRUD + auth backend
docs/
  ARCHITECTURE.md     — System architecture, data flow, cache layers
  API-REFERENCE.md    — All API endpoints (Worker, FMP, Finnhub, Yahoo)
  GLOSSARY.md         — Financial formulas, metrics, scoring thresholds
  CODING-LESSONS.md   — Validated coding pitfalls distilled from the bug log
  KNOWN-ISSUES.md     — Unfixed issues, tech debt, dev gotchas
  DECISIONS.md        — 43 Architecture Decision Records (ADRs)
  DEPLOYMENT.md       — Deploy guide (GitHub Pages, Worker, D1, secrets)
  ROADMAP.md          — Project phases and progress
  TEST-PLAN.md        — Manual test checklist (there are no automated tests)
  d1-schema.sql       — D1 database schema (24 tables)
  BUG-HISTORY.md      — QA audit log, by category and commit
  EXPANSION-PLAN.md   — Phase 11-18 detailed specs (all complete)
  check.sh            — Docs & process consistency gate
```

**Only slow-moving counters live here** — the ADR count and the table count, which change on
architecture or schema batches, and `docs/check.sh` fails when either drifts. Anything that moves
every batch or every commit (bug totals, category count, line counts, cache version) is
deliberately absent: it belongs in the document that owns it, and a counter nobody can keep true
is worse than no counter. `check.sh` verifies those in place instead.

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
- **If a secret is ever committed, ROTATE it.** Deleting it in a later commit does not remove
  it from history, and this repo is public — the old value stays fetchable forever

## Git
- Commit messages in English, concise
- One batch per commit — one shippable change, never a grab bag
- **Trunk-based: commit straight to `main`.** No feature branches — solo dev, no CI gates,
  no reviewers; the version-bump rule below is the safety gate instead
- **Conventional prefix, always:** `feat:` `fix:` `refactor:` `chore:` `perf:` `revert:` `docs:`.
  A `docs:` commit must contain *only* doc changes — the docs-pass audit relies on it,
  and `docs/check.sh` enforces both the prefix list and the purity
- **Deploy commits end with the version:** `fix: … (vNN)`. This is how a commit is traced
  to a service-worker cache generation
- End commit messages with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`

## Shipping a Batch
A batch is one shippable change — usually one feature, sometimes a coherent fix set.

**Deploy ordering — backend before frontend, and schema before both.** A push to `main`
auto-deploys the frontend within a minute, so any batch that also changes the Worker must land
in this order or a stale client will hit a backend that does not yet match it:
1. **Run the schema DDL on live D1 FIRST** (BUG-HISTORY → Deployment Notes has the exact
   commands; record the date it was actually run)
2. **Then `cd web/cloudflare-worker && npx wrangler deploy`**
3. **Only then commit and push the frontend**

**Then, for the batch itself:**
4. **Code commit** — conventional prefix, `(vNN)` if it deploys. **Bump `APP_VERSION`
   (`web/index.html`) and `CACHE_NAME` (`web/sw.js`) TOGETHER in that same commit.** If they
   diverge, the service worker serves stale code and your edits appear not to apply. The
   version is visible in the sidebar so a reload can be confirmed — that visibility is the
   whole reason this rule never drifts, and it is the model for `docs/check.sh`
5. **QA agent** over the batch before reporting done (`memory/feedback_qa-agent-review.md`)
6. **Verify live in the browser** for anything on a data path or visible in the UI. Code
   review does not catch a 200 response carrying another company's data (Cat 99) or a
   stale-cache render — repeatedly, the only thing that caught those was opening the app
7. **`bash docs/check.sh`** — run it with the doc edits still uncommitted; must exit 0
8. **Docs commit** (see below), then push

## Documentation Maintenance
Do a **docs pass at the end of every batch** (each shippable feature/fix, not just once per session) — a dedicated `docs:` commit right after the code commit, so the repo is never left in a code-without-docs state (see `memory/feedback_doc-maintenance.md` for full rules):
- **Every batch:** ROADMAP.md checkboxes, BUG-HISTORY.md (new Category + top summary-table row + running total)
- **Feature work:** KNOWN-ISSUES.md, CODING-LESSONS.md, GLOSSARY.md
- **Architecture changes:** ARCHITECTURE.md, API-REFERENCE.md, DECISIONS.md (new ADR + summary-table row), DEPLOYMENT.md
- **Schema changes:** d1-schema.sql, ARCHITECTURE.md § 5, and add the exact `ALTER … BEFORE wrangler deploy` commands to BUG-HISTORY Deployment Notes

Run `bash docs/check.sh` before the docs commit — it verifies the hand-maintained facts that
drift (version bumps, doc counters, BUG-HISTORY table/body integrity, secrets, stray worktrees).

**No one-off audit dumps in `docs/`.** Audit and review output goes straight to its owner:
open items → ROADMAP.md · fixed → BUG-HISTORY.md · accepted/deferred → KNOWN-ISSUES.md.
The raw dump stays in the scratchpad. Six stray `.txt` dumps once orphaned ~16 open items,
including "there is not a single automated test", which then went untracked for a month.

## Session Status & Handoff
**There is exactly one status file: `memory/STATUS.md`.** Rewrite it *in place* at the end of
every session — never create a dated copy, never leave two files claiming to describe "now".
Anything historical belongs in the relevant plan memory under `## History`.

Required sections, in this order:
1. **Current state** — live version, tree vs `origin/main`, and **pending deploys, stated
   explicitly as "none" when there are none**
2. **Shipped this batch** — table: Cat / batch / version / commits
3. **Verified live** — what was actually exercised in the browser or against prod, as opposed
   to only reviewed. Keep the two apart; this is the section that earns trust
4. **Open threads** — numbered, each with a proposed next batch and why it is not blocking
5. **Operational facts** — deploy model, hard external constraints, anything a fresh session
   would otherwise rediscover the hard way

Rules: status lives **only** here — no version numbers, commit hashes or "PENDING" markers in
any other memory, because those are what go stale. `MEMORY.md` line 1 is always
`- [Current status](STATUS.md) — READ FIRST.` and never changes. A handoff is a claim about
reality: never write "verified" for something only read, and never carry a pending item forward
without re-checking that it is still pending.

## Project Status
See `memory/STATUS.md` for where things stand right now.
See `docs/ROADMAP.md` for phases, tasks, and the backlog.
See `.claude/projects/*/memory/` for detailed plans, API strategy, competitor analysis.

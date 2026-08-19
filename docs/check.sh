#!/usr/bin/env bash
# Stratos Ventures — docs & process consistency check.
#
# Run from anywhere:  bash docs/check.sh
# Run it as step 6 of a batch: after the code commit, while the docs edits are
# still in the working tree, BEFORE the `docs:` commit. Exit 1 = something is off.
#
# It verifies the facts that are maintained by hand and therefore drift: version
# bumps, doc counters, BUG-HISTORY table/body integrity, the docs pass itself,
# secrets, and stray working copies.
#
# Rationale: every rule with a feedback loop in this project has held (APP_VERSION
# is visible in the sidebar → 28/28 deploys correct); every rule without one has
# drifted. This script is that loop for the rest.
#
# A check must never fail OPEN: if a pattern stops matching, that is a FAIL, not a
# pass — an unmatched claim is indistinguishable from a wrong one.

# NOTE: deliberately no `pipefail`. Every pipeline here is `producer | grep -q`,
# and grep -q exits at the first match — which SIGPIPEs the producer and makes the
# pipeline status 141 under pipefail, so the match branch never runs. That bug made
# this script report "no key in git history" for a key that is demonstrably in it.
# Without pipefail a broken producer yields empty output, and every check below
# treats empty as FAIL, so the failure mode stays closed.
set -u
cd "$(dirname "$0")/.." || exit 2

FAIL=0
WARN=0
ok()   { printf '  \033[32mok\033[0m    %s\n' "$1"; }
bad()  { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; FAIL=$((FAIL+1)); }
warn() { printf '  \033[33mwarn\033[0m  %s\n' "$1"; WARN=$((WARN+1)); }
head_() { printf '\n\033[1m%s\033[0m\n' "$1"; }

BH=docs/BUG-HISTORY.md

# ---------------------------------------------------------------- 1. versions
head_ "1. Version bump (APP_VERSION must equal sw.js CACHE_NAME)"
APPV=$(grep -oE "APP_VERSION *= *['\"]v[0-9.]+" web/index.html | grep -oE 'v[0-9.]+$' | head -1)
SWV=$(grep -oE "CACHE_NAME *= *['\"]stratos-v[0-9.]+" web/sw.js | grep -oE 'v[0-9.]+$' | head -1)
if [ -z "$APPV" ] || [ -z "$SWV" ]; then
  bad "could not read APP_VERSION ('${APPV:-?}') or sw.js CACHE_NAME ('${SWV:-?}')"
elif [ "$APPV" != "$SWV" ]; then
  bad "APP_VERSION=$APPV but sw.js CACHE_NAME=stratos-$SWV — the SW will serve stale code"
else
  ok "both at $APPV"
fi

# ------------------------------------------------------- 2. measured reality
head_ "2. Measured reality (what the docs should be claiming)"
LINES=$(wc -l < web/index.html | tr -d ' ')
ADRS=$(grep -c '^## ADR-' docs/DECISIONS.md)
TABLES=$(grep -c '^CREATE TABLE' docs/d1-schema.sql)
TOTAL=$(grep -oE 'Total: *[0-9]+ fixed' "$BH" | grep -oE '[0-9]+' | head -1)
MAXCAT=$(grep -oE '^## Category [0-9]+' "$BH" | grep -oE '[0-9]+' | sort -n | tail -1)
LESSONS=$(grep -c '^### ' docs/CODING-LESSONS.md)
if [ -z "$TOTAL" ] || [ -z "$MAXCAT" ]; then
  bad "could not parse BUG-HISTORY: Total='${TOTAL:-?}' MaxCategory='${MAXCAT:-?}' — heading/phrasing changed?"
  MAXCAT=${MAXCAT:-0}
fi
printf '  index.html lines: %s | ADRs: %s | D1 tables: %s | categories: %s | fixes: %s | lessons: %s\n' \
       "$LINES" "$ADRS" "$TABLES" "$MAXCAT" "${TOTAL:-?}" "$LESSONS"

# The summary table is the only region that counts — the file holds other numbered
# tables. `X` rows (cross-category / INFO) are legitimate and must be included.
TBL=$(awk '/^## QA Audit Categories/{on=1} /^\*\*Total:/{on=0} on' "$BH" | grep -E "^\| *([0-9]+|X) *\|")

# ------------------------------------------------- 3. CLAUDE.md claim drift
head_ "3. CLAUDE.md claims vs reality"
claim() { # claim <label> <regex whose LAST number is the claim> <expected>
  local label="$1" re="$2" want="$3" got
  got=$(grep -oE "$re" CLAUDE.md | head -1 | grep -oE '[0-9]+' | tail -1)
  if [ -z "$got" ]; then
    bad "$label — no claim matched in CLAUDE.md (wording changed? the check is now blind)"
  elif [ "$got" != "$want" ]; then
    bad "$label — CLAUDE.md says $got, reality is $want"
  else ok "$label = $want"; fi
}
# CLAUDE.md carries ONLY slow-moving counters — ones that change on an architecture
# or schema batch, i.e. exactly when someone is already editing docs deeply.
claim "ADR count"        '[0-9]+ Architecture Decision Records'  "$ADRS"
claim "D1 table count"   'schema \([0-9]+ tables\)'              "$TABLES"

# Per-batch and per-commit counters (bug totals, category count, lesson count, line
# counts, cache version) must NOT be duplicated here: a claim that goes stale every
# batch fails this gate every batch, which trains people to ignore it. They belong in
# the document that owns them. This guard catches re-introduction.
#
# Scoped to the docs-tree code block only. Applied to the whole file it false-positives
# on ordinary prose — "3 categories of failure", or documenting the cache-name format
# by example — and a guard that fires on legitimate writing gets disabled.
# It pins phrasings, so a determined rewording slips past; it is a reminder at the point
# of temptation, not a proof. The real defence is that these numbers have no reason to
# be here at all.
TREE=$(awk '/^## Architecture/{on=1} on; on&&/^```$/&&seen++{exit}' CLAUDE.md)
VOLATILE=$(printf '%s\n' "$TREE" | grep -cE '[0-9.]+K lines|stratos-v[0-9]|[0-9]+ (fixes|categories|bug fixes|validated coding pitfalls|lessons)')
if [ -z "$TREE" ]; then
  bad "could not locate the docs tree in CLAUDE.md — the volatile-counter guard is blind"
elif [ "$VOLATILE" = "0" ]; then
  ok "CLAUDE.md's docs tree carries no per-batch-volatile counters"
else
  bad "CLAUDE.md's docs tree re-introduced $VOLATILE volatile counter(s) (line count / cache version / bug totals / category or lesson count) — keep them in their owning doc"
fi

PORTC=$(grep -oE 'http.server [0-9]+' CLAUDE.md | grep -oE '[0-9]+' | head -1)
PORTL=$(grep -oE '"port": *[0-9]+' .claude/launch.json | grep -oE '[0-9]+' | head -1)
[ -n "$PORTC" ] && [ "$PORTC" = "$PORTL" ] \
  && ok "dev server port = $PORTL" \
  || bad "dev port — CLAUDE.md says ${PORTC:-none}, .claude/launch.json says ${PORTL:-none}"

# --------------------------------------------- 4. BUG-HISTORY table integrity
head_ "4. BUG-HISTORY table/body integrity"
missing_row='' tableonly=0
if [ "$MAXCAT" -lt 1 ] 2>/dev/null; then
  bad "no categories parsed — skipping the row/body cross-check"
else
  # One direction only. The table is the index of record: a category summarised in a
  # single row, with no prose section, is a complete entry — not a defect. The reverse
  # IS a defect: a body section with no row is work that has vanished from the index,
  # which is exactly how four categories (12/13/34/61) went missing for months.
  for i in $(seq 1 "$MAXCAT"); do
    grep -qE "^## Category $i([^0-9]|\$)" "$BH" || { tableonly=$((tableonly+1)); continue; }
    printf '%s\n' "$TBL" | grep -qE "^\| *$i *\|" || missing_row="$missing_row $i"
  done
  [ -z "$missing_row" ] \
    && ok "every documented category has a summary-table row ($tableonly are table-only, which is fine; numbers only — content is not compared)" \
    || bad "documented in the body but MISSING from the summary table — invisible in the index:$missing_row"
fi
# Headings that predate the `## Category N` convention are invisible to every check
# above — flag them rather than let them be rediscovered.
LEGACY=$(grep -cE '^## Session [0-9]+' "$BH")
[ "$LEGACY" = "0" ] \
  || warn "$LEGACY '## Session N' section(s) sit outside the category numbering and are indexed by nothing"

DUPES=$(grep -oE '^## Category [0-9]+' "$BH" | grep -oE '[0-9]+$' | sort -n | uniq -d | tr '\n' ' ')
[ -z "$DUPES" ] && ok "no duplicate category numbers in the body" \
                || bad "duplicate '## Category N' numbers: $DUPES"

# Fixed column must sum to the stated total. Cells may read "5+3 QA" — sum every
# integer in the cell. An unparsable cell is a FAIL, not a warning: a silent 0
# would understate the total and send the fixer in the wrong direction.
SUM=$(printf '%s\n' "$TBL" | awk -F'|' '
  { cell=$6; gsub(/[^0-9]+/, " ", cell); n=split(cell, p, " ")
    if (n==0 || cell ~ /^ *$/) { bad++ } else { for (i=1;i<=n;i++) s+=p[i] } }
  END { print s+0"|"bad+0 }')
SUMV=${SUM%%|*}; NONNUM=${SUM##*|}
[ "$NONNUM" != "0" ] && bad "$NONNUM summary-table row(s) have an unreadable Fixed value"
[ "$SUMV" = "${TOTAL:-}" ] \
  && ok "Fixed column sums to the stated total ($TOTAL)" \
  || bad "Fixed column sums to $SUMV but the header claims ${TOTAL:-?}"

# Commit hashes: required in BOTH the table row and the section header.
PLACE=$(printf '%s\n' "$TBL" | grep -cE "\| *(—|-|\`\`|pending|TBD)? *\| *[0-9]{4}-" )
NOHASH=$(printf '%s\n' "$TBL" | grep -cE "\| *(—|-|\`\`|pending|TBD) *\|")
[ "$NOHASH" = "0" ] \
  && ok "no placeholder commit hashes in the table" \
  || bad "$NOHASH table row(s) carry a placeholder commit hash instead of a real one"

# ------------------------------------------------ 5. CODING-LESSONS self-consistency
head_ "5. CODING-LESSONS self-consistency"
# Deliberately NOT compared against BUG-HISTORY's total or category range any more.
# Making this file restate another file's per-batch numbers just relocates the
# maintenance burden the batch above set out to remove — it forced an edit here every
# single batch. What IS worth checking is that the file agrees with itself: its summary
# must match the lessons it actually contains.
CLSUM=$(grep -oE '[0-9]+ lessons' docs/CODING-LESSONS.md | grep -oE '[0-9]+' | head -1)
if [ -z "$CLSUM" ]; then
  bad "CODING-LESSONS states no lesson count in its summary — the check is blind"
elif [ "$CLSUM" != "$LESSONS" ]; then
  bad "CODING-LESSONS summary says $CLSUM lessons, the file contains $LESSONS"
else
  ok "CODING-LESSONS summary matches its $LESSONS lessons"
fi

# ---------------------------------------------------------- 6. docs-pass pair
head_ "6. Docs pass"
DIRTY=$(git status --porcelain 2>/dev/null)
# "Docs" means docs/ plus CLAUDE.md — the same definition the purity check uses.
DIRTY_DOCS=$(printf '%s\n' "$DIRTY" | grep -cE '(^| |\?\?)(docs/|CLAUDE\.md)')
LAST=$(git log -1 --pretty=%s)
if [ -n "$DIRTY" ]; then
  if [ "$DIRTY_DOCS" -gt 0 ]; then
    ok "docs pass in progress — docs/ has uncommitted changes (commit them as \`docs: …\`)"
  else
    bad "uncommitted changes but nothing in docs/ — the batch's docs pass has not been done"
  fi
elif printf '%s' "$LAST" | grep -qE '^docs(\([^)]*\))?:'; then
  # A docs: commit must contain ONLY doc changes — the whole audit trail relies on it.
  NONDOC=$(git show --name-only --pretty=format: HEAD | grep -v '^$' | grep -vE '^(docs/|CLAUDE\.md$|README)' | head -5)
  [ -z "$NONDOC" ] \
    && ok "HEAD is a docs: commit and touches docs only — batch closed" \
    || bad "HEAD is a docs: commit but also changes non-doc files: $(printf '%s' "$NONDOC" | tr '\n' ' ')"
elif printf '%s' "$LAST" | grep -qE '^(feat|fix|refactor|chore|perf|revert)(\([^)]*\))?:'; then
  git show --name-only --pretty=format: HEAD | grep -q '^docs/' \
    && warn "HEAD is a code commit that also touched docs/ — allowed, but the policy wants a separate docs: commit" \
    || bad "HEAD is a code commit with no docs/ changes and no docs: commit after it"
else
  bad "HEAD subject has no conventional prefix (feat/fix/refactor/chore/perf/revert/docs): $LAST"
fi

# --------------------------------------------------- 7. one-off audit dumps
head_ "7. No one-off audit dumps in docs/"
DUMPS=$(ls docs/*.txt docs/*.pdf 2>/dev/null | tr '\n' ' ')
[ -z "$DUMPS" ] \
  && ok "no stray .txt/.pdf dumps in docs/" \
  || warn "stray dump(s) in docs/ — migrate their open items to ROADMAP and delete: $DUMPS"

# ------------------------------------------------------- 8. stray work copies
head_ "8. Stray working copies"
EXTRA=$(git worktree list | tail -n +2 | grep -v '/\.claude/worktrees/[a-z-]*[0-9a-f]\{6\} ')
STALE=$(git worktree list | tail -n +2)
if [ -z "$STALE" ]; then
  ok "no extra git worktrees"
else
  warn "extra worktree(s) shadow the real tree — searches from the repo root match both:
$(printf '%s' "$STALE" | sed 's/^/          /')"
fi

# -------------------------------------------------------------- 9. secrets
head_ "9. Secrets"
if git check-ignore -q .claude/settings.local.json; then
  ok ".claude/settings.local.json is gitignored"
else
  bad ".claude/settings.local.json is NOT gitignored"
fi

# Whole tree, tracked AND untracked, no path filter — the historical leak was at
# the repo root, and an untracked pre-commit file is exactly when you want a hit.
KEYPAT="(api[_-]?key|apikey|FMP|FINNHUB|TOKEN|SECRET)[^\"']{0,24}['\"][A-Za-z0-9]{24,}['\"]|value=\"[A-Za-z0-9]{28,}\""
HITS=$(grep -rInE "$KEYPAT" \
        --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=worktrees . 2>/dev/null | head -5)
[ -z "$HITS" ] \
  && ok "no API-key-shaped literals in the working tree" \
  || bad "possible hardcoded key(s): $(printf '%s' "$HITS" | cut -c1-100 | tr '\n' ' ')"

# The 2026-05-27 exposure (FMP key hardcoded from the initial commit through
# cfc0da6) is CLOSED: the key was rotated and the old value now returns 401.
# A public repo's history cannot be un-published, so there is nothing left to test
# there — the earlier version of this check derived the key from
# settings.local.json, which meant that deleting the key silently turned the check
# into "skipped". A check that can lose its input degrades to silence, and silence
# reads as success. What still needs guarding is NEW commits, so that is what we scan.
# --all so a key committed on a side branch or in a worktree is not invisible; the same
# KEYPAT as the tree scan so the two cannot drift apart; and an explicit failure guard,
# because "git produced nothing" must not be indistinguishable from "nothing to find".
RECENT_RAW=$(git log -p -30 --all --unified=0 2>/dev/null)
if [ -z "$RECENT_RAW" ]; then
  bad "could not read recent commits — the new-secret scan did not run (do not read this as a pass)"
else
  RECENT=$(printf '%s\n' "$RECENT_RAW" | grep '^+' | grep -inE "$KEYPAT" | head -3)
  [ -z "$RECENT" ] \
    && ok "no key-shaped literal added in the last 30 commits (all branches)" \
    || bad "a key-shaped literal appears in a recent commit — if it is real, ROTATE it (deleting it later does NOT unpublish it):
          $(printf '%s' "$RECENT" | cut -c1-100 | tr '\n' ' ')"
fi

# ---------------------------------------------------------------- 10. status
head_ "10. Session status file"
SLUG=$(pwd | tr '/' '-')
MEMDIR="$HOME/.claude/projects/$SLUG/memory"
STATUS="$MEMDIR/STATUS.md"
if [ ! -d "$MEMDIR" ]; then
  warn "no memory dir for this checkout ($MEMDIR) — status check skipped"
elif [ ! -f "$STATUS" ]; then
  bad "STATUS.md is missing — the handoff has nowhere to live (CLAUDE.md § Session Status & Handoff)"
else
  MISSING=''
  for s in "## Current state" "## Shipped this batch" "## Verified live" "## Open threads" "## Operational facts"; do
    grep -qF "$s" "$STATUS" || MISSING="$MISSING '$s'"
  done
  [ -z "$MISSING" ] && ok "STATUS.md has all five required sections" \
                    || bad "STATUS.md is missing section(s):$MISSING"
  # The live version must appear in Current state, not merely somewhere in the file.
  awk '/^## Current state/{on=1;next} /^## /{on=0} on' "$STATUS" | grep -q "$APPV" \
    && ok "STATUS.md § Current state names the live version ($APPV)" \
    || bad "STATUS.md § Current state does not mention $APPV — it is stale"
  awk '/^## Current state/{on=1;next} /^## /{on=0} on' "$STATUS" | grep -qiE 'pending deploys?:? *(none|no )' \
    && ok "STATUS.md states the pending-deploy position explicitly" \
    || warn "STATUS.md § Current state should say 'Pending deploys: none' explicitly when there are none"
  # Status markers belong in STATUS.md only — everywhere else they go stale.
  STRAY=$(grep -lE 'PENDING PETER|⚠️ PENDING' "$MEMDIR"/*.md 2>/dev/null | grep -v 'STATUS.md' | xargs -n1 basename 2>/dev/null | tr '\n' ' ')
  [ -z "$STRAY" ] \
    && ok "no stale PENDING markers in other memories" \
    || warn "PENDING markers outside STATUS.md (they outlive the thing they warn about): $STRAY"
fi

# ------------------------------------------------------------------ summary
printf '\n'
if [ "$FAIL" -gt 0 ]; then
  printf '\033[31m%s check(s) failed\033[0m, %s warning(s). Fix before the docs: commit.\n' "$FAIL" "$WARN"
  exit 1
fi
printf '\033[32mAll checks passed\033[0m'
[ "$WARN" -gt 0 ] && printf ' (%s warning(s))' "$WARN"
printf '.\n'
exit 0

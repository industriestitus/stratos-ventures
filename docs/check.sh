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
# Rationale: every rule with a feedback loop in this project has held — APP_VERSION is
# visible in the sidebar, and every commit that has ever bumped it moved sw.js CACHE_NAME
# in the same commit, without exception. Every rule without a feedback loop has drifted.
# This script is that loop for the rest. (The ratio that used to be quoted here is not:
# it was written once and never re-measured, which is the drift this script exists to
# stop. `git log -S APP_VERSION` measures it on demand — do that instead of trusting a
# number in a comment.)
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
BHA=docs/BUG-HISTORY-ARCHIVE.md
# The log is split by date (Cat 84 / 2026-07-24). $BH holds the summary table — the index for
# BOTH files — so every check that asks "is this category indexed?" must read the bodies from both,
# or archiving a category would silently make it invisible to the very check meant to catch that.
BH_ALL="$BH $BHA"

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
MAXCAT=$(grep -hoE '^## Category [0-9]+' $BH_ALL 2>/dev/null | grep -oE '[0-9]+' | sort -n | tail -1)
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
# The archive holds most of the bodies. If it is emptied (not deleted — check 11 catches
# deletion), every archived category silently becomes "table-only", which is a legitimate
# state, so the gate stays green while 1400 lines of history are gone. Assert it has content.
if [ ! -s "$BHA" ]; then
  bad "$BHA is missing or empty — the archived bodies are gone and every archived category would read as legitimately table-only"
fi
missing_row='' tableonly=0
if [ "$MAXCAT" -lt 1 ] 2>/dev/null; then
  bad "no categories parsed — skipping the row/body cross-check"
else
  # One direction only. The table is the index of record: a category summarised in a
  # single row, with no prose section, is a complete entry — not a defect. The reverse
  # IS a defect: a body section with no row is work that has vanished from the index,
  # which is exactly how four categories (12/13/34/61) went missing for months.
  for i in $(seq 1 "$MAXCAT"); do
    # Both files: a body moved to the archive must still be held to having a row, or
    # archiving would silently exempt a category from the one check that indexes it.
    grep -qhE "^## Category $i([^0-9]|\$)" $BH_ALL 2>/dev/null || { tableonly=$((tableonly+1)); continue; }
    printf '%s\n' "$TBL" | grep -qE "^\| *$i *\|" || missing_row="$missing_row $i"
  done
  # Table-only is legitimate, but the COUNT only rises when a body disappears. Pin it:
  # a rise is a body that vanished, which is exactly what an unasserted "ok" would hide.
  TABLEONLY_EXPECTED=11
  [ -z "$missing_row" ] \
    && ok "every documented category has a summary-table row ($tableonly are table-only, which is fine; numbers only — content is not compared)" \
    || bad "documented in the body but MISSING from the summary table — invisible in the index:$missing_row"
  [ "$tableonly" -le "$TABLEONLY_EXPECTED" ] \
    && ok "table-only count $tableonly is at or below the pinned $TABLEONLY_EXPECTED" \
    || bad "table-only count rose to $tableonly (pinned $TABLEONLY_EXPECTED) — a body section disappeared. If deliberate, raise TABLEONLY_EXPECTED in this script"
fi
# Headings that predate the `## Category N` convention are invisible to every check
# above — flag them rather than let them be rediscovered.
# Match ANY numbered heading that is not '## Category N'. The first version of this check
# hardcoded '## Session N' and reported clean while three '## Audit N' sections — holding 10
# fixes absent from the running total, under numbers already used by real categories — sat in
# the file. A guard that enumerates the one bad spelling it has seen is not a guard.
LEGACY_H=$(grep -hE '^## [A-Za-z]+ [0-9]+' $BH_ALL 2>/dev/null | grep -vE '^## Category [0-9]+' | sed 's/ *—.*//' | tr '\n' ' ')
[ -z "$LEGACY_H" ] \
  && ok "no numbered headings outside the '## Category N' convention" \
  || bad "numbered heading(s) outside the category convention — indexed by nothing, and their fixes are absent from the total: $LEGACY_H"

DUPES=$(grep -hoE '^## Category [0-9]+' $BH_ALL 2>/dev/null | grep -oE '[0-9]+$' | sort -n | uniq -d | tr '\n' ' ')
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

# Commit hashes: required in the table row. Assert that the cell CONTAINS an identifier
# rather than blacklisting placeholder words. The old blacklist was fail-open twice over: it
# was case-sensitive (missing `PENDING`) AND it required a bare cell, so even a lowercase
# `pending` in backticks passed — and backticks are the format every real row uses. A row
# reading `PENDING` sailed straight through the check whose whole job was to catch it. Same
# fail-open class as the pipefail bug: a rule that has to guess both the wording and the
# punctuation someone will use is not a rule. Deliberately shape-tolerant, because the cells are
# not uniform: backticked and bare hashes, `a`+`b` pairs, an `a`…`b` range, and the pre-Cat-24
# session references (`S1-S7`). Demanding one canonical form here would have flagged 10 valid
# rows and buried the one real defect — a check nobody trusts gets bypassed.
NOHASH=$(printf '%s\n' "$TBL" | awk -F'|' '
  { c=$4; gsub(/^[ \t]+|[ \t]+$/, "", c)
    if (c !~ /[0-9a-f]{7,40}/ && c !~ /S[0-9]/) n++ }
  END { print n+0 }')
[ "$NOHASH" = "0" ] \
  && ok "every summary-table row names a commit (or a pre-Cat-24 session)" \
  || bad "$NOHASH table row(s) carry a placeholder instead of a commit hash"

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
# A missing memory dir used to `warn` and skip — the NINTH fail-open in this script, and the
# worst-placed one: the whole of check 10 is the only mechanical guard on the handoff, and it
# switched itself off exactly when it could not find what it guards. Verified by running the
# script with a fake $HOME: every status assertion vanished and the gate still exited 0. A
# missing STATUS.md and a missing directory to hold it are the same defect — the handoff does
# not exist — so they get the same verdict. On a fresh clone this fails loudly and correctly:
# that checkout genuinely has no handoff yet.
if [ ! -d "$MEMDIR" ]; then
  bad "no memory dir for this checkout ($MEMDIR) — STATUS.md cannot exist, so the handoff does not (CLAUDE.md § Session Status & Handoff). Create the dir and write STATUS.md; do not read this as 'skipped'"
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
  # -i is not optional here. This check was written against 'PENDING PETER' and was blind to the
  # five 'PENDING Peter' markers sitting in one file the whole time — the THIRD case-sensitivity
  # fail-open in this script (see check 4's hash guard, and the pipefail bug in check 9). A guard
  # that only recognises one capitalisation of the thing it forbids reports clean and is worse than
  # nothing, because it certifies the file it never read.
  STRAY=$(grep -liE 'pending peter|⚠️ *pending|pending: *peter' "$MEMDIR"/*.md 2>/dev/null | grep -v 'STATUS.md' | xargs -n1 basename 2>/dev/null | tr '\n' ' ')
  [ -z "$STRAY" ] \
    && ok "no stale PENDING markers in other memories" \
    || warn "PENDING markers outside STATUS.md (they outlive the thing they warn about): $STRAY"
fi

# ------------------------------------------- 11. CLAUDE.md docs tree vs reality
head_ "11. CLAUDE.md docs tree lists every file in docs/"
# A document nothing points at is a document nobody maintains: DEVELOPMENT-WORKFLOW.md sat
# outside this tree for six weeks and drifted the furthest of any doc in the repo — it still
# prescribed a `feature/phase-N-*` branching model that Cat 100 had deleted as never-used.
# Both directions matter: an unlisted file goes stale unnoticed, a listed-but-absent file
# sends the reader somewhere that does not exist.
# .txt/.pdf are check 7's business, not this one's — dumps get deleted, not listed.
TREE=$(awk '/^docs\/$/{on=1;next} /^```/{if(on)exit} on' CLAUDE.md \
       | grep -oE '^  [A-Za-z0-9._-]+' | tr -d ' ' | sort -u)
if [ -z "$TREE" ]; then
  bad "could not read the docs/ tree out of CLAUDE.md — the block moved or changed shape"
else
  UNLISTED=''
  for f in $(ls docs/ 2>/dev/null | grep -vE '\.(txt|pdf)$'); do
    printf '%s\n' "$TREE" | grep -qxF "$f" || UNLISTED="$UNLISTED $f"
  done
  GHOST=''
  for n in $TREE; do
    [ -e "docs/$n" ] || GHOST="$GHOST $n"
  done
  [ -z "$UNLISTED" ] \
    && ok "every file in docs/ appears in CLAUDE.md's tree" \
    || bad "in docs/ but missing from CLAUDE.md's tree (unlisted docs go stale):$UNLISTED"
  [ -z "$GHOST" ] \
    && ok "every file CLAUDE.md's tree names actually exists" \
    || bad "named in CLAUDE.md's tree but not on disk:$GHOST"
fi

# ------------------------------------------------ 12. archives hold no live work
head_ "12. Archives contain only finished work"
# An archive is a promise that nothing in it is still open. If live work gets swept in
# during a split it stops appearing in the backlog and is not "archived" but lost —
# the same failure as Cat 106's .txt dumps, arrived at from the opposite direction.
if [ ! -f docs/ROADMAP-ARCHIVE.md ]; then
  bad "docs/ROADMAP-ARCHIVE.md is missing — the ROADMAP split is half-applied"
else
  # Same regex as the live half — nested items are indented, and the first version of this
  # check allowed a leading space on one side only, so an indented live item swept into the
  # archive was invisible to the check written to catch exactly that.
  OPENBOX=$(grep -cE '^ *- \[ \]' docs/ROADMAP-ARCHIVE.md)
  [ "$OPENBOX" = "0" ] \
    && ok "ROADMAP-ARCHIVE.md has no open checkbox" \
    || bad "$OPENBOX open checkbox(es) in ROADMAP-ARCHIVE.md — live work was archived, move it back to ROADMAP.md"
fi
# The live ROADMAP must still be the place with open work, or the split went the wrong way.
LIVEBOX=$(grep -cE '^ *- \[ \]' docs/ROADMAP.md)
[ "$LIVEBOX" -gt 0 ] \
  && ok "ROADMAP.md still carries the open backlog ($LIVEBOX items)" \
  || bad "ROADMAP.md has no open checkbox left — the backlog was archived wholesale"

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

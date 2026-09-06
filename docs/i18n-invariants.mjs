// Stratos Ventures — i18n invariants, checked with a real parser.
//
// Called by docs/check.sh check 14. Prints one "STATUS<TAB>message" line per assertion
// (OK / FAIL / WARN) and exits 0. A non-zero exit means the checker itself broke, which
// check.sh treats as a FAILURE, never as "skipped" — the same fail-closed rule the rest
// of the gate follows.
//
// WHAT THIS CANNOT SEE, stated so a green line is not mistaken for full coverage:
//   * 10 or so i18n() calls build their key at runtime (i18n('x.'+k)). No static check can
//     reach those; the count is printed on every run so it cannot grow unnoticed.
//   * The applyI18n contract below is a TEXTUAL assertion. It proves the tooltip rescue is
//     still written in the function, NOT that it works. Only the browser shows that
//     (TEST-PLAN § Internationalisation).

import fs from 'fs';
import { fileURLToPath } from 'url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
// argv[2] exists so this checker can be run against DELIBERATELY BROKEN copies.
// check.sh never passes it; see the break-test notes in BUG-HISTORY Cat 119.
const FILE = process.argv[2] || (HERE + '../web/index.html');
const ACORN = new URL('../web/cloudflare-worker/node_modules/acorn/dist/acorn.mjs', import.meta.url);

// PINNED CEILINGS for the two blind spots this checker cannot see into. Printing a number on
// every run does NOT stop it growing — that only works if a human remembers three figures
// between runs, which is exactly the hand-maintained fact this gate exists to replace. So they
// are pinned, and growth is a FAILURE. Lower them when the number drops; that is the point.
const PIN_RUNTIME_KEYS = 10;   // i18n('x.'+k) and data-i18n="${k}" — unreachable by any static check
const PIN_UNPARSED_HANDLERS = 1; // on*= fragments that are not valid JS standing alone
const out = [];
const ok   = m => out.push('OK\t' + m);
const fail = m => out.push('FAIL\t' + m);
const warn = m => out.push('WARN\t' + m);
const pin = (label, n, ceiling, note) => {
  if (n > ceiling) fail(`${label}: ${n}, above the pinned ceiling of ${ceiling} — ${note}. Something new became invisible to this checker; look at what, then raise the pin deliberately if it is genuinely unavoidable.`);
  else if (n < ceiling) warn(`${label}: ${n}, below the pinned ceiling of ${ceiling} — lower PIN_* in docs/i18n-invariants.mjs so the ceiling keeps its grip`);
  else ok(`${label}: ${n}, at the pinned ceiling — ${note}`);
};
const flush = () => { console.log(out.join('\n')); process.exit(0); };

let acorn;
try { acorn = await import(ACORN.href); }
catch (e) { console.error('cannot load acorn: ' + e.message); process.exit(3); }

let html;
try { html = fs.readFileSync(FILE, 'utf8'); }
catch (e) { console.error('cannot read ' + FILE + ': ' + e.message); process.exit(3); }

// ---- parse every inline <script> ----
const blocks = [];
const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let m;
while ((m = re.exec(html))) {
  // `\bsrc\s*=` also matched `data-src=`, because `-` is a word boundary — so any block
  // carrying a data-src attribute became an invisibility cloak for every check below.
  if (/(^|\s)src\s*=/i.test(m[1])) continue;
  blocks.push({ attrs: m[1], code: m[2] });
}
if (!blocks.length) { console.error('no inline <script> blocks found — the file shape changed'); process.exit(3); }

const asts = [];
for (const b of blocks) {
  const sourceType = /type\s*=\s*["']?module/i.test(b.attrs) ? 'module' : 'script';
  try { asts.push(acorn.parse(b.code, { ecmaVersion: 'latest', sourceType, ranges: true, allowAwaitOutsideFunction: true })); }
  catch (e) { console.error('index.html does not parse: ' + e.message); process.exit(3); }
}
const walk = (n, fn) => {
  if (!n || typeof n.type !== 'string') return;
  fn(n);
  for (const k in n) {
    if (k === 'type' || k === 'start' || k === 'end' || k === 'range') continue;
    const v = n[k];
    if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walk(c, fn));
    else if (v && typeof v.type === 'string') walk(v, fn);
  }
};
const walkP = (n, fn, p = null, key = null) => {
  if (!n || typeof n.type !== 'string') return;
  fn(n, p, key);
  for (const k in n) {
    if (k === 'type' || k === 'start' || k === 'end' || k === 'range') continue;
    const v = n[k];
    if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walkP(c, fn, n, k));
    else if (v && typeof v.type === 'string') walkP(v, fn, n, k);
  }
};
const propName = p => p.key ? (p.key.type === 'Literal' ? String(p.key.value) : p.key.name) : null;

// ---- the dictionaries, read from the AST rather than scraped ----
const dicts = {}; const unreadable = [];
for (const ast of asts) walk(ast, n => {
  if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && n.id.name === 'I18N'
      && n.init && n.init.type === 'ObjectExpression') {
    for (const lang of n.init.properties) {
      // A dictionary this cannot read must FAIL, never be skipped. Skipping made the summary
      // lie: `var I18N={de:DE, en:{…}, hu:{…}}` printed "2 dictionaries … identical key sets"
      // while the app shipped a third language missing 1010 keys.
      if (lang.type === 'SpreadElement') { unreadable.push('a spread element inside I18N'); continue; }
      const ln = propName(lang);
      if (!ln) { unreadable.push('a dictionary with a computed name'); continue; }
      if (!lang.value || lang.value.type !== 'ObjectExpression') { unreadable.push(`'${ln}' (not an object literal)`); continue; }
      const spread = lang.value.properties.filter(q => q.type === 'SpreadElement').length;
      if (spread) unreadable.push(`'${ln}' (contains ${spread} spread element(s), whose keys cannot be read here)`);
      dicts[ln] = new Set(lang.value.properties.map(propName).filter(Boolean));
    }
  }
});
const langs = Object.keys(dicts);
if (langs.length < 2) { console.error('could not read the I18N dictionaries from the AST (found: ' + langs.join(',') + ')'); process.exit(3); }
if (!dicts.en) { console.error('no `en` dictionary — it is the fallback every other language depends on'); process.exit(3); }
// A floor only makes sense for `en`: it is the fallback every other language falls back TO, so
// an `en` too small to be real means the file shape changed. A SHORT other language is not a
// shape problem — it is drift, and the key-set comparison below names exactly which keys are
// missing. Exiting 3 there would blame the checker for a defect in the data.
if (dicts.en.size < 100) { console.error(`the 'en' dictionary has only ${dicts.en.size} keys — the file shape changed`); process.exit(3); }
if (unreadable.length) fail(`${unreadable.length} I18N entr(y/ies) could not be read and are therefore UNCHECKED: ${unreadable.join('; ')}`);
ok(`${langs.length} dictionaries read from the AST: ` + langs.map(l => `${l}=${dicts[l].size}`).join(', '));

// ---- 1. every language carries exactly the same keys ----
let drift = 0;
for (const a of langs) for (const b of langs) {
  if (a === b) continue;
  const missing = [...dicts[a]].filter(k => !dicts[b].has(k));
  if (missing.length) { drift += missing.length; fail(`${missing.length} key(s) in '${a}' but not '${b}': ${missing.slice(0, 6).join(', ')}${missing.length > 6 ? ' …' : ''}`); }
}
if (!drift) ok(`the ${langs.length} dictionaries carry identical key sets`);

// ---- collect used keys ----
const names0 = (p, o) => { if (!p) return;
  if (p.type === 'Identifier') o.push(p);
  else if (p.type === 'ObjectPattern') p.properties.forEach(q => names0(q.type === 'RestElement' ? q.argument : q.value, o));
  else if (p.type === 'ArrayPattern') p.elements.forEach(e => names0(e, o));
  else if (p.type === 'AssignmentPattern') names0(p.left, o);
  else if (p.type === 'RestElement') names0(p.argument, o); };
const literalKeys = new Set(); let computed = 0, handlerGlobalT = 0;
for (const ast of asts) walk(ast, n => {
  if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && n.callee.name === 'i18n') {
    const a = n.arguments[0];
    if (a && a.type === 'Literal' && typeof a.value === 'string') literalKeys.add(a.value);
    else computed++;
  }
});
// Inline on*= handlers are CODE, but they are HTML text until the browser runs them, so the
// scan above cannot see them. Cat 117 shipped two i18n() calls that lived only here, and the
// first break-test of this checker mutated one of them and produced no failure at all — the
// checker was blind to exactly the place the project has already been bitten. Parse them too.
let handlers = 0, handlerUnparsed = 0;
for (const h of html.matchAll(/\bon[a-z]+\s*=\s*(["'])([\s\S]*?)\1/gi)) {
  handlers++;
  const code = h[2]
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/\$\{[^}]*\}/g, 'PH');           // template placeholders -> a parseable identifier
  let hast;
  try { hast = acorn.parse(code, { ecmaVersion: 'latest', ranges: true }); }
  catch (e) {
    // Most of these are fragments concatenated inside a JS string literal, so \' and \" are
    // escapes belonging to the OUTER string. Undoing them takes the unparseable count from
    // 10 to 1 — worth doing, because a checker that shrugs at 10 of 500 handlers is barely
    // checking handlers at all.
    try { hast = acorn.parse(code.replace(/\\(['"])/g, '$1'), { ecmaVersion: 'latest', ranges: true }); }
    catch (e2) { handlerUnparsed++; continue; }
  }
  // A handler body runs in GLOBAL scope, so any bare `t` here is a reference to the global.
  const bound = new Set();
  walk(hast, n => { if (n.type === 'VariableDeclaration') n.declarations.forEach(d => { const o = []; names0(d.id, o); o.forEach(i => bound.add(i.name)); });
                    if (/Function|Arrow/.test(n.type)) n.params.forEach(p => { const o = []; names0(p, o); o.forEach(i => bound.add(i.name)); }); });
  walk(hast, n => {
    if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && n.callee.name === 'i18n') {
      const a = n.arguments[0];
      if (a && a.type === 'Literal' && typeof a.value === 'string') literalKeys.add(a.value); else computed++;
    }
  });
  // `t` must be caught as a VALUE too, not only as a callee: `[t]`, `${t}`, `alert(t)` and
  // `o={x:t}` are all references to the global and all throw. The <script> pass has always
  // counted identifiers; the handler pass counted calls only — weakest coverage exactly where
  // Cat 117 was bitten, which is the hole this scanner was added to close.
  if (!bound.has('t')) walkP(hast, (n, p, key) => {
    if (n.type !== 'Identifier' || n.name !== 't') return;
    if (p) {
      if (p.type === 'MemberExpression' && key === 'property' && !p.computed) return;
      if (p.type === 'Property' && key === 'key' && !p.computed && !p.shorthand) return;
      if (/MethodDefinition|PropertyDefinition/.test(p.type) && key === 'key' && !p.computed) return;
      if (/LabeledStatement|BreakStatement|ContinueStatement/.test(p.type)) return;
      if (p.type === 'UnaryExpression' && p.operator === 'typeof') return;   // a defensive guard, not a crash
    }
    handlerGlobalT++;
  });
}

// data-i18n* lives in ATTRIBUTES — in static markup and inside JS template literals alike,
// so this one is deliberately textual: an AST cannot see markup that is still a string.
// Three spellings, because markup is built inside JS strings as often as it is written
// literally: data-i18n="k", data-i18n='k', and data-i18n=\"k\" (escaped, inside a JS string).
// Recognising only the first was the check-4 antipattern verbatim — "enumerates the one
// spelling it has seen" — and both other forms went through completely undetected.
const attrKeys = new Set(); let attrComputed = 0;
for (const a of html.matchAll(/data-i18n(?:-placeholder|-title)?\s*=\s*\\?(["'])([^"'\\<>]+?)\\?\1/g)) {
  // `data-i18n="${k}"` is the attribute form of a runtime key. It is the same blind spot the
  // i18n('x.'+k) calls have, so it gets the same verdict — counted, not reported as missing.
  if (a[2].includes('${')) { attrComputed++; continue; }
  attrKeys.add(a[2]);
}
if (!literalKeys.size) { console.error('no literal i18n() call sites found — the call shape changed'); process.exit(3); }
if (!attrKeys.size)   { console.error('no data-i18n attributes found — the markup shape changed'); process.exit(3); }
if (!handlers)        { console.error('no inline on*= handlers found — the markup shape changed'); process.exit(3); }
// Reported as a measured coverage figure, not a warning. Nobody can act on "this fragment is
// not valid JS on its own", and a warning that fires on every single run is how a reader learns
// to skip the warnings that matter. The number is printed so growth is visible.
ok(`${handlers - handlerUnparsed} of ${handlers} inline on*= handlers parsed and scanned`);
pin('unparseable inline handlers', handlerUnparsed, PIN_UNPARSED_HANDLERS,
    handlerUnparsed === 1 ? 'it is a fragment built inside a JS string and is NOT covered by any check below'
                          : 'they are fragments built inside JS strings and are NOT covered by any check below');

// ---- 2. every used key exists in the fallback dictionary ----
const used = new Set([...literalKeys, ...attrKeys]);
const missing = [...used].filter(k => !dicts.en.has(k));
if (missing.length) fail(`${missing.length} key(s) used but absent from 'en', so they render as the raw key: ${missing.slice(0, 6).join(', ')}${missing.length > 6 ? ' …' : ''}`);
else ok(`all ${used.size} used keys exist (${literalKeys.size} from i18n() calls, ${attrKeys.size} from data-i18n attributes)`);

// The blind spot, printed every run so it cannot grow in silence.
if (attrComputed) computed += attrComputed;
pin('runtime-built keys', computed, PIN_RUNTIME_KEYS,
    'these build their key at runtime and no static check can reach them; verify them in the browser');

// ---- 3. Cat 117: nothing may resolve to a global `t` ----
// Scope-resolved, not grepped: a local `t` is fine and 104 of them exist on purpose.
const FN = /^(FunctionDeclaration|FunctionExpression|ArrowFunctionExpression)$/;
const BLOCK = /^(BlockStatement|ForStatement|ForInStatement|ForOfStatement|SwitchStatement|CatchClause|StaticBlock|ClassBody)$/;
let globalT = 0, localT = 0, tScopes = 0;
for (const ast of asts) {
  const mk = (node, parent, kind) => ({ node, parent, kind, decls: new Set(), children: [] });
  const G = mk(ast, null, 'global'); const scopeOf = new Map();
  const names = (p, o) => { if (!p) return;
    if (p.type === 'Identifier') o.push(p);
    else if (p.type === 'ObjectPattern') p.properties.forEach(q => names(q.type === 'RestElement' ? q.argument : q.value, o));
    else if (p.type === 'ArrayPattern') p.elements.forEach(e => names(e, o));
    else if (p.type === 'AssignmentPattern') names(p.left, o);
    else if (p.type === 'RestElement') names(p.argument, o); };
  const fnS = s => { while (s.kind === 'block') s = s.parent; return s; };
  (function build(n, sc) {
    let cur = sc;
    if (FN.test(n.type)) { cur = mk(n, sc, 'function'); sc.children.push(cur);
      const o = []; n.params.forEach(p => names(p, o)); o.forEach(i => cur.decls.add(i.name)); }
    else if (BLOCK.test(n.type)) { cur = mk(n, sc, 'block'); sc.children.push(cur);
      if (n.type === 'CatchClause' && n.param) { const o = []; names(n.param, o); o.forEach(i => cur.decls.add(i.name)); } }
    scopeOf.set(n, cur);
    if (n.type === 'VariableDeclaration') { const o = []; n.declarations.forEach(d => names(d.id, o));
      const tg = n.kind === 'var' ? fnS(cur) : cur; o.forEach(i => tg.decls.add(i.name)); }
    if (n.type === 'FunctionDeclaration' && n.id) fnS(sc).decls.add(n.id.name);
    if (n.type === 'ClassDeclaration' && n.id) sc.decls.add(n.id.name);
    for (const k in n) { if (['type','start','end','range'].includes(k)) continue; const v = n[k];
      if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && build(c, cur));
      else if (v && typeof v.type === 'string') build(v, cur); }
  })(ast, G);
  (function refs(n, p, key, sc) {
    let cur = scopeOf.get(n) || sc;
    if (n.type === 'Identifier' && n.name === 't') {
      let skip = false;
      if (p) {
        if (p.type === 'MemberExpression' && key === 'property' && !p.computed) skip = true;
        if (p.type === 'Property' && key === 'key' && !p.computed && !p.shorthand) skip = true;
        if (/MethodDefinition|PropertyDefinition/.test(p.type) && key === 'key' && !p.computed) skip = true;
        if (/LabeledStatement|BreakStatement|ContinueStatement/.test(p.type)) skip = true;
        if (p.type === 'UnaryExpression' && p.operator === 'typeof') skip = true;  // a defensive guard, not a ReferenceError
      }
      if (!skip) { let s = cur, f = null; while (s) { if (s.decls.has('t')) { f = s; break; } s = s.parent; }
        if (!f || f === G) globalT++; else localT++; }
    }
    for (const k in n) { if (['type','start','end','range'].includes(k)) continue; const v = n[k];
      if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && refs(c, n, k, cur));
      else if (v && typeof v.type === 'string') refs(v, n, k, cur); }
  })(ast, null, null, G);
  (function count(s){ if(s.decls.has('t') && s!==G) tScopes++; s.children.forEach(count); })(G);
}
if (globalT + handlerGlobalT > 0) fail(`${globalT + handlerGlobalT} identifier(s) resolve to a GLOBAL \`t\` (${handlerGlobalT} of them inside inline on*= handlers) — the i18n function is \`i18n()\` since Cat 117 and a bare \`t\` is now a ReferenceError`);
else ok(`no identifier resolves to a global \`t\` (${localT} references resolve to a local \`t\`, across ${tScopes} scopes that bind one — harmless by design, do not "clean them up"; ${handlers} inline handlers scanned too)`);

// ---- 4. Cat 118: the applyI18n contract, asserted on the SYNTAX TREE ----
// The first version of this matched a regex from `function applyI18n(){` to the first newline.
// applyI18n is the last thing on its line, so the window swallowed whatever followed — and a
// trailing `// TODO restore :scope > .cp-tiptext and documentElement.lang =` satisfied BOTH
// assertions while both defects were fully reintroduced. It also failed the moment anyone
// reformatted the function across lines, an entirely correct refactor. A comment cannot
// satisfy a syntax tree, and line breaks are invisible to one.
let fnFound = false, hasRescue = false, hasLang = false;
for (const ast of asts) walk(ast, n => {
  if (!(n.type === 'FunctionDeclaration' && n.id && n.id.name === 'applyI18n')) return;
  fnFound = true;
  walk(n.body, k => {
    if (k.type === 'CallExpression' && k.callee.type === 'MemberExpression'
        && !k.callee.computed && k.callee.property.name === 'querySelectorAll') {
      const a = k.arguments[0];
      if (a && a.type === 'Literal' && typeof a.value === 'string' && /:scope\s*>\s*\.cp-tiptext/.test(a.value)) hasRescue = true;
    }
    if (k.type === 'AssignmentExpression' && k.left.type === 'MemberExpression'
        && !k.left.computed && k.left.property.name === 'lang'
        && k.left.object.type === 'MemberExpression' && !k.left.object.computed
        && k.left.object.property.name === 'documentElement') hasLang = true;
  });
});
if (!fnFound) fail('applyI18n() is not a top-level function declaration any more — the two Cat 118 contracts below could not be checked at all');
else {
  if (!hasRescue) fail('applyI18n() no longer queries `:scope > .cp-tiptext` — textContent deletes element children, and this silently wiped all 12 widget tooltips before Cat 118');
  else ok('applyI18n() still queries `:scope > .cp-tiptext` (a real call with a real literal, not a comment — but presence is still not proof it WORKS; TEST-PLAN § Internationalisation has the manual case)');
  if (!hasLang) fail('applyI18n() no longer assigns document.documentElement.lang — <html lang> was hard-coded "hu" against an English default until Cat 118');
  else ok('applyI18n() still assigns document.documentElement.lang');
}

// ---- 4b. Cat 117's other half: nothing may SHADOW the global in a handler's `with` scope ----
// Inline on*= handlers evaluate under with(element)/with(document), so an element carrying
// id="i18n" or name="i18n" would shadow the function inside every handler. Recorded by hand in
// STATUS.md and never asserted until now.
const shadowingEls = [...html.matchAll(/\b(?:id|name)\s*=\s*\\?["']i18n\\?["']/g)].length;
if (shadowingEls) fail(`${shadowingEls} element(s) carry id/name "i18n" — inline on*= handlers run under with(element), so the global i18n() is shadowed inside every one of them`);
else ok('no element carries id/name "i18n", so nothing shadows the global inside inline handlers');

// ---- 5. unused keys: measured, never blocking ----
const orphans = [...dicts.en].filter(k => !used.has(k));
ok(`${orphans.length} of ${dicts.en.size} 'en' keys are defined but never used — dead weight, not an error, and deliberately NOT pinned: adding keys ahead of their use is normal`);

flush();

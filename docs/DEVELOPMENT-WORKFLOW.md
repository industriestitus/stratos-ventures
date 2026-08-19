# Fejlesztési Workflow — Hogyan dolgozunk együtt

> **Ez a dokumentum neked szól, Peter — nem Claude-nak.** Azt írja le, hogyan néz ki az
> együttműködés a te oldaladról. A *kötelező* folyamatszabályokat (commit-prefixek, verzió-bump,
> deploy-sorrend, QA, docs pass, handoff) a **`CLAUDE.md` birtokolja, és az az irányadó** —
> ha a kettő valaha ellentmond egymásnak, a CLAUDE.md nyer. Ez a fájl 2026-08-19-ig karbantartás
> nélkül állt, és három hamis állítást hordozott (branching modell, `desktop/` mappa,
> commit-gyakorlat); azóta a `docs/check.sh` 11. pontja figyeli, hogy legalább látható maradjon.

## Session Workflow (minden session elején és végén)

### Session kezdete
1. Claude automatikusan beolvassa a CLAUDE.md-t és a memóriát
2. Nyisd meg a ROADMAP.md-t és mondd meg, melyik feladattal foglalkozunk
3. Vagy írd le szabad szöveggel, mit szeretnél — Claude megkeresi a kontextust

### Session közepe
- **Egy feature per session** — ne próbáljunk mindent egyszerre
- Ha a session hosszú lesz, Claude automatikusan kompaktálja a kontextust
- Kérdezz bátran közben, változtasd meg az irányt ha kell

### Session vége
1. Claude commitolja a működő kódot
2. Frissíti a ROADMAP.md-t (kipipálja ami kész)
3. Ha tanult valamit fontosat, memóriába menti
4. Összefoglalja mit csináltunk és mi a következő lépés

---

## Task Tracking — Hol látod a teendőket

### ROADMAP.md (a fő hely)
- `docs/ROADMAP.md` — fázisokra bontott feladatlista checkboxokkal
- Minden session elején és végén frissül
- Te is szerkesztheted bármikor

### Claude memória (háttér-kontextus)
- `.claude/projects/*/memory/` — részletes tervek, döntések, API stratégia
- Ezt Claude olvassa automatikusan, neked nem kell vele foglalkozni
- De megnézheted ha kíváncsi vagy

### Session-on belüli taskok
- Claude a session során belső task trackert használ
- Ezek a session végén eltűnnek, de ami fontos, az ROADMAP-ba vagy memóriába kerül

---

## QA — Hogyan biztosítjuk a minőséget

### Fejlesztés közben
1. **Lokális tesztelés**: minden változtatás után Claude megnyitja a böngészőben és teszteli
2. **Console errors**: Claude figyeli a böngésző konzolt hibákra
3. **Mobile teszt**: responsive nézetet is ellenőrizzük
4. **Edge case-ek**: üres állapot, sok adat, hibás input

### Kód minőség
- Nincs framework a web appban — tiszta, olvasható vanilla JS
- CSS változók a színekhez — konzisztens design
- Angol változónevek, beszédes függvénynevek
- Kommentek csak ha a "miért" nem egyértelmű

### Biztonsági ellenőrzés
- Soha nem kerül API key a forráskódba
- Input sanitization minden user inputnál
- CSP headerek a Cloudflare-en

### Ha hiba van
1. Írd le mi a hiba és mikor jelentkezik
2. Claude megkeresi a kódban, kijavítja, és teszteli
3. Ha nehezen reprodukálható: screenshot vagy pontos lépések kellenek

---

## Git Workflow

**A részletes és irányadó szabályok: `CLAUDE.md` § Git és § Shipping a Batch.** Röviden:

### Branching — nincs
Minden commit egyenesen a `main`-re megy (trunk-based). Nincsenek feature branchek: egy fejlesztő,
nincs CI-kapu, nincs reviewer — a biztonsági háló helyette a verzió-bump és a `docs/check.sh`.

> Ez a szakasz korábban egy `feature/phase-N-*` modellt írt le. Az soha nem volt igaz: 239 commitból
> **nulla** használta, ezért a Cat 100 kivette a CLAUDE.md-ből is.

### Commit gyakorlat
- **Egy batch = egy commit** — egy szállítható változás, soha nem vegyes zsák
- **Mindig conventional prefix:** `feat:` `fix:` `refactor:` `chore:` `perf:` `revert:` `docs:`
- **Deploy-commit a végén hordozza a verziót:** `fix: … (vNN)`, és ilyenkor az `APP_VERSION`
  (`web/index.html`) és a `CACHE_NAME` (`web/sw.js`) **ugyanabban a commitban** mozdul együtt
- **A kódcommit után külön `docs:` commit** jön, ami *csak* dokumentumot érint
- Angol commit message, tömör

---

## Claude-specifikus tippek — Amire figyelni kell

### Kontextus ablak kezelése
- A Claude kontextus ablaka véges (~200K token). Hosszú sessionokban degradálódik a minőség.
- **Egy session = egy feature** — ne próbáljunk 5 dolgot egyszerre
- Ha elakadunk és Claude köröz: új session, friss kontextus
- A CLAUDE.md és memória minden sessionben automatikusan betöltődik

### Ami jól működik
- **Specifikus kérések**: "Adj hozzá egy osztalék yield oszlopot a tracker táblához" > "Javítsd a trackert"
- **Fájl + sor hivatkozás**: "A web/index.html 450. sor körül lévő fetchStockData függvényben..."
- **Kis lépések**: inkább 3 kicsi változtatás mint 1 hatalmas

### Ami nem működik
- Vágj fejet prompting: "Csináld meg az egész portfólió modult" — túl nagy, kontextus elfogy
- Implicit elvárások: ha van preferenciád (pl. design, UX), mondd ki
- Feltételezni, hogy Claude emlékszik a korábbi sessionből — a memória segít, de nem tökéletes

### Ha Claude hibázik
- **Mondd el konkrétan** mi a baj: "Ez a gomb nem működik mobilon" > "Nem jó"
- **Claude tanul belőle** — elmenti a feedbacket, következő sessionben már tudja
- Ha ugyanazt a hibát csinálja újra: új session-t indíts (kontextus lehet szennyezett)

---

## Fájl struktúra (ahova Claude ír)

```
/Claude/Finance/
├── CLAUDE.md                    ← Claude beolvassa session elején; a folyamatszabályok gazdája
├── docs/                        ← Teljes lista: CLAUDE.md § Architecture
│   ├── ROADMAP.md               ← Feladatlista, progress tracking
│   ├── DEVELOPMENT-WORKFLOW.md  ← Ez a dokumentum
│   └── check.sh                 ← Konzisztencia-kapu; minden docs commit előtt fut
├── web/                         ← IDE — minden fejlesztés
└── .claude/
    └── projects/*/memory/       ← Claude memóriája (auto)
        ├── STATUS.md            ← Hol tart a projekt MOST — az egyetlen státuszfájl
        ├── MEMORY.md            ← Memória index
        ├── user_*.md            ← Rólad (preferenciák)
        ├── project_*.md         ← Projekt döntések, tervek
        └── feedback_*.md        ← Feedback amit adtál
```

> A `desktop/` mappa korábban itt szerepelt „referencia" címkével — az Electron app azóta törölve
> lett, csak a sémája maradt meg `docs/reference-desktop-schema.sql`-ben.

# Stratos Ventures — Tesztelési Terv (QA Checklist)

**Verzió:** 1.0
**Létrehozva:** 2026-07-04
**Utolsó frissítés:** 2026-07-04

Átfogó manuális tesztelési terv az alkalmazás összes moduljához. Bármikor lefuttatható — checkbox-ok kipipálhatók session közben, majd visszaállíthatók a következő QA körre.

**Futtatás módja:** Nyisd meg az appot böngészőben (`http://localhost:8765/index.html` vagy GitHub Pages), majd haladj végig a listán. Mobilon is tesztelj (DevTools responsive mode vagy valódi eszköz).

---

## 0. Előfeltételek & Alapok

### 0.1 App betöltés
- [ ] App betölt hiba nélkül (nincs console error)
- [ ] Service Worker regisztrál (Application → Service Workers)
- [ ] PWA manifest betölt (Application → Manifest)
- [ ] Favicon megjelenik
- [ ] Dark theme az alapértelmezett
- [ ] Sidebar navigáció látható (desktop)
- [ ] Bottom nav látható (mobile ≤768px)

### 0.2 Navigáció
- [ ] Sidebar: minden menüpont kattintható és a helyes szekciót tölti be (Dashboard, Companies, Portfolio, Research, Framework, Reviews, Settings)
- [ ] URL hash frissül navigáláskor (#dashboard, #companies, stb.)
- [ ] Böngésző Back/Forward gomb működik a hash routing-gal
- [ ] Cmd+1 → Dashboard, Cmd+2 → Companies, ... Cmd+7 → Settings
- [ ] Global Search (Cmd+K): megnyílik, keres, eredményre kattintva odanavigál
- [ ] Global Search: minimum 2 karakter szükséges, üres keresés üzenetet mutat
- [ ] Szekció váltáskor fade-in animáció látható (~150ms)
- [ ] Scroll pozíció megőrződik szekciók között (el-vissza navigálás)

### 0.3 Téma
- [ ] Dark/Light/Auto toggle működik (sidebar header ikon)
- [ ] Light theme: háttér fehér, szöveg sötét, minden olvasható
- [ ] Auto theme: követi az OS beállítást (System Preferences → Appearance)
- [ ] Témaváltás után Chart.js grafikonok is frissülnek (tengelyek, rácsvonalak)
- [ ] Téma megmarad reload után (localStorage)

### 0.4 Nyelv
- [ ] Nyelv váltás EN ↔ HU (sidebar-ban vagy Settings-ben)
- [ ] Váltás után minden UI elem (gombok, címkék, placeholder-ek, toast-ok) a kiválasztott nyelven
- [ ] Reload után megmarad a nyelvi beállítás
- [ ] Pénzügyi szakkifejezések (DCF, FCF, P/E) angolul maradnak HU módban is

---

## 1. Dashboard

### 1.1 Portfolio Summary widget
- [ ] Összérték megjelenik a helyes devizában (base currency)
- [ ] Cost basis, P&L, P&L % helyes
- [ ] Ha nincs pozíció → empty state üzenet + "Add Position" CTA

### 1.2 Allocation Charts widget
- [ ] Pie chart: ticker szerinti megoszlás
- [ ] Pie chart: account szerinti megoszlás
- [ ] Pie chart: deviza szerinti megoszlás
- [ ] Pie chart: asset class szerinti megoszlás
- [ ] Pie chart: szektor szerinti megoszlás
- [ ] Hover: tooltip-ban ticker neve + érték + %
- [ ] Chart PNG export gomb (⤓) megjelenik hover-re

### 1.3 Terry Smith Metrics widget
- [ ] Weighted P/E, P/S, P/FCF, ROE, ROIC, margin-ok megjelennek
- [ ] Értékek a portfolio összetétel alapján súlyozottak
- [ ] Üres portfolio → widget nem mutat NaN-t

### 1.4 Benchmark Comparison widget
- [ ] S&P 500 összehasonlítás chart betölt
- [ ] TWR és XIRR értékek megjelennek
- [ ] Snapshot nélkül → üres state

### 1.5 Red Flag Alerts widget
- [ ] Ha van alert (margin drop, debt rise) → piros/sárga figyelmeztetés
- [ ] Ha nincs alert → "No alerts" üzenet
- [ ] Alert-re kattintva a céges profilra navigál

### 1.6 Dip Finder widget
- [ ] 52-hetes csúcshoz képest esés mutatása
- [ ] Csak saját cégek (tracked stocks) jelennek meg
- [ ] Rendezés: legnagyobb esés először

### 1.7 Financial Independence widget
- [ ] FI beállítások: target összeg, éves kiadás, megtakarítási ráta
- [ ] Progressz bar és becsült FI dátum
- [ ] Beállítások mentődnek

### 1.8 TODO widget
- [ ] "X open tasks across Y companies" összesítő
- [ ] Kattintásra átvezet a megfelelő céghez/szekcióhoz

### 1.9 Sell Trigger widget
- [ ] Aktív sell trigger-ek megjelennek
- [ ] Csak "Owned" cégek trigger-jei
- [ ] Link: kattintás → cég Buy/Sell Decision szekció

### 1.10 Price Alerts widget
- [ ] Aktív price alert-ek listája: cég, cél ár, jelenlegi ár
- [ ] Alert kiváltásakor toast notification

### 1.11 Earnings Calendar widget
- [ ] Közelgő earnings dátumok
- [ ] Rendezés: legközelebbi először
- [ ] Csak Owned/Buy Target cégek

### 1.12 Net Worth widget
- [ ] Pie chart: asset class megoszlás
- [ ] Összérték megjelenik
- [ ] YoY változás (ha van snapshot)

### 1.13 Widget kezelés
- [ ] Widget hide: hover-re megjelenik a hide gomb, kattintásra eltűnik a widget
- [ ] Manage Widgets panel: checkboxokkal ki/be kapcsolható minden widget
- [ ] Widget sorrend: fel/le nyíl gombok működnek
- [ ] Beállítás megmarad reload után

### 1.14 Review Reminders widget
- [ ] 90+ napos review-nélküli Owned/Buy Target cégek megjelennek
- [ ] Badge szám helyes

---

## 2. Companies

### 2.1 Stock Calculator (DCF, Reverse DCF, ARIA, Money Back)
- [ ] DCF Perpetuity: Revenue=10B, Growth=10%, Margin=20%, Multiple=15x → Fair Value megjelenik (nem NaN)
- [ ] DCF Exit: ugyanezzel az inputtal → Fair Value különbözik a perpetuity-tól
- [ ] Reverse DCF: Price input → implied growth rate megjelenik
- [ ] ARIA: EPS, multiples → fair value range
- [ ] Money Back: ár + FCF → évek száma
- [ ] FCFF toggle: FCF to Equity ↔ FCFF to Firm → különböző eredmények
- [ ] Scenario Builder: Bear/Base/Bull kitöltés → Weighted Fair Value
- [ ] 10cap: Net Income + D&A + CAPEX → MOS price
- [ ] EVA: NOPAT, Invested Capital, WACC → "Creating/Destroying Value" badge
- [ ] Valuation History: "Save Snapshot" → tábla bővül, reload után is megvan
- [ ] Chart PNG export működik minden grafikonon

### 2.2 Tracker (Companies lista)
- [ ] Cég hozzáadás: ticker beírás → Enter → betölt API-ról
- [ ] Cég megjelenik a tracker táblában (név, ár, pipeline, score)
- [ ] Pipeline filter bar: kattintásra szűr (Watchlist, Under Review, Buy Target, Owned)
- [ ] Tag filter bar: tag-re kattintva szűr
- [ ] "Archived" toggle: archiváltak megjelenítése/elrejtése
- [ ] Pin-to-top (csillag): pinned cégek mindig felül
- [ ] Screener gomb: megnyitja a screener panelt
- [ ] Compare gomb: megnyitja az összehasonlító panelt
- [ ] Ticker oszlop kattintható → company profile megnyílik

### 2.3 Screener
- [ ] Filter hozzáadás (pl. P/E min-max, Growth min-max)
- [ ] Szűrés működik: csak a feltételeknek megfelelő cégek maradnak
- [ ] Több filter egyszerre (AND logika)
- [ ] Filter törlése (X gomb)
- [ ] Preset mentés: nevet ad → legördülőből visszatölthető
- [ ] Beépített preset-ek (GARP, Quality, stb.) betölthetők
- [ ] Preset törlése

### 2.4 Company Comparison
- [ ] 2+ cég kijelölés → Compare megnyitás → side-by-side tábla
- [ ] ~30 metrika összehasonlítás
- [ ] Horizontális scroll ha sok cég van kijelölve
- [ ] Zöld/piros szín jelzi a jobb/rosszabb értéket

### 2.5 Company Profile — Summary tab
- [ ] Cég neve, ára, pipeline badge megjelenik
- [ ] External research linkek (Finviz, Yahoo, SEC, stb.) → új tab-ban nyílnak
- [ ] Tag-ek megjelennek, tag hozzáadás/törlés működik
- [ ] Összefoglaló: pozíciók, tranzakciók, notes, reviews, TODOs áttekintés
- [ ] Quick action gombok működnek

### 2.6 Company Profile — Financials tab
- [ ] Key Metrics grid betölt (P/E, P/S, ROE, ROIC, margin-ok)
- [ ] Tooltip: metrikára hover → definíció, képlet, benchmark
- [ ] Data override: dupla kattintás → szerkeszthető, "overridden" badge megjelenik
- [ ] Overridden érték megmarad reload után, original érték megtekinthető
- [ ] Auto-fill thresholds: zöld ✓ / piros ✗ / szürke —
- [ ] Yellow Flags panel: auto-detected figyelmeztetések (ha van)
- [ ] Cash Flow deep dive: 10 metrika + tooltip-ok
- [ ] Balance Sheet deep dive: 11 metrika + tooltip-ok
- [ ] Cache age indicator ("Data: X hr ago")
- [ ] Refresh gomb: újratölti az API adatokat

### 2.7 Company Profile — Charts tab
- [ ] Historical chart betölt (revenue, FCF, EPS, margins)
- [ ] Chart range választás (5Y, 10Y, 20Y, 30Y)
- [ ] Mini chart-ok: Revenue, Net Income, FCF, Gross Margin
- [ ] Chart PNG export (⤓) gomb működik

### 2.8 Company Profile — Checklist tab
- [ ] 14 szekció accordion megjelenik
- [ ] Company Details: ~30+ kérdés, mix of textarea/select/text
- [ ] Moat Analysis: moat típusok (12+), rating, fake moat check
- [ ] SWOT/SPLEEN szekció: 10 textarea
- [ ] Management, Industry, Risks szekciók kitölthetők
- [ ] Financial Analysis: auto-fill thresholds
- [ ] Valuation, Buy/Sell Decision, Research Sources szekciók
- [ ] Psychology Check: 9+ kérdés
- [ ] Quarterly Follow-up: quarter hozzáadás, 14 strukturált mező
- [ ] Learning Log: entry hozzáadás (date, category, description)
- [ ] Change Tracking: automatikus naplózás (timestamp, quarter)
- [ ] Progress bar: kitöltöttség % frissül valós időben
- [ ] Mentés automatikus (onChange/onBlur)

### 2.9 Company Profile — Valuation tab
- [ ] DCF, Reverse DCF, ARIA, Money Back: pre-filled az API adatokkal
- [ ] Scenario Builder: 3-oszlop, probability validation
- [ ] 10cap, EVA: auto-prefill
- [ ] Expected Return breakdown: stacked bar chart
- [ ] Position Sizing: score + Kelly Criterion
- [ ] Valuation History: snapshot lista

### 2.10 Company Profile — Insider tab
- [ ] Insider summary (top insiders, total buy/sell)
- [ ] Transaction history tábla (dátum, név, pozíció, shares, value)
- [ ] Pagination működik (sok tranzakciónál)
- [ ] Finnhub API key szükséges (Settings-ben beállítva)

### 2.11 Company Profile — Dividends tab
- [ ] Dividend history lista
- [ ] Yield, payout ratio, growth rate
- [ ] Dividend chart

### 2.12 Company Profile — Earnings tab
- [ ] Earnings grid: Q1-Q4, évenként
- [ ] "Done" checkbox per quarter
- [ ] "Call Listened" checkbox
- [ ] Notes per quarter
- [ ] Earnings calendar dates (FMP-ből)

### 2.13 Company Profile — Notes tab
- [ ] Thesis notes: Markdown szerkesztő
- [ ] Kép beillesztés (paste/upload)
- [ ] Mentés automatikus

### 2.14 Company Profile — TODOs tab
- [ ] TODO hozzáadás (szöveg + dátum)
- [ ] Kész jelölés (checkbox)
- [ ] Törlés
- [ ] Lista rendezés: open first, then completed

### 2.15 Company Profile — Other
- [ ] Company type tag (slow/medium/fast/cyclical/turnaround/asset)
- [ ] Pipeline change: dropdown → "Owned"/"Watchlist"/stb.
- [ ] Conviction badge megjelenik (ha van conviction history)
- [ ] Conviction chart: line chart 1-10 skálán
- [ ] Follow Sources: external URL-ek mentése
- [ ] Price Alerts: above/below ár beállítás

### 2.16 Archive & Delete
- [ ] Archive: cég → "Archived" pipeline stage, eltűnik a fő listából
- [ ] Archived toggle: megjelenik, "Archived" badge-dzsel
- [ ] Delete permanently: type-to-confirm dialog, kitörlődik véglegesen
- [ ] D1-ből is törlődik (ha D1 mode aktív)

---

## 3. Portfolio

### 3.1 Broker Accounts
- [ ] Account hozzáadás: név + deviza (HUF, USD, EUR, stb.)
- [ ] Account szerkesztés
- [ ] Account törlés: megerősítő dialog, cascade törlés (pozíciók is!)
- [ ] Legalább 1 account szükséges pozíció hozzáadáshoz

### 3.2 Positions
- [ ] Pozíció hozzáadás (Stock type): ticker, account, shares, avg cost, currency
- [ ] Pozíció hozzáadás (ETF type): ugyanazok a mezők
- [ ] Pozíció hozzáadás (Bond type): face value, coupon rate, maturity date, payment frequency, bond type extra mezők
- [ ] Pozíció hozzáadás (Real Estate): purchase price, current value, monthly rental, location, annual costs
- [ ] Pozíció hozzáadás (Cash): amount, currency — nincs ticker/shares
- [ ] Pozíció hozzáadás (Crypto, Other): alap mezők
- [ ] Pozíció szerkesztés: mezők pre-filled, mentés frissíti a listát
- [ ] Pozíció törlés: undo toast (6s), soft-delete
- [ ] P&L kalkuláció: 100 AAPL @ $150, ár $200 → P&L = +$5,000 (+33.3%)
- [ ] P&L kalkuláció: 50 MSFT @ $400, ár $350 → P&L = -$2,500 (-12.5%)
- [ ] Multi-currency: EUR pozíció USD base-ben → converted value helyes
- [ ] Position table sort: kattintás oszlopfejlécre → ascending/descending
- [ ] Pin-to-top: csillag → pinned pozíciók felül
- [ ] Üres state: "No positions yet" + CTA gomb
- [ ] Bulk select: checkboxok → floating action bar (delete + CSV export)
- [ ] Bulk delete: megerősítő dialog, undo support

### 3.3 Transactions
- [ ] Transaction hozzáadás (Buy): ticker, account, shares, price, total, date
- [ ] Transaction hozzáadás (Sell): ugyanaz, ellentétes irány
- [ ] Transaction hozzáadás (Dividend): amount, date
- [ ] Transaction szerkesztés
- [ ] Transaction törlés: undo toast
- [ ] Form validation: hiányzó mező → piros border + hibaüzenet
- [ ] Auto-calculate: shares × price = total (vagy total → price)
- [ ] Üres state + CTA

### 3.4 Portfolio ↔ Pipeline sync
- [ ] Buy transaction hozzáadás → cég pipeline automatikusan "Owned" lesz
- [ ] Összes pozíció eladás → cég pipeline "Watchlist" lesz
- [ ] CSV import → batch pipeline sync

### 3.5 Snapshots
- [ ] Manual snapshot: "Take Snapshot" gomb → dátum + total value rögzítve
- [ ] Snapshot lista megjelenik
- [ ] Snapshot törlése
- [ ] Legalább 2 snapshot kell a TWR/XIRR-hez

### 3.6 Returns
- [ ] TWR (Time-Weighted Return): megjelenik % + annualizált
- [ ] XIRR (Money-Weighted Return): megjelenik %
- [ ] Simple P&L: absolute + percentage
- [ ] Returns grid: összes metrika egy helyen
- [ ] 0 vagy 1 snapshot → "Not enough data" üzenet (nem NaN/error)

### 3.7 CSV Import
- [ ] CSV fájl kiválasztás → preview tábla
- [ ] Oszlop mapping (ticker, date, shares, price, stb.)
- [ ] Locale detection: EU formátum (1.234,56) vs US (1,234.56)
- [ ] Import gomb → tranzakciók hozzáadva
- [ ] Hibás sorok jelölve, nem importálva

### 3.8 Value Chart
- [ ] Portfolio value over time chart (snapshot-ok alapján)
- [ ] Minimum 2 pont kell

### 3.9 Allocation Charts
- [ ] By ticker, by account, by currency, by asset type, by sector
- [ ] Pie chart értékek összege = total portfolio value

---

## 4. Research & Notes

### 4.1 Notes CRUD
- [ ] Investment Journal note hozzáadás: dátum + ticker + szöveg
- [ ] Earnings Note hozzáadás: per-company, per-quarter, Markdown
- [ ] News Note hozzáadás: dátum + source + excerpt + comment
- [ ] Market Journal note hozzáadás: makró jegyzet (nem cég-specifikus)
- [ ] Note szerkesztés: Markdown editor, preview
- [ ] Note törlés: undo toast
- [ ] Bulk select + bulk delete

### 4.2 Markdown Editor
- [ ] **Bold**, *italic*, `code`, lista, heading működik
- [ ] Preview: renderelt HTML helyes
- [ ] Kép beillesztés: paste → base64 mentés
- [ ] Kép beillesztés: upload gomb → fájl kiválasztás

### 4.3 Search
- [ ] Keresés az összes note-ban (investment, earnings, news, market)
- [ ] Keresés: ticker név, szöveg tartalom
- [ ] Keresés eredmények kiemelve (highlight)

---

## 5. Framework

### 5.1 Principles & Rules
- [ ] Investment principles: hozzáadás (cím + leírás)
- [ ] Portfolio rules: hozzáadás
- [ ] Ideal company traits: checkbox lista (30+ elem)
- [ ] What I avoid / red flags: checkbox lista
- [ ] Szerkesztés, törlés működik
- [ ] Mentés automatikus

### 5.2 Position Scoring
- [ ] CAGR multiplier × Conviction × Risk → score megjelenik
- [ ] Score range: szín és méret ajánlás (1-2% → 8-12%)

---

## 6. Reviews

### 6.1 Review CRUD
- [ ] Weekly review: 9 kérdés megjelenik, kitölthető
- [ ] Monthly review: 11 kérdés
- [ ] Quarterly review: 13 kérdés + company selector
- [ ] Review mentés: dátum + válaszok rögzítve
- [ ] Review szerkesztés
- [ ] Review törlés: undo toast
- [ ] Bulk select + bulk delete

### 6.2 Review Feed
- [ ] "All" filter: minden review típus
- [ ] Type filter: weekly/monthly/quarterly szűrés
- [ ] Rendezés: legújabb először
- [ ] Company link: quarterly review-nél kattintás → company profile

### 6.3 Conviction Tracker
- [ ] Conviction history chart megjelenik (ha van adat)
- [ ] Quarterly review conviction szint → history-ba mentve

---

## 7. Settings

### 7.1 API Keys
- [ ] FMP API key beállítás + Test gomb → "Connected" / "Failed"
- [ ] Finnhub API key beállítás + Test gomb
- [ ] Worker URL beállítás + Test gomb
- [ ] Sync Secret beállítás

### 7.2 Data Management
- [ ] JSON backup export: letölti a teljes adatbázist
- [ ] JSON restore: fájl kiválasztás → overwrite (type-to-confirm)
- [ ] JSON import: fájl kiválasztás → merge (nem töröl meglévőt)
- [ ] CSV export: 5 fájl (positions, transactions, notes, reviews, framework)
- [ ] XLSX export: 5-sheet workbook letöltődik
- [ ] Markdown export: notes + framework letöltődik

### 7.3 D1 Cloud Sync
- [ ] Test Connection → "Connected" / "Failed"
- [ ] Migrate to Cloud: progress overlay, sikeres migráció
- [ ] D1 mode aktív → autoSave debounced (1500ms)
- [ ] Page close → flushAll (keepalive/sendBeacon)
- [ ] Reload → D1-ből tölti az adatot (nem localStorage)

### 7.4 PDF Export
- [ ] Per-company PDF: section chooser dialog, 10 szekció
- [ ] PDF generálás: Stratos Ventures branding, header/footer
- [ ] Portfolio Summary PDF: overview, accounts, positions, allocation

### 7.5 Trash (Soft Delete)
- [ ] Trash view: törölt elemek listája (positions, transactions, notes, reviews)
- [ ] Restore: visszaállítás működik
- [ ] Permanent delete: véglegesen eltávolít
- [ ] Empty all: megerősítő dialog
- [ ] 30 napos auto-purge

### 7.6 API Usage widget
- [ ] FMP: X/250 daily limit, progress bar
- [ ] Yahoo: 30/min limit
- [ ] Finnhub: 60/min limit

### 7.7 Other Settings
- [ ] Base currency beállítás
- [ ] Settings pill navigation: sticky nav, active state
- [ ] Keyboard shortcuts guide (? gomb info)
- [ ] Encryption settings (ha konfigurálva)

---

## 8. Cross-Module & Edge Cases

### 8.1 Üres állapotok
- [ ] Új app (nincs adat): minden szekcióban empty state + CTA
- [ ] Dashboard: empty widget-ek megfelelő üzenettel
- [ ] Portfolio: "No accounts" → "No positions" → "No transactions"
- [ ] Research: "No notes yet"
- [ ] Reviews: "No reviews yet"

### 8.2 Hiányzó API adat
- [ ] Cég hozzáadás FMP key nélkül → error toast (nem crash)
- [ ] Yahoo proxy nem elérhető → fallback / error üzenet
- [ ] Finnhub key nélkül → Insider tab üres state (nem error)
- [ ] Rate limit (250 FMP/nap) elérése → warning toast 80%-nál, block 100%-nál

### 8.3 Adat integritás
- [ ] Reload: összes adat megmarad (localStorage VAGY D1)
- [ ] Cég törlés: cascade → notes, checklist, valuations, todos is törlődnek
- [ ] Account törlés: cascade → pozíciók is törlődnek
- [ ] Import → Export → Import: adatvesztés nélkül (round-trip)
- [ ] JSON backup → új böngésző → restore: teljes adat visszaáll

### 8.4 Számítási ellenőrzés
- [ ] parseNum("1.234,56") → 1234.56 (EU formátum)
- [ ] parseNum("1,234.56") → 1234.56 (US formátum)
- [ ] parseNum("10B") → 10,000,000,000
- [ ] parseNum("2.5M") → 2,500,000
- [ ] parseNum("1.5K") → 1,500
- [ ] P&L: (currentPrice - avgCost) × shares → helyes előjel
- [ ] Currency conversion: 100 EUR → USD a mai árfolyamon
- [ ] Stock Score: 4 pillar (0-25 each) → composite 0-100

### 8.5 Keyboard Shortcuts
- [ ] Cmd+K → Global Search
- [ ] Cmd+1-7 → section navigation
- [ ] N → new item (context-aware: note, position, review)
- [ ] ? → shortcut guide
- [ ] Esc → modal/overlay bezárása

### 8.6 Toast & Confirmation
- [ ] Toast megjelenik és auto-eltűnik (6s)
- [ ] Toast hover → pause (nem tűnik el)
- [ ] Undo toast: "Undo" gomb → visszaállítás működik
- [ ] Danger confirm: type-to-confirm (pl. "TÖRLÉS" beírása)
- [ ] Bulk confirm: "X items will be deleted" message

---

## 9. Mobile Responsiveness

### 9.1 Layout (≤768px)
- [ ] Bottom nav megjelenik (5 menüpont + More)
- [ ] Sidebar elrejtve
- [ ] More menu: téma toggle + nyelv + extra menüpontok
- [ ] Tartalom teljes szélességben
- [ ] Nincs horizontal overflow (nem kell jobbra görgetni)
- [ ] Táblák: horizontal scroll engedélyezett (overflow-x:auto)

### 9.2 Touch
- [ ] Gombok elég nagyok (min 44×44px touch target)
- [ ] Modal-ok: háttér kattintás → bezárás
- [ ] Company profile: sub-tab-ok swipe/kattintás
- [ ] Checklist accordion: kattintásra kinyílik/becsukódik

### 9.3 Specifikus breakpoint-ok
- [ ] 375px (iPhone SE): minden olvasható, nem csúszik ki
- [ ] 768px (iPad): layout vált sidebar → bottom nav
- [ ] 1024px+: sidebar + tartalom egymás mellett

---

## 10. Teljesítmény & Biztonság

### 10.1 Betöltés
- [ ] Első betöltés: <3s (lassú hálózaton is)
- [ ] Reload (cached): <1s
- [ ] Service Worker cache működik (offline fallback)
- [ ] Lazy-loaded: jsPDF, SheetJS (csak használatkor tölt be)
- [ ] Lazy-loaded charts: Chart.js canvas csak ha látható

### 10.2 FMP Budget
- [ ] Napi hívásszámláló működik (Settings API Usage widget)
- [ ] 200/250 → warning toast
- [ ] 250/250 → block (nem hív tovább)
- [ ] Másnap reset

### 10.3 Cache
- [ ] D1 API cache: stock data 1h, historical 24h, insider 12h, dividends 24h
- [ ] Cache age megjelenik company profile-on ("Data: X hr ago")
- [ ] Force refresh: friss adatot tölt → cache age frissül
- [ ] In-memory cache (non-D1 mode): TTL-based

### 10.4 Biztonság
- [ ] escH() véd XSS ellen: próbálj `<script>alert(1)</script>` tickert hozzáadni → escaped
- [ ] File import size limit: >10MB → error toast
- [ ] Worker rate limit: 30 req/min Yahoo, 120 req/min D1
- [ ] API key nem jelenik meg a HTML source-ban
- [ ] Encryption (ha aktív): AES-256-GCM, PBKDF2

---

## Futtatási napló

| Dátum | Tesztelő | Sikeres | Hibás | Megjegyzés |
|-------|----------|---------|-------|------------|
| | | | | |

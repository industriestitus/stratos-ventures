# Stratos Ventures — Expansion Plan (v2 Features)

> Detailed expansion plan for deepening the investment analysis workflow.
> Created: 2026-06-30
> Status: Phase 11 COMPLETE (2026-06-30)
> Estimated effort: ~12-14 sessions across 8 phases
> Dependencies: All Phase 0-10 features COMPLETE

## Overview

The core app (Phases 0-10) is complete. This plan adds depth to the existing framework:
- **Checklist deepening** — the 12-section checklist covers the structure but many detailed questions from the user's methodology are missing
- **Financial analysis deepening** — yellow flags, detailed thresholds, cash flow / balance sheet deep dive
- **More valuation tools** — scenario builder, 10cap, EVA, FCFF, valuation history
- **Portfolio asset types** — real estate, government bonds, cash, net worth view
- **Follow-up & monitoring** — quarterly improvements, learning log, price alerts, sell trigger monitoring
- **Review & psychology** — more review questions, conviction tracker
- **Expected return calculator** — return breakdown, position sizing
- **External links & earnings calendar** — quick links, basic earnings tracking

All features are **ingyenes** (no paid services required). The only optional paid item was FMP Premium ($14/mo) for detailed analyst estimates — removed from scope; basic earnings calendar from free tier is sufficient.

---

## Phase 11: Checklist Deepening — Company Details & Moat ✅ COMPLETE (2026-06-30)

### 11.1 Company Details section expansion ✅
- **Difficulty:** MEDIUM (2-3 hours)
- **Cost:** Free
- **What:** Add ~30 missing questions to CL_SECTIONS[0] (company_details)
- **Implementation:** Expand `fields` array in CL_SECTIONS[0]. Group into sub-sections for readability.

**New fields to add (grouped):**

**Basic Info:**
- `founded` (text) — "When was the company founded?"
- `ipoDate` (text) — "When did it go public?"
- `headquarters` (text) — "Where is the company headquartered?"
- `maturityStage` (select: Early Growth / Growth / Mature / Declining) — "What stage of maturity?"
- `companyMission` (textarea) — "What is their mission?"

**Business Model Deep Dive:**
- `productType` (select: Painkiller / Nice-to-have / Mission Critical) — "Is the product must-have or nice-to-have?"
- `productCommodity` (select: Yes / No / Partially) — "Are the products a commodity?"
- `revenueRecurring` (select: Recurring / Transactional / Mixed) — "Is revenue recurring?"
- `fixVarCosts` (textarea) — "Fix vs variable cost structure?"
- `minReinvestment` (textarea) — "Can operations be maintained with minimal reinvestment?"
- `valueChain` (textarea) — "What does the value chain look like? What's different vs competitors?"
- `operatingLeverage` (textarea) — "Operating leverage — growing revenue but costs stay same?"

**Customer Economics:**
- `netRetentionRate` (text) — "Net Retention Rate (NRR)"
- `churnRate` (text) — "Churn rate"
- `customerConcentration` (textarea) — "Customer concentration risk? Top 5 customers % of revenue?"
- `wordOfMouth` (select: Yes / No / Unknown) — "Do customers come based on word of mouth?"
- `recessionProof` (select: Yes / Partially / No) — "Will customers keep spending in a recession?"
- `easyToSell` (select: Easy / Hard / Depends) — "Is the product easy or hard to sell?"
- `canDelayPurchase` (select: Yes / No) — "Can customers delay the purchase?"
- `sharedEconomics` (textarea) — "Shared economics model? (like Costco — Scale Economics Shared)"
- `customerDependency` (textarea) — "If the business disappeared, what impact on customers?"

**Growth & Optionality:**
- `growthDrivers` (textarea) — "What drove returns historically? Can those persist? Already priced in?"
- `bigOpportunity` (textarea) — "What big opportunity / growth engine / growth vertical?"
- `spawner` (select: Yes / No) — "Is it a Spawner? (one big business + many small ventures)"
- `newProducts` (textarea) — "Does it create new products? Pipeline strong? Have new products increased sales?"
- `optionality` (textarea) — "Is there optionality? R&D spillover products?"
- `secularTrends` (textarea) — "Secular growth trends benefiting the company?"
- `tailwindsHeadwinds` (textarea) — "Tailwinds and headwinds? Short-term or long-term?"
- `tenYearOutlook` (textarea) — "Will it be a great company in 10 years?"
- `shareOfMind` (select: Yes / No / Partially) — "Does the company have share of mind?"
- `firstMover` (select: Yes / No) — "Is it a first mover / industry disruptor?"

**Shareholder Structure:**
- `shareholderStructure` (textarea) — "Shareholder structure — institutional, insider, retail %"
- `historicalPerformance` (textarea) — "Historical stock performance notes"

**KPIs (Finchat):**
- `kpiTrend` (textarea) — "Finchat KPIs going in the right direction? Which ones?"

### 11.2 Moat Analysis section expansion ✅
- **Difficulty:** MEDIUM (2-3 hours)
- **Cost:** Free
- **What:** Expand moat types from 6 to 12+, add Fake Moat check, Legacy vs Reinvestment moat
- **Implementation:** Expand CL_SECTIONS[1] (moat) fields array

**New moat types to add (same pattern: evidence textarea + 1-5 rating):**
- `floatMoat` — "Float — customers pay upfront, company invests before delivering (insurance, subscriptions)"
- `flywheelMoat` — "Flywheel — self-reinforcing loop where growth drives more growth"
- `complexityMoat` — "Complexity — technically complex product/ecosystem creates barriers"
- `antiFragilityMoat` — "Anti-fragility — company benefits from volatility and shocks"
- `aggregationMoat` — "Aggregation — controls customer relationship, suppliers compete on platform"
- `counterPositioningMoat` — "Counter-positioning — competition must give up sales to adopt your model"
- `cultMoat` — "Cult following — evangelical customers, emotional brand connection"

**New structural fields:**
- `moatType` (select: Legacy Moat / Reinvestment Moat / Both) — "Legacy (wide moat, can't reinvest at high rates) vs Reinvestment (can reinvest at high rates)"
- `moatExpanding` (select: Expanding / Stable / Contracting) — "Is the moat expanding or contracting?"
- `moatAttacked` (textarea) — "Has the moat been attacked? How did it hold up?"
- `moatDisruptionRisk` (textarea) — "How can the moat be disrupted? Why hasn't it been?"
- `hundredBillionTest` (textarea) — "If you had $100B, could you disrupt the moat?"

**Fake Moat Check (checkboxes, all should be UNCHECKED for real moat):**
- `fakeMoatProduct` — "Great product alone (no patent/complexity protection)"
- `fakeMoatMarketShare` — "Strong market share alone (without understanding HOW/WHY)"
- `fakeMoatExecution` — "Great execution alone (can be copied)"
- `fakeMoatManagement` — "Great management alone (management changes)"
- `fakeMoatBrand` — "Brand alone (without pricing power or loyalty data)"

**Production vs Consumer advantage analysis:**
- `productionAdvantage` (textarea) — "Production advantage: process complexity, patents, resource uniqueness, rate of cost change, indivisibility, distribution, purchasing, R&D, advertising scale"
- `consumerAdvantage` (textarea) — "Consumer advantage: habit, experience goods, switching costs, network effects"

### 11.3 SWOT + SPLEEN Analysis (new section 12) ✅
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** New CL_SECTIONS entry with 10 textarea fields
- **Implementation:** Add to CL_SECTIONS array as section 13

**Fields:**
- `strengths` (textarea) — "Strengths"
- `weaknesses` (textarea) — "Weaknesses"
- `opportunities` (textarea) — "Opportunities"
- `threats` (textarea) — "Threats"
- `social` (textarea) — "Social factors"
- `political` (textarea) — "Political factors"
- `legal` (textarea) — "Legal factors"
- `economic` (textarea) — "Economic factors"
- `environmental` (textarea) — "Environmental factors"
- `niche` (textarea) — "Niche/industry-specific factors"

### 11.4 "Investment Case" fields in Buy/Sell Decision ✅
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Expand CL_SECTIONS[7] (buy_sell) with structured investment case
- **Implementation:** Add fields to existing buy_sell section

**New fields:**
- `howMakesMoney` (textarea) — "How does it make money? (if can't figure out → TOO HARD)"
- `whyOwn3Reasons` (textarea) — "Why own it? 3 most compelling reasons (irrespective of price)"
- `whenToOwn` (textarea) — "When to own? Target price level + set price alert"
- `downsideRisk` (textarea) — "What is the downside risk? Metrics to track to verify strength"
- `upsidePotential` (textarea) — "Upside potential — order of magnitude: 2x? 3x? (min 100% / 5yr = 15% CAGR)"
- `whyOpportunityExists` (textarea) — "Why does this opportunity exist? Why is market offering it?"
- `betterThanOwned` (textarea) — "Is it better than what I already own?"
- `shortSellerView` (textarea) — "What would a short seller say?"
- `valueTrapRisk` (textarea) — "What would make this a value trap?"

### 11.5 Management section expansion ✅
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Add ~10 fields to CL_SECTIONS[2] (management)
- **Implementation:** Expand fields array

**New fields:**
- `founderLed` (select: Yes / No) — "Is the company founder-led?"
- `familyOwned` (select: Yes / No / Partially) — "Family owned?"
- `glassdoorLink` (text) — "Glassdoor link/rating"
- `sbcBasis` (textarea) — "SBC: based on what? Amount reasonable?"
- `guidanceTrackRecord` (select: Conservative / Accurate / Aggressive) — "Conservative guidance that they beat?"
- `insiderBuying` (textarea) — "Are insiders buying stock? Recent transactions?"
- `maTrackRecord` (textarea) — "M&A track record — useful or wasteful acquisitions?"
- `underPromise` (select: Yes / No / Mixed) — "Under promise and over deliver?"
- `shareholderFriendly` (textarea) — "Shareholder friendly? Capital return policy?"
- `hidesIssues` (textarea) — "Does management hide bad news? Candid with shareholders?"
- `longTermOriented` (select: Yes / No / Unclear) — "Long-term orientation?"

### 11.6 Industry section expansion ✅
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Add ~10 fields to CL_SECTIONS[3] (industry)
- **Implementation:** Expand fields array

**New fields:**
- `hhiIndex` (number) — "HHI Index (> 1800 = less rivalry)"
- `supplierPower` (rating 1-5) — "Supplier power rating"
- `buyerPower` (rating 1-5) — "Buyer power rating"
- `buyerInformed` (select: Yes / No / Partially) — "How informed are the buyers?"
- `minEfficientScale` (textarea) — "Minimum efficient production scale?"
- `verticalHorizontal` (select: Vertical / Horizontal / Mixed) — "Vertical or horizontal industry?"
- `industryEndState` (textarea) — "What is the end state of the market/industry?"
- `valueCreation` (textarea) — "Where is the value/profit created in the industry?"
- `industryPowerHolder` (textarea) — "Who has the most power/leverage?"
- `priceIncreaseHistory` (textarea) — "Examples of companies raising prices without losing business?"
- `entryExitRates` (textarea) — "Rates of entry and exit to industry?"
- `disruptionVulnerable` (select: Yes / No / Partially) — "Is industry vulnerable to disruption?"
- `innovationEffect` (textarea) — "Does innovation improve product or just get passed to customer?"
- `competitorProfitability` (textarea) — "Profitability of each key competitor?"

### 11.7 "Edge Analysis" in Buy/Sell Decision ✅
- **Difficulty:** EASY (30 min)
- **Cost:** Free
- **What:** Add 4 fields to buy_sell section
- **Implementation:** Append to CL_SECTIONS[7].fields

**New fields:**
- `marketMispricing` (textarea) — "Mi az, amit a piac rosszul áraz?"
- `consensusError` (textarea) — "Miben téved a konszenzus?"
- `kpiMisread` (textarea) — "Mi az a KPI, ami félre van értelmezve?"
- `timeHorizonMismatch` (textarea) — "Időhorizont mismatch? (short-term vs long-term)"

### 11.8 "Anti-Investment Thesis" — Sell Events tracking ✅ (simplified: static fields instead of dynamic list)
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Add dynamic sell events to buy_sell section (similar to dynamic_risks)
- **Implementation:** New dynamic list type `dynamic_sell_events`

**Each sell event entry:**
- `description` (textarea) — the event
- `status` (select: ACTIVE / TRIGGERED / RESOLVED) — current status
- `dateAdded` (date)
- `dateTriggered` (date, optional)
- `notes` (textarea)

Render similar to Risks section with status badges. Dashboard widget aggregates all ACTIVE sell events across owned companies.

### 11.9 10K Analysis guide in Research Sources ✅
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Expand research_sources section with 10K sub-checklist
- **Implementation:** Add checkbox group to CL_SECTIONS[8]

**New checkboxes:**
- `auditorOpinion` — "Auditor opinion checked? (Unqualified = Good)"
- `item1b` — "Item 1B — SEC unanswered questions reviewed?"
- `item8` — "Item 8 — Financial statements reviewed?"
- `item9` — "Item 9 — Disagreements with accountants?"
- `def14a` — "DEF 14A — CEO compensation, insider ownership?"
- `proxyStatement` — "Proxy statement reviewed?"
- `formS3` — "Form S-3 — New stock issuance to employees?"
- `form4` — "Form 4 — Changes in stock ownership?"
- `asc718` — "ASC-718 — Stock compensation details?"
- `annualLetterToShareholders` — "Annual letter to shareholders read?"

---

## Phase 12: Financial Analysis Deepening (~2 sessions)

### 12.1 Yellow Flags system
- **Difficulty:** MEDIUM (3 hours)
- **Cost:** Free
- **What:** Auto-detected warning flags from API data
- **Implementation:** New `YELLOW_FLAGS` array similar to `CL_THRESHOLDS`, rendered in Financial Analysis section

**Balance Sheet Yellow Flags (auto-calculated from FMP API):**
- Goodwill > 50% of total assets
- Receivables rising faster than revenue (YoY comparison)
- Inventory rising faster than profits
- Debt becoming excessive (D/E suddenly > 2× previous year)
- Cash < 25% of total debt
- Retained earnings negative
- Intangibles > 50% of balance sheet
- Preferred stock present (flag for awareness)

**Income Statement Yellow Flags:**
- Revenue sudden slowdown (growth dropped > 50% vs prior year)
- Gross margin declining (2+ consecutive years)
- Frequent large extraordinary charges
- Tax rate sudden decline (may indicate one-time benefit)
- Net profit < cash from operations (earnings quality concern)
- SG&A expense rising faster than revenue
- R&D expense > 30% of revenue

**Implementation details:**
- Each flag: `{key, label, check: (stockData) => boolean, severity: 'yellow'|'red'}` function
- Auto-run when company data loads
- Display as warning panel with yellow/red badges
- `check()` function receives the stock data object and returns true if flag is triggered
- FMP balance sheet data already fetched — fields: `goodwill`, `goodwillAndIntangibleAssets`, `totalAssets`, `netReceivables`, `inventory`, `totalDebt`, `cashAndCashEquivalents`, `retainedEarnings`, `preferredStock`

### 12.2 Detailed financial thresholds ✅ DONE (2026-06-30)
- **Difficulty:** MEDIUM (2 hours)
- **Cost:** Free
- **What:** Expand CL_THRESHOLDS from 6 to 22 items with 6 group headers
- **Implementation:** Refactored to data-driven `auto(s)`/`val(s)` functions per threshold (like YELLOW_FLAGS). Added `_cfData` storage. 3 QA bugs fixed.

**New thresholds to add:**
```
Gross margin > 40%
Depreciation / Gross Profit < 10%
Interest expense / Operating Income < 15%
Net margin > 10%
R&D expense < 30% of revenue
SG&A expense < 30% of revenue
D/E < 0.5 (conservative) or < 1.0 (moderate)
Current ratio > 1.5
Net debt / FCF < 5
Net debt / FCFF < 5
Total LT liabilities / 5yr avg FCF < 5
EBIT / Interest payment > 10 (interest coverage)
CAPEX / Operating CF < 15%
CAPEX / Sales < 5%
FCF / Revenue > 15%
FCF / Net Income > 90% (FCF conversion)
5yr P/E < 22.5
5yr ROIC > 9%
Shares outstanding decreasing (3yr trend)
```

Each threshold: `{k, label, formula, check: (data) => boolean, value: (data) => number}`
Display: green checkmark if passes, red X if fails, gray dash if data unavailable.

### 12.3 Cash Flow deep dive panel ✅ DONE (2026-06-30)
- **Difficulty:** EASY (1.5 hours)
- **Cost:** Free
- **What:** New card in Financials tab with 10 deep dive metrics + tooltips
- **Implementation:** Inline in `renderFinancials`, uses `_cfData`/`_bsData`/`_isData`. 2 QA bugs fixed (NaN CAGR, capex null mask).

**Calculated metrics (from existing FMP data):**
- CAPEX % of OCF = `capex / operatingCashFlow × 100`
- CAPEX / Sales = `capex / revenue × 100`
- Dividend coverage = `FCF / dividendsPaid`
- Dilution rate = `(sharesOutstanding_now - sharesOutstanding_3yr_ago) / sharesOutstanding_3yr_ago × 100`
- FCF conversion = `FCF / netIncome × 100`
- FCF yield = `FCF per share / stock price × 100`
- FCF per share = `FCF / sharesOutstanding`
- FCF per share growth (3yr CAGR)
- Working Capital = `currentAssets - currentLiabilities`
- Working Capital trend (positive = company needs cash, negative = uses supplier cash like Amazon)

All with METRIC_TIPS tooltips.

### 12.4 Balance Sheet deep dive panel ✅ DONE (2026-06-30)
- **Difficulty:** EASY (1.5 hours)
- **Cost:** Free
- **What:** New card in Financials tab with 11 balance sheet metrics + tooltips
- **Implementation:** Inline in `renderFinancials`, uses `_bsData`. Metrics: Book Value, BVPS, NAV, Net Debt, Goodwill %, Intangibles %, Retained Earnings + trend, Treasury Stock, WC Management, Preferred Stock.

**Calculated metrics:**
- Book Value = `totalStockholdersEquity`
- Book Value per Share = `bookValue / sharesOutstanding`
- Net Asset Value = `totalAssets - totalLiabilities`
- Net Debt = `totalDebt - cashAndCashEquivalents`
- Goodwill % of Assets = `goodwill / totalAssets × 100`
- Intangibles % of Assets = `goodwillAndIntangibleAssets / totalAssets × 100`
- Retained Earnings trend (3yr)
- Treasury Stock amount
- Working Capital Management = `(payables - receivables - inventory) / revenue` (negative = good, like Amazon)
- Preferred Stock present? Yes/No flag

### 12.5 Extended metric tooltips ✅ DONE (2026-06-30)
- **Difficulty:** EASY (30 min)
- **Cost:** Free
- **What:** Add tooltip entries for all new metrics from 12.3 and 12.4
- **Implementation:** Already done inline with 12.3 (10 entries) and 12.4 (11 entries) — 21 new METRIC_TIPS total, each with name/formula/benchmark/description

---

## Phase 13: Valuation Calculators Expansion ✅ COMPLETE (~2 sessions)

### 13.1 Base / Bull / Bear scenario builder ✅ COMPLETE
- **Difficulty:** MEDIUM (3 hours)
- **Cost:** Free
- **What:** 3-scenario valuation with probability weighting
- **Implementation:** Scenario Builder card in company profile Valuation tab

**UI:**
- 3 columns: Bear | Base | Bull (responsive — collapses to 1 column on mobile)
- Each column inputs: Revenue Growth %, Terminal Margin %, Exit P/E Multiple, Probability %
- Probability sum validation (warns if ≠ 100%)
- Auto-prefill Base case from current settings + stock data (g1, netMargin, em)
- Calculated: Fair Value per scenario, Weighted Fair Value = Σ(probability × fair_value)
- Horizontal bar chart: Bear/Base/Bull/Weighted/Market Cap comparison
- Upside/downside % from current price with color-coded badge
- Per-share fair value display

**Save:** Store scenarios per company in `tStocks[ticker].scenarios`

**QA:** 0 CRITICAL, 3 WARN fixed (default value mismatch, mobile responsive, toFixed guard)

### 13.2 10cap calculator ✅ COMPLETE
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Phil Town's Rule #1 method
- **Implementation:** 10cap card in company profile Valuation tab

**Formula:**
- Owner Earnings = Net Income + Depreciation - Maintenance CAPEX
- 10cap Price = Owner Earnings × 10 / shares
- Margin of Safety Price = 10cap / 2

**Inputs (3, auto-prefilled from API):**
- Net Income (from income statement)
- Depreciation & Amortization (from income statement, fallback to cash flow)
- Maintenance CAPEX (default = 50% of total CAPEX, shows total for reference)

**QA:** 0 CRITICAL, 1 WARN fixed (|| → ?? for D&A fallback)

### 13.3 EVA (Economic Value Added) calculator ✅ COMPLETE
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Shows if company earns above cost of capital

**Formula:**
- NOPAT = EBIT × (1 - Effective Tax Rate) — auto-derived from API, fallback 21%
- Invested Capital = Total Equity + Total Debt - Cash
- WACC = editable input (default 10%, saved per company as `evaWacc`)
- EVA = NOPAT - (Invested Capital × WACC)
- EVA Spread = ROIC - WACC
- ROIC (calc) = NOPAT / Invested Capital

**Display:** "Creating Value" (green) / "Destroying Value" (red) badge

**QA:** 0 CRITICAL, 2 WARN fixed (tax rate clamped 0-100%, WACC editable input added)

### 13.4 Unlevered FCF (FCFF) toggle in DCF ✅ COMPLETE
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Toggle between FCF (equity) and FCFF (firm) in DCF calculator
- **Implementation:** Toggle buttons in company profile DCF card

**FCFF calculation:**
- FCFF = EBIT × (1 - Eff. Tax Rate) + D&A - CAPEX - ΔWorking Capital
- FCFF mode: discounts at WACC (reuses EVA's editable WACC), 3-phase growth (g1/g2), enterprise value → subtract net debt
- FCF mode: existing behavior (FCF-SBC, discount at required return)

**UI:** "FCF to Equity" / "FCFF to Firm" toggle buttons, mode saved per company

**QA:** 1 CRITICAL fixed (single growth rate → 3-phase g1/g2), 1 WARN fixed (dead variable removed)

### 13.5 Valuation history tracking ✅ COMPLETE
- **Difficulty:** MEDIUM (2 hours)
- **Cost:** Free
- **What:** Save & compare valuation calculations over time
- **Implementation:** New `valuation_history` array per company

**Delivered:**
- `saveValSnapshot(ticker)` captures DCF, ARIA, Money Back, 10cap MOS, EVA, Weighted FV, Price
- Same-day dedup (overwrites last snapshot if same date)
- `deleteValSnapshot(ticker, idx)` with correct reverse-index mapping
- History table with color-coded badges (DCF, ARIA, EVA)
- Comparison section: first vs latest snapshot with price delta %
- "Save Snapshot" button in Valuation History card

**QA:** 2 WARNs fixed (weighted FV mismatch without saved scenarios — now mirrors renderValuation defaults; ARIA badge threshold at 10% — aligned with badge() function), 1 INFO fixed (removed unused calcStockRatios call). D1 persistence gap noted for future.

---

## Phase 14: Portfolio Asset Type Expansion (~1 session)

### 14.1 Real Estate asset type ✅ COMPLETE
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Dedicated "real_estate" option in position modal with custom fields
- **Implementation:** Add to pf-pos-type dropdown, modify `updatePositionModalFields()`

**Custom fields when type = "real_estate":**
- `purchasePrice` (number) — purchase price
- `currentEstimatedValue` (number) — current estimated value (manual update)
- `monthlyRentalIncome` (number) — monthly rental income (0 if not rented)
- `purchaseDate` (date) — when purchased
- `location` (text) — property location/description
- `annualCosts` (number) — annual maintenance/tax/insurance costs

**P&L calculation:** `currentValue - purchasePrice + (monthlyRental × months_held) - (annualCosts × years_held)`
**Yield:** `(monthlyRentalIncome × 12 - annualCosts) / currentEstimatedValue × 100`

### 14.2 Government Bonds enhanced handling ✅ COMPLETE
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Extra fields for bond positions (coupon, maturity, payment frequency)
- **Implementation:** Show extra fields when type = "bond"

**Custom fields when type = "bond":**
- `faceValue` (number) — face/par value
- `couponRate` (number %) — annual coupon rate
- `maturityDate` (date) — maturity date
- `paymentFrequency` (select: Monthly / Quarterly / Semi-annual / Annual) — interest payment frequency
- `bondType` (text) — e.g., "MÁP+", "PMÁP", "US Treasury", "Corporate"

**Calculated display:**
- Annual interest income = faceValue × couponRate
- Time to maturity = maturityDate - today
- Yield to maturity (simplified) = if bought at different price than face value

### 14.3 Cash / Currency positions ✅ COMPLETE
- **Difficulty:** EASY (30 min)
- **Cost:** Free
- **What:** Simplified position modal for cash holdings
- **Implementation:** Show minimal fields when type = "cash"

**Custom fields when type = "cash":**
- `amount` (number) — cash amount
- `currency` (select) — currency
- No ticker, no shares, no avgCost needed

**Display:** Simple: "EUR 10,000" converted to base currency using existing exchange rate system.

### 14.4 "Net Worth" dashboard widget
- **Difficulty:** MEDIUM (2 hours)
- **Cost:** Free
- **What:** Total wealth overview across all asset classes
- **Implementation:** New Dashboard widget

**Content:**
- Pie chart: allocation by asset class (stock, ETF, crypto, bond, real_estate, savings, cash, other)
- Total Net Worth in base currency
- YoY change (from monthly snapshots)
- Each slice shows: asset class name, total value, % of portfolio

**Data source:** Aggregated from existing `pfPositions` array, grouped by `assetType`.

---

## Phase 15: Follow-up & Monitoring ✅ COMPLETE (2026-07-01)

### 15.1 Quarterly Follow-up expansion ✅ DONE
- **Difficulty:** MEDIUM (2 hours)
- **Cost:** Free
- **What:** Add structured fields to quarterly_followup entries
- **Implementation:** Expand dynamic_quarters render function

**Current:** Free-form text entry per quarter.
**New structured fields per quarterly entry:**
- `numbers` (textarea) — "Revenue, profit, margins, EPS — on track?"
- `news` (textarea) — "Significant news this quarter"
- `managementCommentary` (textarea) — "Key management commentary"
- `companyForecast` (textarea) — "Company's own forecast/guidance"
- `thesisStatus` (select: ON TRACK / BROKEN / UNCLEAR) — "Is thesis intact?"
- `thesisChanges` (textarea) — "What changed vs original thesis?"
- `moatStatus` (select: Widened / Stable / Narrowed) — "Moat status?"
- `qualityTrend` (select: Improving / Stable / Declining) — "Quality getting better or worse?"
- `valuationUpdate` (textarea) — "Updated valuation notes"
- `convictionLevel` (rating 1-10) — "Updated conviction"
- `action` (select: Hold / Buy More / Reduce / Sell) — "Action decision"
- `watchNextQuarter` (textarea) — "What to watch for next quarter"
- `uncertainties` (textarea) — "Any new uncertainties?"
- `previousQuarterFollowup` (textarea) — "Follow up on previous quarter items"

**Auto-carry:** When creating a new quarter entry, auto-populate `previousQuarterFollowup` with the previous quarter's `watchNextQuarter` text.

### 15.2 "Where I Was Wrong" learning log ✅ DONE
- **Difficulty:** EASY (1.5 hours)
- **Cost:** Free
- **What:** Per-company error tracking for skill compounding
- **Implementation:** New dynamic list in checklist (section 14 or sub-section of quarterly_followup)

**Each learning entry:**
- `date` (date)
- `category` (select: Growth / Management / Valuation / Moat / Industry / Psychology / Other)
- `whatHappened` (textarea) — "What went wrong?"
- `whatILearned` (textarea) — "What did I learn?"
- `impactOnThesis` (textarea) — "How did this affect my thesis?"

**Dashboard aggregation:** "My top learning categories" — bar chart showing most common mistake types across all companies.

### 15.3 Company follow sources (External Links) ✅ DONE
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Per-company URL list for news/research tracking
- **Implementation:** New field group in Company Details or Research Sources section

**Fields:**
- `irPageUrl` (text) — Investor Relations page URL
- `seekingAlphaUrl` (text) — SeekingAlpha page
- `twitterAccounts` (text) — Twitter/X accounts to follow
- `youtubeChannels` (text) — YouTube analysis channels
- `substackUrl` (text) — Substack newsletters
- `otherSources` (textarea) — Other URLs

**Plus auto-generated quick links (template URLs):**
- TickerTrends: `tickertrends.io/social-arbitrage` (opens with ticker)
- Glassdoor: `glassdoor.com/Reviews/{company}`
- Finviz: `finviz.com/quote.ashx?t={TICKER}`
- Macrotrends: `macrotrends.net/stocks/charts/{TICKER}`

### 15.4 Price Alerts (basic — on app load) ✅ DONE
- **Difficulty:** EASY (1.5 hours for basic) / HARD (4 hours for push notifications)
- **Cost:** Free
- **What:** Set price targets, get notified when reached
- **Implementation (basic version — recommended first):**

**Per-company alert config:**
- `alertAbove` (number) — notify if price goes above this
- `alertBelow` (number) — notify if price goes below this
- Stored in `tStocks[ticker].priceAlerts`

**On app load / data refresh:**
- Check each company with alerts: `if (currentPrice >= alertAbove || currentPrice <= alertBelow)`
- Show toast notification with company name + price + "target reached!"
- Dashboard widget: "Price Alerts" — list of all active alerts with current price vs target

**Future enhancement (push notification — separate task):**
- Cloudflare Worker cron job (free tier: 1 trigger/min, 10ms CPU)
- Check prices via FMP API → if alert triggered → Web Push API notification
- Requires service worker push subscription (PWA already has service worker)

### 15.5 Sell Trigger monitoring dashboard ✅ DONE
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Aggregated view of all sell triggers across owned companies
- **Implementation:** New Dashboard widget

**Content:**
- Table: Company | Sell Trigger | Status (ACTIVE/TRIGGERED/RESOLVED) | Date Added
- Filter: Owned companies only, ACTIVE triggers only
- Link: Click → opens company's Buy/Sell Decision section
- Count badge: "X active sell triggers across Y companies"

**Data source:** Reads from `tStocks[ticker].checklist.sections.buy_sell` (sellTrigger1-3) + the new dynamic_sell_events from Phase 11.8.

---

## Phase 16: Review & Psychology Expansion (~1 session) ✅ COMPLETE (2026-07-01)

### 16.1 Psychology section expansion ✅ (done early in Phase 11 session, 2026-06-30)
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Add ~8 fields to CL_SECTIONS[9] (psychology)
- **Implementation:** Expand fields array

**New fields:**
- `priceAnchoringBias` (textarea) — "Is there any price anchoring bias?"
- `tooHardPile` (textarea) — "Would this fit in the too hard pile?"
- `borrowedConviction` (select: Yes / No) — "Am I borrowing conviction from others?"
- `highestOpportunityCost` (select: Yes / No / Unsure) — "Is this my highest opportunity cost?"
- `independenceOfThought` (textarea) — "Do I rely on first-hand sources or am I influenced?"
- `expectationsVsConsensus` (textarea) — "How do my expectations differ from consensus?"
- `disconfirmingEvidence` (textarea) — "Have I reconciled disconfirming evidence?"
- `speculationCheck` (select: Investing / Speculating / Unsure) — "Am I investing or speculating?"
- `emotionalAttachment` (select: None / Some / High) — "Do I have emotional attachment to this stock?"

### 16.2 Review template questions expansion ✅ (2026-07-01)
- **Difficulty:** EASY (30 min)
- **Cost:** Free
- **What:** Add questions to RV_QUESTIONS weekly/monthly/quarterly arrays

**Weekly additions:**
- `w8` — "Am I exercising great temperament or rushing?"
- `w9` — "Any new companies added to watchlist or analysis pipeline?"

**Monthly additions:**
- `m9` — "Companies I want to analyze next month"
- `m10` — "Any conviction level changes? Which companies and why?"
- `m11` — "Am I following my framework principles?"

**Quarterly additions:**
- `q11` — "Moat status: widened, stable, or narrowed?"
- `q12` — "What to specifically watch for next quarter?"
- `q13` — "Where was I wrong this quarter and what did I learn?"

### 16.3 Conviction Tracker timeline ✅ (2026-07-01)
- **Difficulty:** MEDIUM (2 hours)
- **Cost:** Free
- **What:** Per-company conviction level over time, visualized as line chart
- **Implementation:** New panel in company profile

**Data collection:**
- Every quarterly review entry that has a `convictionLevel` (1-10) → stored as `{date, level, notes}` in `tStocks[ticker].convictionHistory[]`
- Also collect from checklist psychology section's conviction level
- Change Tracking log can be mined for historical conviction changes

**Display:**
- Chart.js line chart: X = date, Y = conviction level (1-10)
- Color zones: 1-3 red, 4-6 yellow, 7-10 green
- Hover shows notes from that review
- Current conviction badge on company profile header

---

## Phase 17: Expected Return Calculator (~1 session)

### 17.1 Expected Return breakdown ✅ (2026-07-01)
- **Difficulty:** MEDIUM (2 hours)
- **Cost:** Free
- **What:** Decompose expected return into 4 drivers
- **Implementation:** New calculator tab or sub-panel in Buy/Sell Decision

**Formula:**
```
Expected CAGR ≈ Revenue Growth + Margin Expansion + Multiple Change + Shareholder Yield
```

**Inputs (with auto-prefill from API where possible):**
- Revenue Growth % (auto: 3yr CAGR from API)
- Margin Expansion/Contraction % (auto: current net margin trend)
- Multiple Change % (manual: expected P/E change per year)
- Shareholder Yield % (auto: dividend yield + buyback yield from API)

**Output:**
- Total Expected CAGR %
- Stacked bar chart showing contribution of each driver
- Comparison line: "Minimum acceptable = 15%"
- Color: green if > 15%, yellow if 10-15%, red if < 10%

### 17.2 Position sizing recommendation ✅
- **Difficulty:** EASY (1 hour)
- **Cost:** Free
- **What:** Formula-based position size suggestion based on scoring
- **Implementation:** Display in Buy/Sell Decision section, calculated from framework scoring

**Logic (from user's scoring system):**
```
Position Score = Expected CAGR multiplier × Conviction multiplier × Risk multiplier

CAGR multipliers: 10-12% → 1x, 12-15% → 1.2x, 15-20% → 1.5x, 20%+ → 2x
Conviction: Low → 0.5x, Medium → 1x, High → 1.5x, Very High → 2x
Risk: Very safe → 1.3x, Normal → 1x, Fragile → 0.7x, High risk → 0.5x
```

**Position size mapping:**
- Score 0-1 → 1-2% (minimal position)
- Score 1-2 → 2-4% (small position)
- Score 2-3 → 4-6% (medium position)
- Score 3-4 → 6-8% (large position)
- Score 4+ → 8-12% (high conviction position)

**Display:** Score badge + suggested position size range + current actual position size for comparison.

**Kelly Criterion (optional toggle):**
- `f* = (b × p - q) / b`
- Where b = expected gain ratio, p = probability of gain, q = 1 - p
- Half-Kelly for safety: `f*/2`

---

## Phase 18: External Links & Earnings Calendar (~1 session)

### 18.1 External research links
- **Difficulty:** EASY (30 min)
- **Cost:** Free
- **What:** Quick-link buttons on company profile to external research sites
- **Implementation:** Add link row to company profile header

**Template URLs (ticker auto-inserted):**
- TickerTrends: `https://tickertrends.io/social-arbitrage`
- Finviz: `https://finviz.com/quote.ashx?t={TICKER}`
- Macrotrends: `https://www.macrotrends.net/stocks/charts/{TICKER}`
- SeekingAlpha: `https://seekingalpha.com/symbol/{TICKER}`
- Yahoo Finance: `https://finance.yahoo.com/quote/{TICKER}`
- SEC EDGAR: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={TICKER}&type=10-K`
- Glassdoor: search URL with company name

**UI:** Row of small icon buttons below company name, each opens in new tab.

### 18.2 Basic Earnings Calendar
- **Difficulty:** EASY (1.5 hours)
- **Cost:** Free (FMP free tier endpoint)
- **What:** Show upcoming earnings dates for tracked companies + mark as read/listened
- **Implementation:** Dashboard widget + per-company earnings date display

**Data source:** FMP `/v3/earning_calendar` endpoint (free tier: limited but sufficient for tracked companies). Or Finnhub `/calendar/earnings` (free tier).

**Dashboard "Upcoming Earnings" widget:**
- Table: Company | Earnings Date | Days Until | Status (Upcoming / Reported / Reviewed)
- Sort by date (nearest first)
- Only show companies in "Owned" or "Buy Target" pipeline

**Per-company earnings tracking:**
- Existing earnings grid already tracks Q1-Q4 "done" checkbox per year
- Enhancement: Add "Earnings Date" field per quarter (auto-fill from API if available)
- Add "Call Listened" checkbox separate from "Report Read" checkbox
- Add "Notes" textarea per quarter (already exists)

**No premium API needed** — free tier covers next + recent earnings dates.

---

## Maybe Later (moved from scope)

- [ ] Google Drive import tool — manual export (Docs → .docx/.md → app import) is sufficient for now
- [ ] Push notifications for price alerts — basic on-load check is Phase 15.4, push is a future enhancement
- [ ] Analyst consensus estimates — FMP Premium ($14/mo), not needed for basic workflow
- [ ] CFROI calculator — complex, low priority vs other valuation methods
- [ ] Seasonality analysis, Pattern matching, Sector Map — see main ROADMAP "Maybe Later"

---

## Implementation Notes

### Approach for checklist expansion (Phases 11-12)
The CL_SECTIONS array is the single source of truth. Each section's `fields` array defines the UI:
- `type: 'textarea'` — multi-line text
- `type: 'text'` — single line
- `type: 'number'` — numeric
- `type: 'select', opts: [...]` — dropdown
- `type: 'rating'` — 1-5 star rating
- `type: 'rating10'` — 1-10 slider
- `type: 'checkbox'` — boolean

**Sub-grouping:** Implemented as a `group` field type (not a property):
```js
{k:'_g_basicinfo', type:'group', label:'Basic Info'},
{k:'founded', label:'Founded', type:'text', ph:'Year founded'},
```
Group type renders as a styled divider/header. Skipped in progress calculation.

### Data migration
- New fields auto-initialize as empty/null via `ensureChecklist()` — no migration needed
- New CL_SECTIONS entries (SWOT = section 13) need `ensureChecklist()` to create empty `sections.swot` object
- D1 schema: checklist data stored as JSON blob per company — no schema change needed for new fields
- SCHEMA_VERSION bump only if data structure changes (not just new empty fields)

### Testing approach
- Each phase: implement → QA in browser → fix bugs → commit
- Per the project workflow: one feature per session, commit at end, update this plan's status

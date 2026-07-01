# Stratos Ventures — Financial Glossary

**Last Updated:** 2026-07-01

All financial calculations, formulas, and metrics used in the app, with exact implementation details.

---

## Valuation Methods

### DCF — Discounted Cash Flow (Perpetuity)

Calculates intrinsic value by discounting projected future free cash flows to present value.

- **Function:** `calcDCF(prefix, false)` — line ~2613
- **Formula:**
  - PV of FCF (Years 1-10): `Sum of FCF[i] / (1 + dr)^i`
  - Terminal Value: `(FCF[10] × (1 + tg)) / (dr - tg)`
  - PV Terminal: `TV / (1 + dr)^10`
  - Enterprise Value: `Sum of Discounted FCF + PV Terminal`
  - Equity Value: `EV + Cash - Debt`
  - Upside/Downside: `((Equity Value - Market Cap) / Market Cap) × 100`
- **Inputs:** Market Cap, FCF-SBC (Year 0), growth rates (g1/g2/g3), discount rate, terminal growth, cash, debt
- **Used in:** Companies view — Calculator tab, Scenario Builder

### DCF — Exit Multiple Variant

Same as perpetuity DCF except terminal value uses an exit P/FCF multiple.

- **Function:** `calcDCF(prefix, true)` — line ~2613
- **Formula:** Terminal Value = `FCF[10] × exit_multiple` (instead of perpetuity)
- **Inputs:** Same as perpetuity DCF + exit multiple (em)

### Reverse DCF — Implied Growth

Binary search to find what growth rate the market is pricing in at current valuation.

- **Function:** `calcReverseDCF()` — line ~2679, uses `solveGrowth()` — line ~2665
- **Formula:** Solve for `g` where `Sum(FCF[i]/(1+dr)^i) + TV/(1+dr)^fade = Market Cap - Cash + Debt`
- **Outputs:** Implied growth %, P/FCF-SBC multiple, FCF-SBC yield
- **Display:** Sensitivity chart for discount rates 6-14%
- **Guard:** Returns early if FCF-SBC <= 0

### ARIA — Assumed Rate of Initial Assumption

Shows achievable CAGR at various exit P/FCF multiples for Year 5 and Year 10.

- **Function:** `calcAria()` — line ~2738, `ariaCagr()` helper — line ~2742
- **Formula:** For each multiple m: `CAGR = (FCF[year] × m / Market Cap)^(1/year) - 1`
- **Inputs:** Market Cap, 15-year FCF projections, configurable P/FCF multiples (default 10x-35x)
- **Color coding:** >=15% green, 8-15% orange, <8% red

### Money Back Method

Calculates years until cumulative FCF equals the initial investment (market cap payback period).

- **Function:** `calcMoneyBack()` — line ~2762
- **Formula:**
  - Cumulative FCF[i] = Sum of FCF from years 0 to i
  - Money Back Year = first year where Cumulative FCF >= Market Cap
  - Interpolation: `mby = (mby-1) + (mc - cum[mby-1]) / (cum[mby] - cum[mby-1])`
- **Threshold:** >10 years = negative (red), <=10 years = positive (green)

---

## Portfolio Performance

### TWR — Time-Weighted Return

Measures portfolio return independent of cash flow timing (deposits/withdrawals).

- **Function:** `calcTWR()` — line ~4111
- **Formula:**
  - Per-period return: `R = (End Value - (Start Value + Cashflow)) / (Start Value + Cashflow)`
  - TWR = `Product of all (1 + R) - 1`
  - Annualized: `(1 + TWR)^(365/days) - 1` if period > 365 days
- **Inputs:** Portfolio snapshots (min 2), transactions (buy/sell/dividend), base currency
- **Used in:** Portfolio view — Performance section

### XIRR — Extended Internal Rate of Return

Money-weighted return accounting for the timing and size of all cash flows.

- **Function:** `calcXIRR()` — line ~4145
- **Formula:** Newton-Raphson iteration to solve `NPV(rate) = 0`
  - `NPV = Sum of CF[i] / (1 + rate)^years[i]`
- **Inputs:** All buy/sell/dividend transactions with dates and amounts, current portfolio values
- **Precision:** Rate within 1e-8, NPV < 1
- **Used in:** Portfolio view — Performance section

---

## Valuation Ratios

| Ratio | Formula | Scoring (Quality Score) | Line |
|-------|---------|------------------------|------|
| **P/S** (Price/Sales) | Market Cap / Revenue TTM | — | ~8734 |
| **P/E** (Price/Earnings) | Market Cap / Net Income TTM | <=15: 6pts, <=25: 4pts, <=35: 2pts | ~8735 |
| **P/FCF** (Price/FCF) | Market Cap / FCF TTM | <=15: 6pts, <=25: 4pts, <=40: 2pts | ~8736 |
| **P/OCF** (Price/OpCashFlow) | Market Cap / OCF TTM | — | ~8737 |
| **EV/EBIT** | (MCap + Debt - Cash) / EBIT TTM | <=12: 4pts, <=20: 3pts, <=30: 1pt | ~8738 |
| **PEG** | P/E / EPS Growth % | <=1.0: 5pts, <=1.5: 3pts, <=2.5: 1pt | ~8739 |
| **Buyback Yield** | (Shares Repurchased / MCap) × 100 | >=2%: 3pts, >=1%: 2pts, >=0.01%: 1pt | ~8740 |

---

## Profitability Metrics

| Metric | Formula | Scoring | Thresholds |
|--------|---------|---------|------------|
| **Gross Margin** | (Gross Profit / Revenue) × 100 | >=50%: 5pts, >=35%: 4pts, >=20%: 2pts | Ideal >50%, Good >40% |
| **Operating Margin** | (EBIT / Revenue) × 100 | >=25%: 5pts, >=15%: 4pts, >=8%: 2pts | Ideal >20%, Good >10% |
| **Net Margin** | (Net Income / Revenue) × 100 | >=20%: 5pts, >=10%: 4pts, >=5%: 2pts | Ideal >15%, Good >10% |

---

## Return on Investment

| Metric | Formula | Scoring | Thresholds |
|--------|---------|---------|------------|
| **ROE** | (Net Income / Avg Shareholders' Equity) × 100 | >=20%: 5pts, >=12%: 4pts, >=8%: 2pts | Ideal >15% |
| **ROIC** | NOPAT / Invested Capital × 100 | >=20%: 5pts, >=12%: 4pts, >=8%: 2pts | Ideal >20% |

Source: Finnhub key metrics TTM (`roeTTM`, `roicTTM`).

---

## Balance Sheet Strength

| Metric | Formula | Scoring | Thresholds |
|--------|---------|---------|------------|
| **Debt/Equity** | Total Debt / Total Equity | <0: 6pts (net cash), <=0.3: 6pts, <=0.7: 4pts, <=1.5: 2pts | Ideal <0.5 |
| **Current Ratio** | Current Assets / Current Liabilities | >=2.0: 5pts, >=1.5: 4pts, >=1.0: 2pts | Ideal >1.5 |

Source: Finnhub key metrics TTM (`debtToEquityTTM`, `currentRatioTTM`).

---

## Cash Flow Metrics

| Metric | Formula | Notes |
|--------|---------|-------|
| **FCF-SBC** | Free Cash Flow - Stock Based Compensation | Primary FCF metric in all valuations |
| **OCF-SBC** | Operating Cash Flow - SBC | Secondary metric |
| **FCF Positive** | Boolean: FCF > 0 | 4pts if positive (Health pillar) |
| **FCF Quality** | FCF vs Net Income comparison | >=NI: 4pts, >=80%: 3pts, >=50%: 1pt |
| **SBC % Revenue** | (SBC / Revenue) × 100 | <=5%: 3pts, <=10%: 1pt (inverse) |

---

## Growth Metrics

| Metric | Scoring | Pillar |
|--------|---------|--------|
| **Revenue Growth TTM** | >=20%: 7pts, >=10%: 5pts, >=5%: 3pts, >=0%: 1pt | Growth |
| **3Y Revenue CAGR** | >=15%: 7pts, >=8%: 5pts, >=3%: 3pts, >=0%: 1pt | Growth |
| **EPS Growth TTM** | >=20%: 6pts, >=10%: 4pts, >=5%: 2pts | Growth |
| **Revenue Consistency** | All 3yr positive: 5pts, 2/3: 3pts, 1/3: 1pt | Growth |

---

## Dividend Metrics

| Metric | Formula | Line |
|--------|---------|------|
| **Dividend Yield** | (Annual DPS / Current Price) × 100 | ~7903 |
| **Yield on Cost** | (Annual DPS / Avg Cost Basis) × 100 | ~7973 |
| **Payout Ratio** | (Annual DPS / Diluted EPS) × 100 | ~7905 |
| **Dividend Growth CAGR** | (Recent / Old)^(1/years) - 1 | ~7883 |
| **Dividend Frequency** | Auto-detected: monthly/quarterly/semi-annual/annual | ~7897 |

Function: `calcDivGrowthCAGR()` — lookback periods: 1Y, 3Y, 5Y, 10Y.

---

## Composite Scores

### Quality Score (0-100)

- **Function:** `calcStockScore()` — line ~8657
- **Structure:** 4 pillars × 25 points max each
  - **Valuation:** P/E, P/FCF, PEG, EV/EBIT, DCF Upside
  - **Growth:** Revenue Growth, 3Y CAGR, EPS Growth, Revenue Consistency
  - **Profitability:** Gross Margin, Op. Margin, Net Margin, ROE, ROIC
  - **Health:** Debt/Equity, Current Ratio, FCF Positive, FCF Quality, SBC %, Buyback Yield
- **Used in:** Tracker table (center column), Screener filters, Dashboard quality widget

### Position Score (Framework)

- **Function:** `calcFwScore()` — line ~9755
- **Formula:** `(Expected CAGR × Conviction × Risk) / 10`
  - CAGR: Expected annual return (%)
  - Conviction: 1-10 scale
  - Risk multiplier: 0.5 (high risk) to 1.5 (very safe)
- **Thresholds:** >=100 strong candidate, >=50 worth considering, <50 weak/risky

---

## Scenario Builder

### Bear/Base/Bull Case

| Scenario | Revenue Growth | Terminal Margin | Exit Multiple | Default Probability |
|----------|---------------|-----------------|---------------|-------------------|
| **Bear** | -5% | 10% | 10x | 20% |
| **Base** | g1 | Net Margin | em | 60% |
| **Bull** | g1 × 1.5 | Net Margin × 1.2 | em × 1.3 | 20% |

Weighted average intrinsic value = sum of (scenario value × probability).

### EVA — Economic Value Added

- **Spread:** `ROIC - WACC`
- **Input:** Manual WACC entry (`evaWacc` field)
- **Purpose:** Measures value creation above cost of capital
- **Line:** ~7045

---

## Global Calculation Settings

| Setting | Default | Description |
|---------|---------|-------------|
| **g1** (Years 1-5 growth) | 20% | Configurable globally and per-stock |
| **g2** (Years 6-10 growth) | 15% | Configurable globally and per-stock |
| **g3** (Years 11-15 growth) | 10% | Configurable globally and per-stock |
| **dr** (Discount rate) | 10% | WACC equivalent for DCF |
| **tg** (Terminal growth) | 3% | Long-term perpetual growth |
| **em** (Exit multiple) | 15x | P/FCF exit multiple |
| **Fade years** | 10 | Reverse DCF growth fade period (range 5-20) |

Per-stock overrides are stored in the company's data object and take precedence over global defaults.

---

## Key Concepts

**FCF-SBC** is the primary cash flow metric throughout all calculations. It excludes dilutive stock-based compensation, providing a cleaner picture of true cash generation than reported FCF.

**Reverse DCF** is the quickest "is this fairly priced?" check — if implied growth exceeds reasonable expectations, the stock is overvalued.

**ARIA** is best for portfolio construction — it shows achievable CAGR at various entry multiples, aiding position sizing and conviction assessment.

**Money Back** appeals to conservative investors — it shows how quickly cumulative cash generation repays the initial investment.

**Quality Score** aggregates four pillars but no single metric should be relied upon alone — the framework requires multi-factor analysis across all verticals: Moat, Growth, Valuation, and (Un)Certainty.

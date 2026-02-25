// src/mocks/company.ts
//
// Mock P1 pipeline responses for the metrics panel.
// Matches the P1Summary interface in src/types/index.ts exactly.
//
// WHEN BACKEND IS READY: replace fetchCompanySummary() body only.

import type { P1Summary } from "../types";

export const MOCK_P1: Record<string, P1Summary> = {
  AAPL: {
    pipeline: "p1_market_financials",
    ticker: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    industry: "Consumer Electronics",
    fetched_at: "2026-02-20T04:07:36.988163",
    metrics: {
      price:                "260.58",
      week_52_high:         "288.62",
      week_52_low:          "169.21",
      market_cap_b:         "3829.99",
      pe_trailing:          "32.98",
      pe_forward:           "28.07",
      eps_ttm:              "7.90",
      gross_margin_pct:     "47.33",
      net_margin_pct:       "27.04",
      op_margin_pct:        "35.37",
      revenue_growth_pct:   "15.7",
      earnings_growth_pct:  "18.3",
      beta:                 "1.107",
      dividend_yield_pct:   "0.44",
    },
    derived: {
      revenue_b:      { "2022": 394.33, "2023": 383.28, "2024": 391.04, "2025": 416.16 },
      revenue_yoy_pct:{ "2022": 7.79,   "2023": -2.80,  "2024": 2.02,   "2025": 6.43  },
      net_margin_pct: { "2022": 25.31,  "2023": 25.31,  "2024": 23.97,  "2025": 26.92 },
      gross_margin_pct:{ "2022": 43.31, "2023": 44.13,  "2024": 46.21,  "2025": 46.91 },
      fcf_margin_pct: { "2022": 28.26,  "2023": 25.98,  "2024": 27.83,  "2025": 23.73 },
      debt_equity:    { "2022": 2.61,   "2023": 1.79,   "2024": 1.87,   "2025": 1.34  },
    },
  },

  MSFT: {
    pipeline: "p1_market_financials",
    ticker: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    industry: "Software",
    fetched_at: "2026-02-20T04:07:36.988163",
    metrics: {
      price:                "415.30",
      week_52_high:         "468.35",
      week_52_low:          "362.90",
      market_cap_b:         "3090.00",
      pe_trailing:          "36.20",
      pe_forward:           "31.40",
      eps_ttm:              "11.45",
      gross_margin_pct:     "69.40",
      net_margin_pct:       "35.60",
      op_margin_pct:        "44.60",
      revenue_growth_pct:   "12.3",
      earnings_growth_pct:  "14.1",
      beta:                 "0.903",
      dividend_yield_pct:   "0.72",
    },
    derived: {
      revenue_b:       { "2022": 198.27, "2023": 211.91, "2024": 245.12, "2025": 275.00 },
      revenue_yoy_pct: { "2022": 17.96,  "2023": 6.88,   "2024": 15.66,  "2025": 12.19 },
      net_margin_pct:  { "2022": 36.69,  "2023": 34.15,  "2024": 35.96,  "2025": 36.20 },
      gross_margin_pct:{ "2022": 68.40,  "2023": 68.92,  "2024": 69.76,  "2025": 69.40 },
      fcf_margin_pct:  { "2022": 32.10,  "2023": 28.50,  "2024": 31.20,  "2025": 30.10 },
      debt_equity:     { "2022": 0.47,   "2023": 0.37,   "2024": 0.31,   "2025": 0.28  },
    },
  },

  NVDA: {
    pipeline: "p1_market_financials",
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    industry: "Semiconductors",
    fetched_at: "2026-02-20T04:07:36.988163",
    metrics: {
      price:                "131.40",
      week_52_high:         "153.13",
      week_52_low:          "47.32",
      market_cap_b:         "3220.00",
      pe_trailing:          "54.10",
      pe_forward:           "32.60",
      eps_ttm:              "2.43",
      gross_margin_pct:     "74.60",
      net_margin_pct:       "55.00",
      op_margin_pct:        "61.10",
      revenue_growth_pct:   "114.0",
      earnings_growth_pct:  "147.0",
      beta:                 "1.680",
      dividend_yield_pct:   "0.03",
    },
    derived: {
      revenue_b:       { "2022": 26.97, "2023": 26.97, "2024": 60.92, "2025": 130.50 },
      revenue_yoy_pct: { "2022": 61.40, "2023": 0.00,  "2024": 125.9, "2025": 114.20 },
      net_margin_pct:  { "2022": 36.23, "2023": 16.00, "2024": 55.04, "2025": 55.00  },
      gross_margin_pct:{ "2022": 64.93, "2023": 56.93, "2024": 72.72, "2025": 74.60  },
      fcf_margin_pct:  { "2022": 24.50, "2023": 14.20, "2024": 48.30, "2025": 50.10  },
      debt_equity:     { "2022": 0.44,  "2023": 0.41,  "2024": 0.38,  "2025": 0.29   },
    },
  },
};

// ─── Fetch function ───────────────────────────────────────────────────────────
export async function fetchCompanySummary(ticker: string): Promise<P1Summary> {
  await new Promise((r) => setTimeout(r, 200));
  const data = MOCK_P1[ticker] ?? MOCK_P1["AAPL"]; // fallback to AAPL if unknown
  return { ...data, ticker };
}
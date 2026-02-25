// src/types/index.ts
//
// Single source of truth for all shared TypeScript types.
// Import from anywhere: import type { TimeRange } from "@/types"
//
// These types mirror your pipeline JSON shapes exactly.
// If a pipeline changes, update here — TypeScript shows every breakage.

// ─── App types ────────────────────────────────────────────────────────────────

// Union type: only these exact 6 strings are valid TimeRange values.
// TypeScript errors immediately if something tries to pass "2Y" or "6M".
export type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

// Array version — used to render the time range buttons.
// Defined here so Navbar AND ChartPanel use the same source of truth.
export const TIME_RANGES: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

// A company — used in search results and watchlist
export interface Company {
  ticker: string;
  name: string;
  sector: string;
  exchange: string;
}

// ─── Pipeline P1 — Market & Financials ────────────────────────────────────────

export interface P1Summary {
  pipeline: "p1_market_financials";
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  fetched_at: string;
  metrics: {
    price: string;
    week_52_high: string;
    week_52_low: string;
    market_cap_b: string;
    pe_trailing: string;
    pe_forward: string;
    eps_ttm: string;
    gross_margin_pct: string;
    net_margin_pct: string;
    op_margin_pct: string;
    revenue_growth_pct: string;
    earnings_growth_pct: string;
    beta: string;
    dividend_yield_pct: string;
  };
  derived: {
    revenue_b: Record<string, number>;
    revenue_yoy_pct: Record<string, number>;
    net_margin_pct: Record<string, number>;
    gross_margin_pct: Record<string, number>;
    fcf_margin_pct: Record<string, number>;
    debt_equity: Record<string, number>;
  };
}

// ─── Pipeline P2 — SEC Filings ────────────────────────────────────────────────

export interface Filing {
  ticker: string;
  cik: string;
  form_type: "10-K" | "10-Q" | "8-K";
  filed_date: string;
  accession_number: string;
  primary_document: string;
  filing_url: string;
  description: string;
}

export interface P2Filings {
  pipeline: "p2_sec_filings";
  ticker: string;
  total: number;
  fetched_at: string;
  filings: Filing[];
}

// ─── Pipeline P3 — News (stub until pipeline is finished) ────────────────────

export type Sentiment = "positive" | "negative" | "neutral";

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  published_at: string;
  sentiment: Sentiment;
  related_tickers: string[];
  url: string;
}

export interface P3News {
  pipeline: "p3_news";
  ticker: string;
  fetched_at: string;
  articles: NewsArticle[];
}

// ─── Pipeline P4 — Executives & Ownership ────────────────────────────────────

export interface Executive {
  ticker: string;
  name: string;
  title: string;
  year_born: number | null;
  total_pay: number | null;
  exercised_value: number;
  unexercised_value: number;
}

export interface Institution {
  Date_Reported: string;
  Holder: string;
  pctHeld: number;
  Shares: number;
  Value: number;
  pctChange: number;
}

export interface P4ExecOwnership {
  pipeline: "p4_executives";
  ticker: string;
  fetched_at: string;
  executives: Executive[];
  institutions: Institution[];
}
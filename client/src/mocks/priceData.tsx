// src/mocks/priceData.ts
//
// Mock OHLCV (Open, High, Low, Close, Volume) price data for AAPL.
// Structured to match what your real pipeline will return.
//
// Each time range has its own dataset with appropriate granularity:
//   1D  → 5-minute intervals (78 candles per trading day)
//   1W  → 30-minute intervals
//   1M  → daily candles
//   3M  → daily candles
//   1Y  → weekly candles
//   5Y  → monthly candles
//
// WHEN BACKEND IS READY:
//   Replace fetchPriceData() body with a real API call.
//   The PriceCandle interface and function signature stay identical.

import type { TimeRange } from "../types";

export interface PriceCandle {
  timestamp: number;   // Unix ms — works directly with new Date(ts)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceDataset {
  ticker: string;
  range: TimeRange;
  interval: string;    // "5m" | "30m" | "1d" | "1w" | "1mo"
  candles: PriceCandle[];
}

// ─── Helper to generate realistic-looking price series ───────────────────────
// Uses a random walk with drift so the data looks like a real chart.
// seed: starting price
// n: number of candles
// volatility: how much price can move per step (0.005 = 0.5%)
// drift: slight upward/downward bias per step
function generateCandles(
  seed: number,
  n: number,
  startMs: number,
  stepMs: number,
  volatility: number,
  drift: number
): PriceCandle[] {
  const candles: PriceCandle[] = [];
  let price = seed;

  // Deterministic pseudo-random using a simple LCG so data is consistent
  let rng = 12345;
  function rand() {
    rng = (rng * 1664525 + 1013904223) & 0xffffffff;
    return (rng >>> 0) / 0xffffffff;
  }

  for (let i = 0; i < n; i++) {
    const change = price * volatility * (rand() - 0.5) * 2 + drift;
    const open  = price;
    const close = Math.max(1, price + change);
    const high  = Math.max(open, close) * (1 + rand() * volatility * 0.5);
    const low   = Math.min(open, close) * (1 - rand() * volatility * 0.5);
    const volume = Math.floor(30_000_000 + rand() * 80_000_000);

    candles.push({
      timestamp: startMs + i * stepMs,
      open:   +open.toFixed(2),
      high:   +high.toFixed(2),
      low:    +low.toFixed(2),
      close:  +close.toFixed(2),
      volume,
    });

    price = close;
  }
  return candles;
}

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY  = 24 * HOUR;
const WEEK = 7 * DAY;

// Trading day start: 9:30 AM ET on 2026-02-24
const TODAY_OPEN = new Date("2026-02-24T09:30:00-05:00").getTime();

// ─── Generate datasets for each time range ───────────────────────────────────

const DATA_1D = generateCandles(260.58, 78, TODAY_OPEN, 5 * MIN, 0.003, 0.001);
const DATA_1W = generateCandles(255.00, 65, TODAY_OPEN - 5 * DAY, 30 * MIN, 0.004, 0.002);
const DATA_1M = generateCandles(240.00, 21, TODAY_OPEN - 21 * DAY, DAY, 0.012, 0.004);
const DATA_3M = generateCandles(210.00, 63, TODAY_OPEN - 63 * DAY, DAY, 0.014, 0.006);
const DATA_1Y = generateCandles(175.00, 52, TODAY_OPEN - 52 * WEEK, WEEK, 0.025, 0.012);
const DATA_5Y = generateCandles(120.00, 60, TODAY_OPEN - 60 * 30 * DAY, 30 * DAY, 0.045, 0.018);

export const MOCK_PRICE_DATA: Record<TimeRange, PriceDataset> = {
  "1D": { ticker: "AAPL", range: "1D", interval: "5m",  candles: DATA_1D },
  "1W": { ticker: "AAPL", range: "1W", interval: "30m", candles: DATA_1W },
  "1M": { ticker: "AAPL", range: "1M", interval: "1d",  candles: DATA_1M },
  "3M": { ticker: "AAPL", range: "3M", interval: "1d",  candles: DATA_3M },
  "1Y": { ticker: "AAPL", range: "1Y", interval: "1w",  candles: DATA_1Y },
  "5Y": { ticker: "AAPL", range: "5Y", interval: "1mo", candles: DATA_5Y },
};

// ─── Mock fetch function ──────────────────────────────────────────────────────
// NOW:   returns the hardcoded data above with a fake delay
//
// LATER: replace body with:
//   const res = await fetch(`/api/company/${ticker}/price?range=${range}`);
//   if (!res.ok) throw new Error("Price fetch failed");
//   return res.json() as Promise<PriceDataset>;
//
export async function fetchPriceData(
  ticker: string,
  range: TimeRange
): Promise<PriceDataset> {
  await new Promise((r) => setTimeout(r, 200));
  // For now return AAPL data regardless of ticker
  const dataset = MOCK_PRICE_DATA[range];
  return { ...dataset, ticker };
}
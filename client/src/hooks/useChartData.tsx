// src/hooks/useChartData.ts
//
// TanStack Query hooks that the chart panel uses to fetch data.
// Components never call fetch() directly — they call these hooks.
//
// WHY TANSTACK QUERY instead of useEffect + useState:
//   Without it you write loading/error/data state + useEffect every time.
//   With it: caching, deduplication, background refetch, and retry
//   are all handled automatically.
//
// The queryKey array is the cache key:
//   ["price", "AAPL", "1M"] → cached separately from ["price", "AAPL", "1D"]
//   If two components call usePriceData("AAPL", "1M") at the same time,
//   only ONE fetch happens — the second reads from cache.

import { useQuery } from "@tanstack/react-query";
import { fetchPriceData } from "../mocks/priceData";
import { fetchCompanySummary } from "../mocks/company";
import type { TimeRange } from "../types";

// ─── Price / OHLCV data ───────────────────────────────────────────────────────
export function usePriceData(ticker: string, range: TimeRange) {
  return useQuery({
    queryKey: ["price", ticker, range],
    queryFn:  () => fetchPriceData(ticker, range),
    staleTime: range === "1D" ? 30_000 : 5 * 60_000,
    // 1D data goes stale after 30s (market hours need fresher data)
    // All other ranges stale after 5 minutes
  });
}

// ─── Company summary (P1 pipeline) ───────────────────────────────────────────
export function useCompanySummary(ticker: string) {
  return useQuery({
    queryKey: ["summary", ticker],
    queryFn:  () => fetchCompanySummary(ticker),
    staleTime: 60_000,
  });
}
// src/hooks/useNews.ts
import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../mocks/news";

export function useNews(ticker: string) {
  return useQuery({
    queryKey: ["news", ticker],
    queryFn: () => fetchNews(ticker),
    staleTime: 2 * 60_000,
    refetchInterval: 2 * 60_000,
  });
}
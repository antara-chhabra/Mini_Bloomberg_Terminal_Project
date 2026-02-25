import type { Company } from '../types';

// The hardcoded list shown in the search dropdown.
// Add more tickers here as needed.
export const MOCK_COMPANIES: Company[] = [
  { ticker: 'AAPL',  name: 'Apple Inc.',            sector: 'Technology',         exchange: 'NASDAQ' },
  { ticker: 'MSFT',  name: 'Microsoft Corporation', sector: 'Technology',         exchange: 'NASDAQ' },
  { ticker: 'NVDA',  name: 'NVIDIA Corporation',    sector: 'Technology',         exchange: 'NASDAQ' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.',         sector: 'Communication',      exchange: 'NASDAQ' },
  { ticker: 'META',  name: 'Meta Platforms Inc.',   sector: 'Communication',      exchange: 'NASDAQ' },
  { ticker: 'AMZN',  name: 'Amazon.com Inc.',       sector: 'Consumer Cyclical',  exchange: 'NASDAQ' },
  { ticker: 'TSLA',  name: 'Tesla Inc.',            sector: 'Consumer Cyclical',  exchange: 'NASDAQ' },
  { ticker: 'JPM',   name: 'JPMorgan Chase & Co.',  sector: 'Financial Services', exchange: 'NYSE'   },
  { ticker: 'V',     name: 'Visa Inc.',             sector: 'Financial Services', exchange: 'NYSE'   },
  { ticker: 'JNJ',   name: 'Johnson & Johnson',     sector: 'Healthcare',         exchange: 'NYSE'   },
];

/*
  searchCompanies — the function SearchBar calls.

  RIGHT NOW: filters the hardcoded list above, fakes a 150ms network delay.

  WHEN BACKEND IS READY: replace the body only:
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json() as Promise<Company[]>;

  The function name and signature never change, so SearchBar.tsx
  doesn't need to be touched at all.
*/
export async function searchCompanies(query: string): Promise<Company[]> {
  // Simulate network round-trip
  await new Promise((resolve) => setTimeout(resolve, 150));

  if (!query.trim()) return [];

  const q = query.toLowerCase();
  return MOCK_COMPANIES.filter(
    (c) =>
      c.ticker.toLowerCase().startsWith(q) ||
      c.name.toLowerCase().includes(q)
  ).slice(0, 6); // cap at 6 results — same as real search would
}
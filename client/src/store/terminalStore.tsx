// src/store/terminalStore.ts
//
// Global state for the entire app.
// ANY component reads/updates this directly — no prop drilling.
//
// Before Zustand: App.tsx held all state, passed it as props to every child.
// After Zustand:  App.tsx is just layout. Components are self-contained.

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { TimeRange, Company } from '../types';

interface TerminalStore {
  // ── State ──────────────────────────────────────────────────
  ticker:        string;
  companyName:   string;
  selectedRange: TimeRange;
  selectedDate:  Date;
  watchlist:     Company[];

  // ── Actions ────────────────────────────────────────────────
  // Functions that update state. Components call these.
  // Never mutate state directly — always go through actions.
  setTicker:             (ticker: string, companyName: string) => void;
  setSelectedRange:      (range: TimeRange) => void;
  setSelectedDate:       (date: Date) => void;
  addToWatchlist:        (company: Company) => void;
  removeFromWatchlist:   (ticker: string) => void;
}

export const useTerminalStore = create<TerminalStore>()(
  // devtools: inspect state in Redux DevTools Chrome extension
  // https://chromewebstore.google.com/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
  devtools(
    // persist: saves to localStorage so state survives page refresh
    persist(
      (set) => ({
        // ── Initial values ──────────────────────────────────
        ticker:        'AAPL',
        companyName:   'Apple Inc.',
        selectedRange: '1M',
        selectedDate:  new Date(),
        watchlist: [
          { ticker: 'AAPL',  name: 'Apple Inc.',            sector: 'Technology', exchange: 'NASDAQ' },
          { ticker: 'MSFT',  name: 'Microsoft Corporation', sector: 'Technology', exchange: 'NASDAQ' },
          { ticker: 'NVDA',  name: 'NVIDIA Corporation',    sector: 'Technology', exchange: 'NASDAQ' },
        ],

        // ── Action implementations ──────────────────────────
        // Third arg to set() is the label shown in Redux DevTools
        setTicker: (ticker, companyName) =>
          set({ ticker, companyName }, false, 'setTicker'),

        setSelectedRange: (range) =>
          set({ selectedRange: range }, false, 'setSelectedRange'),

        setSelectedDate: (date) =>
          set({ selectedDate: date }, false, 'setSelectedDate'),

        addToWatchlist: (company) =>
          set(
            (state) => ({
              // Don't add duplicates
              watchlist: state.watchlist.find((c) => c.ticker === company.ticker)
                ? state.watchlist
                : [...state.watchlist, company],
            }),
            false,
            'addToWatchlist'
          ),

        removeFromWatchlist: (ticker) =>
          set(
            (state) => ({
              watchlist: state.watchlist.filter((c) => c.ticker !== ticker),
            }),
            false,
            'removeFromWatchlist'
          ),
      }),
      {
        name: 'bloomberg-terminal',
        // Only persist these fields to localStorage.
        // selectedDate is intentionally excluded — "today" should
        // reset when the user opens a new session.
        partialize: (state) => ({
          ticker:        state.ticker,
          companyName:   state.companyName,
          selectedRange: state.selectedRange,
          watchlist:     state.watchlist,
        }),
      }
    )
  )
);
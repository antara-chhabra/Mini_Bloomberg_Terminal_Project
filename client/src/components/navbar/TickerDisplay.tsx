// src/components/navbar/TickerDisplay.tsx
//
// Shows the currently selected company ticker + name in the top-left.
// Reads directly from Zustand — no props needed.
// Re-renders ONLY when ticker or companyName changes in the store.

import { useTerminalStore } from "../../store/terminalStore";

export default function TickerDisplay() {
  // Separate selectors = separate subscriptions.
  // If selectedRange changes in the store, this component does NOT re-render
  // because it doesn't subscribe to selectedRange.
  const ticker = useTerminalStore((s) => s.ticker);
  const companyName = useTerminalStore((s) => s.companyName);

  return (
    <div
      className="flex items-center gap-2 min-w-[160px] border border-white/20 rounded px-3 py-1.5 bg-white/5"
      aria-label={`Current selection: ${ticker}, ${companyName}`}
    >
      {/* Bright green ticker symbol — stands out on the dark background */}
      <span className="text-terminal-positive font-bold text-sm tracking-widest">
        {ticker}
      </span>
      {/* Company name — muted, truncates if it overflows */}
      <span className="text-white/60 text-xs truncate">{companyName}</span>
    </div>
  );
}
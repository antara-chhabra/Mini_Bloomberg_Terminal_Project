// src/utils/formatters.ts
// Pure functions — no React, no side effects. Easy to unit test.

export function formatCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9)  return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6)  return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

// Always show sign (+/-) for financial changes
export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

// ▲/▼ arrow + percent — never use color alone (WCAG requirement)
export function formatChangeWithArrow(value: number): string {
  const arrow = value >= 0 ? '▲' : '▼';
  return `${arrow} ${Math.abs(value).toFixed(2)}%`;
}
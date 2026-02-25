// src/components/layout/Dashboard.tsx
//
// Three-panel layout:
//
//  ┌─────────────┬──────────────────────────────┐
//  │             │                              │
//  │  NewsFeed   │       ChartPanel             │
//  │  (left col) │       (top right)            │
//  │  full       ├──────────────────────────────┤
//  │  height     │                              │
//  │             │     KnowledgeGraph           │
//  │             │     (bottom right)           │
//  └─────────────┴──────────────────────────────┘
//
// CSS approach:
//   Outer = CSS grid, 2 columns: fixed 320px news | flex-1 right side
//   Right side = flex column: ChartPanel (fixed height) | KnowledgeGraph (flex-1)
//   Outer height = 100vh minus navbar (64px) minus vertical padding
//
// All three panels read from Zustand directly — no props passed here.

import NewsFeed      from "../news/NewsFeed";
import ChartPanel    from "../chart/ChartPanel";
import KnowledgeGraph from "../graph/KnowledgeGraph";

export default function Dashboard() {
  return (
    // h-[calc(100vh-64px-2rem)]:
    //   100vh = full screen height
    //   64px  = navbar height
    //   2rem  = top + bottom padding (pt-4 pb-4)
    <div
      className="grid gap-3"
      style={{
        // Left column: fixed 320px for news feed
        // Right column: takes all remaining space
        gridTemplateColumns: "320px 1fr",
        height: "calc(100vh - 64px - 2rem)",
      }}
    >
      {/* ── LEFT: News feed — full height ── */}
      {/* min-h-0 is required: without it, a flex/grid child won't shrink
          below its content size, breaking the overflow scroll inside NewsFeed */}
      <div className="min-h-0">
        <NewsFeed />
      </div>

      {/* ── RIGHT: Chart on top, graph on bottom ── */}
      <div className="flex flex-col gap-3 min-h-0">

        {/* Chart panel — fixed height so graph always has room */}
        {/* h-[440px]: tall enough for price chart + metrics strip */}
        <div className="h-[440px] shrink-0">
          <ChartPanel />
        </div>

        {/* Knowledge graph — takes all remaining vertical space */}
        {/* flex-1 min-h-0: the two key rules that make it fill the gap */}
        <div className="flex-1 min-h-0">
          <KnowledgeGraph />
        </div>
      </div>
    </div>
  );
}
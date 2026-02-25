// src/App.tsx
//
// Root layout. Navbar fixed at top, Dashboard fills the rest of the screen.

import Navbar    from "./components/navbar/Navbar";
import Dashboard from "./components/layout/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-terminal-bg text-white font-mono">

      {/* Fixed navbar — 64px tall */}
      <Navbar />

      {/*
        pt-16 = 64px = exactly the navbar height
        px-4 py-4 = breathing room around the panels
      */}
      <main className="pt-16 px-4 py-4" id="main-content">
        <Dashboard />
      </main>

    </div>
  );
}
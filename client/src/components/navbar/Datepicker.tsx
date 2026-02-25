// src/components/navbar/DatePicker.tsx
//
// Calendar dropdown for selecting a date.
// Ported from your original TopBar.tsx and wired to Zustand instead of props.
//
// Concepts used:
//   useRef + click-outside pattern  → closes calendar when clicking elsewhere
//   date-fns                        → all date math (no moment.js)
//   startPadding math               → aligns days under correct weekday columns

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { clsx } from "clsx";
import { useTerminalStore } from "../../store/terminalStore";

export default function DatePicker() {
  const selectedDate = useTerminalStore((s) => s.selectedDate);
  const setDate = useTerminalStore((s) => s.setSelectedDate);

  // Local state — only DatePicker cares about these
  const [isOpen, setIsOpen] = useState(false);
  // calendarMonth controls which month the calendar is *viewing*,
  // independent of the selected date. So the user can navigate months
  // without changing their selection.
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // ref on the outer wrapper — used for click-outside detection
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Close on outside click ─────────────────────────────────────────────
  // Same pattern as SearchBar: attach a document listener, check if the
  // clicked target is inside our container. If not, close.
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // ── Calendar grid data ─────────────────────────────────────────────────
  // eachDayOfInterval returns an array of Date objects for every day in the month.
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(calendarMonth),
    end: endOfMonth(calendarMonth),
  });

  // ── Start padding ──────────────────────────────────────────────────────
  // Our calendar header order: Mon Tue Wed Thu Fri Sat Sun
  // getDay() returns:          1   2   3   4   5   6   0
  //
  // We want Mon=0, Tue=1 ... Sun=6 so days fall under the right column.
  // Formula: (getDay() + 6) % 7
  //   Monday:   (1 + 6) % 7 = 0  → 0 empty cells before the 1st
  //   Tuesday:  (2 + 6) % 7 = 1  → 1 empty cell
  //   Sunday:   (0 + 6) % 7 = 6  → 6 empty cells
  const startPadding = (startOfMonth(calendarMonth).getDay() + 6) % 7;

  function handleSelectDay(day: Date) {
    setDate(day);       // update global store
    setIsOpen(false);   // close the calendar
  }

  return (
    // relative: the dropdown is positioned relative to this container
    <div className="relative" ref={containerRef}>

      {/* ── Trigger button ── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Open date picker. Selected: ${format(selectedDate, "MMMM dd, yyyy")}`}
        className="
          flex items-center gap-2
          border border-white/15 rounded
          px-3 py-1.5 text-xs text-white/60
          hover:border-white/30 hover:text-white/80
          transition-colors duration-150
        "
      >
        {format(selectedDate, "MMMM dd, yyyy")}
        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
      </button>

      {/* ── Calendar dropdown ── */}
      {isOpen && (
        <div
          className="
            absolute right-0 top-[calc(100%+8px)]
            w-[280px] bg-[#111118]
            border border-white/15 rounded-lg
            p-4 shadow-2xl z-50
          "
          role="dialog"
          aria-label="Date picker calendar"
          aria-modal="false"
        >

          {/* ── Month navigation ── */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCalendarMonth((m) => subMonths(m, 1))}
              aria-label={`Go to ${format(subMonths(calendarMonth, 1), "MMMM yyyy")}`}
              className="p-1 text-white/50 hover:text-white transition-colors rounded hover:bg-white/5"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* aria-live="polite": announces the month name to screen readers when it changes */}
            <span
              className="text-sm text-white font-medium"
              aria-live="polite"
              aria-atomic="true"
            >
              {format(calendarMonth, "MMM yyyy")}
            </span>

            <button
              onClick={() => setCalendarMonth((m) => addMonths(m, 1))}
              aria-label={`Go to ${format(addMonths(calendarMonth, 1), "MMMM yyyy")}`}
              className="p-1 text-white/50 hover:text-white transition-colors rounded hover:bg-white/5"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* ── Weekday headers ── */}
          <div className="grid grid-cols-7 mb-2" role="row">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div
                key={d}
                role="columnheader"
                aria-label={d}
                className="text-center text-[10px] text-white/30 pb-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* ── Day grid ── */}
          <div className="grid grid-cols-7 gap-y-1" role="grid">

            {/* Empty cells to push the first day under the right weekday column */}
            {Array.from({ length: startPadding }).map((_, i) => (
              <div key={`pad-${i}`} role="gridcell" aria-hidden="true" />
            ))}

            {daysInMonth.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, calendarMonth);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleSelectDay(day)}
                  // Full date for screen readers — they read "February 24 2026"
                  aria-label={format(day, "MMMM d, yyyy")}
                  aria-pressed={isSelected}
                  aria-current={isSelected ? "date" : undefined}
                  role="gridcell"
                  className={clsx(
                    "text-center text-xs py-1.5 rounded transition-all",
                    isSelected
                      ? "bg-terminal-positive text-black font-bold"
                      : isCurrentMonth
                      ? "text-white/70 hover:bg-white/10"
                      : "text-white/20"
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
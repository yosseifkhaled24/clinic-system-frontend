"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed-cadence polling that pauses while the browser tab is hidden.
 *
 * Phase 1 performance optimization: background tabs no longer keep the
 * API busy. The interval stops on `visibilitychange` → hidden and
 * restarts when the tab becomes visible again, firing ONE catch-up tick
 * so stale data refreshes immediately on return.
 *
 * Guarantees owned by this hook:
 *  - No tick on mount: callers keep their own initial-load effect, so
 *    the first data request still happens exactly as before.
 *  - While visible: the interval runs every `intervalMs` with the exact
 *    callback the caller passed (refresh behavior is unchanged).
 *  - Overlap guard: if the previous tick has not settled yet, the next
 *    tick is skipped — no stacked requests.
 *  - The tick is read through a ref, so callers may pass a fresh
 *    closure every render without resetting the interval.
 *  - The interval and the visibilitychange listener are fully removed
 *    on unmount.
 *
 * Callers keep owning error handling: a rejected tick never breaks the
 * loop and never surfaces here (each page already swallows background
 * refresh failures exactly as before).
 */
export function useVisibilityPoll(
  tick: () => unknown,
  intervalMs: number
): void {
  const tickRef = useRef(tick);

  // Always invoke the latest closure without re-creating the interval.
  useEffect(() => {
    tickRef.current = tick;
  });

  useEffect(() => {
    let intervalId: number | null = null;
    let inFlight = false;
    let disposed = false;

    const runTick = () => {
      // Never overlap requests: skip this tick while one is pending.
      if (inFlight || disposed) return;

      inFlight = true;

      void (async () => {
        try {
          await tickRef.current();
        } catch {
          // Pages handle their own refresh errors; polling must go on.
        } finally {
          inFlight = false;
        }
      })();
    };

    const startInterval = () => {
      if (disposed || intervalId !== null) return;
      if (document.visibilityState === "hidden") return;

      intervalId = window.setInterval(runTick, intervalMs);
    };

    const stopInterval = () => {
      if (intervalId === null) return;

      window.clearInterval(intervalId);
      intervalId = null;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Tab hidden → pause polling entirely.
        stopInterval();
        return;
      }

      // Tab visible again → one catch-up refresh, then resume cadence.
      runTick();
      startInterval();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Start only while the tab is visible; no immediate tick on mount.
    startInterval();

    return () => {
      disposed = true;
      stopInterval();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [intervalMs]);
}

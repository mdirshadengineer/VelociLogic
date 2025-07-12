import { ExecutionPhase } from "@prisma/client";
import { endOfMonth, intervalToDuration, startOfMonth } from "date-fns";
import { AppNode, Period } from "src/lib/types";
import { TaskRegistry } from "./workflow/task/registry";

/**
 * Waits for the specified number of milliseconds.
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the delay
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Converts two dates to a human-readable duration string (e.g., '1h 2m 3s').
 * @param end - End date
 * @param start - Start date
 * @returns Duration string or null if invalid
 */
export function datesToDurationString(
  end: Date | null | undefined,
  start: Date | null | undefined,
): string | null {
  if (!start || !end) return null;

  const timeElapsed = end.getTime() - start.getTime();
  if (timeElapsed < 1000) {
    return `${timeElapsed} ms`;
  }

  // intervalToDuration does not account for values under one second
  const duration = intervalToDuration({
    start: 0,
    end: timeElapsed,
  });

  return `${duration.hours || 0}h ${duration.minutes || 0}m ${
    duration.seconds || 0
  }s`;
}

/**
 * Calculates the total credits consumed by all phases.
 * @param phases - Array of phases with creditsConsumed
 * @returns Total credits consumed
 */
type Phase = Pick<ExecutionPhase, "creditsConsumed">;
export function getPhasesTotalCost(phases: Phase[]): number {
  return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
}

/**
 * Calculates the total workflow cost based on node credits.
 * @param nodes - Array of AppNode
 * @returns Total credits required for the workflow
 */
export function calculateWorkflowCost(nodes: AppNode[]): number {
  return nodes.reduce((acc, node) => {
    return acc + TaskRegistry[node.data.type].credits;
  }, 0);
}

/**
 * Returns the full app URL for a given path.
 * @param path - Path to append to the app URL
 * @returns Full URL string
 */
export function getAppUrl(path: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return `${appUrl}/${path}`;
}

/**
 * Converts a period (year, month) to a date range (start and end of month).
 * @param period - Period object with year and month
 * @returns Object with startDate and endDate
 */
export function periodToDateRange(period: Period) {
  const startDate = startOfMonth(new Date(period.year, period.month));
  const endDate = endOfMonth(new Date(period.year, period.month));

  return { startDate, endDate };
}

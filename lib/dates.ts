/**
 * Clinic-local date helpers (D6).
 *
 * The backend anchors "today" and clinic-day logic to Africa/Cairo. Date
 * math that relies on `new Date().toISOString()` is UTC-based, which
 * disagrees with Cairo for part of every day: between local midnight and
 * 03:00 Cairo the UTC date is still "yesterday". That made the booking
 * min-date and the dashboard's isToday flip a day early.
 *
 * These helpers format dates in Africa/Cairo using Intl.DateTimeFormat,
 * which the browser resolves with its full tz database (including Egypt's
 * reintroduced DST), so no offset is hardcoded.
 */

const CAIRO_TZ = "Africa/Cairo";

/** Today's date in Cairo, as YYYY-MM-DD. */
export function cairoToday(): string {
  return cairoDateString(new Date());
}

/** Format any Date as YYYY-MM-DD in Cairo local time. */
export function cairoDateString(date: Date): string {
  // en-CA renders dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CAIRO_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Whether a YYYY-MM-DD (or YYYY-MM-DDTHH:MM:SS...) string is Cairo's
 * today. Compares date prefixes, so a raw date-only value is safe.
 */
export function isCairoToday(date: string): boolean {
  return date.startsWith(cairoToday());
}

/**
 * Parse a date-only value (YYYY-MM-DD) into a LOCAL date at midnight.
 *
 * `new Date("2026-11-01")` is parsed as UTC midnight, so formatting it
 * in a UTC-negative timezone renders the previous calendar day. A
 * date-only value is a calendar date, not an instant, so it is built
 * from its parts in local time to keep the day stable everywhere.
 */
export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * GET /api/doctors/{doctor}/availability — the Smart Booking contract.
 *
 * One entry per calendar day in the requested window. `date`/`from`/`to`
 * are plain YYYY-MM-DD clinic-local (Africa/Cairo) date strings, exactly
 * like `appointment_date` on every other appointment payload.
 */
export interface AvailabilityDay {
  /** YYYY-MM-DD, clinic-local (Africa/Cairo). */
  date: string;

  /** English weekday name, e.g. "Sunday" (matches the schedules enum). */
  day: string;

  /** Before today (Cairo) — reported, never bookable. */
  is_past: boolean;

  /** The doctor has an available schedule row for this weekday. */
  is_working_day: boolean;

  /** "HH:MM:SS" working-hours boundaries; null on non-working days. */
  start_time: string | null;
  end_time: string | null;

  /** Daily capacity; null on non-working days. */
  max_patients: number | null;

  /** ACTIVE appointments that hold a slot (cancelled/no_show excluded). */
  booked: number;

  /** max_patients - booked, never negative; 0 on non-working days. */
  remaining: number;

  /** working && !past && remaining > 0 — what the date picker enables. */
  is_bookable: boolean;
}

export interface DoctorAvailability {
  doctor: {
    id: number;
    name: string;
    specialty?: string | null;
  };

  /** YYYY-MM-DD window actually reported. */
  from: string;
  to: string;

  days: AvailabilityDay[];
}

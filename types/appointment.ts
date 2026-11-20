export type PaymentMethod =
  | "cash"
  | "visa"
  | "insurance"
  | "stripe"
  | "instapay"
  | "vodafone_cash";

export interface Appointment {
  id: number;

  doctor: {
    id: number;
    name: string;
    specialty?: string | null;
  };

  service: {
    id: number;
    name: string;
    price: number;
  };

  patient: {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
  };

  // 👇 أضف الجزء ده
  payment: {
    status: "paid" | "unpaid";
    method: string | null;
    paid_at: string | null;
  };

  queue_number: number;

  appointment_date: string;

  status:
    | "pending"
    | "arrived"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";

  notes?: string | null;

  // C: set by the end-of-day cleanup when a COMPLETED appointment was
  // never paid. Additive optional field — older responses may omit it.
  needs_investigation?: boolean;

  created_at?: string | null;

  updated_at?: string | null;
}

export interface AppointmentCreatePayload {
  doctor_id: number;

  service_id: number;

  appointment_date: string;

  status?:
    | "pending"
    | "arrived"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";

  notes?: string;

  patient_id?: number;

  name?: string;

  phone?: string;

  email?: string;

  gender?: "male" | "female";
}

export interface AppointmentCreateResponse {
  message: string;

  queue_number: number;

  data: Appointment;
}

export interface AppointmentStatusPayload {
  status:
    | "pending"
    | "arrived"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
}

export interface AppointmentCompleteResponse {
  message: string;
  data: Appointment;
}

/**
 * One page of GET /api/appointments (Phase 2 — server-side pagination).
 *
 * The endpoint always answers with this envelope: `data` holds only the
 * rows of `current_page`, never the whole result set, so a screen must
 * take its counts from `total` / `last_page` instead of `data.length`.
 */
export interface AppointmentsPage {
  data: Appointment[];

  current_page: number;
  per_page: number;
  total: number;
  last_page: number;

  // Row numbers of this page; null when the page is empty.
  from: number | null;
  to: number | null;

  // Navigation metadata emitted by the backend.
  path: string;
  prev_page_url: string | null;
  next_page_url: string | null;
}

/**
 * Query accepted by GET /api/appointments.
 *
 * `page` defaults to 1, `per_page` defaults to 15 and is capped at 50
 * (larger values are rejected with 422). `search` matches a substring of
 * the patient name, doctor name or status; `status` matches one of
 * pending | arrived | in_progress | completed | cancelled | no_show;
 * `date` (optional, YYYY-MM-DD) narrows the rows to ONE calendar day —
 * purely additive, so callers that omit it keep the exact rows they had
 * before (A2/F-02).
 */
export interface AppointmentsPageParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: Appointment["status"];
  date?: string;
}

/**
 * One row of GET /api/appointments/recent (Part C — the dashboard's
 * "new bookings" toast feed).
 *
 * Deliberately minimal: only the names the dashboard already renders.
 * No phone, no email, no notes, no payment data.
 */
export interface RecentAppointment {
  id: number;
  created_at: string;
  patient_name: string | null;
  doctor_name: string | null;
}

/**
 * Response envelope of GET /api/appointments/recent.
 *
 * `data` holds only the rows NEWER than the `after_id` cursor the client
 * sent (id ASC, capped at 20); `latest_id` is the true MAX(id) and is
 * what a baseline (cursor-less) call returns so the first poll never
 * presents pre-existing bookings as new.
 */
export interface RecentAppointmentsResponse {
  data: RecentAppointment[];
  latest_id: number;
}
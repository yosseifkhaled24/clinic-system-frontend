import api from "@/lib/axios";
import type {
  Appointment,
  AppointmentCompleteResponse,
  AppointmentCreatePayload,
  AppointmentCreateResponse,
  AppointmentsPage,
  AppointmentsPageParams,
  PaymentMethod,
  RecentAppointmentsResponse,
} from "@/types/appointment";
import { unwrapResponse } from "./response";

/**
 * Phase 2 — server-side pagination limits.
 *
 * GET /api/appointments is paginated now (15 rows by default, hard cap
 * 50), so a complete list is walked in 50-row steps. The page cap bounds
 * that walk: 100 pages × 50 rows = 5 000 rows — far beyond any realistic
 * clinic history, and it keeps a pathological dataset from turning one
 * page load into thousands of requests.
 */
const COMPLETE_HISTORY_PAGE_SIZE = 50;
const MAX_COMPLETE_PAGES = 100;

/**
 * The single place that talks to the paginated index.
 *
 * Deliberately NOT unwrapResponse(): that helper strips a `{ data: ... }`
 * wrapper, and the pagination envelope's own `data` key IS the page —
 * unwrapping it would throw away total / last_page / the nav URLs.
 */
async function fetchAppointmentsPage(
  params: AppointmentsPageParams = {}
): Promise<AppointmentsPage> {
  const response = await api.get("/appointments", {
    params: {
      ...params,
      // An empty search means "no filter" — never send it as `search=`.
      search: params.search?.trim() || undefined,
      // `date` (A2/F-02) is an optional Y-m-d day filter; when absent
      // it stays undefined and axios omits it entirely, so the server
      // answers the exact pre-Phase-0 contract.
      date: params.date || undefined,
    },
  });

  return response.data as AppointmentsPage;
}

export const appointmentsService = {
  /**
   * ONE page of appointments, exactly as the server sliced it.
   *
   * Use this wherever a screen renders a bounded list (the admin table,
   * the dashboard's "latest five"). Counts come from `total` — never
   * from `data.length`, which only knows about this page's rows.
   */
  async getPage(params: AppointmentsPageParams = {}): Promise<AppointmentsPage> {
    return fetchAppointmentsPage(params);
  },

  /**
   * The COMPLETE list of appointments the caller may see.
   *
   * The index is paginated now, so a single request would silently hand
   * a patient only their first 15 appointments. This walks every page
   * instead, which keeps the patient surfaces ("My Appointments",
   * Profile) showing the full history they always did — including every
   * row the review gate inspects.
   */
  async getAll(): Promise<Appointment[]> {
    const appointments: Appointment[] = [];

    for (let page = 1; page <= MAX_COMPLETE_PAGES; page += 1) {
      const result = await fetchAppointmentsPage({
        page,
        per_page: COMPLETE_HISTORY_PAGE_SIZE,
      });

      appointments.push(...result.data);

      if (page >= result.last_page) {
        break;
      }
    }

    return appointments;
  },

  async getById(id: number) {
    const response = await api.get(`/appointments/${id}`);
    return unwrapResponse<Appointment>(response);
  },

  async create(payload: AppointmentCreatePayload) {
    const response = await api.post("/appointments", payload);
    return unwrapResponse<AppointmentCreateResponse>(response);
  },

  async update(id: number, payload: AppointmentCreatePayload) {
    const response = await api.patch(`/appointments/${id}`, payload);
    return unwrapResponse<Appointment>(response);
  },

  async updateStatus(id: number, status: string) {
    const response = await api.patch(`/appointments/${id}/status`, {
      status,
    });

    return unwrapResponse(response);
  },
  async updatePayment(id: number, paymentMethod: PaymentMethod) {
    const response = await api.patch(`/appointments/${id}/payment`, {
      payment_method: paymentMethod,
    });
    return unwrapResponse(response);
  },

  /**
   * A/B: complete + payment in ONE request (the backend records the
   * payment and marks the appointment completed atomically). Omit the
   * method when the appointment is already paid (e.g. Stripe online).
   */
  async complete(id: number, paymentMethod?: PaymentMethod | null) {
    const response = await api.patch(
      `/appointments/${id}/complete`,
      paymentMethod ? { payment_method: paymentMethod } : {}
    );
    return unwrapResponse<AppointmentCompleteResponse>(response);
  },

  async delete(id: number) {
    const response = await api.delete(`/appointments/${id}`);
    return unwrapResponse(response);
  },

  /**
   * Part C — the admin-only "new bookings" feed behind the dashboard
   * toast (GET /api/appointments/recent).
   *
   * Deliberately NOT unwrapResponse(): that helper would strip the
   * envelope's own `data` key and throw away `latest_id`, which the
   * dashboard needs as its baseline cursor. Omit `afterId` for the
   * baseline call (answers an empty `data` + the current `latest_id`,
   * so pre-existing bookings are never toasted as "new"); pass the
   * last-seen id afterwards to receive only rows booked since.
   *
   * Admin-only: a non-admin token answers 403 (the dashboard polls
   * only while the caller is an admin — see the dashboard page).
   */
  async getRecent(afterId?: number): Promise<RecentAppointmentsResponse> {
    const response = await api.get("/appointments/recent", {
      params: afterId === undefined ? {} : { after_id: afterId },
    });

    return response.data as RecentAppointmentsResponse;
  },
};
import api from "@/lib/axios";
import type { DoctorAvailability } from "@/types/availability";
import { unwrapResponse } from "./response";

export const availabilityService = {
  /**
   * Public per-day working/capacity report for one doctor (Smart
   * Booking). The backend is the authority: it mirrors the exact rules
   * the booking endpoint enforces (working day = available schedule
   * row, booked = ACTIVE appointments only, Africa/Cairo "today"), so
   * what this endpoint shows and what POST /appointments accepts can
   * never disagree.
   *
   * Defaults (backend-side): from = today, to = from + 29 days,
   * hard-capped at a 62-day window.
   */
  async getByDoctor(
    doctorId: number,
    params?: { from?: string; to?: string }
  ) {
    const response = await api.get(
      `/doctors/${doctorId}/availability`,
      { params }
    );

    // Bare payload — no {data} wrapper — unwrapResponse returns it as-is.
    return unwrapResponse<DoctorAvailability>(response);
  },
};

import api from "@/lib/axios";
import type { Appointment, AppointmentCreatePayload, AppointmentCreateResponse } from "@/types/appointment";
import { unwrapCollection, unwrapResponse } from "./response";

export const appointmentsService = {
  async getAll() {
    const response = await api.get("/appointments");
    return unwrapCollection<Appointment>(response);
  },

  async create(payload: AppointmentCreatePayload) {
    const response = await api.post("/appointments", payload);
    return unwrapResponse<AppointmentCreateResponse>(response);
  },

  async updateStatus(id: number, status: string) {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return unwrapResponse(response);
  },
};

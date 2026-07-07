import api from "@/lib/axios";
import type { Appointment } from "@/types/appointment";

function unwrapResponse<T>(response: { data: T | { data: T } }) {
  return (response?.data && typeof response.data === "object" && "data" in response.data && response.data.data !== undefined
    ? (response.data as { data: T }).data
    : response.data) as T;
}

export const appointmentsService = {
  async getAll() {
    const response = await api.get("/appointments");
    return unwrapResponse<Appointment[]>(response);
  },

  async create(payload: Partial<Appointment> & { doctor_id?: number; appointment_date?: string; notes?: string }) {
    const response = await api.post("/appointments", payload);
    return unwrapResponse<Appointment>(response);
  },

  async updateStatus(id: number, status: string) {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return unwrapResponse(response);
  },
};

import api from "@/lib/axios";
import type { Doctor } from "@/types/doctor";

function unwrapResponse<T>(response: { data: T | { data: T } }) {
  return (response?.data && typeof response.data === "object" && "data" in response.data && response.data.data !== undefined
    ? (response.data as { data: T }).data
    : response.data) as T;
}

export const doctorsService = {
  async getAll() {
    const response = await api.get("/doctors");
    return unwrapResponse<{ data: Doctor[] } | Doctor[]>(response);
  },

  async getById(id: number) {
    const response = await api.get(`/doctors/${id}`);
    return unwrapResponse<Doctor>(response);
  },

  async create(payload: Partial<Doctor>) {
    const response = await api.post("/doctors", payload);
    return unwrapResponse<Doctor>(response);
  },

  async update(id: number, payload: Partial<Doctor>) {
    const response = await api.patch(`/doctors/${id}`, payload);
    return unwrapResponse<Doctor>(response);
  },

  async delete(id: number) {
    const response = await api.delete(`/doctors/${id}`);
    return unwrapResponse(response);
  },
};

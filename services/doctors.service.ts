import api from "@/lib/axios";
import type { Doctor } from "@/types/doctor";
import { unwrapCollection, unwrapResponse } from "./response";

export const doctorsService = {
  async getAll() {
    const response = await api.get("/doctors");
    return unwrapCollection<Doctor>(response);
  },

  async getById(id: number) {
    const response = await api.get(`/doctors/${id}`);
    return unwrapResponse<Doctor>(response);
  },

  async create(payload: Partial<Doctor> | FormData) {
    const response = await api.post("/doctors", payload);
    return unwrapResponse<Doctor>(response);
  },

async update(id: number, payload: Partial<Doctor> | FormData) {
  if (payload instanceof FormData) {
    payload.append("_method", "PATCH");
  }

  const response = await api.post(`/doctors/${id}`, payload);

  return unwrapResponse<Doctor>(response);
},

  async delete(id: number) {
    const response = await api.delete(`/doctors/${id}`);
    return unwrapResponse(response);
  },
};

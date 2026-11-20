import api from "@/lib/axios";
import type { Specialty } from "@/types/specialty";
import { unwrapCollection, unwrapResponse } from "./response";

export const specialtiesService = {
  async getAll() {
    const response = await api.get("/specialties");
    return unwrapCollection<Specialty>(response);
  },

  async getById(id: number) {
    const response = await api.get(`/specialties/${id}`);
    return unwrapResponse<Specialty>(response);
  },

  async create(payload: Partial<Specialty>) {
    const response = await api.post("/specialties", payload);
    return unwrapResponse<Specialty>(response);
  },

  async update(id: number, payload: Partial<Specialty>) {
    const response = await api.patch(`/specialties/${id}`, payload);
    return unwrapResponse<Specialty>(response);
  },

  async delete(id: number) {
    const response = await api.delete(`/specialties/${id}`);
    return unwrapResponse(response);
  },
};

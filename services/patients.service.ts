import api from "@/lib/axios";
import type { Patient } from "@/types/patient";
import { unwrapCollection, unwrapResponse } from "./response";

export const patientsService = {
  async getAll() {
    const response = await api.get("/patients");
    return unwrapCollection<Patient>(response);
  },

  async search(query: string) {
    const response = await api.get(`/patients/search?query=${encodeURIComponent(query)}`);
    return unwrapCollection<Patient>(response);
  },

  async create(data: Partial<Patient>) {
    const response = await api.post("/patients", data);
    return unwrapResponse<Patient>(response);
  },

  async update(id: number, data: Partial<Patient>) {
    const response = await api.put(`/patients/${id}`, data);
    return unwrapResponse<Patient>(response);
  },

  async delete(id: number) {
    const response = await api.delete(`/patients/${id}`);
    return unwrapResponse(response);
  },
};

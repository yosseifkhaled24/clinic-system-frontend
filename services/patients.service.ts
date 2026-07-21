import api from "@/lib/axios";
import type { Patient } from "@/types/patient";
import { unwrapCollection, unwrapResponse } from "./response";
import type { PatientHistoryResponse } from "@/types/patient-history";

export const patientsService = {
  async getAll() {
    const response = await api.get("/patients");
    return unwrapCollection<Patient>(response);
  },

  async getById(id: number) {
    const response = await api.get(`/patients/${id}`);
    return unwrapResponse<Patient>(response);
  },

  async search(query: string) {
    const response = await api.get("/patients/search", {
      params: { query },
    });

    return unwrapCollection<Patient>(response);
  },

  async update(id: number, payload: Partial<Patient>) {
    const response = await api.patch(`/patients/${id}`, payload);
    return unwrapResponse<Patient>(response);
  },
  async getHistory(id: number) {
  const response = await api.get(`/patients/${id}/history`);
  return unwrapResponse<PatientHistoryResponse>(response);
},

  async delete(id: number) {
    const response = await api.delete(`/patients/${id}`);
    return unwrapResponse(response);
  },
};
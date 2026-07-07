import api from "@/lib/axios";
import type { Patient } from "@/types/patient";

function unwrapResponse<T>(response: { data: T | { data: T } }) {
  return (response?.data && typeof response.data === "object" && "data" in response.data && response.data.data !== undefined
    ? (response.data as { data: T }).data
    : response.data) as T;
}

export const patientsService = {
  async getAll() {
    const response = await api.get("/patients");
    return unwrapResponse<Patient[]>(response);
  },

  async search(query: string) {
    const response = await api.get(`/patients/search?q=${encodeURIComponent(query)}`);
    return unwrapResponse<Patient[]>(response);
  },
};

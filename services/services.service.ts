import api from "@/lib/axios";
import type { ServiceItem } from "@/types/service";

function unwrapResponse<T>(response: { data: T | { data: T } }) {
  return (response?.data && typeof response.data === "object" && "data" in response.data && response.data.data !== undefined
    ? (response.data as { data: T }).data
    : response.data) as T;
}

export const servicesService = {
  async getAll() {
    const response = await api.get("/services");
    return unwrapResponse<ServiceItem[]>(response);
  },

  async getById(id: number) {
    const response = await api.get(`/services/${id}`);
    return unwrapResponse<ServiceItem>(response);
  },

  async create(payload: Partial<ServiceItem>) {
    const response = await api.post("/services", payload);
    return unwrapResponse<ServiceItem>(response);
  },
};

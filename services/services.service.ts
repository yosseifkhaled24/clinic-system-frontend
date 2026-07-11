import api from "@/lib/axios";
import type { ServiceItem } from "@/types/service";
import { unwrapCollection, unwrapResponse } from "./response";

export const servicesService = {
  async getAll() {
    const response = await api.get("/services");
    return unwrapCollection<ServiceItem>(response);
  },

  async getById(id: number) {
    const response = await api.get(`/services/${id}`);
    return unwrapResponse<ServiceItem>(response);
  },

  async create(payload: Partial<ServiceItem> | FormData) {
    const response = await api.post("/services", payload);
    return unwrapResponse<ServiceItem>(response);
  },

  async update(id: number, payload: Partial<ServiceItem> | FormData) {
    const response = await api.patch(`/services/${id}`, payload);
    return unwrapResponse<ServiceItem>(response);
  },

  async delete(id: number) {
    const response = await api.delete(`/services/${id}`);
    return unwrapResponse(response);
  },
};

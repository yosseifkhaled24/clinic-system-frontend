import api from "@/lib/axios";
import type { Service } from "@/types/service";
import { unwrapCollection, unwrapResponse } from "./response";

export const servicesService = {
  async getAll() {
    const response = await api.get("/services");
    return unwrapCollection<Service>(response);
  },

  async getById(id: number) {
    const response = await api.get(`/services/${id}`);
    return unwrapResponse<Service>(response);
  },

  async create(payload: Partial<Service> | FormData) {
    const response = await api.post("/services", payload);
    return unwrapResponse<Service>(response);
  },

 async update(id: number, payload: Partial<Service> | FormData) {
  if (payload instanceof FormData) {
    payload.append("_method", "PATCH");

    const response = await api.post(`/services/${id}`, payload);

    return unwrapResponse<Service>(response);
  }

  const response = await api.patch(`/services/${id}`, payload);

  return unwrapResponse<Service>(response);
},

  async delete(id: number) {
    const response = await api.delete(`/services/${id}`);
    return unwrapResponse(response);
  },
};
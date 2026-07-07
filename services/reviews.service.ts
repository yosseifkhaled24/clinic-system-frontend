import api from "@/lib/axios";
import type { Review } from "@/types/review";

function unwrapResponse<T>(response: { data: T | { data: T } }) {
  return (response?.data && typeof response.data === "object" && "data" in response.data && response.data.data !== undefined
    ? (response.data as { data: T }).data
    : response.data) as T;
}

export const reviewsService = {
  async getAll() {
    const response = await api.get("/reviews");
    return unwrapResponse<Review[]>(response);
  },

  async getById(id: number) {
    const response = await api.get(`/reviews/${id}`);
    return unwrapResponse<Review>(response);
  },

  async create(payload: Partial<Review>) {
    const response = await api.post("/reviews", payload);
    return unwrapResponse<Review>(response);
  },
};

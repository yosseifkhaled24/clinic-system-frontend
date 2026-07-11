import api from "@/lib/axios";
import type { Review, ReviewCreatePayload } from "@/types/review";
import { unwrapCollection, unwrapResponse } from "./response";

export const reviewsService = {
  async getAll() {
    const response = await api.get("/reviews");
    return unwrapCollection<Review>(response);
  },

  async getById(id: number) {
    const response = await api.get(`/reviews/${id}`);
    return unwrapResponse<Review>(response);
  },

  async create(payload: ReviewCreatePayload) {
    const response = await api.post("/reviews", payload);
    return unwrapResponse<Review>(response);
  },
};

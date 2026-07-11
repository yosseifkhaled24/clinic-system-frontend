import api from "@/lib/axios";
import type { AuthUser } from "@/types/auth";
import { unwrapResponse } from "./response";

export const profileService = {
  async getProfile() {
    const response = await api.get("/user");
    return unwrapResponse<AuthUser>(response);
  },
};

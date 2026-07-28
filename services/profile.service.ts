import api from "@/lib/axios";
import type { AuthUser } from "@/types/auth";
import { unwrapResponse } from "./response";

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const profileService = {
  async getProfile() {
    const response = await api.get("/user");
    return unwrapResponse<AuthUser>(response);
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const response = await api.patch("/user", payload);
    return unwrapResponse<AuthUser>(response);
  },

  async changePassword(payload: ChangePasswordPayload) {
    const response = await api.patch("/user/password", payload);
    return unwrapResponse<{ message: string }>(response);
  },
};

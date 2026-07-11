import api from "@/lib/axios";
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from "@/types/auth";
import { unwrapResponse } from "./response";

export const authService = {
  async login(payload: LoginPayload) {
    const response = await api.post("/login", payload);
    return unwrapResponse<AuthResponse>(response);
  },

  async register(payload: RegisterPayload) {
    const response = await api.post("/register", payload);
    return unwrapResponse<AuthResponse>(response);
  },

  async getUser() {
    const response = await api.get("/user");
    return unwrapResponse<AuthUser>(response);
  },

  async logout() {
    const response = await api.post("/logout");
    return unwrapResponse<{ message: string }>(response);
  },
};

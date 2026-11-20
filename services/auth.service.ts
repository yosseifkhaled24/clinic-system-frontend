import api from "@/lib/axios";
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
} from "@/types/auth";
import { unwrapResponse } from "./response";

export const authService = {
  async login(payload: LoginPayload) {
    const response = await api.post("/login", payload);
    return unwrapResponse<AuthResponse>(response);
  },

  /**
   * SEC-03: registration creates an UNVERIFIED account and issues no
   * token — there is no session to establish until the email address is
   * confirmed. `notification_sent` tells the UI whether the
   * verification email actually left the mail service.
   */
  async register(payload: RegisterPayload) {
    const response = await api.post("/register", payload);
    return unwrapResponse<RegisterResponse>(response);
  },

  /**
   * SEC-03/SEC-04: resend the verification email. Public but
   * credential-gated (email + password) so only the account owner can
   * trigger a send, and throttled per identity + IP. The backend
   * answers the same uniform 202 for every outcome (no enumeration).
   */
  async resendVerification(payload: LoginPayload) {
    const response = await api.post("/email/verification-notification", payload);
    return unwrapResponse<{ message: string }>(response);
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

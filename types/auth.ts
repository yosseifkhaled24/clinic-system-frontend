export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

/**
 * SEC-03: registration no longer issues a token. The response reports
 * whether the verification email was actually dispatched so the UI can
 * show an honest state (and offer a resend when it was not).
 */
export interface RegisterResponse {
  message: string;
  verification_required?: boolean;
  notification_sent?: boolean;
  user?: AuthUser;
}

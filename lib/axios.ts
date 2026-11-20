import axios from "axios";

// Base URL of the Laravel API. Exported so pages that must navigate to a
// raw signed endpoint (email verification) can rebuild byte-identical
// URLs to the ones the backend signed.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // SEC-19 (Option A — approved): the Bearer token intentionally lives in
  // localStorage; we do NOT migrate to HttpOnly cookies (that would
  // require a session/CSRF/CORS-credentials architecture change and
  // would break Android/Capacitor compatibility).
  //
  // Residual risk: any XSS on the page could read this token. Accepted
  // mitigations:
  //  - 30-day token expiry (Sanctum config, SEC-14) bounds exposure;
  //  - one-active-token-per-user: a fresh login revokes the old token;
  //  - the 401 interceptor below clears a rejected/expired token;
  //  - strict-ish CSP is deployed in Report-Only (SEC-17) with the goal
  //    of later enforcement, plus the existing X-Frame-Options /
  //    nosniff / Referrer-Policy headers.
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Locale for the backend's language-aware responses (Part B: the
    // booking confirmation e-mail is rendered in the language the UI is
    // showing). LanguageContext persists the choice under "language";
    // anything other than the supported pair falls back to the server's
    // default, so no header is sent rather than a bogus one.
    const language = localStorage.getItem("language");

    if (language === "en" || language === "ar") {
      config.headers["Accept-Language"] = language;
    }
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error?.response?.status === 401
    ) {
      localStorage.removeItem("token");
      // Only redirect if not already on an auth page
      if (
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
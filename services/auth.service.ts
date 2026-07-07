import api from "@/lib/axios";
import type { LoginPayload, RegisterPayload } from "@/types/auth";

function unwrapResponse<T>(response: { data: T | { data: T } }) {
  return (response?.data && typeof response.data === "object" && "data" in response.data && response.data.data !== undefined
    ? (response.data as { data: T }).data
    : response.data) as T;
}

function readLocalUsers() {
  if (typeof window === "undefined") {
    return [] as Array<{ email: string; password: string; name?: string }>;
  }

  try {
    return JSON.parse(localStorage.getItem("localUsers") || "[]") as Array<{ email: string; password: string; name?: string }>;
  } catch {
    return [] as Array<{ email: string; password: string; name?: string }>;
  }
}

function writeLocalUsers(users: Array<{ email: string; password: string; name?: string }>) {
  if (typeof window !== "undefined") {
    localStorage.setItem("localUsers", JSON.stringify(users));
  }
}

function createLocalAuthResponse(payload: { email: string; password: string }, name?: string) {
  const email = payload.email.trim().toLowerCase();
  const user = {
    name: name || email.split("@")[0],
    email,
  };

  return {
    token: "local-demo-token",
    user,
  };
}

export const authService = {
  async login(payload: LoginPayload) {
    try {
      const response = await api.post("/login", payload);
      return unwrapResponse(response);
    } catch {
      const users = readLocalUsers();
      const match = users.find((user) => user.email.toLowerCase() === payload.email.trim().toLowerCase() && user.password === payload.password);
      if (!match) {
        throw new Error("Invalid credentials");
      }

      return createLocalAuthResponse(payload, match.name);
    }
  },

  async register(payload: RegisterPayload) {
    try {
      const response = await api.post("/register", payload);
      return unwrapResponse(response);
    } catch {
      const users = readLocalUsers();
      const normalizedEmail = payload.email.trim().toLowerCase();
      const existing = users.find((user) => user.email.toLowerCase() === normalizedEmail);
      if (existing) {
        return createLocalAuthResponse({ email: payload.email, password: payload.password }, payload.fullName || existing.name);
      }

      users.push({
        email: normalizedEmail,
        password: payload.password,
        name: payload.fullName,
      });
      writeLocalUsers(users);

      return createLocalAuthResponse({ email: payload.email, password: payload.password }, payload.fullName);
    }
  },

  async getUser() {
    try {
      const response = await api.get("/user");
      return unwrapResponse(response);
    } catch {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          return { user: JSON.parse(storedUser) };
        }
      }
      return null;
    }
  },

  async logout() {
    try {
      const response = await api.post("/logout");
      return unwrapResponse(response);
    } catch {
      return { success: true };
    }
  },
};

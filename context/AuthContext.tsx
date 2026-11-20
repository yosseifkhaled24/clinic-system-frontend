"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/auth.service";
import type { AuthUser, RegisterResponse } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, phone: string, email: string, password: string) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/*
 * SEC-19 (Option A — approved decision): the auth Bearer token is stored
 * in localStorage ("token") and attached to requests by lib/axios.ts.
 * We deliberately keep this architecture instead of migrating to
 * HttpOnly cookies: the API is stateless Bearer-based (no session/CSRF
 * pipeline) and the Android/Capacitor build (capacitor.config.ts serves
 * bundled assets) depends on localStorage.
 *
 * Residual risk: an XSS payload could steal the token. Mitigations in
 * place: 30-day token expiration (Sanctum, SEC-14), one-active-token-
 * per-user on login, automatic removal of rejected tokens on 401, and
 * the security headers + Report-Only CSP deployed in SEC-17. Enforcing
 * a strict CSP (nonces instead of 'unsafe-inline') is the follow-up
 * that would further reduce this risk.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return Boolean(localStorage.getItem("token"));
  });

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authService.getUser();
      setUser(currentUser);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let active = true;

    authService.getUser()
      .then((currentUser) => {
        if (active) {
          setUser(currentUser);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    localStorage.setItem("token", response.token);
    const currentUser = await authService.getUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  const register = useCallback(async (name: string, phone: string, email: string, password: string) => {
    // SEC-03: no token is issued at registration. The account is created
    // unverified, so there is no session to establish here — the register
    // page renders the verification-required state instead and offers the
    // resend action.
    return authService.register({
      name,
      phone,
      email,
      password,
      password_confirmation: password,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Local credentials are still cleared after an expired-token logout.
    }
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, refreshUser }),
    [isLoading, login, logout, refreshUser, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/auth.service";

interface AuthContextValue {
  user: { name?: string; email?: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: { name?: string; email?: string } | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  const normalizeUser = (response: unknown, fallbackName?: string, fallbackEmail?: string) => {
    const payload = (response as { user?: { name?: string; email?: string } } | undefined)?.user ?? response;
    const possibleUser = payload as { name?: string; full_name?: string; fullName?: string; email?: string } | undefined;
    const name = possibleUser?.name || possibleUser?.full_name || possibleUser?.fullName || fallbackName;
    const email = possibleUser?.email || fallbackEmail;

    if (name || email) {
      return { name, email };
    }

    return null;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const token = (response as { token?: string }).token;
    const userData = normalizeUser(response, undefined, email);
    if (token) {
      localStorage.setItem("token", token);
    }
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    const response = await authService.register({ fullName, email, password });
    const token = (response as { token?: string }).token;
    const userData = normalizeUser(response, fullName, email);
    if (token) {
      localStorage.setItem("token", token);
    }
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors and clear local state.
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (userData: { name?: string; email?: string } | null) => {
    setUser((currentUser) => {
      const nextUser = userData ? { ...(currentUser ?? {}), ...userData } : null;
      if (nextUser) {
        localStorage.setItem("user", JSON.stringify(nextUser));
      } else {
        localStorage.removeItem("user");
      }
      return nextUser;
    });
  };

  const value = useMemo(() => ({ user, login, register, logout, updateUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

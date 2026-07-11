"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";

type DashboardLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function DashboardLayout({
  title,
  description,
  children,
}: DashboardLayoutProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/");
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="w-full px-8 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-[1700px] px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">{title}</h1>

          {description && (
            <p className="mt-2 text-slate-500">{description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <Sidebar />

          <main className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
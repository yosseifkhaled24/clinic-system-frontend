"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

type DashboardLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function DashboardLayout({
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
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white px-8 py-6 shadow">
          Loading...
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-[1800px] px-6 py-6">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">

          <Sidebar />

          <div className="flex flex-col gap-6">

            <DashboardNavbar />

            <main className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

              {children}

            </main>

          </div>

        </div>

      </div>
    </div>
  );
}
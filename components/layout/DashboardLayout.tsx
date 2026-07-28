"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

type DashboardLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-slate-100">

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full overflow-y-auto">
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
          >
            <X size={16} />
          </button>
          <Sidebar />
        </div>
      </div>

      <div className="mx-auto max-w-[1800px] px-4 py-4 sm:px-6 sm:py-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[280px_1fr]">

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          <div className="flex flex-col gap-4 sm:gap-6">

            {/* Mobile top bar with hamburger */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-100"
              >
                <Menu size={20} />
              </button>
              <div className="flex-1">
                <DashboardNavbar />
              </div>
            </div>

            {/* Desktop top bar */}
            <div className="hidden lg:block">
              <DashboardNavbar />
            </div>

            <main className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-8">
              {children}
            </main>

          </div>
        </div>
      </div>
    </div>
  );
}
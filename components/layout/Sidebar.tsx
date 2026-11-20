"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import {
  LayoutDashboard,
  Users,
  UserRound,
  Stethoscope,
  CalendarDays,
  CalendarClock,
  MessageSquare,
  Star,
  Settings,
  ClipboardList,
  LogOut,
  Building2,
  Home,
  Tags,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export function Sidebar() {
  const pathname = usePathname();

  const { language } = useLanguage();
  const dict = getDictionary(language);
  const { user, logout } = useAuth();

  const items = [
    { label: dict.dashboard.overview, href: "/dashboard", icon: LayoutDashboard },
    { label: dict.dashboardPages.doctors.title, href: "/dashboard/doctors", icon: Stethoscope },
    { label: dict.dashboardPages.specialties.title, href: "/dashboard/specialties", icon: Tags },
    { label: "Doctor Schedules", href: "/dashboard/schedules", icon: CalendarClock },
    { label: dict.dashboardPages.patients.title, href: "/dashboard/patients", icon: Users },
    { label: dict.dashboardPages.services.title, href: "/dashboard/services", icon: ClipboardList },
    { label: dict.dashboardPages.appointments.title, href: "/dashboard/appointments", icon: CalendarDays },
    { label: dict.dashboardPages.queue.title, href: "/dashboard/queue", icon: UserRound },
    { label: dict.dashboardPages.reviews.title, href: "/dashboard/reviews", icon: Star },
    { label: dict.dashboardPages.messages.title, href: "/dashboard/messages", icon: MessageSquare },
    { label: dict.dashboardPages.settings.title, href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="flex h-full w-full flex-col rounded-3xl border border-slate-200 bg-white shadow-xl lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-72">

      {/* Logo -> Links to Website Home */}
      <div className="border-b border-slate-200 p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-3 sm:gap-4 transition hover:opacity-80">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-lg sm:h-14 sm:w-14">
            <Building2 size={26} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-slate-900 sm:text-xl">MediCare</h2>
            <p className="truncate text-xs text-slate-500 sm:text-sm">Clinic Management</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 sm:p-4">
        {/* Back to Website Link */}
        <Link
          href="/"
          className="group mb-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-white sm:gap-4 sm:px-4 sm:py-3"
        >
          <Home size={18} className="shrink-0 text-slate-500 group-hover:text-white" />
          <span className="truncate">{dict.nav.home}</span>
        </Link>

        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 sm:gap-4 sm:px-4 sm:py-3 ${
                active
                  ? "bg-sky-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100 hover:text-sky-600"
              }`}
            >
              <Icon
                size={18}
                className={`shrink-0 transition ${
                  active ? "text-white" : "text-slate-500 group-hover:text-sky-600"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-slate-200 p-3 sm:p-5">
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-100 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-base font-bold text-white shadow sm:h-12 sm:w-12 sm:text-lg">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">
              {user?.name || "Administrator"}
            </p>
            <p className="truncate text-xs capitalize text-slate-500">
              {user?.role || "Admin"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 py-2.5 font-semibold text-red-600 transition hover:bg-red-50 hover:shadow-md sm:py-3"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </aside>
  );
}

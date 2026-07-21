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
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export function Sidebar() {
  const pathname = usePathname();

  const { language } = useLanguage();
  const dict = getDictionary(language);
  const { user, logout } = useAuth();
  const items = [
    {
      label: dict.dashboard.overview,
      href: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      label: dict.dashboardPages.doctors.title,
      href: "/dashboard/doctors",
      icon: Stethoscope,
    },

    {
      label: "Doctor Schedules",
      href: "/dashboard/schedules",
      icon: CalendarClock,
    },

    {
      label: dict.dashboardPages.patients.title,
      href: "/dashboard/patients",
      icon: Users,
    },

    {
      label: dict.dashboardPages.services.title,
      href: "/dashboard/services",
      icon: ClipboardList,
    },

    {
      label: dict.dashboardPages.appointments.title,
      href: "/dashboard/appointments",
      icon: CalendarDays,
    },

    {
      label: dict.dashboardPages.queue.title,
      href: "/dashboard/queue",
      icon: UserRound,
    },

    {
      label: dict.dashboardPages.reviews.title,
      href: "/dashboard/reviews",
      icon: Star,
    },

    {
      label: dict.dashboardPages.messages.title,
      href: "/dashboard/messages",
      icon: MessageSquare,
    },

    {
      label: dict.dashboardPages.settings.title,
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (<aside className="sticky top-6 flex h-[calc(100vh-3rem)] w-full flex-col rounded-3xl border border-slate-200 bg-white shadow-xl lg:w-72">

  {/* Logo */}

  <div className="border-b border-slate-200 p-6">

    <div className="flex items-center gap-4">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-lg">

        <Building2 size={30} />

      </div>

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          MediCare
        </h2>

        <p className="text-sm text-slate-500">
          Clinic Management
        </p>

      </div>

    </div>

  </div>

  {/* Navigation */}

  <nav className="flex-1 space-y-2 overflow-y-auto p-4">

    {items.map((item) => {

      const Icon = item.icon;

      const active =
        pathname === item.href ||
        pathname.startsWith(item.href + "/");

      return (

        <Link
          key={item.href}
          href={item.href}
          className={`group flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200
          ${
            active
              ? "bg-sky-600 text-white shadow-lg"
              : "text-slate-600 hover:bg-slate-100 hover:text-sky-600"
          }`}
        >

          <Icon
            size={20}
            className={`transition ${
              active
                ? "text-white"
                : "text-slate-500 group-hover:text-sky-600"
            }`}
          />

          <span>{item.label}</span>

        </Link>

      );

    })}

  </nav>

  {/* User */}

  <div className="border-t border-slate-200 p-5">

    <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-100 p-3">

     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-lg font-bold text-white shadow">

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
  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 py-3 font-semibold text-red-600 transition hover:bg-red-50 hover:shadow-md"
>

      <LogOut size={18} />

      Logout

    </button>

  </div>

</aside>
);
}

"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export function Sidebar() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const items = [
    { label: dict.dashboard.overview, href: "/dashboard" },
    { label: dict.dashboardPages.doctors.title, href: "/dashboard/doctors" },
    { label: dict.dashboardPages.patients.title, href: "/dashboard/patients" },
    { label: dict.dashboardPages.services.title, href: "/dashboard/services" },
    { label: dict.dashboardPages.reviews.title, href: "/dashboard/reviews" },
    { label: dict.dashboardPages.queue.title, href: "/dashboard/queue" },
    { label: dict.dashboardPages.messages.title, href: "/dashboard/messages" },
    { label: dict.dashboardPages.appointments.title, href: "/dashboard/appointments" },
    { label: dict.dashboardPages.settings.title, href: "/dashboard/settings" },
  ];

  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:w-64">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{dict.dashboard.title}</h2>
      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

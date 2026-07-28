"use client";

import {
  Users,
  Stethoscope,
  CalendarDays,
  Star,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export default function Stats() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const stats = [
    {
      title: dict.home.stats.doctors,
      value: "120+",
      icon: Stethoscope,
      color: "bg-sky-100 text-sky-600",
    },
    {
      title: dict.home.stats.patients,
      value: "8K+",
      icon: Users,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: dict.home.stats.appointments,
      value: "15K+",
      icon: CalendarDays,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: dict.home.stats.reviews,
      value: "4.9",
      icon: Star,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <section className="-mt-10 sm:-mt-14 relative z-20 pb-16 sm:pb-20">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:gap-6 sm:px-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div
                className={`mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl ${item.color}`}
              >
                <Icon size={28} />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                {item.value}
              </h2>

              <p className="mt-2 text-slate-500 text-sm sm:text-base">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
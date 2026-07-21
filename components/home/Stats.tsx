"use client";

import {
  Users,
  Stethoscope,
  CalendarDays,
  Star,
} from "lucide-react";

export default function Stats() {
  const stats = [
    {
      title: "Doctors",
      value: "120+",
      icon: Stethoscope,
      color: "bg-sky-100 text-sky-600",
    },
    {
      title: "Patients",
      value: "8K+",
      icon: Users,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Appointments",
      value: "15K+",
      icon: CalendarDays,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Reviews",
      value: "4.9",
      icon: Star,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <section className="-mt-14 relative z-20 pb-20">

      <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >

              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${item.color}`}
              >

                <Icon size={30} />

              </div>

              <h2 className="text-4xl font-bold text-slate-900">

                {item.value}

              </h2>

              <p className="mt-2 text-slate-500">

                {item.title}

              </p>

            </div>

          );

        })}

      </div>

    </section>
  );
}
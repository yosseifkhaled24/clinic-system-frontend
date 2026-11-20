"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ApiImage } from "@/components/ui/ApiImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { doctorsService } from "@/services/doctors.service";
import type { Doctor } from "@/types/doctor";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export default function FeaturedDoctors() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorsService
      .getAll()
      .then((data) => {
        setDoctors(data.slice(0, 3));
      })
      // A4: a rejected request used to leave an unhandled rejection —
      // the section then showed an empty grid with no explanation.
      // Degrade to the existing "no doctors" state instead.
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
            {dict.home.featuredDoctors.tag}
          </span>

          <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
            {dict.home.featuredDoctors.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 sm:text-lg">
            {dict.home.featuredDoctors.description}
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <Skeleton className="h-72 w-full rounded-none" />
                <div className="p-7 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}

          {!loading &&
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <ApiImage
                  src={doctor.image_url}
                  alt={doctor.name}
                  className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  fallbackClassName="flex h-72 items-center justify-center bg-slate-100 text-slate-400"
                />

                <div className="p-7">
                  <p className="text-sm font-semibold text-sky-600">
                    {doctor.specialty || "Specialist"}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {doctor.name}
                  </h3>

                  <p className="mt-4 line-clamp-3 text-slate-500">
                    {doctor.bio || "Professional healthcare specialist."}
                  </p>

                  <Link
                    href={`/doctors/${doctor.id}`}
                    className="mt-6 inline-flex font-semibold text-sky-600 transition hover:translate-x-2"
                  >
                    {dict.home.featuredDoctors.viewProfile}
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
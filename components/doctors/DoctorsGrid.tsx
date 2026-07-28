"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { doctorsService } from "@/services/doctors.service";
import type { Doctor } from "@/types/doctor";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

import DoctorCard from "./DoctorCard";

export default function DoctorsGrid() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    doctorsService
      .getAll()
      .then((data) => setDoctors(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [doctors, search]);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between sm:mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {dict.doctors.title}
            </h2>

            <p className="mt-2 text-slate-500 sm:mt-3">
              {dict.doctors.description}
            </p>
          </div>

          <div className="relative w-full lg:w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={dict.doctors.searchPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 shadow-sm outline-none transition focus:border-sky-500 sm:py-4"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
              >
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            {dict.doctors.noDoctors}
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
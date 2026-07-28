"use client";

import Link from "next/link";
import { Star, CalendarDays } from "lucide-react";

import { ApiImage } from "@/components/ui/ApiImage";
import type { Doctor } from "@/types/doctor";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

type DoctorCardProps = {
  doctor: Doctor;
};

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  return (
    <div className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between">
      <div>
        <div className="relative overflow-hidden">
          <ApiImage
            src={doctor.image_url}
            alt={doctor.name}
            className="h-72 sm:h-80 w-full object-cover transition duration-500 group-hover:scale-110"
            fallbackClassName="flex h-72 sm:h-80 items-center justify-center bg-slate-100 text-slate-400"
          />

          <div className="absolute left-4 top-4 sm:left-5 sm:top-5 rounded-full bg-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold shadow">
            {doctor.specialty || dict.home.doctorCard.specialist}
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {doctor.name}
            </h2>

            <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs sm:text-sm font-semibold text-yellow-700">
              <Star size={14} fill="currentColor" />
              4.9
            </div>
          </div>

          <p className="line-clamp-3 leading-7 text-slate-500 text-sm sm:text-base">
            {doctor.bio || "Professional medical specialist with years of experience."}
          </p>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
              <CalendarDays size={16} />
              {dict.home.doctorCard.availableToday}
            </div>

            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs sm:text-sm font-semibold text-sky-700">
              250 {dict.home.doctorCard.egp}
            </span>
          </div>

          <div className="mt-6 sm:mt-8 flex gap-3">
            <Link
              href={`/doctors/${doctor.id}`}
              className="flex-1 rounded-2xl border border-slate-200 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {dict.home.doctorCard.viewProfile}
            </Link>

            <Link
              href={`/booking?doctor=${doctor.id}`}
              className="flex-1 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-semibold text-white shadow-lg transition hover:scale-105"
            >
              {dict.home.doctorCard.bookNow}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
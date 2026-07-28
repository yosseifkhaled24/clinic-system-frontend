"use client";

import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export default function DoctorsHero() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 py-16 sm:py-24 text-white">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-20 px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 sm:px-5 py-2 backdrop-blur text-sm">
            <Stethoscope size={18} />
            <span>{dict.doctorsHero.tag}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            {dict.doctorsHero.title}
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-sky-100 leading-7 sm:leading-8">
            {dict.doctorsHero.description}
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link href="/booking" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto rounded-2xl bg-black px-8 py-4 sm:py-6 text-base font-semibold text-white transition-none">
                {dict.doctorsHero.ctaBook}
              </button>
            </Link>

            <Link href="/contact" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto rounded-2xl border border-white/40 bg-transparent px-8 py-4 sm:py-6 text-base font-semibold text-white transition-none">
                {dict.doctorsHero.ctaContact}
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-auto lg:flex-1 lg:justify-end">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur shadow-2xl">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <div className="rounded-2xl bg-white/10 p-4 sm:p-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold">120+</h2>
                <p className="mt-2 text-xs sm:text-sm text-sky-100">{dict.doctorsHero.doctorsCount}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 sm:p-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold">15+</h2>
                <p className="mt-2 text-xs sm:text-sm text-sky-100">{dict.doctorsHero.specialties}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 sm:p-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold">24/7</h2>
                <p className="mt-2 text-xs sm:text-sm text-sky-100">{dict.doctorsHero.support}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 sm:p-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold">4.9★</h2>
                <p className="mt-2 text-xs sm:text-sm text-sky-100">{dict.doctorsHero.rating}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
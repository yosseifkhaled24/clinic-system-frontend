"use client";

import { MessageSquareHeart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export default function ReviewsHero() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 py-16 sm:py-24 text-white">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-20 px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 sm:px-5 py-2 backdrop-blur text-sm">
            <MessageSquareHeart size={18} />
            <span>{dict.reviewsHero.tag}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            {dict.reviewsHero.title}
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-sky-100">
            {dict.reviewsHero.description}
          </p>
        </div>

        <div className="w-full lg:w-auto lg:flex-1 lg:justify-end">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <div className="rounded-2xl bg-white/10 p-4 sm:p-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold">100%</h2>
                <p className="mt-2 text-xs sm:text-sm text-sky-100">{dict.reviewsHero.realReviews}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 sm:p-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold">4.9</h2>
                <p className="mt-2 text-xs sm:text-sm text-sky-100">{dict.reviewsHero.avgRating}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 sm:p-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold">24/7</h2>
                <p className="mt-2 text-xs sm:text-sm text-sky-100">{dict.reviewsHero.support}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 sm:p-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold">❤</h2>
                <p className="mt-2 text-xs sm:text-sm text-sky-100">{dict.reviewsHero.trustedCare}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
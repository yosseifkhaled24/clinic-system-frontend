"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { reviewsService } from "@/services/reviews.service";
import { getErrorMessage } from "@/lib/errors";
import type { Review } from "@/types/review";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export default function Testimonials() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reviewsService
      .getAll()
      .then((data) => {
        setReviews(data.slice(0, 3));
      })
      .catch((error) => {
        console.error(getErrorMessage(error, "Unable to load reviews."));
        setReviews([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
            {dict.home.testimonials.tag}
          </span>

          <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
            {dict.home.testimonials.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 sm:text-lg">
            {dict.home.testimonials.description}
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-slate-500">{dict.dashboard.loading}</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-slate-500">{dict.home.testimonials.noReviews}</p>
        ) : (
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      fill={star <= review.rating ? "currentColor" : "transparent"}
                      className={star <= review.rating ? "text-yellow-400" : "text-slate-300"}
                    />
                  ))}
                </div>

                <p className="leading-8 text-slate-600 text-sm sm:text-base">
                  "{review.comment || "No comment"}"
                </p>

                <div className="mt-8">
                  {/* SEC-20: anonymized public reads return name: null */}
                  <h3 className="font-bold text-slate-900">
                    {review.user.name ?? dict.reviews.anonymous}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {dict.home.testimonials.patient} • {review.doctor.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
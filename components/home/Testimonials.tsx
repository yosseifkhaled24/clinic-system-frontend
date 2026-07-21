"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { reviewsService } from "@/services/reviews.service";
import { getErrorMessage } from "@/lib/errors";

import type { Review } from "@/types/review";

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reviewsService
      .getAll()
      .then((data) => {
        setReviews(data.slice(0, 3));
      })
      .catch((error) => {
        console.error(
  getErrorMessage(error, "Unable to load reviews.")
);
        setReviews([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
            Testimonials
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            What Our Patients Say
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Trusted by hundreds of happy patients every month.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-slate-500">
            Loading testimonials...
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-slate-500">
            No reviews available.
          </p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      fill={
                        star <= review.rating
                          ? "currentColor"
                          : "transparent"
                      }
                      className={
                        star <= review.rating
                          ? "text-yellow-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>

                <p className="leading-8 text-slate-600">
                  "{review.comment || "No comment"}"
                </p>

                <div className="mt-8">
                  <h3 className="font-bold text-slate-900">
                    {review.user.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Patient • {review.doctor.name}
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
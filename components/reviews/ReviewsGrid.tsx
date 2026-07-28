"use client";

import { useEffect, useState } from "react";

import { reviewsService } from "@/services/reviews.service";
import { getErrorMessage } from "@/lib/errors";
import { Skeleton } from "@/components/ui/Skeleton";

import type { Review } from "@/types/review";

import ReviewCard from "./ReviewCard";

export default function ReviewsGrid() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    reviewsService
      .getAll()
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => {
        setError(getErrorMessage(error, "Unable to load reviews."));
        setReviews([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {loading && (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="py-16 text-center text-red-500">{error}</div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="py-16 text-center text-slate-500">
            No reviews available.
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
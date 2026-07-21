"use client";

import { useEffect, useState } from "react";

import { reviewsService } from "@/services/reviews.service";
import { getErrorMessage } from "@/lib/errors";

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
        setError(
          getErrorMessage(
            error,
            "Unable to load reviews."
          )
        );

        setReviews([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        {loading && (
          <div className="py-20 text-center text-slate-500">
            Loading reviews...
          </div>
        )}

        {!loading && error && (
          <div className="py-20 text-center text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="py-20 text-center text-slate-500">
            No reviews available.
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
              />
            ))}

          </div>
        )}

      </div>

    </section>
  );
}
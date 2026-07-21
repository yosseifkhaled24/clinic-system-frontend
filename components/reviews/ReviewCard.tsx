"use client";

import { Star } from "lucide-react";

import type { Review } from "@/types/review";

type ReviewCardProps = {
  review: Review;
};

export default function ReviewCard({
  review,
}: ReviewCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="mb-5 flex gap-1">

        {Array.from({ length: review.rating }).map((_, index) => (
          <Star
            key={index}
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}

      </div>

      <p className="leading-8 text-slate-600">
        "{review.comment || "No comment provided."}"
      </p>

      <div className="mt-8 border-t border-slate-100 pt-5">

        <h3 className="font-bold text-slate-900">
          {review.user.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Doctor: {review.doctor.name}
        </p>

        {review.created_at && (
          <p className="mt-3 text-xs text-slate-400">
            {new Date(review.created_at).toLocaleDateString()}
          </p>
        )}

      </div>

    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

import { useLanguage } from "@/context/LanguageContext";

import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";

import { reviewsService } from "@/services/reviews.service";

import type { Review } from "@/types/review";

export default function DashboardReviewsPage() {
  const { language } = useLanguage();

  const dict = getDictionary(language);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);

  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setIsLoading(true);

      const response =
        await reviewsService.getAll();

      setReviews(response);
      setFilteredReviews(response);

      setError("");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to load reviews."
        )
      );

      setReviews([]);
      setFilteredReviews([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const keyword = search.toLowerCase();

    setFilteredReviews(
      reviews.filter((review) =>
        review.user.name
          .toLowerCase()
          .includes(keyword) ||
        (review.comment ?? "")
          .toLowerCase()
          .includes(keyword)
      )
    );
  }, [search, reviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;

    return (
      reviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0
      ) / reviews.length
    ).toFixed(1);
  }, [reviews]);

  return (
    <DashboardLayout
      title={dict.dashboardPages.reviews.title}
      description={dict.dashboardPages.reviews.description}
    >
            {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading reviews...
        </div>
      ) : (
        <div className="space-y-8">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Reviews Management
              </h2>

              <p className="mt-2 text-slate-500">
                View all patient reviews and ratings.
              </p>

            </div>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Total Reviews
              </p>

              <h3 className="mt-3 text-4xl font-bold text-sky-600">
                {reviews.length}
              </h3>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Average Rating
              </p>

              <h3 className="mt-3 text-4xl font-bold text-amber-500">
                {averageRating}
              </h3>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Five Star Reviews
              </p>

              <h3 className="mt-3 text-4xl font-bold text-green-600">
                {
                  reviews.filter(
                    (review) => review.rating === 5
                  ).length
                }
              </h3>

            </div>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search Reviews
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by patient name or review..."
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />

          </div>

          {filteredReviews.length === 0 ? (

            <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">

              <div className="text-6xl">
                ⭐
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                No Reviews Found
              </h2>

              <p className="mt-3 text-slate-500">
                There are no reviews matching your search.
              </p>

            </div>

          ) : (

            <div className="space-y-5">
                            {filteredReviews.map((review) => (

                <div
                  key={review.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
                >

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-center gap-5">

                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-2xl">
                        👤
                      </div>

                      <div>

                        <h3 className="text-xl font-bold text-slate-900">
                          {review.user.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Patient Review
                        </p>

                      </div>

                    </div>

                    <div className="text-right">

                      <div className="text-2xl text-amber-400">
                        {"★".repeat(review.rating || 0)}
                        <span className="text-slate-300">
                          {"★".repeat(
                            5 - (review.rating || 0)
                          )}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        Rating: {review.rating}/5
                      </p>

                    </div>

                  </div>

                  <div className="mt-6 rounded-2xl bg-slate-50 p-5">

                    <p className="leading-7 text-slate-700">
                      {review.comment}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      )}

    </DashboardLayout>
  );
}
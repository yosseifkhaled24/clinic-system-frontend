"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { reviewsService } from "@/services/reviews.service";
import type { Review } from "@/types/review";

export default function DashboardReviewsPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    reviewsService.getAll().then((response) => {
      const list = Array.isArray(response) ? response : (response as { data?: Review[] }).data || [];
      setReviews(list);
    });
  }, []);

  return (
    <DashboardLayout title={dict.dashboardPages.reviews.title} description={dict.dashboardPages.reviews.description}>
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{review.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{review.comment}</p>
              </div>
              <span className="text-sm text-amber-500">{"★".repeat(review.rating || 0)}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

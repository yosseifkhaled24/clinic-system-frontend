"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { reviewsService } from "@/services/reviews.service";
import type { Review } from "@/types/review";

export default function ReviewsPage() {
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
    <Container className="py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">{dict.reviews.title}</h1>
        <p className="mt-2 text-slate-600">{dict.reviews.description}</p>
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-900">{review.name}</p>
            <p className="mt-2 text-slate-600">{review.comment}</p>
            <p className="mt-3 text-sm text-amber-500">{"★".repeat(review.rating || 0)}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}

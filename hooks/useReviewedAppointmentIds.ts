"use client";

import { useCallback, useEffect, useState } from "react";

import { reviewsService } from "@/services/reviews.service";

/**
 * Loads which appointments already carry a review (backing
 * `reviewedAppointmentIds` on the patient surfaces).
 *
 * Best-effort by design: the public review list tells the UI which
 * appointments are already reviewed so the Write Review action hides.
 * A failure here must not break the page — the backend still rejects
 * duplicate reviews with 422.
 */
export function useReviewedAppointmentIds() {
  const [reviewedAppointmentIds, setReviewedAppointmentIds] = useState<
    Set<number>
  >(new Set());

  useEffect(() => {
    let isMounted = true;

    reviewsService
      .getAll()
      .then((reviews) => {
        if (!isMounted) return;

        setReviewedAppointmentIds(
          new Set(
            reviews
              .map((review) => review.appointment?.id)
              .filter((id): id is number => typeof id === "number")
          )
        );
      })
      .catch(() => {
        // Reviews stay unknown; the backend still rejects duplicates.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Called after a successful submission so the action disappears
  // immediately (UI-only state; the backend is still the authority).
  const markReviewed = useCallback((appointmentId: number) => {
    setReviewedAppointmentIds((current) => new Set(current).add(appointmentId));
  }, []);

  return { reviewedAppointmentIds, markReviewed };
}

"use client";

import { useCallback, useState } from "react";

import { reviewsService } from "@/services/reviews.service";
import { getErrorMessage } from "@/lib/errors";

import type { Appointment } from "@/types/appointment";

/**
 * Shared controller for the patient review form (button gate + inline
 * form + submission) used by BOTH patient surfaces — /appointments and
 * the profile Appointments tab — so the review flow is implemented once.
 *
 * The submission itself is validated by the backend (ownership, completed,
 * paid, one-per-appointment); this state is UI-only and mirrors it.
 *
 * `onReviewed` receives the appointment id after a successful creation so
 * the caller's `reviewedAppointmentIds` set can hide the action at once.
 */
export function useReviewForm(onReviewed: (appointmentId: number) => void) {
  const [target, setTarget] = useState<Appointment | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const open = useCallback((appointment: Appointment) => {
    setTarget(appointment);
    setRating(5);
    setComment("");
    setError("");
  }, []);

  const close = useCallback(() => {
    setTarget(null);
    setError("");
  }, []);

  const submit = useCallback(async () => {
    if (!target) return;

    try {
      setIsSubmitting(true);
      setError("");

      await reviewsService.create({
        doctor_id: target.doctor.id,
        appointment_id: target.id,
        rating,
        comment: comment.trim() || undefined,
      });

      // Backend accepted (201): hide the action immediately.
      onReviewed(target.id);
      setTarget(null);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to submit review."));
    } finally {
      setIsSubmitting(false);
    }
  }, [target, rating, comment, onReviewed]);

  return {
    target,
    rating,
    setRating,
    comment,
    setComment,
    isSubmitting,
    error,
    open,
    close,
    submit,
  };
}

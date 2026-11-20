"use client";

import { Button } from "@/components/ui/Button";

import type { Appointment } from "@/types/appointment";

type ReviewFormController = {
  target: Appointment | null;
  rating: number;
  setRating: (value: number) => void;
  comment: string;
  setComment: (value: string) => void;
  isSubmitting: boolean;
  error: string;
  close: () => void;
  submit: () => Promise<void>;
};

type ReviewFormProps = {
  appointment: Appointment;
  controller: ReviewFormController;
};

/**
 * The inline review form (rating + optional comment + Cancel/Submit).
 * Markup taken verbatim from the original /appointments implementation
 * so the design is unchanged; rendered only for the appointment the
 * controller currently targets.
 *
 * Shared by /appointments and the profile Appointments tab.
 */
export function ReviewForm({ appointment, controller }: ReviewFormProps) {
  if (controller.target?.id !== appointment.id) {
    return null;
  }

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-sm font-semibold text-slate-900">
        Review {appointment.doctor.name}
      </h3>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-slate-600">Rating</span>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => controller.setRating(value)}
              className={`rounded-lg px-3 py-1 text-sm font-semibold transition ${
                controller.rating === value
                  ? "bg-sky-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={controller.comment}
        onChange={(e) => controller.setComment(e.target.value)}
        maxLength={1000}
        rows={3}
        placeholder="Share your experience (optional)"
        className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500"
      />

      {controller.error && (
        <p className="mt-2 text-sm text-rose-600">{controller.error}</p>
      )}

      <div className="mt-3 flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          disabled={controller.isSubmitting}
          onClick={controller.close}
        >
          Cancel
        </Button>

        <Button
          type="button"
          disabled={controller.isSubmitting}
          onClick={() => void controller.submit()}
        >
          {controller.isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </div>
  );
}

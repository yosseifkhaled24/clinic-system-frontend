import type { Appointment } from "@/types/appointment";

/**
 * Single source of truth for the patient review gate (UI side).
 *
 * Approved business rules, unchanged:
 *  - the appointment must be `completed`;
 *  - it must be fully paid (`payment.status === "paid"`);
 *  - it must not carry a review yet.
 *
 * Ownership (only the owning patient may review) and the one-review-per-
 * appointment rule are enforced server-side by ReviewController::store
 * (403 / 422) and by the unique index on reviews.appointment_id — this
 * helper is UI-only state and never weakens those checks.
 *
 * Used by BOTH patient surfaces (/appointments and the profile
 * Appointments tab) so the eligibility conditions can never drift apart.
 */
export function canReviewAppointment(
  appointment: Appointment,
  reviewedAppointmentIds: Set<number>
): boolean {
  return (
    appointment.status === "completed" &&
    appointment.payment?.status === "paid" &&
    !reviewedAppointmentIds.has(appointment.id)
  );
}

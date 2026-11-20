"use client";

import { Button } from "@/components/ui/Button";
import { canReviewAppointment } from "@/lib/reviews";

import type { Appointment } from "@/types/appointment";

type WriteReviewButtonProps = {
  appointment: Appointment;
  reviewedAppointmentIds: Set<number>;
  /** Currently-open review form target, if any (hides this button while its own form is open). */
  target: Appointment | null;
  onOpen: (appointment: Appointment) => void;
  className?: string;
};

/**
 * The patient "Write Review" action. Renders only when the approved
 * rules are satisfied: completed + paid + not already reviewed (see
 * canReviewAppointment). Ownership and duplicate rules stay enforced
 * server-side.
 *
 * Shared by /appointments and the profile Appointments tab so the
 * visibility conditions can never diverge between the two surfaces.
 */
export function WriteReviewButton({
  appointment,
  reviewedAppointmentIds,
  target,
  onOpen,
  className,
}: WriteReviewButtonProps) {
  if (!canReviewAppointment(appointment, reviewedAppointmentIds)) {
    return null;
  }

  // While this appointment's form is open the button steps aside
  // (the form itself carries Cancel/Submit).
  if (target?.id === appointment.id) {
    return null;
  }

  return (
    <Button
      type="button"
      onClick={() => onOpen(appointment)}
      className={className}
    >
      Write Review
    </Button>
  );
}

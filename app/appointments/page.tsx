"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import DeleteAppointmentDialog from "@/components/dashboard/appointments/DeleteAppointmentDialog";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { WriteReviewButton } from "@/components/reviews/WriteReviewButton";
import { getErrorMessage } from "@/lib/errors";

import { appointmentsService } from "@/services/appointments.service";
import { paymentService } from "@/services/payment.service";

import { useReviewForm } from "@/hooks/useReviewForm";
import { useReviewedAppointmentIds } from "@/hooks/useReviewedAppointmentIds";
import { useVisibilityPoll } from "@/hooks/useVisibilityPoll";

import type { Appointment } from "@/types/appointment";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // D7: patients may cancel their own appointments through the existing
  // DELETE endpoint. Rescheduling is intentionally NOT offered here —
  // only admins may change doctor/date (D4).
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<Appointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Review gate: shared state/logic (loaded review ids + form controller),
  // identical to the profile Appointments tab. The backend still rejects
  // duplicates and foreign appointments — this is UI-only state.
  const { reviewedAppointmentIds, markReviewed } = useReviewedAppointmentIds();
  const reviewForm = useReviewForm(markReviewed);

  // Unmount guard shared by the initial load and the background refresh
  // (state updates after unmount are skipped, exactly as before).
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // NOTE: no synchronous setIsLoading(true) here — the state already
    // starts as `true` (useState initializer) and this effect runs once
    // before anything could flip it, so the old redundant call was a
    // no-op (and trips react-hooks/set-state-in-effect when inlined).
    appointmentsService
      .getAll()
      .then((response) => {
        if (!mountedRef.current) return;
        setAppointments(response);
      })
      .catch((error) => {
        if (!mountedRef.current) return;
        setError(getErrorMessage(error, "Unable to load appointments."));
        setAppointments([]);
      })
      .finally(() => {
        if (!mountedRef.current) return;
        setIsLoading(false);
      });

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Background refresh: the same 15s cadence and the same success and
  // failure semantics as before, but paused while the tab is hidden
  // (Phase 1) and never overlapping a still-pending request.
  const refresh = () => {
    return appointmentsService
      .getAll()
      .then((response) => {
        if (!mountedRef.current) return;
        setAppointments(response);
        setError("");
      })
      .catch(() => {
        // Preserve current appointments while background refresh fails.
      });
  };

  useVisibilityPoll(refresh, 15000);

  const handlePayment = async (appointmentId: number) => {
    try {
      const response = await paymentService.checkout(appointmentId);

      window.location.href = response.checkout_url;
    } catch (error) {
      alert(getErrorMessage(error, "Unable to start payment."));
    }
  };

  async function confirmCancel() {
    if (!appointmentToCancel) return;

    try {
      setIsCancelling(true);

      await appointmentsService.delete(appointmentToCancel.id);

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === appointmentToCancel.id
            ? { ...appointment, status: "cancelled" }
            : appointment
        )
      );

      setAppointmentToCancel(null);
    } catch (error) {
      alert(getErrorMessage(error, "Unable to cancel appointment."));
    } finally {
      setIsCancelling(false);
    }
  }

  // D7: cancel is offered only while the appointment is still active
  // (pending/arrived). Completed, cancelled, no-show and in-progress
  // rows are not cancellable from the patient UI.
  const canCancel = (appointment: Appointment) =>
    appointment.status === "pending" || appointment.status === "arrived";

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold text-slate-900">
        My Appointments
      </h1>

      <div className="mt-8 space-y-4">
        {isLoading && (
          <p className="text-sm text-slate-600">
            Loading...
          </p>
        )}

        {!isLoading && error && (
          <p className="text-sm text-rose-600">
            {error}
          </p>
        )}

        {!isLoading &&
          !error &&
          appointments.length === 0 && (
            <p className="text-sm text-slate-600">
              No appointments found.
            </p>
          )}

        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {appointment.doctor.name}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  {appointment.appointment_date}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Queue: {appointment.queue_number}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {appointment.status}
                </span>

                {appointment.payment?.status === "unpaid" ? (
                  <Button
                    onClick={() =>
                      handlePayment(appointment.id)
                    }
                  >
                    Pay Now
                  </Button>
                ) : (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    Paid
                  </span>
                )}

                {canCancel(appointment) && (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isCancelling}
                    onClick={() =>
                      setAppointmentToCancel(appointment)
                    }
                    className="text-red-600"
                  >
                    Cancel
                  </Button>
                )}

                <WriteReviewButton
                  appointment={appointment}
                  reviewedAppointmentIds={reviewedAppointmentIds}
                  target={reviewForm.target}
                  onOpen={reviewForm.open}
                />
              </div>
            </div>

            <ReviewForm appointment={appointment} controller={reviewForm} />
          </div>
        ))}

      <DeleteAppointmentDialog
        open={appointmentToCancel !== null}
        patientName={appointmentToCancel?.doctor.name}
        onCancel={() => setAppointmentToCancel(null)}
        onConfirm={confirmCancel}
      />
      </div>
    </Container>
  );
}

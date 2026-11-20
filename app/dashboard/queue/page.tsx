"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

import DoctorQueueCard, {
  nextEligiblePatient,
} from "@/components/dashboard/queue/DoctorQueueCard";
import CompletePaymentDialog from "@/components/dashboard/appointments/CompletePaymentDialog";

import { useLanguage } from "@/context/LanguageContext";

import { appointmentsService } from "@/services/appointments.service";
import { queueService } from "@/services/queue.service";

import { useVisibilityPoll } from "@/hooks/useVisibilityPoll";

import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";

import type { PaymentMethod } from "@/types/appointment";
import type { DoctorQueue, QueuePatient } from "@/types/queue";

/** Clinic-wide queue refresh cadence. */
const REFRESH_INTERVAL_MS = 15000;

/**
 * All-doctors queue control center.
 *
 * Loads EVERY doctor's queue up front (single GET /api/queue call) — no
 * doctor selection step — and polls silently every 15 seconds with an
 * in-flight guard so refreshes never overlap and unmount cleans the
 * interval. Every action goes through the existing appointment status /
 * complete endpoints and re-fetches the queues immediately afterwards.
 */
export default function DashboardQueuePage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const [queues, setQueues] = useState<DoctorQueue[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  /** Appointment id with an in-flight row action (arrive/start/skip). */
  const [busyId, setBusyId] = useState<number | null>(null);
  /** True while a "Call Next Patient" action is in flight. */
  const [isCallingNext, setIsCallingNext] = useState(false);

  /** A/B: the Complete + payment dialog target. */
  const [completeTarget, setCompleteTarget] =
    useState<QueuePatient | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);

  const loadQueues = useCallback(async () => {
    // Never overlap refreshes (polling tick vs. post-action refetch).
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      const data = await queueService.all();

      if (!mountedRef.current) return;

      setQueues(data);
      setIsLoading(false);
      setError("");
    } catch (err) {
      if (!mountedRef.current) return;

      setIsLoading(false);
      setError(
        getErrorMessage(
          err,
          "Failed to load the clinic queues."
        )
      );
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    // Kick off the first load off the effect body (same callback path
    // the poller uses). The in-flight guard inside loadQueues keeps it
    // from ever overlapping the poller, and the cleanup below tears the
    // bootstrap timer down on unmount.
    const bootstrap = setTimeout(() => {
      loadQueues();
    }, 0);

    return () => {
      mountedRef.current = false;
      clearTimeout(bootstrap);
    };
  }, [loadQueues]);

  // Poll every REFRESH_INTERVAL_MS while the tab is visible — paused
  // when hidden, with one catch-up refresh on return (Phase 1). The
  // in-flight guard inside loadQueues still prevents overlap with
  // post-action refetches, and the hook skips any tick that would stack
  // on a still-pending one.
  useVisibilityPoll(loadQueues, REFRESH_INTERVAL_MS);

  /** Clinic-wide summary, derived from the loaded queues. */
  const summary = useMemo(() => {
    let waiting = 0;
    let inConsultation = 0;
    let completed = 0;

    for (const queue of queues) {
      waiting += queue.waiting.length;

      if (queue.current) inConsultation += 1;

      completed += queue.finished.filter(
        (patient) => patient.status === "completed"
      ).length;
    }

    return {
      doctors: queues.length,
      waiting,
      inConsultation,
      completed,
    };
  }, [queues]);

  /**
   * One shared runner for the per-row actions — waits for the backend,
   * then reloads every doctor's queue so all indicators refresh at once.
   */
  async function runStatusAction(
    appointmentId: number,
    status: "arrived" | "in_progress" | "no_show"
  ) {
    try {
      setBusyId(appointmentId);

      await appointmentsService.updateStatus(
        appointmentId,
        status
      );

      await loadQueues();
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to update the queue.")
      );
    } finally {
      setBusyId(null);
    }
  }

  function handleArrive(patient: QueuePatient) {
    return runStatusAction(patient.id, "arrived");
  }

  function handleStart(patient: QueuePatient) {
    return runStatusAction(patient.id, "in_progress");
  }

  function handleSkip(patient: QueuePatient) {
    // Skipped patients become no_show and are NOT reinserted; the
    // backend also releases their capacity slot.
    return runStatusAction(patient.id, "no_show");
  }

  /**
   * A: Call Next — starts the first ARRIVED patient of this doctor's
   * queue, through the existing status endpoint. It never completes or
   * pays anything, and it is gated while a consultation is still running
   * (the card disables the button and explains Complete + Payment; this
   * handler re-checks in case of a stale click).
   */
  async function handleCallNext(queue: DoctorQueue) {
    if (queue.current || isCallingNext || busyId !== null) return;

    const next = nextEligiblePatient(queue);
    if (!next) return;

    try {
      setIsCallingNext(true);

      await appointmentsService.updateStatus(
        next.id,
        "in_progress"
      );

      await loadQueues();
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to call the next patient.")
      );
    } finally {
      setIsCallingNext(false);
    }
  }

  function openCompleteDialog(patient: QueuePatient) {
    setCompleteTarget(patient);
  }

  function closeCompleteDialog() {
    if (isCompleting) return;
    setCompleteTarget(null);
  }

  // A/B: one request records the payment and completes the appointment
  // atomically; afterwards the doctor's current slot clears so the next
  // arrived patient becomes callable.
  async function handleComplete(
    method: PaymentMethod | null
  ) {
    if (!completeTarget) return;

    try {
      setIsCompleting(true);

      await appointmentsService.complete(
        completeTarget.id,
        method
      );

      setCompleteTarget(null);

      await loadQueues();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to complete the consultation."
        )
      );
    } finally {
      setIsCompleting(false);
    }
  }

  const isBusy =
    busyId !== null || isCallingNext || isCompleting;

  return (
    <DashboardLayout
      title={dict.dashboardPages.queue.title}
      description={dict.dashboardPages.queue.description}
    >
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-3xl bg-slate-200"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">

          {/* Clinic-wide summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Doctors
              </p>

              <h3 className="mt-3 text-4xl font-bold text-slate-900">
                {summary.doctors}
              </h3>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Waiting Patients
              </p>

              <h3 className="mt-3 text-4xl font-bold text-yellow-600">
                {summary.waiting}
              </h3>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                In Consultation
              </p>

              <h3 className="mt-3 text-4xl font-bold text-green-600">
                {summary.inConsultation}
              </h3>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Completed Today
              </p>

              <h3 className="mt-3 text-4xl font-bold text-sky-600">
                {summary.completed}
              </h3>
            </div>

          </div>

          {/* One queue card per doctor */}
          {queues.length === 0 ? (

            <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-12 text-center shadow-sm sm:p-16">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-4xl sm:h-24 sm:w-24 sm:text-5xl">
                👨‍⚕️
              </div>

              <h2 className="mt-6 text-xl font-bold text-slate-900 sm:text-2xl">
                No Doctors Yet
              </h2>

              <p className="mt-3 text-slate-500">
                Add doctors in the dashboard and their queues will appear
                here automatically.
              </p>

            </div>

          ) : (

            <div className="grid gap-6 xl:grid-cols-2">

              {queues.map((queue) => (
                <DoctorQueueCard
                  key={queue.doctor.id}
                  queue={queue}
                  busyId={busyId}
                  isBusy={isBusy}
                  onArrive={handleArrive}
                  onStart={handleStart}
                  onSkip={handleSkip}
                  onCallNext={handleCallNext}
                  onComplete={openCompleteDialog}
                />
              ))}

            </div>

          )}

          <CompletePaymentDialog
            open={completeTarget !== null}
            patientName={completeTarget?.patient.name}
            amount={completeTarget?.service_price ?? 0}
            isPaid={
              completeTarget?.payment_status === "paid"
            }
            isSubmitting={isCompleting}
            onCancel={closeCompleteDialog}
            onConfirm={handleComplete}
          />

        </div>
      )}
    </DashboardLayout>
  );
}

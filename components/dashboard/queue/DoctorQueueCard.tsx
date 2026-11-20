"use client";

import type { DoctorQueue, QueuePatient } from "@/types/queue";

interface DoctorQueueCardProps {
  queue: DoctorQueue;
  /** Appointment id with an in-flight action (disables that row). */
  busyId: number | null;
  /** True while any action on this doctor's queue is in flight. */
  isBusy: boolean;
  /** pending -> arrived (reception step before the patient is called). */
  onArrive: (patient: QueuePatient) => void;
  /** Direct start of a waiting patient (existing workflow). */
  onStart: (patient: QueuePatient) => void;
  /** Absent patient -> no_show; never reinserted into the queue. */
  onSkip: (patient: QueuePatient) => void;
  /** Calls the next ARRIVED patient — gated while a consultation runs. */
  onCallNext: (queue: DoctorQueue) => void;
  /** Opens the Complete + payment dialog for the current patient. */
  onComplete: (patient: QueuePatient) => void;
}

/**
 * The Next-patient candidate: the first ARRIVED patient in queue order.
 * Pending patients have not checked in yet and are never auto-started;
 * skipped (no_show) / cancelled / completed patients never appear in
 * `waiting` at all (the backend buckets them into `finished`).
 */
export function nextEligiblePatient(
  queue: DoctorQueue
): QueuePatient | null {
  return (
    queue.waiting.find((patient) => patient.status === "arrived") ??
    null
  );
}

const ACTION_BUTTON =
  "rounded-xl border px-4 py-2 text-sm font-medium transition-all disabled:opacity-50";

export default function DoctorQueueCard({
  queue,
  busyId,
  isBusy,
  onArrive,
  onStart,
  onSkip,
  onCallNext,
  onComplete,
}: DoctorQueueCardProps) {
  const next = nextEligiblePatient(queue);

  // Why the Next action is unavailable, in priority order.
  const nextBlockedReason = queue.current
    ? "The current consultation must finish through Complete + Payment first."
    :!next
      ? "No arrived patient yet — mark a patient as arrived to call them."
      : null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

      {/* Header: doctor identity + queue counters */}
      <div className="mb-6 flex items-center justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-2xl">
            👨‍⚕️
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {queue.doctor.name}
            </h3>

            <p className="text-sm text-slate-500">
              {queue.doctor.specialty || "General"}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2">

          {queue.current && (
            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              In consultation
            </span>
          )}

          <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            {queue.waiting.length} waiting
          </span>

        </div>

      </div>

      {/* Current patient — visually prominent */}
      {queue.current ? (

        <div className="mb-4 rounded-3xl border border-green-200 bg-green-50 p-6">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
                🩺
              </div>

              <div>

                <span className="inline-flex rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                  Now Serving
                </span>

                <h4 className="mt-2 text-xl font-bold text-slate-900">
                  {queue.current.patient.name}
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  {queue.current.patient.phone || "No phone number"} ·{" "}
                  <span className="font-semibold text-green-700">
                    #{queue.current.queue_number}
                  </span>
                </p>

              </div>

            </div>

            <button
              onClick={() => onComplete(queue.current as QueuePatient)}
              className="rounded-xl border border-sky-200 bg-white px-5 py-3 text-sm font-semibold text-sky-700 transition-all hover:bg-sky-50"
            >
              ✅ Complete + Payment
            </button>

          </div>

        </div>

      ) : (

        <div className="mb-4 rounded-3xl border-2 border-dashed border-slate-300 p-6 text-center">

          <p className="text-4xl">🩺</p>

          <p className="mt-2 font-semibold text-slate-700">
            No patient in consultation
          </p>

        </div>

      )}

      {/* Next patient + the gated Call Next action */}
      <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 p-5">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <span className="inline-flex rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold text-white">
              Next Patient
            </span>

            {next ? (

              <p className="mt-2 font-semibold text-slate-900">
                {next.patient.name}{" "}
                <span className="font-normal text-slate-500">
                  · #{next.queue_number}
                </span>
              </p>

            ) : (

              <p className="mt-2 text-sm text-slate-500">
                No arrived patient in line.
              </p>

            )}

          </div>

          <button
            onClick={() => onCallNext(queue)}
            disabled={isBusy || nextBlockedReason !== null}
            title={nextBlockedReason ?? "Call the next arrived patient"}
            className={`${ACTION_BUTTON} border-green-200 bg-white text-green-700 hover:bg-green-50`}
          >
            ▶ Call Next Patient
          </button>

        </div>

        {nextBlockedReason && (
          <p className="mt-3 text-xs font-medium text-amber-700">
            ⚠️ {nextBlockedReason}
          </p>
        )}

      </div>

      {/* Waiting list, in queue-number order */}
      <div className="mb-6">

        <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
          Waiting ({queue.waiting.length})
        </h4>

        {queue.waiting.length === 0 ? (

          <p className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
            No patients waiting.
          </p>

        ) : (

          <div className="space-y-3">

            {queue.waiting.map((patient) => (
              <div
                key={patient.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >

                <div className="flex items-center gap-3">

                  <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                    #{patient.queue_number}
                  </span>

                  <div>

                    <p className="font-semibold text-slate-900">
                      {patient.patient.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {patient.patient.phone || "No phone number"}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-2">

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      patient.status === "arrived"
                        ? "bg-sky-100 text-sky-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {patient.status === "arrived"
                      ? "Arrived"
                      : "Waiting"}
                  </span>

                  {patient.status === "pending" && (
                    <button
                      disabled={isBusy || busyId === patient.id}
                      onClick={() => onArrive(patient)}
                      className={`${ACTION_BUTTON} border-slate-200 bg-white text-slate-700 hover:bg-slate-100`}
                    >
                      🧍 Mark Arrived
                    </button>
                  )}

                  <button
                    disabled={isBusy || busyId === patient.id}
                    onClick={() => onStart(patient)}
                    className={`${ACTION_BUTTON} border-green-200 bg-white text-green-700 hover:bg-green-50`}
                  >
                    ▶ Start
                  </button>

                  <button
                    disabled={isBusy || busyId === patient.id}
                    onClick={() => onSkip(patient)}
                    className={`${ACTION_BUTTON} border-amber-200 bg-white text-amber-700 hover:bg-amber-50`}
                  >
                    ⏭️ Skip
                  </button>

                </div>

              </div>
            ))}

          </div>

        )}

      </div>

      {/* Compact finished-today summary (completed / cancelled / no_show) */}
      <details className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

        <summary className="cursor-pointer text-sm font-semibold text-slate-600">
          Finished today ({queue.finished.length})
        </summary>

        {queue.finished.length === 0 ? (

          <p className="mt-3 text-sm text-slate-500">
            Nothing finished yet.
          </p>

        ) : (

          <div className="mt-3 space-y-2">

            {queue.finished.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between text-sm"
              >

                <span className="text-slate-700">
                  #{patient.queue_number} · {patient.patient.name}
                </span>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    patient.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : patient.status === "no_show"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {patient.status === "no_show"
                    ? "Skipped"
                    : patient.status}
                </span>

              </div>
            ))}

          </div>

        )}

      </details>

    </div>
  );
}

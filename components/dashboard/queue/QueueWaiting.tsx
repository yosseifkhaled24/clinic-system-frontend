"use client";

import type { QueuePatient } from "@/types/queue";

interface QueueWaitingProps {
  patients: QueuePatient[];
  /** A: promote the patient to in_progress (Start Consultation). */
  onStart?: (patient: QueuePatient) => Promise<void>;
  /** A: absent patient -> no_show (skipped, never reinserted). */
  onSkip?: (patient: QueuePatient) => Promise<void>;
  /** True while any queue action is in flight. */
  isBusy?: boolean;
}

export default function QueueWaiting({
  patients,
  onStart,
  onSkip,
  isBusy = false,
}: QueueWaitingProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Waiting Patients
        </h2>

        <p className="mt-2 text-slate-500">
          Patients waiting for their turn today.
        </p>

      </div>

      {patients.length === 0 ? (

        <div className="rounded-3xl border-2 border-dashed border-slate-300 p-12 text-center">

          <div className="text-5xl">
            ⏳
          </div>

          <h3 className="mt-5 text-xl font-bold text-slate-900">
            No Waiting Patients
          </h3>

          <p className="mt-2 text-slate-500">
            The waiting list is currently empty.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {patients.map((patient, index) => (

            <div
              key={patient.id}
              className={`rounded-2xl border bg-slate-50 p-5 transition ${
                index === 0
                  ? "border-yellow-300 hover:border-yellow-400 hover:bg-yellow-50"
                  : "border-slate-200 hover:border-yellow-300 hover:bg-yellow-50"
              }`}
            >

              <div className="flex flex-wrap items-center justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl">
                    ⏳
                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <h3 className="font-semibold text-slate-900">
                        {patient.patient.name}
                      </h3>

                      {/* A: the head of the queue is the next patient. */}
                      {index === 0 && (
                        <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                          Next Patient
                        </span>
                      )}

                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {patient.patient.phone || "No phone number"}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  {/* A: direct actions — Start Consultation / Skip. */}
                  {onStart && (
                    <button
                      disabled={isBusy}
                      onClick={() => onStart(patient)}
                      className="rounded-xl border border-green-200 px-4 py-2 text-sm font-medium text-green-700 transition-all hover:bg-green-50 disabled:opacity-50"
                    >
                      ▶️ Start
                    </button>
                  )}

                  {onSkip && (
                    <button
                      disabled={isBusy}
                      onClick={() => onSkip(patient)}
                      className="rounded-xl border border-amber-200 px-4 py-2 text-sm font-medium text-amber-700 transition-all hover:bg-amber-50 disabled:opacity-50"
                    >
                      ⏭️ Skip
                    </button>
                  )}

                  <div className="text-right">

                    <span className="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                      #{patient.queue_number}
                    </span>

                    <p className="mt-2 text-xs text-slate-400">
                      Waiting
                    </p>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}
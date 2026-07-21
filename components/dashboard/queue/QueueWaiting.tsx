"use client";

import type { QueuePatient } from "@/types/queue";

interface QueueWaitingProps {
  patients: QueuePatient[];
}

export default function QueueWaiting({
  patients,
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

          {patients.map((patient) => (

            <div
              key={patient.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-yellow-300 hover:bg-yellow-50"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl">
                  ⏳
                </div>

                <div>

                  <h3 className="font-semibold text-slate-900">
                    {patient.patient.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {patient.patient.phone || "No phone number"}
                  </p>

                </div>

              </div>

              <div className="text-right">

                <span className="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                  #{patient.queue_number}
                </span>

                <p className="mt-2 text-xs text-slate-400">
                  Waiting
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}
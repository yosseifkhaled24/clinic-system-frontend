"use client";

import type { QueuePatient } from "@/types/queue";

interface QueueFinishedProps {
  patients: QueuePatient[];
}

export default function QueueFinished({
  patients,
}: QueueFinishedProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Finished Patients
        </h2>

        <p className="mt-2 text-slate-500">
          Patients who have completed their appointments today.
        </p>

      </div>

      {patients.length === 0 ? (

        <div className="rounded-3xl border-2 border-dashed border-slate-300 p-12 text-center">

          <div className="text-5xl">
            ✅
          </div>

          <h3 className="mt-5 text-xl font-bold text-slate-900">
            No Finished Patients
          </h3>

          <p className="mt-2 text-slate-500">
            Finished patients will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {patients.map((patient) => (

            <div
              key={patient.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-green-200 hover:bg-green-50"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
                  ✅
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

                <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  #{patient.queue_number}
                </span>

                <p className="mt-2 text-xs text-slate-400">
                  Completed
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}
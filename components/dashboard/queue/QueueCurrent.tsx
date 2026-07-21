"use client";

import type { QueuePatient } from "@/types/queue";

interface QueueCurrentProps {
  patient: QueuePatient | null;
}

export default function QueueCurrent({
  patient,
}: QueueCurrentProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="mb-2 text-2xl font-bold text-slate-900">
        Current Patient
      </h2>

      <p className="mb-8 text-slate-500">
        Patient currently being served.
      </p>

      {patient ? (

        <div className="rounded-3xl border border-green-200 bg-green-50 p-8">

          <div className="flex flex-col items-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl">
              👤
            </div>

            <h3 className="mt-6 text-2xl font-bold text-slate-900">
              {patient.patient.name}
            </h3>

            <p className="mt-2 text-slate-500">
              {patient.patient.phone || "No phone number"}
            </p>

          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl bg-white p-5 text-center">

              <p className="text-sm text-slate-500">
                Queue Number
              </p>

              <h4 className="mt-2 text-3xl font-bold text-green-600">
                #{patient.queue_number}
              </h4>

            </div>

            <div className="rounded-2xl bg-white p-5 text-center">

              <p className="text-sm text-slate-500">
                Status
              </p>

              <span className="mt-2 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                Now Serving
              </span>

            </div>

          </div>

        </div>

      ) : (

        <div className="rounded-3xl border-2 border-dashed border-slate-300 p-14 text-center">

          <div className="text-6xl">
            🩺
          </div>

          <h3 className="mt-6 text-2xl font-bold text-slate-900">
            No Current Patient
          </h3>

          <p className="mt-3 text-slate-500">
            There is no patient currently being served.
          </p>

        </div>

      )}

    </div>
  );
}
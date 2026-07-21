"use client";

import type { Schedule } from "@/types/schedule";

interface ScheduleTableProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}

export default function ScheduleTable({
  schedules,
  onEdit,
  onDelete,
}: ScheduleTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="border-b border-slate-200 bg-slate-50">

            <tr>

              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Doctor
              </th>

              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Working Day
              </th>

              <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Max Patients
              </th>

              <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {schedules.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  className="py-16 text-center text-slate-500"
                >
                  No schedules found.
                </td>

              </tr>

            )}

            {schedules.map((schedule) => (
              <tr
                key={schedule.id}
                className="transition hover:bg-slate-50"
              >

                <td className="px-6 py-5">

                  <div>

                    <p className="font-semibold text-slate-900">
                      {schedule.doctor.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Doctor Schedule
                    </p>

                  </div>

                </td>

                <td className="px-6 py-5">

                  <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
                    {schedule.day}
                  </span>

                </td>
                                <td className="px-6 py-5 text-center">

                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                      schedule.is_available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {schedule.is_available
                      ? "Available"
                      : "Unavailable"}
                  </span>

                </td>

                <td className="px-6 py-5 text-center">

                  <span className="rounded-full bg-slate-100 px-4 py-2 font-bold text-slate-700">
                    {schedule.max_patients}
                  </span>

                </td>

               <td className="px-6 py-5">

  <div className="flex justify-center gap-3">

    <button
      onClick={() => onEdit(schedule)}
      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
    >
      ✏️ Edit
    </button>

    <button
      onClick={() => onDelete(schedule)}
      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
    >
      🗑 Delete
    </button>

  </div>

</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
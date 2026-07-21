"use client";

import type { Appointment } from "@/types/appointment";

interface AppointmentTableProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
}

export default function AppointmentTable({
  appointments,
  onEdit,
  onCancel,
}: AppointmentTableProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr className="border-b border-slate-200">

              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Patient
              </th>

              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Doctor
              </th>

              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Date
              </th>

              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {appointments.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  className="py-16 text-center text-slate-500"
                >

                  <div className="flex flex-col items-center gap-2">

                    <div className="text-5xl">
                      📅
                    </div>

                    <p className="text-lg font-semibold">
                      No appointments found
                    </p>

                    <p className="text-sm text-slate-400">
                      Start by creating your first appointment.
                    </p>

                  </div>

                </td>

              </tr>

            )}
                        {appointments.map((appointment) => (

              <tr
                key={appointment.id}
                className="border-b border-slate-100 transition hover:bg-sky-50/40"
              >

                <td className="px-6 py-5">

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {appointment.patient.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {appointment.patient.phone || "No phone"}
                    </p>

                  </div>

                </td>

                <td className="px-6 py-5">

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {appointment.doctor.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {appointment.doctor.specialty || "General"}
                    </p>

                  </div>

                </td>

                <td className="px-6 py-5 text-sm text-slate-600">

                  <div className="space-y-1">

                    <p>
                      {appointment.appointment_date}
                    </p>

                    {appointment.queue_number && (
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        Queue #{appointment.queue_number}
                      </span>
                    )}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() => onEdit(appointment)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => onCancel(appointment)}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
                    >
                      ❌ Cancel
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
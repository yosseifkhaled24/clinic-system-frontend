"use client";

import { ApiImage } from "@/components/ui/ApiImage";
import type { Doctor } from "@/types/doctor";

interface DoctorTableProps {
  doctors: Doctor[];
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

export default function DoctorTable({
  doctors,
  onEdit,
  onDelete,
}: DoctorTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="border-b border-slate-200 bg-slate-50">

            <tr>

              <th className="px-6 py-5 text-start text-xs font-bold uppercase tracking-wider text-slate-500">
                Doctor
              </th>

              <th className="px-6 py-5 text-start text-xs font-bold uppercase tracking-wider text-slate-500">
                Specialty
              </th>

              <th className="px-6 py-5 text-start text-xs font-bold uppercase tracking-wider text-slate-500">
                Phone
              </th>

              <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {doctors.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-16 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center gap-2">

                    <div className="text-5xl">
                      👨‍⚕️
                    </div>

                    <p className="text-lg font-semibold">
                      No doctors found
                    </p>

                    <p className="text-sm text-slate-400">
                      Start by adding your first doctor.
                    </p>

                  </div>
                </td>
              </tr>
            )}

            {doctors.map((doctor) => (

              <tr
                key={doctor.id}
                className="transition hover:bg-slate-50"
              >

                <td className="px-6 py-5">

                  <div className="flex items-center gap-4">

                    <ApiImage
                      src={doctor.image_url}
                      alt={doctor.name}
                      className="h-16 w-16 rounded-2xl object-cover"
                      fallbackClassName="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500"
                    />

                    <div>

                      <h3 className="font-semibold text-slate-900">
                        {doctor.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {doctor.email || "No email provided"}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="px-6 py-5">

                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    {doctor.specialty || "General"}
                  </span>

                </td>

                <td className="px-6 py-5 text-sm text-slate-600">
                  {doctor.phone || "-"}
                </td>

                <td className="px-6 py-5">
                  <div className="flex justify-center gap-3">
                                        <button
                      onClick={() => onEdit(doctor)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => onDelete(doctor)}
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
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Photo
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Name
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Specialty
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Email
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Phone
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {doctors.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="py-10 text-center text-slate-500"
              >
                No doctors found.
              </td>
            </tr>
          )}

          {doctors.map((doctor) => (

            <tr
              key={doctor.id}
              className="border-t transition hover:bg-slate-50"
            >

              <td className="px-6 py-4">

                <ApiImage
                  src={doctor.image_url}
                  alt={doctor.name}
                  className="h-14 w-14 rounded-xl object-cover"
                  fallbackClassName="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-xs"
                />

              </td>

              <td className="px-6 py-4 font-semibold">
                {doctor.name}
              </td>

              <td className="px-6 py-4">
                {doctor.specialty || "-"}
              </td>

              <td className="px-6 py-4">
                {doctor.email || "-"}
              </td>

              <td className="px-6 py-4">
                {doctor.phone || "-"}
              </td>

              <td className="px-6 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onEdit(doctor)}
                    className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(doctor)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
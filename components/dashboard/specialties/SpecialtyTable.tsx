"use client";

import type { Specialty } from "@/types/specialty";

interface SpecialtyTableProps {
  specialties: Specialty[];
  onEdit: (specialty: Specialty) => void;
  onDelete: (specialty: Specialty) => void;
}

export default function SpecialtyTable({
  specialties,
  onEdit,
  onDelete,
}: SpecialtyTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="border-b border-slate-200 bg-slate-50">

            <tr>

              <th className="px-6 py-5 text-start text-xs font-bold uppercase tracking-wider text-slate-500">
                Specialty
              </th>

              <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {specialties.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="py-16 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center gap-2">

                    <div className="text-5xl">
                      🏷️
                    </div>

                    <p className="text-lg font-semibold">
                      No specialties found
                    </p>

                    <p className="text-sm text-slate-400">
                      Start by adding your first specialty.
                    </p>

                  </div>
                </td>
              </tr>
            )}

            {specialties.map((specialty) => (

              <tr
                key={specialty.id}
                className="transition hover:bg-slate-50"
              >

                <td className="px-6 py-5">

                  <h3 className="font-semibold text-slate-900">
                    {specialty.name}
                  </h3>

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() => onEdit(specialty)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => onDelete(specialty)}
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

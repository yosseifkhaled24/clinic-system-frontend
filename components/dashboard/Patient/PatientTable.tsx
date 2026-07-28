"use client";

import type { Patient } from "@/types/patient";

import { useRouter } from "next/navigation";

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export default function PatientTable({
  
  patients,
  onEdit,
  onDelete,
}: PatientTableProps) {
  const router = useRouter();
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-5 text-start text-xs font-bold uppercase tracking-wider text-slate-500">
                Patient
              </th>

              <th className="px-6 py-5 text-start text-xs font-bold uppercase tracking-wider text-slate-500">
                Phone
              </th>

              <th className="px-6 py-5 text-start text-xs font-bold uppercase tracking-wider text-slate-500">
                Gender
              </th>

              <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {patients.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-16 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-5xl">🧑</div>

                    <p className="text-lg font-semibold">
                      No patients found
                    </p>

                    <p className="text-sm text-slate-400">
                      There are no patients to display.
                    </p>
                  </div>
                </td>
              </tr>
            )}
            

            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="transition hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {patient.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {patient.email || "No email provided"}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-5 text-sm text-slate-600">
                  {patient.phone || "-"}
                </td>

                <td className="px-6 py-5">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold capitalize text-sky-700">
                    {patient.gender || "Unknown"}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <div className="flex justify-center gap-3">
                 <button
  onClick={() => onEdit(patient)}
  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
>
  ✏️ Edit
</button>

<button
  onClick={() =>
    router.push(`/dashboard/patients/history/${patient.id}`)
  }
  className="rounded-xl border border-sky-200 px-4 py-2 text-sm font-medium text-sky-700 transition-all hover:bg-sky-50"
>
  📜 History
</button>

<button
  onClick={() => onDelete(patient)}
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
"use client";

import { ApiImage } from "@/components/ui/ApiImage";
import type { Service } from "@/types/service";

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export default function ServiceTable({
  services,
  onEdit,
  onDelete,
}: ServiceTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr className="border-b border-slate-200">

              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Service
              </th>

              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Price
              </th>

              <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {services.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="py-16 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center gap-2">

                    <div className="text-5xl">
                      🩺
                    </div>

                    <p className="text-lg font-semibold">
                      No services found
                    </p>

                    <p className="text-sm text-slate-400">
                      Start by adding your first service.
                    </p>

                  </div>
                </td>
              </tr>
            )}

            {services.map((service) => (

              <tr
                key={service.id}
                className="border-b border-slate-100 transition hover:bg-sky-50/40"
              >

                <td className="px-6 py-5">

                  <div className="flex items-center gap-4">

                    <ApiImage
                      src={service.image_url}
                      alt={service.name}
                      className="h-16 w-16 rounded-2xl object-cover"
                      fallbackClassName="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500"
                    />

                    <div>

                      <h3 className="font-semibold text-slate-900">
                        {service.name}
                      </h3>

                      <p className="mt-1 max-w-sm text-sm text-slate-500 line-clamp-2">
                        {service.description || "No description provided"}
                      </p>

                    </div>

                  </div>

                </td>
                                <td className="px-6 py-5">

                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">

                    {service.price != null
                      ? `${Number(service.price).toFixed(2)} EGP`
                      : "Free"}

                  </span>

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() => onEdit(service)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => onDelete(service)}
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
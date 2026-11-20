"use client";

import { useState } from "react";

import { cairoToday } from "@/lib/dates";

import type {
  Appointment,
  PaymentMethod,
} from "@/types/appointment";

interface AppointmentTableProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  /** D: direct status transitions (Start / Skip) without opening Edit. */
  onStatusChange: (
    appointment: Appointment,
    status:
      | "arrived"
      | "in_progress"
      | "no_show"
  ) => Promise<void>;
  /** A/B: opens the Complete + payment dialog for the current patient. */
  onComplete: (appointment: Appointment) => void;
  onReceivePayment: (
    appointment: Appointment,
    method: PaymentMethod
  ) => Promise<void>;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  "cash",
  "visa",
  "insurance",
  "stripe",
  "instapay",
  "vodafone_cash",
];

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  visa: "Visa",
  insurance: "Insurance",
  stripe: "Stripe",
  instapay: "InstaPay",
  vodafone_cash: "Vodafone Cash",
};

export default function AppointmentTable({
  appointments,
  onEdit,
  onCancel,
  onStatusChange,
  onComplete,
  onReceivePayment,
}: AppointmentTableProps) {
  const [loadingId, setLoadingId] =
    useState<number | null>(null);

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

  /**
   * D: an appointment is "expired" once its clinic day has passed while
   * the patient never reached a resolution (still pending/arrived/in
   * progress). The cleanup command turns these into deletions or no_shows
   * after the day ends.
   */
  function isExpired(appointment: Appointment) {
    return (
      appointment.appointment_date < cairoToday() &&
      ["pending", "arrived", "in_progress"].includes(
        appointment.status
      )
    );
  }

  async function runAction(
    appointment: number,
    action: () => Promise<unknown>
  ) {
    try {
      setLoadingId(appointment);

      await action();
    } finally {
      setLoadingId(null);
    }
  }

  async function receivePayment(
    appointment: Appointment,
    method: PaymentMethod
  ) {
    await runAction(appointment.id, () =>
      onReceivePayment(appointment, method)
    );
  }

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
                Doctor
              </th>

              <th className="px-6 py-5 text-start text-xs font-bold uppercase tracking-wider text-slate-500">
                Date
              </th>

              <th className="px-6 py-5 text-start text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

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
                className="transition hover:bg-slate-50"
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
                    <p>{appointment.appointment_date}</p>

                    {appointment.queue_number && (
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        Queue #{appointment.queue_number}
                      </span>
                    )}

                    {isExpired(appointment) && (
                      <div>
                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          ⏰ Expired
                        </span>
                      </div>
                    )}

                    {appointment.needs_investigation && (
                      <div>
                        <span
                          title="Completed but never paid — flagged by the end-of-day cleanup and excluded from revenue."
                          className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700"
                        >
                          ⚠️ Needs review
                        </span>
                      </div>
                    )}

                    <div className="mt-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          appointment.payment.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {appointment.payment.status === "paid"
                          ? `Paid (${appointment.payment.method ?? "-"})`
                          : "Unpaid"}
                      </span>
                    </div>
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
                  <div className="flex justify-center gap-3 flex-wrap">
                    {/* A: direct queue actions — Start / Skip / Complete
                        without opening the Edit form. */}
                    {(appointment.status === "pending" ||
                      appointment.status === "arrived") && (
                      <>
                        <button
                          disabled={loadingId === appointment.id}
                          onClick={() =>
                            runAction(appointment.id, () =>
                              onStatusChange(
                                appointment,
                                "in_progress"
                              )
                            )
                          }
                          className="rounded-xl border border-green-200 px-4 py-2 text-sm font-medium text-green-700 transition-all hover:bg-green-50 disabled:opacity-50"
                        >
                          ▶️ Start
                        </button>

                        <button
                          disabled={loadingId === appointment.id}
                          onClick={() =>
                            runAction(appointment.id, () =>
                              onStatusChange(appointment, "no_show")
                            )
                          }
                          className="rounded-xl border border-amber-200 px-4 py-2 text-sm font-medium text-amber-700 transition-all hover:bg-amber-50 disabled:opacity-50"
                        >
                          ⏭️ Skip
                        </button>
                      </>
                    )}

                    {appointment.status === "in_progress" && (
                      <button
                        disabled={loadingId === appointment.id}
                        onClick={() => onComplete(appointment)}
                        className="rounded-xl border border-sky-200 px-4 py-2 text-sm font-medium text-sky-700 transition-all hover:bg-sky-50 disabled:opacity-50"
                      >
                        ✅ Complete
                      </button>
                    )}

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

                    {appointment.payment.status === "unpaid" && (
                      <select
                        disabled={loadingId === appointment.id}
                        defaultValue=""
                        onChange={(e) => {
                          if (!e.target.value) return;

                          receivePayment(
                            appointment,
                            e.target.value as PaymentMethod
                          );

                          e.target.selectedIndex = 0;
                        }}
                        className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700"
                      >
                        <option value="">
                          💰 Receive Payment
                        </option>

                        {PAYMENT_METHODS.map((method) => (
                          <option
                            key={method}
                            value={method}
                          >
                            {PAYMENT_METHOD_LABELS[method]}
                          </option>
                        ))}
                      </select>
                    )}
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

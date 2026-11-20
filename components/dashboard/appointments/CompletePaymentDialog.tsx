"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

import type { PaymentMethod } from "@/types/appointment";

interface CompletePaymentDialogProps {
  open: boolean;
  patientName?: string;
  serviceName?: string | null;
  /** The actual consultation amount, server-stored on the appointment. */
  amount: string | number;
  /** Already paid (cash earlier, or Stripe online via the webhook). */
  isPaid?: boolean;
  isSubmitting?: boolean;
  onCancel: () => void;
  /**
   * Confirms completion. `method` is the selected payment method, or null
   * when the appointment is already paid (no second payment is recorded).
   */
  onConfirm: (method: PaymentMethod | null) => void;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "visa", label: "Visa" },
  { value: "insurance", label: "Insurance" },
  { value: "stripe", label: "Stripe" },
  { value: "instapay", label: "InstaPay" },
  { value: "vodafone_cash", label: "Vodafone Cash" },
];

/**
 * B: the Complete-consultation payment dialog. Shown when staff finish a
 * consultation — displays the ACTUAL amount stored server-side on the
 * appointment and collects the payment method. The backend then records
 * the payment and marks the appointment completed in one transaction.
 * For an already-paid appointment (e.g. paid online through Stripe) the
 * method selection is replaced with a plain confirmation so no duplicate
 * payment can be recorded.
 */
export default function CompletePaymentDialog({
  open,
  patientName,
  serviceName,
  amount,
  isPaid = false,
  isSubmitting = false,
  onCancel,
  onConfirm,
}: CompletePaymentDialogProps) {
  const [method, setMethod] = useState<PaymentMethod>("cash");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mb-6">

          <h2 className="text-2xl font-bold text-slate-900">
            Complete Consultation
          </h2>

          <p className="mt-2 text-slate-500">
            Record the payment for{" "}
            <span className="font-semibold text-slate-900">
              {patientName}
            </span>{" "}
            to complete the appointment.
          </p>

        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">

          {serviceName && (
            <p className="text-sm text-slate-500">
              {serviceName}
            </p>
          )}

          <div className="mt-1 flex items-center justify-between">

            <span className="text-sm font-semibold text-slate-600">
              Consultation Amount
            </span>

            <span className="text-2xl font-bold text-slate-900">
              {amount} EGP
            </span>

          </div>

        </div>

        {isPaid ? (

          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            Already paid — completing will not record another payment.
          </div>

        ) : (

          <div className="mb-6">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Payment Method
            </label>

            <select
              value={method}
              onChange={(e) =>
                setMethod(e.target.value as PaymentMethod)
              }
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            >
              {PAYMENT_METHODS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

          </div>

        )}

        <div className="flex justify-end gap-3">

          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Keep Open
          </Button>

          <Button
            type="button"
            onClick={() => onConfirm(isPaid ? null : method)}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : isPaid
                ? "Complete Appointment"
                : "Receive Payment & Complete"}
          </Button>

        </div>

      </div>

    </div>
  );
}

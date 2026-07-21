"use client";

import { Button } from "@/components/ui/Button";

interface DeleteAppointmentDialogProps {
  open: boolean;
  patientName?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteAppointmentDialog({
  open,
  patientName,
  onCancel,
  onConfirm,
}: DeleteAppointmentDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mb-6">

          <h2 className="text-2xl font-bold text-slate-900">
            Cancel Appointment
          </h2>

          <p className="mt-2 text-slate-500">
            Are you sure you want to cancel the appointment for{" "}
            <span className="font-semibold text-slate-900">
              {patientName}
            </span>
            ?
          </p>

        </div>
                <div className="flex justify-end gap-3">

          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            Keep Appointment
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Cancel Appointment
          </Button>

        </div>

      </div>

    </div>
  );
}
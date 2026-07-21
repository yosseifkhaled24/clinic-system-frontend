"use client";

import { Button } from "@/components/ui/Button";

import type { Schedule } from "@/types/schedule";

interface DeleteScheduleDialogProps {
  open: boolean;
  schedule: Schedule | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteScheduleDialog({
  open,
  schedule,
  onCancel,
  onConfirm,
}: DeleteScheduleDialogProps) {
  if (!open || !schedule) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">

          <span className="text-4xl">🗑️</span>

        </div>

        <h2 className="mt-6 text-center text-2xl font-bold text-slate-900">
          Delete Schedule
        </h2>

        <p className="mt-4 text-center text-slate-500">
          Are you sure you want to delete the schedule for
          <span className="font-semibold text-slate-900">
            {" "}
            {schedule.doctor.name}
          </span>
          ?
        </p>

        <p className="mt-2 text-center text-sm text-slate-400">
          {schedule.day} • Max Patients: {schedule.max_patients}
        </p>

        <div className="mt-8 flex justify-end gap-3">

          <Button
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>

        </div>

      </div>

    </div>
  );
}
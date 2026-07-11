"use client";

import { Button } from "@/components/ui/Button";

interface DeleteDoctorDialogProps {
  open: boolean;
  doctorName?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteDoctorDialog({
  open,
  doctorName,
  loading = false,
  onCancel,
  onConfirm,
}: DeleteDoctorDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">

        <div className="border-b border-slate-200 p-6">

          <h2 className="text-2xl font-bold text-slate-900">
            Delete Doctor
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Are you sure you want to delete
            <span className="font-semibold text-slate-900">
              {" "}
              {doctorName}
            </span>
            ?
          </p>

        </div>

        <div className="flex justify-end gap-3 p-6">

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <Button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>

        </div>

      </div>

    </div>
  );
}
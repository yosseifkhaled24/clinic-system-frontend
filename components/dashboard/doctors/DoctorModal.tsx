"use client";

import DoctorForm from "./DoctorForm";
import type { Doctor } from "@/types/doctor";

interface DoctorModalProps {
  open: boolean;
  initialData?: Doctor | null;
  isSubmitting: boolean;
  onSubmit: (form: FormData) => void;
  onClose: () => void;
}

export default function DoctorModal({
  open,
  initialData,
  isSubmitting,
  onSubmit,
  onClose,
}: DoctorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">

      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {initialData ? "Edit Doctor" : "Add Doctor"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Fill doctor information.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            ✕
          </button>

        </div>

        <div className="p-6">

          <DoctorForm
            initialData={initialData}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onClose}
          />

        </div>

      </div>

    </div>
  );
}
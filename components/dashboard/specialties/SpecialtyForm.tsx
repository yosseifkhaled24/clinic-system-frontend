"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Specialty } from "@/types/specialty";

interface SpecialtyFormProps {
  initialData?: Specialty | null;
  isSubmitting: boolean;
  onSubmit: (payload: { name: string }) => void;
  onCancel: () => void;
}

export default function SpecialtyForm({
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}: SpecialtyFormProps) {
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setName(initialData?.name ?? "");
    setLocalError("");
  }, [initialData]);

  const handleSubmit = () => {
    const trimmed = name.trim();

    if (!trimmed) {
      setLocalError("Specialty name is required.");
      return;
    }

    if (trimmed.length > 255) {
      setLocalError("Specialty name must be 255 characters or fewer.");
      return;
    }

    setLocalError("");
    onSubmit({ name: trimmed });
  };

  return (
    <div className="space-y-8">

      <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">

        <p className="mt-2 text-slate-500">
          {initialData
            ? "Update the specialty name. Doctors assigned to it keep their link."
            : "Create a new specialty that doctors can be assigned to."}
        </p>

      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="mb-8 text-xl font-bold text-slate-800">
          Specialty Information
        </h2>

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Specialty Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (localError) setLocalError("");
            }}
            placeholder="Cardiology"
            maxLength={255}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />

          {localError && (
            <p className="mt-2 text-sm text-red-600">
              {localError}
            </p>
          )}

          <p className="mt-3 text-sm text-slate-400">
            Names must be unique — differences in casing or extra spaces are
            treated as the same specialty.
          </p>

        </div>

      </div>

      {/* Actions */}

      <div className="flex items-center justify-end gap-4">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Cancel
        </button>

        <Button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="px-8 py-3"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Specialty"
            : "Save Specialty"}
        </Button>

      </div>

    </div>
  );
}

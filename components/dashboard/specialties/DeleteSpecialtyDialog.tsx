"use client";

interface DeleteSpecialtyDialogProps {
  open: boolean;
  specialtyName?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteSpecialtyDialog({
  open,
  specialtyName,
  onCancel,
  onConfirm,
}: DeleteSpecialtyDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        <h2 className="text-xl font-bold">
          Delete Specialty
        </h2>

        <p className="mt-3 text-slate-600">
          Are you sure you want to delete
          <span className="font-semibold"> {specialtyName}</span>?
        </p>

        <p className="mt-2 text-sm text-slate-400">
          Specialties assigned to doctors cannot be deleted.
        </p>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-5 py-2 text-white"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Patient } from "@/types/patient";

interface PatientFormProps {
  initialData?: Patient | null;
  isSubmitting: boolean;
  onSubmit: (patient: Partial<Patient>) => void;
  onCancel: () => void;
}

export default function PatientForm({
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}: PatientFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!initialData) return;

    setName(initialData.name ?? "");
    setPhone(initialData.phone ?? "");
    setEmail(initialData.email ?? "");
    setGender(initialData.gender ?? "");
    setDateOfBirth(initialData.date_of_birth ?? "");
    setAddress(initialData.address ?? "");
    setNotes(initialData.notes ?? "");
  }, [initialData]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800">
          Edit Patient
        </h1>

        <p className="mt-2 text-slate-500">
          Update patient information.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-8 text-xl font-bold text-slate-800">
          Patient Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ahmed Mohamed"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Phone
            </label>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010xxxxxxxx"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patient@example.com"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Gender
            </label>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Birth Date
            </label>

            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Address
            </label>

            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Patient address"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-slate-800">
          Notes
        </h2>

        <textarea
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write notes about the patient..."
          className="w-full resize-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />

        <p className="mt-3 text-sm text-slate-400">
          These notes are visible only to clinic staff.
        </p>
      </div>

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
          onClick={() =>
            onSubmit({
              name,
              phone,
              email,
              gender: gender as "male" | "female",
              date_of_birth: dateOfBirth,
              address,
              notes,
            })
          }
          className="px-8 py-3"
        >
          {isSubmitting ? "Saving..." : "Update Patient"}
        </Button>
      </div>
    </div>
  );
}
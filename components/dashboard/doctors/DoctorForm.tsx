"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ApiImage } from "@/components/ui/ApiImage";
import type { Doctor } from "@/types/doctor";
import type { Specialty } from "@/types/specialty";
import { specialtiesService } from "@/services/specialties.service";

interface DoctorFormProps {
  initialData?: Doctor | null;
  isSubmitting: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

export default function DoctorForm({
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}: DoctorFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // Specialty selection comes from the database only — no free text.
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [specialtyId, setSpecialtyId] = useState("");
  const [isLoadingSpecialties, setIsLoadingSpecialties] =
    useState(true);
  const [specialtiesError, setSpecialtiesError] = useState("");

  useEffect(() => {
    loadSpecialties();
  }, []);

  async function loadSpecialties() {
    try {
      setIsLoadingSpecialties(true);
      setSpecialtiesError("");

      const response = await specialtiesService.getAll();

      setSpecialties(response);
    } catch {
      setSpecialtiesError(
        "Failed to load the specialty list. Check your connection and try again."
      );
    } finally {
      setIsLoadingSpecialties(false);
    }
  }

  useEffect(() => {
    if (!initialData) return;

    setName(initialData.name ?? "");
    setEmail(initialData.email ?? "");
    setPhone(initialData.phone ?? "");
    setBio(initialData.bio ?? "");
    setPreview(initialData.image_url ?? "");
  }, [initialData]);

  // Pre-select the doctor's current specialty once the list is loaded:
  // prefer the linked id, fall back to matching the legacy string name.
  // Derived (not an effect) — the explicit user choice always wins.
  const matchedSpecialty =
    specialties.length > 0 && initialData
      ? (initialData.specialty_id != null
          ? specialties.find(
              (s) => s.id === initialData.specialty_id
            )
          : undefined) ??
        specialties.find((s) => s.name === initialData.specialty)
      : undefined;

  const selectedSpecialtyId =
    specialtyId !== ""
      ? specialtyId
      : matchedSpecialty
      ? String(matchedSpecialty.id)
      : "";

  useEffect(() => {
    if (!image) return;

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const noSpecialties =
    !isLoadingSpecialties &&
    !specialtiesError &&
    specialties.length === 0;

  const canSubmit =
    !isSubmitting &&
    !isLoadingSpecialties &&
    !specialtiesError &&
    !noSpecialties &&
    selectedSpecialtyId !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;

    const form = new FormData();

    form.append("name", name);
    // The backend requires a real specialty record id — the free-text
    // `specialty` field is no longer accepted by the admin API.
    form.append("specialty_id", selectedSpecialtyId);

    if (email) form.append("email", email);
    if (phone) form.append("phone", phone);
    if (bio) form.append("bio", bio);
    if (image) form.append("image", image);

    onSubmit(form);
  };

  return (
    <div className="space-y-8">

      <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">

        

        <p className="mt-2 text-slate-500">
          {initialData
            ? "Update doctor information."
            : "Create a new doctor profile."}
        </p>

      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Image Card */}

<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

  <h2 className="mb-6 text-xl font-bold text-slate-800">
    Doctor Photo
  </h2>

  <div className="flex flex-col items-center">

    <ApiImage
      src={preview}
      alt={name || "Doctor"}
      className="h-56 w-56 rounded-3xl border-4 border-slate-200 object-cover shadow-md"
      fallbackClassName="flex h-56 w-56 items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-100 text-slate-400"
    />

    <label className="mt-6 cursor-pointer rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">

      Upload Image

      <input
        hidden
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            setImage(file);
          }
        }}
      />

    </label>

    <p className="mt-3 text-center text-xs text-slate-400">
      PNG or JPG
    </p>

  </div>

</div>

{/* Form */}

<div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

  <h2 className="mb-8 text-xl font-bold text-slate-800">
    Doctor Information
  </h2>

  <div className="grid gap-6 md:grid-cols-2">

    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Doctor Name
      </label>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ahmed Mohamed"
        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Specialty <span className="text-red-500">*</span>
      </label>

      <select
        value={selectedSpecialtyId}
        onChange={(e) => setSpecialtyId(e.target.value)}
        disabled={
          isLoadingSpecialties || specialties.length === 0
        }
        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="" disabled>
          {isLoadingSpecialties
            ? "Loading specialties..."
            : "Select a specialty"}
        </option>

        {specialties.map((specialty) => (
          <option key={specialty.id} value={specialty.id}>
            {specialty.name}
          </option>
        ))}
      </select>

      {specialtiesError && (
        <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <p>{specialtiesError}</p>

          <button
            type="button"
            onClick={loadSpecialties}
            className="mt-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {noSpecialties && (
        <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          No specialties exist yet. Create a specialty from the
          Specialties page first — doctors must be assigned to one.
        </div>
      )}

      {initialData &&
        !isLoadingSpecialties &&
        !specialtiesError &&
        !noSpecialties &&
        selectedSpecialtyId === "" && (
          <p className="mt-2 text-sm text-amber-600">
            The doctor&apos;s current specialty was not found in the
            list — select one to continue.
          </p>
        )}

    </div>

    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Email
      </label>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="doctor@example.com"
        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Phone
      </label>

      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="010xxxxxxxx"
        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
      />

    </div>

  </div>

</div>

</div>
{/* Biography */}

<div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

  <h2 className="mb-6 text-xl font-bold text-slate-800">
    Biography
  </h2>

  <textarea
    rows={6}
    value={bio}
    onChange={(e) => setBio(e.target.value)}
    placeholder="Write a short biography about the doctor..."
    className="w-full resize-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
  />

  <p className="mt-3 text-sm text-slate-400">
    This information will appear on the doctor&apos;s profile.
  </p>

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
    disabled={!canSubmit}
    onClick={handleSubmit}
    className="px-8 py-3"
  >
    {isSubmitting
      ? "Saving..."
      : initialData
      ? "Update Doctor"
      : "Save Doctor"}
  </Button>

</div>

</div>
  );
}

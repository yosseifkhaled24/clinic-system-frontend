"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ApiImage } from "@/components/ui/ApiImage";
import type { Doctor } from "@/types/doctor";

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
  const [specialty, setSpecialty] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!initialData) return;

    setName(initialData.name ?? "");
    setSpecialty(initialData.specialty ?? "");
    setEmail(initialData.email ?? "");
    setPhone(initialData.phone ?? "");
    setBio(initialData.bio ?? "");
    setPreview(initialData.image_url ?? "");
  }, [initialData]);

  useEffect(() => {
    if (!image) return;

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

 return (
  <div className="space-y-8">

    <div className="flex flex-col items-center gap-4">

      <ApiImage
        src={preview}
        alt={name || "Doctor"}
        className="h-40 w-40 rounded-2xl border-4 border-slate-200 object-cover shadow"
        fallbackClassName="flex h-40 w-40 items-center justify-center rounded-2xl border-4 border-dashed border-slate-300 bg-slate-100 text-slate-500"
      />

      <label className="cursor-pointer rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">

        Upload Doctor Photo

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

    </div>

    <div className="grid gap-5 md:grid-cols-2">
              <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Doctor Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Doctor name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Specialty
        </label>

        <input
          type="text"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          placeholder="Specialty"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
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
          placeholder="doctor@email.com"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
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
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
        />
      </div>

    </div>

    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Biography
      </label>

      <textarea
        rows={5}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Doctor bio..."
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
      />

    </div>
        <div className="flex justify-end gap-3">

      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
      >
        Cancel
      </button>

      <Button
        type="button"
        disabled={isSubmitting}
        onClick={() => {

          const form = new FormData();

          form.append("name", name);

          if (specialty) {
            form.append("specialty", specialty);
          }

          if (email) {
            form.append("email", email);
          }

          if (phone) {
            form.append("phone", phone);
          }

          if (bio) {
            form.append("bio", bio);
          }

          if (image) {
            form.append("image", image);
          }

          onSubmit(form);

        }}
      >
        {isSubmitting ? "Saving..." : initialData ? "Update Doctor" : "Save Doctor"}
      </Button>

    </div>

  </div>
);

}
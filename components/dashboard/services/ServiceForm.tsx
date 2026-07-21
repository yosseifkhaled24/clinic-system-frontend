"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ApiImage } from "@/components/ui/ApiImage";
import type { Service } from "@/types/service";

interface ServiceFormProps {
  initialData?: Service | null;
  isSubmitting: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

export default function ServiceForm({
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}: ServiceFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!initialData) {
      setName("");
      setDescription("");
      setPrice("");
      setImage(null);
      setPreview("");
      return;
    }

    setName(initialData.name ?? "");
    setDescription(initialData.description ?? "");
    setPrice(initialData.price?.toString() ?? "");
    setPreview(initialData.image_url ?? "");
  }, [initialData]);

  useEffect(() => {
    if (!image) return;

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = () => {
    const form = new FormData();

    form.append("name", name.trim());
    form.append("description", description.trim());
    form.append("price", price);

    if (image) {
      form.append("image", image);
    }

    onSubmit(form);
  };
    return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h1 className="text-3xl font-bold text-slate-800">
          {initialData ? "Edit Service" : "Add Service"}
        </h1>

        <p className="mt-2 text-slate-500">
          {initialData
            ? "Update service information."
            : "Create a new clinic service."}
        </p>

      </div>

      <div className="grid gap-8 lg:grid-cols-3">

        {/* Image */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-bold text-slate-800">
            Service Image
          </h2>

          <div className="flex flex-col items-center">

            <ApiImage
              src={preview}
              alt={name || "Service"}
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
            Service Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Service Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dental Cleaning"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Price
              </label>

              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />

            </div>

          </div>

        </div>

      </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-xl font-bold text-slate-800">
          Description
        </h2>

        <textarea
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a description for the service..."
          className="w-full resize-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />

        <p className="mt-3 text-sm text-slate-400">
          This description will be visible to patients.
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
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="px-8 py-3"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Service"
            : "Save Service"}
        </Button>

      </div>

    </div>
  );
}
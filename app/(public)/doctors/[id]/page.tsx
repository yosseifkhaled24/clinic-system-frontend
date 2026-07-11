"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { ApiImage } from "@/components/ui/ApiImage";
import { getErrorMessage } from "@/lib/errors";
import { doctorsService } from "@/services/doctors.service";
import type { Doctor } from "@/types/doctor";

export default function DoctorDetailsPage() {
  const params = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return;

    doctorsService.getById(id).then(setDoctor).catch((error) => {
      setError(getErrorMessage(error, "Unable to load doctor."));
      setDoctor(null);
    }).finally(() => setIsLoading(false));
  }, [params.id]);

  return (
    <Container className="py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {isLoading ? <p className="text-sm text-slate-600">Loading...</p> : null}
        {!isLoading && error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {!isLoading && !error && !doctor ? <p className="text-sm text-slate-600">Doctor not found.</p> : null}
        <ApiImage src={doctor?.image_url} alt={doctor?.name || "Doctor"} className="mb-6 h-72 w-full rounded-2xl object-cover" fallbackClassName="mb-6 flex h-72 w-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500" />
        <h1 className="text-3xl font-semibold text-slate-900">{doctor?.name || "Doctor details"}</h1>
        <p className="mt-3 text-slate-600">{doctor?.bio || doctor?.specialty || "Doctor profile is unavailable."}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <h2 className="font-semibold text-slate-900">Specialty</h2>
            <p className="mt-2 text-sm text-slate-600">{doctor?.specialty || "Specialist"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <h2 className="font-semibold text-slate-900">Contact</h2>
            <p className="mt-2 text-sm text-slate-600">{doctor?.phone || doctor?.email || "Contact details unavailable"}</p>
          </div>
        </div>
      </div>
    </Container>
  );
}

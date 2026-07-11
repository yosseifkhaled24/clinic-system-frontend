"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { ApiImage } from "@/components/ui/ApiImage";
import { useLanguage } from "@/context/LanguageContext";
import { getErrorMessage } from "@/lib/errors";
import { getDictionary } from "@/lib/i18n";
import { doctorsService } from "@/services/doctors.service";
import type { Doctor } from "@/types/doctor";

export default function DoctorsPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    doctorsService.getAll().then((response) => {
      setDoctors(response);
    }).catch((error) => {
      setError(getErrorMessage(error, "Unable to load doctors."));
      setDoctors([]);
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <Container className="py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">{dict.doctors.title}</h1>
        <p className="mt-2 text-slate-600">{dict.doctors.description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {isLoading ? <p className="text-sm text-slate-600">{dict.dashboard.loading}</p> : null}
        {!isLoading && error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {!isLoading && !error && doctors.length === 0 ? <p className="text-sm text-slate-600">No doctors available.</p> : null}
        {doctors.map((doctor) => (
          <div key={doctor.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <ApiImage src={doctor.image_url} alt={doctor.name} className="mb-4 h-44 w-full rounded-2xl object-cover" fallbackClassName="mb-4 flex h-44 w-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500" />
            <h2 className="text-xl font-semibold text-slate-900">{doctor.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{doctor.specialty || "Specialist"}</p>
            <p className="mt-2 text-sm text-slate-500">{doctor.bio || doctor.phone || ""}</p>
            <Link href={`/doctors/${doctor.id}`} className="mt-4 inline-flex text-sm font-semibold text-slate-900">
              {dict.doctors.details} →
            </Link>
          </div>
        ))}
      </div>
    </Container>
  );
}

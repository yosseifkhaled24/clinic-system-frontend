"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { doctorsService } from "@/services/doctors.service";
import type { Doctor } from "@/types/doctor";

export default function DoctorsPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    doctorsService.getAll().then((response) => {
      const list = Array.isArray(response) ? response : (response as { data?: Doctor[] }).data || [];
      setDoctors(list);
    });
  }, []);

  return (
    <Container className="py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">{dict.doctors.title}</h1>
        <p className="mt-2 text-slate-600">{dict.doctors.description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{doctor.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{doctor.specialty}</p>
            <p className="mt-2 text-sm text-slate-500">{doctor.experience}</p>
            <Link href={`/doctors/${doctor.id}`} className="mt-4 inline-flex text-sm font-semibold text-slate-900">
              {dict.doctors.details} →
            </Link>
          </div>
        ))}
      </div>
    </Container>
  );
}

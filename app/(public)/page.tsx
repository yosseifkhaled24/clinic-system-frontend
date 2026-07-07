"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { doctorsService } from "@/services/doctors.service";
import type { Doctor } from "@/types/doctor";

export default function PublicHomePage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    doctorsService.getAll().then((response) => {
      const list = Array.isArray(response) ? response : (response as { data?: Doctor[] }).data || [];
      setDoctors(list.slice(0, 3));
    });
  }, []);

  return (
    <div className="flex flex-col">
      <section className="bg-slate-950 py-20 text-white">
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
              {dict.home.hero.pretitle}
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              {dict.home.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              {dict.home.hero.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/booking">
                <Button>{dict.home.hero.ctaBook}</Button>
              </Link>
              <Link href="/doctors">
                <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
                  {dict.home.hero.ctaExplore}
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur">
            <h2 className="text-2xl font-semibold">{dict.home.benefits.title}</h2>
            <ul className="mt-6 space-y-4 text-sm text-slate-200">
              {dict.home.benefits.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-sky-600">{doctor.specialty}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{doctor.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{doctor.bio || "Experienced specialist"}</p>
                <Link href={`/doctors/${doctor.id}`} className="mt-4 inline-flex text-sm font-semibold text-slate-900">
                  {dict.home.doctorCard.profile} →
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

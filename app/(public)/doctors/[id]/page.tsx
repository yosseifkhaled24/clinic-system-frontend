"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { ApiImage } from "@/components/ui/ApiImage";

import { getErrorMessage } from "@/lib/errors";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

import { doctorsService } from "@/services/doctors.service";
import { schedulesService } from "@/services/schedules.service";

import type { Schedule } from "@/types/schedule";
import type { Doctor } from "@/types/doctor";

export default function DoctorDetailsPage() {
  const params = useParams<{ id: string }>();
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = Number(params.id);

    if (!Number.isFinite(id)) return;

    Promise.all([
      doctorsService.getById(id),
      schedulesService.getByDoctor(id),
    ])
      .then(([doctor, schedules]) => {
        setDoctor(doctor);
        setSchedules(schedules);
      })
      .catch((error) => {
        setError(getErrorMessage(error, "Unable to load doctor."));
        setDoctor(null);
      })
      .finally(() => setIsLoading(false));
  }, [params.id]);

  return (
    <Container className="py-16">
      {isLoading && (
        <div className="rounded-3xl bg-white p-10 text-center shadow">
          {dict.profile.loading}
        </div>
      )}

      {error && (
        <div className="rounded-3xl bg-red-50 p-6 text-center text-red-600">
          {error}
        </div>
      )}

      {!isLoading && !error && doctor && (
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="overflow-hidden rounded-3xl bg-white shadow">
            <ApiImage
              src={doctor.image_url}
              alt={doctor.name}
              className="h-80 w-full object-cover"
              fallbackClassName="flex h-80 items-center justify-center bg-slate-100 text-slate-400"
            />

            <div className="p-6">
              <h1 className="text-2xl font-bold text-slate-900">
                {doctor.name}
              </h1>

              <p className="mt-2 text-sky-600">
                {doctor.specialty || dict.home.doctorCard.specialist}
              </p>

              <p className="mt-4 text-sm text-slate-500">
                {doctor.bio || "Professional medical specialist."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow">
            <h2 className="text-2xl font-bold text-slate-900">
              {dict.doctors.workingHours}
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="font-bold text-slate-900">
                    {schedule.day}
                  </p>

                  <p
                    dir="ltr"
                    className="mt-2 text-center font-medium text-slate-700"
                  >
                    {schedule.start_time.slice(0, 5)} →{" "}
                    {schedule.end_time.slice(0, 5)}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {dict.booking.maxPatients} {schedule.max_patients}
                  </p>
                </div>
              ))}

              {schedules.length === 0 && (
                <p className="text-slate-500">{dict.doctors.noSchedules}</p>
              )}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={`/booking?doctor=${doctor.id}`}>
                <button className="rounded-2xl bg-black px-8 py-4 text-base font-semibold text-white transition-none">
                  {dict.doctors.bookAppointment}
                </button>
              </Link>

              <Link href="/doctors">
                <button className="rounded-2xl border border-slate-300 bg-transparent px-8 py-4 text-base font-semibold text-slate-700 transition-none">
                  {dict.doctors.backToDoctors}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
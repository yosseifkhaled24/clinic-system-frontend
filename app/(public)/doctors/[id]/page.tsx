"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { ApiImage } from "@/components/ui/ApiImage";
import { Button } from "@/components/ui/Button";

import { getErrorMessage } from "@/lib/errors";
import { doctorsService } from "@/services/doctors.service";
import { schedulesService } from "@/services/schedules.service";

import type { Schedule } from "@/types/schedule";

import type { Doctor } from "@/types/doctor";

export default function DoctorDetailsPage() {
  const params = useParams<{ id: string }>();

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
          Loading...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-3xl bg-white p-10 text-center text-red-600 shadow">
          {error}
        </div>
      )}

      {!isLoading && !error && !doctor && (
        <div className="rounded-3xl bg-white p-10 text-center shadow">
          Doctor not found.
        </div>
      )}

      {!isLoading && !error && doctor && (
         <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-xl">

<div className="grid gap-10 lg:grid-cols-[380px_1fr]">

<div>

<ApiImage
  src={doctor.image_url}
  alt={doctor.name}
  className="h-[500px] w-full rounded-[28px] object-cover"
  fallbackClassName="flex h-[500px] w-full items-center justify-center rounded-[28px] bg-slate-100"
/>

</div>

<div className="flex flex-col justify-center">

<span className="w-fit rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">

{doctor.specialty || "Specialist"}

</span>

<h1 className="mt-5 text-5xl font-bold text-slate-900">

{doctor.name}

</h1>

<p className="mt-8 text-lg leading-9 text-slate-600">

{doctor.bio || "No biography available."}

</p>

<div className="mt-10 grid gap-5 md:grid-cols-2">
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
    Phone
  </h3>

  <p className="mt-3 text-xl font-bold text-slate-900">
    {doctor.phone || "Not Available"}
  </p>

 </div>

 <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
    Email
  </h3>

  <p className="mt-3 break-all text-lg font-semibold text-slate-900">
    {doctor.email || "Not Available"}
  </p>

</div>

</div>
<div className="mt-10">
  <h2 className="mb-5 text-2xl font-bold text-slate-900">
    Working Schedule
  </h2>

  <div className="grid gap-4 md:grid-cols-2">
    {schedules
      .filter((schedule) => schedule.is_available)
      .map((schedule) => (
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
    Max Patients: {schedule.max_patients}
  </p>
</div>
      ))}
  </div>
</div>

<div className="mt-10 flex flex-wrap gap-4">
   <Link href={`/booking?doctor=${doctor.id}`}>

  <Button className="px-8 py-4">
    Book Appointment
  </Button>

</Link>

<Link href="/doctors">

  <Button
    variant="ghost"
    className="px-8 py-4"
  >
    Back To Doctors
  </Button>

</Link>

</div>

</div>

</div>

</div>

)}
    </Container>
  );
}

         
"use client";

import Link from "next/link";
import { Star, CalendarDays } from "lucide-react";

import { ApiImage } from "@/components/ui/ApiImage";
import type { Doctor } from "@/types/doctor";

type DoctorCardProps = {
  doctor: Doctor;
};

export default function DoctorCard({
  doctor,
}: DoctorCardProps) {

  return (

    <div className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

      <div className="relative overflow-hidden">

        <ApiImage
          src={doctor.image_url}
          alt={doctor.name}
          className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
          fallbackClassName="flex h-80 items-center justify-center bg-slate-100 text-slate-400"
        />

        <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow">

          {doctor.specialty || "Specialist"}

        </div>

      </div>

      <div className="p-7">
                <div className="mb-4 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-slate-900">

            {doctor.name}

          </h2>

          <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">

            <Star
              size={15}
              fill="currentColor"
            />

            4.9

          </div>

        </div>

        <p className="line-clamp-3 leading-7 text-slate-500">

          {doctor.bio || "Professional medical specialist with years of experience."}

        </p>
                <div className="mt-6 flex items-center justify-between">

          <div className="flex items-center gap-2 text-slate-500">

            <CalendarDays size={18} />

            Available Today

          </div>

          <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">

            250 EGP

          </span>

        </div>

        <div className="mt-8 flex gap-3">

          <Link
            href={`/doctors/${doctor.id}`}
            className="flex-1 rounded-2xl border border-slate-200 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
          >

            View Profile

          </Link>

          <Link
            href={`/booking?doctor=${doctor.id}`}
            className="flex-1 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 py-3 text-center font-semibold text-white shadow-lg transition hover:scale-105"
          >

            Book Now

          </Link>

        </div>

      </div>

    </div>

  );

}
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ApiImage } from "@/components/ui/ApiImage";
import { doctorsService } from "@/services/doctors.service";
import type { Doctor } from "@/types/doctor";

export default function FeaturedDoctors() {

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    doctorsService
      .getAll()
      .then((data) => {
        setDoctors(data.slice(0, 3));
      })
      .finally(() => setLoading(false));

  }, []);

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">

            Doctors

          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">

            Meet Our Specialists

          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">

            Experienced doctors providing exceptional healthcare
            with modern medical technology.

          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                      {loading && (

            <p className="col-span-3 text-center text-slate-500">

              Loading doctors...

            </p>

          )}

          {!loading &&
            doctors.map((doctor) => (

              <div
                key={doctor.id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                <ApiImage
                  src={doctor.image_url}
                  alt={doctor.name}
                  className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  fallbackClassName="flex h-72 items-center justify-center bg-slate-100 text-slate-400"
                />

                <div className="p-7">

                  <p className="text-sm font-semibold text-sky-600">

                    {doctor.specialty || "Specialist"}

                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-slate-900">

                    {doctor.name}

                  </h3>

                  <p className="mt-4 line-clamp-3 text-slate-500">

                    {doctor.bio || "Professional healthcare specialist."}

                  </p>

                  <Link
                    href={`/doctors/${doctor.id}`}
                    className="mt-6 inline-flex font-semibold text-sky-600 transition hover:translate-x-2"
                  >

                    View Profile →

                  </Link>

                </div>

              </div>

            ))}

        </div>

      </div>

    </section>

  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { doctorsService } from "@/services/doctors.service";
import type { Doctor } from "@/types/doctor";

import DoctorCard from "./DoctorCard";

export default function DoctorsGrid() {

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {

    doctorsService
      .getAll()
      .then((data) => setDoctors(data))
      .finally(() => setLoading(false));

  }, []);

  const filteredDoctors = useMemo(() => {

    return doctors.filter((doctor) =>

      doctor.name
        .toLowerCase()
        .includes(search.toLowerCase())

    );

  }, [doctors, search]);

  return (

    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>

            <h2 className="text-4xl font-bold text-slate-900">

              Our Doctors

            </h2>

            <p className="mt-3 text-slate-500">

              Browse our professional medical team.

            </p>

          </div>

          <div className="relative w-full lg:w-96">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 shadow-sm outline-none transition focus:border-sky-500"
            />

          </div>

        </div>
                {loading && (

          <div className="py-20 text-center text-slate-500">

            Loading doctors...

          </div>

        )}

        {!loading && (

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {filteredDoctors.map((doctor) => (

              <DoctorCard
                key={doctor.id}
                doctor={doctor}
              />

            ))}

          </div>

        )}

      </div>

    </section>

  );

}
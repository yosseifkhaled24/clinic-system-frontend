"use client";

import type { Doctor } from "@/types/doctor";

interface QueueDoctorSelectProps {
  doctors: Doctor[];
  value: number | "";
  onChange: (doctorId: number) => void;
}

export default function QueueDoctorSelect({
  doctors,
  value,
  onChange,
}: QueueDoctorSelectProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="mb-2 text-2xl font-bold text-slate-900">
        Select Doctor
      </h2>

      <p className="mb-8 text-slate-500">
        Choose a doctor to display today's queue.
      </p>

      <div>

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Doctor
        </label>

        <select
          value={value}
          onChange={(e) =>
            onChange(Number(e.target.value))
          }
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
        >
          <option value="">
            Choose Doctor
          </option>

          {doctors.map((doctor) => (

            <option
              key={doctor.id}
              value={doctor.id}
            >
              {doctor.name}
            </option>

          ))}

        </select>

      </div>

    </div>
  );
}
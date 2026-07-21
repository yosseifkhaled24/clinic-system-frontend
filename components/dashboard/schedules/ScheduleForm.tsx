"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

import type { Doctor } from "@/types/doctor";
import type { Schedule } from "@/types/schedule";

interface ScheduleFormProps {
  doctors: Doctor[];
  initialData?: Schedule | null;
  isSubmitting: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ScheduleForm({
  doctors,
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}: ScheduleFormProps) {
  const [doctorId, setDoctorId] = useState("");

  const [day, setDay] = useState("Monday");

  const [isAvailable, setIsAvailable] =
    useState(true);

  const [maxPatients, setMaxPatients] =
    useState(20);
  const [startTime, setStartTime] =
     useState("09:00");

   const [endTime, setEndTime] =
     useState("17:00");

  useEffect(() => {
    if (!initialData) {
      setDoctorId("");
      setDay("Monday");
      setIsAvailable(true);
      setMaxPatients(20);
      return;
    }

    setDoctorId(
      initialData.doctor.id.toString()
    );

    setDay(initialData.day);

    setIsAvailable(
      initialData.is_available
    );

    setMaxPatients(
      initialData.max_patients
    );
    setStartTime(initialData.start_time);

    setEndTime(initialData.end_time);
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit({
        doctor_id: Number(doctorId),
        day,
        start_time: startTime,
        end_time: endTime,
        is_available: isAvailable,
        max_patients: Number(maxPatients),
      });
    };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <p className="mt-2 text-slate-500">
          {initialData
            ? "Update doctor schedule."
            : "Create a new doctor schedule."}
        </p>

      </div>

      <div className="grid gap-8 lg:grid-cols-3">
              {/* Schedule Summary */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-bold text-slate-800">
          Schedule Summary
        </h2>

        <div className="flex h-56 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50">

          <div className="text-6xl">
            📅
          </div>

          <h3 className="mt-6 text-lg font-bold text-slate-800">
            {day}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Maximum Patients
          </p>

          <span className="mt-2 rounded-full bg-sky-100 px-5 py-2 text-lg font-bold text-sky-700">
            {maxPatients}
          </span>

        </div>

      </div>

      {/* Schedule Information */}

      <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="mb-8 text-xl font-bold text-slate-800">
          Schedule Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Doctor
            </label>

            <select
              value={doctorId}
              onChange={(e) =>
                setDoctorId(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            >
              <option value="">
                Select Doctor
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

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Working Day
            </label>

            <select
              value={day}
              onChange={(e) =>
                setDay(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            >
              {DAYS.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Maximum Patients
            </label>

            <input
              type="number"
              min={1}
              value={maxPatients}
              onChange={(e) =>
                setMaxPatients(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />

          </div>
                    <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>

            <div className="flex h-[54px] items-center rounded-2xl border border-slate-300 bg-slate-50 px-4">

              <input
                id="available"
                type="checkbox"
                checked={isAvailable}
                onChange={(e) =>
                  setIsAvailable(e.target.checked)
                }
                className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />

              <label
                htmlFor="available"
                className="ml-3 cursor-pointer font-medium text-slate-700"
              >
                Doctor Available
              </label>

            </div>

          </div>

        </div>

      </div>
              

   </div>

      {/* Availability */}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-xl font-bold text-slate-800">
          Availability
        </h2>

        <div
          className={`rounded-2xl border p-6 ${
            isAvailable
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-lg font-bold text-slate-800">
                Current Status
              </h3>

              <p className="mt-2 text-slate-500">
                Enable or disable booking for this schedule.
              </p>

            </div>

            <span
              className={`rounded-full px-5 py-2 text-sm font-bold ${
                isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isAvailable
                ? "Available"
                : "Unavailable"}
            </span>

          </div>

        </div>

      </div>
      <div>

  <label className="mb-2 block text-sm font-semibold text-slate-700">
    Start Time
  </label>

  <input
    type="time"
    value={startTime}
    onChange={(e) =>
      setStartTime(e.target.value)
    }
    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
  />

</div>

<div>

  <label className="mb-2 block text-sm font-semibold text-slate-700">
    End Time
  </label>

  <input
    type="time"
    value={endTime}
    onChange={(e) =>
      setEndTime(e.target.value)
    }
    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
  />

</div>

            {/* Actions */}

      <div className="flex items-center justify-end gap-4">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Cancel
        </button>

        <Button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="px-8 py-3"
        >
          {isSubmitting 
            ? "Saving..."
            : initialData
            ? "Update Schedule"
            : "Save Schedule"}
        </Button>

      </div>
  
      </div>
  );
} 

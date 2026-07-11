"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { getErrorMessage } from "@/lib/errors";
import { getDictionary } from "@/lib/i18n";
import { doctorsService } from "@/services/doctors.service";
import { appointmentsService } from "@/services/appointments.service";
import type { Doctor } from "@/types/doctor";

export default function BookingPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Available time slots (8 AM to 5 PM, hourly)
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  useEffect(() => {
    doctorsService.getAll().then((response) => {
      setDoctors(response);
      if (response[0]) setDoctorId(String(response[0].id));
    }).catch((error) => {
      setError(getErrorMessage(error, dict.booking.error));
      setDoctors([]);
    }).finally(() => setIsLoading(false));
  }, [dict.booking.error]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);
    try {
      const appointmentDateTime = `${date} ${time}`;
      await appointmentsService.create({
        doctor_id: Number(doctorId),
        appointment_date: appointmentDateTime,
        notes,
      });
      setMessage(dict.booking.success);
      setDoctorId("");
      setDate("");
      setTime("");
      setNotes("");
    } catch (error) {
      setError(getErrorMessage(error, dict.booking.error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{dict.booking.title}</h1>
        <p className="mt-2 text-slate-600">{dict.booking.description}</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">{dict.booking.doctor}</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              {isLoading ? <option>{dict.dashboard.loading}</option> : null}
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty || "Specialist"}
                </option>
              ))}
            </select>
            {!isLoading && doctors.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No doctors available.</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {date && (
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">Available Time Slots</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      time === slot
                        ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                        : "border-slate-300 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">{dict.booking.reason}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              rows={4}
              placeholder="Describe your reason for visiting..."
            />
          </div>

          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" disabled={isSubmitting || !doctorId || !date || !time}>
            {isSubmitting ? dict.dashboard.loading : dict.booking.submit}
          </Button>
        </form>
      </div>
    </Container>
  );
}

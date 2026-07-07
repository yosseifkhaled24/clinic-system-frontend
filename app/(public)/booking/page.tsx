"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
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
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    doctorsService.getAll().then((response) => {
      const list = Array.isArray(response) ? response : (response as { data?: Doctor[] }).data || [];
      setDoctors(list);
      if (list[0]) setDoctorId(String(list[0].id));
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await appointmentsService.create({ doctor_id: Number(doctorId), appointment_date: date, notes });
      setMessage(dict.booking.success);
    } catch {
      setMessage(dict.booking.error);
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
            <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm">
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">{dict.booking.date}</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">{dict.booking.reason}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" rows={4} />
          </div>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          <Button type="submit">{dict.booking.submit}</Button>
        </form>
      </div>
    </Container>
  );
}

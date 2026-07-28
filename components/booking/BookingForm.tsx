"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";

import { doctorsService } from "@/services/doctors.service";
import { appointmentsService } from "@/services/appointments.service";
import { servicesService } from "@/services/services.service";

import type { Doctor } from "@/types/doctor";
import type { Service } from "@/types/service";

export default function BookingForm() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [doctorId, setDoctorId] = useState("");
  const [serviceId, setServiceId] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    doctorsService
      .getAll()
      .then((response) => {
        setDoctors(response);

        if (response.length > 0) {
          setDoctorId(String(response[0].id));
        }
      })
      .catch(() => setDoctors([]));
  }, []);

  useEffect(() => {
    servicesService
      .getAll()
      .then((response) => {
        setServices(response);

        if (response.length > 0) {
          setServiceId(String(response[0].id));
        }
      })
      .catch(() => setServices([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await appointmentsService.create({
        doctor_id: Number(doctorId),
        service_id: Number(serviceId),
        appointment_date: appointmentDate,
        notes,
      });

      setMessage(
        `${dict.booking.success}\n\n${dict.booking.queueMsg} ${response.queue_number}`
      );

      setAppointmentDate("");
      setNotes("");
    } catch (err: any) {
      setError(getErrorMessage(err, dict.booking.error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl sm:rounded-[32px] border border-slate-200 bg-white p-6 sm:p-10 shadow-xl"
        >
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {dict.booking.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {dict.booking.description}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {dict.booking.doctor}
            </label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm sm:text-base outline-none transition focus:border-sky-500 focus:bg-white"
              required
            >
              <option value="">{dict.bookingHero.chooseDoctor}</option>

              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty || dict.home.doctorCard.specialist}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {dict.booking.service}
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm sm:text-base outline-none transition focus:border-sky-500 focus:bg-white"
              required
            >
              <option value="">{dict.booking.chooseService}</option>

              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {dict.booking.date}
            </label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm sm:text-base outline-none transition focus:border-sky-500 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {dict.booking.reason}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder={dict.booking.reasonPlaceholder}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm sm:text-base outline-none transition focus:border-sky-500 focus:bg-white"
            />
          </div>

          {message && (
            <p className="text-center font-medium text-emerald-600 whitespace-pre-line text-sm sm:text-base">
              {message}
            </p>
          )}

          {error && (
            <p className="text-center font-medium text-red-600 text-sm sm:text-base">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !doctorId || !serviceId || !appointmentDate}
            className="w-full rounded-2xl bg-black py-4 font-semibold text-white text-sm sm:text-base transition-none disabled:opacity-50"
          >
            {loading ? dict.dashboard.loading : dict.booking.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
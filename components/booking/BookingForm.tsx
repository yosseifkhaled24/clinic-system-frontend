"use client";

import { useEffect, useState } from "react";

import { doctorsService } from "@/services/doctors.service";
import { appointmentsService } from "@/services/appointments.service";
import { servicesService } from "@/services/services.service";

import type { Doctor } from "@/types/doctor";
import type { Service } from "@/types/service";

export default function BookingForm() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [doctorId, setDoctorId] = useState("");
  const [serviceId, setServiceId] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await appointmentsService.create({
        doctor_id: Number(doctorId),
        service_id: Number(serviceId),
        appointment_date: appointmentDate,
        notes,
      });

      setMessage("Appointment booked successfully.");

      setDoctorId("");
      setServiceId("");
      setAppointmentDate("");
      setNotes("");
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ??
          "Booking failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-10 shadow-xl"
        >
          <h2 className="text-3xl font-bold">
            Book Appointment
          </h2>

          <select
            value={doctorId}
            onChange={(e) =>
              setDoctorId(e.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 p-4"
            required
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

          <select
            value={serviceId}
            onChange={(e) =>
              setServiceId(e.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 p-4"
            required
          >
            <option value="">
              Choose Service
            </option>

            {services.map((service) => (
              <option
                key={service.id}
                value={service.id}
              >
                {service.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={appointmentDate}
            onChange={(e) =>
              setAppointmentDate(e.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 p-4"
            required
          />

          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            rows={5}
            placeholder="Notes..."
            className="w-full rounded-2xl border border-slate-200 p-4"
          />

          <button
            type="submit"
            disabled={
              loading ||
              !doctorId ||
              !serviceId ||
              !appointmentDate
            }
            className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 py-4 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "Booking..."
              : "Book Appointment"}
          </button>

          {message && (
            <p className="text-center font-medium text-sky-700">
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { getErrorMessage } from "@/lib/errors";
import { getDictionary } from "@/lib/i18n";

import { doctorsService } from "@/services/doctors.service";
import { appointmentsService } from "@/services/appointments.service";
import { schedulesService } from "@/services/schedules.service";
import { servicesService } from "@/services/services.service";

import type { Doctor } from "@/types/doctor";
import type { Schedule } from "@/types/schedule";
import type { Service } from "@/types/service";

export default function BookingPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [doctorId, setDoctorId] = useState("");
  const [serviceId, setServiceId] = useState("");

  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    doctorsService
      .getAll()
      .then((response) => {
        setDoctors(response);

        if (response[0]) {
          setDoctorId(String(response[0].id));
        }
      })
      .catch((error) => {
        setDoctors([]);
        setError(getErrorMessage(error, dict.booking.error));
      })
      .finally(() => setIsLoading(false));
  }, [dict.booking.error]);

  useEffect(() => {
    servicesService
      .getAll()
      .then((response) => {
        setServices(response);

        if (response[0]) {
          setServiceId(String(response[0].id));
        }
      })
      .catch(() => {
        setServices([]);
      });
  }, []);

  useEffect(() => {
    if (!doctorId) {
      setSchedules([]);
      return;
    }

    schedulesService
      .getByDoctor(Number(doctorId))
      .then(setSchedules)
      .catch(() => setSchedules([]));
  }, [doctorId]);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response =
        await appointmentsService.create({
          doctor_id: Number(doctorId),
          service_id: Number(serviceId),
          appointment_date: date,
          notes,
        });

      setMessage(
        `${dict.booking.success}\n\nYour number today is:: ${response.queue_number}`
      );

      setDate("");
      setNotes("");
    } catch (error) {
      setError(
        getErrorMessage(error, dict.booking.error)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (    <Container className="py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">
          {dict.booking.title}
        </h1>

        <p className="mt-2 text-slate-600">
          {dict.booking.description}
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={handleSubmit}
        >
          {/* Doctor */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {dict.booking.doctor}
            </label>

            <select
              value={doctorId}
              onChange={(e) =>
                setDoctorId(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              {isLoading ? (
                <option>
                  {dict.dashboard.loading}
                </option>
              ) : null}

              {doctors.map((doctor) => (
                <option
                  key={doctor.id}
                  value={doctor.id}
                >
                  {doctor.name} -{" "}
                  {doctor.specialty ||
                    "Specialist"}
                </option>
              ))}
            </select>

            {!isLoading &&
            doctors.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">
                No doctors available.
              </p>
            ) : null}
          </div>

          {/* Service */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Service
            </label>

            <select
              value={serviceId}
              onChange={(e) =>
                setServiceId(e.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
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
          </div>

          {/* Date */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              required
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Working Hours */}

          {date && (
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Working Hours
              </label>

              {(() => {
                const day =
                  new Date(
                    date
                  ).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                    }
                  );

                const schedule =
                  schedules.find(
                    (s) =>
                      s.day === day &&
                      s.is_available
                  );

                if (!schedule) {
                  return (
                    <p className="text-red-500">
                      Doctor is not available
                      on this day.
                    </p>
                  );
                }

                return (
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p
                      dir="ltr"
                      className="font-semibold"
                    >
                      {schedule.start_time.slice(
                        0,
                        5
                      )}{" "}
                      →{" "}
                      {schedule.end_time.slice(
                        0,
                        5
                      )}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Max Patients :{" "}
                      {
                        schedule.max_patients
                      }
                    </p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Notes */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {dict.booking.reason}
            </label>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              rows={4}
              placeholder="Describe your reason for visiting..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {message && (
            <p className="text-sm text-emerald-600 whitespace-pre-line">
              {message}
            </p>
          )}

          {error && (
            <p className="text-sm text-rose-600">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !doctorId ||
              !serviceId ||
              !date
            }
          >
            {isSubmitting
              ? dict.dashboard.loading
              : dict.booking.submit}
          </Button>
        </form>
      </div>
    </Container>
  );
}
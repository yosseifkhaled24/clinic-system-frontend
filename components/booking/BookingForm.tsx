"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { ApiImage } from "@/components/ui/ApiImage";

import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";
import { cairoToday, parseDateOnly } from "@/lib/dates";

import { appointmentsService } from "@/services/appointments.service";
import { availabilityService } from "@/services/availability.service";
import { doctorsService } from "@/services/doctors.service";
import { servicesService } from "@/services/services.service";
import { specialtiesService } from "@/services/specialties.service";

import type { AvailabilityDay, DoctorAvailability } from "@/types/availability";
import type { Doctor } from "@/types/doctor";
import type { Service } from "@/types/service";
import type { Specialty } from "@/types/specialty";

type Step = 1 | 2 | 3 | 4;

/**
 * The exact 422 messages the booking endpoint returns when the world
 * changed after the page loaded (schedule edit, capacity filled by
 * someone else, duplicate). When one of these comes back, the form
 * re-fetches the REAL availability and returns the patient to the date
 * step so they always act on current backend truth.
 */
const BOOKING_CONFLICT_MESSAGES = [
  "Doctor is not available on this day.",
  "Patient already booked this doctor on this day.",
  "This day is fully booked.",
];

/** Localized short date label ("Sun, 2 Nov") built from a date-only string. */
function formatDayLabel(date: string, language: string): string {
  return parseDateOnly(date).toLocaleDateString(
    language === "ar" ? "ar-EG" : "en-EG",
    { weekday: "short", day: "numeric", month: "short" }
  );
}

/** "HH:MM:SS" → "HH:MM" (same slice the doctor profile page uses). */
function shortTime(time: string | null): string {
  return time ? time.slice(0, 5) : "";
}

/**
 * Smart Booking wizard.
 *
 * Specialty -> Doctor -> Available date (live capacity from the public
 * availability endpoint) -> Visit details -> Confirmation. Every
 * decision comes from the real Laravel APIs — availability, capacity
 * and validation are backend-authoritative; this form only renders what
 * the backend reports and displays its 422 messages verbatim.
 *
 * Mounted by both /booking and /services (unchanged) and honors the
 * existing deep links: /booking?doctor={id} and the new
 * /booking?specialty_id={id}.
 */
function SmartBookingForm() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const searchParams = useSearchParams();

  // ---------------------------------------------------------------- data
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [availability, setAvailability] =
    useState<DoctorAvailability | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");

  // ---------------------------------------------------------------- flow
  const [step, setStep] = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Client-only lazy init: whether a session token exists (the axios
  // interceptor handles the 401 redirect; this only shows a hint).
  const [isAuthenticated] = useState(
    () => typeof window === "undefined" || Boolean(localStorage.getItem("token"))
  );

  // ------------------------------------------------------------- loaders
  const loadDoctors = async (specialtyId?: string) => {
    setDoctorsLoading(true);

    try {
      const data = await doctorsService.getAll(
        specialtyId ? { specialty_id: Number(specialtyId) } : undefined
      );
      setDoctors(data);
    } catch {
      setDoctors([]);
    } finally {
      setDoctorsLoading(false);
    }
  };

  const loadAvailability = async (doctor: Doctor, clearError = true) => {
    setAvailabilityLoading(true);
    setAvailability(null);
    setSelectedDate("");
    // `clearError = false` when re-fetching after a booking conflict:
    // the 422 message must stay on screen while the calendar reloads,
    // otherwise the patient is bounced to the date step with no reason.
    if (clearError) setError("");

    try {
      // Cairo-local today — matches the backend's Africa/Cairo "today".
      const data = await availabilityService.getByDoctor(doctor.id, {
        from: cairoToday(),
      });
      setAvailability(data);
    } catch (err) {
      setError(getErrorMessage(err, dict.booking.loadError));
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // Initial load: specialties, services, unfiltered doctors.
  useEffect(() => {
    specialtiesService
      .getAll()
      .then(setSpecialties)
      .catch(() => setSpecialties([]));

    servicesService
      .getAll()
      .then((data) => {
        setServices(data);
        if (data.length > 0) setServiceId(String(data[0].id));
      })
      .catch(() => setServices([]));

    // Deferred off the effect body (same pattern as the queue page) so
    // loadDoctors' synchronous loading-state update never runs during
    // the effect itself — repo lint rule react-hooks/set-state-in-effect.
    Promise.resolve().then(() => loadDoctors());
  }, []);

  // Deep links: /booking?doctor={id} (from doctor profiles) selects the
  // doctor and jumps straight to the date step; /booking?specialty_id={id}
  // preselects the specialty filter. Runs once per mount.
  const handledParamsRef = useRef(false);

  useEffect(() => {
    if (handledParamsRef.current) return;
    handledParamsRef.current = true;

    const doctorId = Number(searchParams.get("doctor"));

    if (Number.isInteger(doctorId) && doctorId > 0) {
      doctorsService
        .getById(doctorId)
        .then(async (doctor) => {
          setSelectedDoctor(doctor);
          if (doctor.specialty_id) {
            setSelectedSpecialtyId(String(doctor.specialty_id));
          }
          await loadAvailability(doctor);
          setStep(2);
        })
        .catch((err) =>
          setError(getErrorMessage(err, dict.booking.error))
        );

      return;
    }

    const specialtyId = Number(searchParams.get("specialty_id"));

    if (Number.isInteger(specialtyId) && specialtyId > 0) {
      // Deferred so no state is touched synchronously in the effect
      // body (repo lint rule react-hooks/set-state-in-effect).
      Promise.resolve().then(() => {
        setSelectedSpecialtyId(String(specialtyId));
        return loadDoctors(String(specialtyId));
      });
    }
    // One-shot deep-link handler: re-running on identity changes of the
    // loader callbacks would re-select the doctor mid-flow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ------------------------------------------------------------ handlers
  function handleSpecialtyChange(id: string) {
    setSelectedSpecialtyId(id);
    setSelectedDoctor(null);
    setAvailability(null);
    setSelectedDate("");
    setStep(1);
    loadDoctors(id);
  }

  function handleSelectDoctor(doctor: Doctor) {
    setSelectedDoctor(doctor);
    loadAvailability(doctor);
  }

  function handleSelectDay(day: AvailabilityDay) {
    // The backend decides: only working, not-past, capacity-left days.
    if (!day.is_bookable) return;
    setSelectedDate(day.date);
    // Picking a fresh day acknowledges the previous conflict message.
    setError("");
  }

  function resetWizard() {
    setStep(1);
    setSelectedDoctor(null);
    setAvailability(null);
    setSelectedDate("");
    setNotes("");
    setSuccessMessage("");
    setError("");
  }

  async function handleSubmit() {
    if (!selectedDoctor || !selectedDate || !serviceId) return;

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await appointmentsService.create({
        doctor_id: selectedDoctor.id,
        service_id: Number(serviceId),
        appointment_date: selectedDate,
        notes: notes || undefined,
      });

      // Reset the wizard FIRST, then surface the confirmation — the
      // banner (success message + queue number) must survive the reset.
      resetWizard();
      setSuccessMessage(
        `${dict.booking.success}\n\n${dict.booking.queueMsg} ${response.queue_number}`
      );
    } catch (err) {
      const message = getErrorMessage(err, dict.booking.error);
      setError(message);

      // The world changed after page load (schedule edited, day filled
      // by a simultaneous booking, duplicate): re-fetch the REAL
      // availability and send the patient back to the date step so the
      // UI shows current backend truth instead of stale state.
      if (BOOKING_CONFLICT_MESSAGES.some((m) => message.includes(m))) {
        if (selectedDoctor) loadAvailability(selectedDoctor, false);
        setStep(2);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ------------------------------------------------------------ derived
  const selectedDay =
    availability?.days.find((d) => d.date === selectedDate) ?? null;

  const selectedService =
    services.find((s) => String(s.id) === serviceId) ?? null;

  const anyBookableDay = Boolean(
    availability?.days.some((d) => d.is_bookable)
  );

  const steps: { id: Step; label: string }[] = [
    { id: 1, label: dict.booking.stepSpecialty },
    { id: 2, label: dict.booking.stepDate },
    { id: 3, label: dict.booking.stepDetails },
    { id: 4, label: dict.booking.stepConfirm },
  ];

  function stepReachable(id: Step): boolean {
    if (id === 1) return true;
    if (id === 2) return Boolean(selectedDoctor);
    return Boolean(selectedDate); // 3 and 4
  }

  const INPUT_CLASS =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm sm:text-base outline-none transition focus:border-sky-500 focus:bg-white";

  // ----------------------------------------------------------------- ui
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 4) handleSubmit();
          }}
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

          {/* Step indicator */}
          <ol className="flex flex-wrap gap-2">
            {steps.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  disabled={!stepReachable(s.id)}
                  onClick={() => setStep(s.id)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition disabled:opacity-50 ${
                    step === s.id
                      ? "bg-black text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ol>

          {successMessage && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="whitespace-pre-line font-medium text-emerald-700 text-sm sm:text-base">
                {successMessage}
              </p>
              <button
                type="button"
                onClick={resetWizard}
                className="mt-3 rounded-2xl bg-black px-6 py-2.5 text-sm font-semibold text-white"
              >
                {dict.booking.bookAnother}
              </button>
            </div>
          )}

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center font-medium text-red-600 text-sm sm:text-base">
              {error}
            </p>
          )}

          {/* ---------------------------------------------------- step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {dict.booking.specialty}
                </label>

                <div className="flex flex-wrap gap-2">
                  {[{ id: "", name: dict.booking.allSpecialties }, ...specialties].map(
                    (specialty) => (
                      <button
                        key={specialty.id || "all"}
                        type="button"
                        onClick={() =>
                          handleSpecialtyChange(String(specialty.id))
                        }
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          selectedSpecialtyId === String(specialty.id)
                            ? "border-sky-500 bg-sky-50 text-sky-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-sky-300"
                        }`}
                      >
                        {specialty.name}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {dict.booking.doctor}
                </label>

                {doctorsLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="h-28 animate-pulse rounded-2xl bg-slate-100"
                      />
                    ))}
                  </div>
                ) : doctors.length === 0 ? (
                  <p className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                    {selectedSpecialtyId
                      ? dict.booking.noDoctorsForSpecialty
                      : dict.booking.noDoctors}
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {doctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        type="button"
                        onClick={() => handleSelectDoctor(doctor)}
                        className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                          selectedDoctor?.id === doctor.id
                            ? "border-sky-500 bg-sky-50 ring-1 ring-sky-500"
                            : "border-slate-200 bg-white hover:border-sky-300"
                        }`}
                      >
                        <ApiImage
                          src={doctor.image_url}
                          alt={doctor.name}
                          className="h-16 w-16 shrink-0 rounded-full object-cover"
                          fallbackClassName="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400"
                        />

                        <span>
                          <span className="block font-semibold text-slate-900">
                            {doctor.name}
                          </span>
                          <span className="block text-sm text-sky-600">
                            {doctor.specialty ||
                              dict.home.doctorCard.specialist}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedDoctor && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <span className="text-sm text-slate-600">
                    {selectedDoctor.name} —{" "}
                    {selectedDoctor.specialty ||
                      dict.home.doctorCard.specialist}
                  </span>

                  <Link
                    href={`/doctors/${selectedDoctor.id}`}
                    className="text-sm font-semibold text-sky-600 hover:underline"
                  >
                    {dict.booking.viewProfile}
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------- step 2 */}
          {step === 2 && selectedDoctor && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-bold text-slate-900">
                  {selectedDoctor.name} — {dict.booking.workingDays}
                </h3>

                <button
                  type="button"
                  onClick={() => loadAvailability(selectedDoctor)}
                  disabled={availabilityLoading}
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {dict.booking.refreshAvailability}
                </button>
              </div>

              {availabilityLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-24 animate-pulse rounded-2xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : !availability ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                  <p className="text-sm font-medium text-red-600">
                    {dict.booking.loadError}
                  </p>
                  <button
                    type="button"
                    onClick={() => loadAvailability(selectedDoctor)}
                    className="mt-3 rounded-2xl bg-black px-6 py-2.5 text-sm font-semibold text-white"
                  >
                    {dict.booking.retry}
                  </button>
                </div>
              ) : (
                <>
                  {!anyBookableDay && (
                    <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-700">
                      {dict.booking.noWorkingDays}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {availability.days.map((day) => {
                      const isSelected = day.date === selectedDate;

                      return (
                        <button
                          key={day.date}
                          type="button"
                          disabled={!day.is_bookable}
                          onClick={() => handleSelectDay(day)}
                          className={`rounded-2xl border p-3 text-center transition ${
                            isSelected
                              ? "border-sky-500 bg-sky-500 text-white"
                              : day.is_bookable
                                ? "border-slate-200 bg-white hover:border-sky-400"
                                : day.is_working_day && !day.is_past
                                  ? "border-amber-100 bg-amber-50 text-amber-700"
                                  : "border-slate-100 bg-slate-50 text-slate-400"
                          }`}
                        >
                          <span className="block text-[11px] font-semibold uppercase tracking-wide opacity-80">
                            {day.day.slice(0, 3)}
                          </span>

                          <span className="mt-1 block text-sm font-bold">
                            {formatDayLabel(day.date, language)}
                          </span>

                          <span className="mt-1 block text-[11px]">
                            {day.is_bookable
                              ? `${day.remaining} ${
                                  day.remaining === 1
                                    ? dict.booking.slotLeft
                                    : dict.booking.slotsLeft
                                }`
                              : day.is_past
                                ? dict.booking.date
                                : !day.is_working_day
                                  ? dict.booking.notWorking
                                  : dict.booking.fullyBooked}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedDay && (
                    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                      <p className="text-sm font-semibold text-sky-800">
                        {dict.booking.selectedDate}:{" "}
                        {formatDayLabel(selectedDay.date, language)}
                      </p>

                      <p
                        dir="ltr"
                        className="mt-1 text-sm text-slate-700"
                      >
                        {dict.booking.hours}:{" "}
                        {shortTime(selectedDay.start_time)} →{" "}
                        {shortTime(selectedDay.end_time)}
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {dict.booking.maxPatients}{" "}
                        {selectedDay.remaining}{" "}
                        {selectedDay.remaining === 1
                          ? dict.booking.slotLeft
                          : dict.booking.slotsLeft}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ---------------------------------------------------- step 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {dict.booking.service}
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className={INPUT_CLASS}
                  required
                >
                  <option value="">{dict.booking.chooseService}</option>

                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                      {service.price != null ? ` — ${service.price} EGP` : ""}
                    </option>
                  ))}
                </select>
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
                  className={`${INPUT_CLASS} resize-none`}
                />
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- step 4 */}
          {step === 4 && selectedDoctor && selectedDay && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {dict.booking.confirmTitle}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {dict.booking.confirmHint}
                </p>
              </div>

              <dl className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50 px-5">
                <div className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-slate-500">{dict.booking.doctor}</dt>
                  <dd className="text-right font-semibold text-slate-900">
                    {selectedDoctor.name} —{" "}
                    {selectedDoctor.specialty ||
                      dict.home.doctorCard.specialist}
                  </dd>
                </div>

                <div className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-slate-500">{dict.booking.date}</dt>
                  <dd className="text-right font-semibold text-slate-900">
                    {formatDayLabel(selectedDay.date, language)} (
                    <span dir="ltr">
                      {shortTime(selectedDay.start_time)} →{" "}
                      {shortTime(selectedDay.end_time)}
                    </span>
                    )
                  </dd>
                </div>

                <div className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-slate-500">{dict.booking.service}</dt>
                  <dd className="text-right font-semibold text-slate-900">
                    {selectedService?.name ?? "—"}
                    {selectedService?.price != null
                      ? ` — ${selectedService.price} EGP`
                      : ""}
                  </dd>
                </div>

                {notes && (
                  <div className="flex justify-between gap-4 py-3 text-sm">
                    <dt className="text-slate-500">{dict.booking.reason}</dt>
                    <dd className="text-right font-semibold text-slate-900">
                      {notes}
                    </dd>
                  </div>
                )}
              </dl>

              {!isAuthenticated && (
                <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-sm font-medium text-amber-700">
                  {dict.booking.loginToBook}{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-amber-900 underline"
                  >
                    {dict.nav.login}
                  </Link>
                </p>
              )}
            </div>
          )}

          {/* -------------------------------------------------- controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={step === 1 || submitting}
              onClick={() => setStep((prev) => (prev > 1 ? (prev - 1) as Step : prev))}
              className="rounded-2xl border border-slate-300 bg-transparent px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {dict.booking.back}
            </button>

            {step < 4 ? (
              <button
                type="button"
                disabled={
                  (step === 1 && !selectedDoctor) ||
                  (step === 2 && !selectedDate) ||
                  (step === 3 && !serviceId)
                }
                onClick={() =>
                  setStep((prev) => (prev < 4 ? (prev + 1) as Step : prev))
                }
                className="rounded-2xl bg-black px-8 py-3 text-sm font-semibold text-white transition-none disabled:opacity-50"
              >
                {dict.booking.continue}
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting || !serviceId}
                className="rounded-2xl bg-black px-8 py-3 text-sm font-semibold text-white transition-none disabled:opacity-50"
              >
                {submitting ? dict.dashboard.loading : dict.booking.submit}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default function BookingForm() {
  // useSearchParams (deep links) needs a Suspense boundary under the
  // Next.js app router for static prerendering of /booking and /services.
  return (
    <Suspense
      fallback={<section className="py-12 sm:py-16" aria-busy="true" />}
    >
      <SmartBookingForm />
    </Suspense>
  );
}

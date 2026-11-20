"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { useVisibilityPoll } from "@/hooks/useVisibilityPoll";
import { getErrorMessage } from "@/lib/errors";
import { cairoToday } from "@/lib/dates";
import { getDictionary } from "@/lib/i18n";
import { appointmentsService } from "@/services/appointments.service";
import { dashboardService } from "@/services/dashboard.service";
import { doctorsService } from "@/services/doctors.service";
import { queueService } from "@/services/queue.service";
import { servicesService } from "@/services/services.service";
import type { Appointment } from "@/types/appointment";
import type { DashboardOverview } from "@/types/dashboard";
import type { Doctor } from "@/types/doctor";
import type { QueueResponse } from "@/types/queue";

const emptyOverview: DashboardOverview = {
  doctors_count: 0,
  patients_count: 0,
  services_count: 0,
  appointments_count: 0,
  appointments_today: 0,
  pending_count: 0,
  completed_count: 0,
  cancelled_count: 0,
  reviews_count: 0,
  messages_count: 0,
};

const emptyQueue: QueueResponse = {
  current: null,
  waiting: [],
  finished: [],
};

export default function DashboardPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const dict = getDictionary(language);
  const { showToast, ToastElement } = useToast();
  const [overview, setOverview] = useState<DashboardOverview>(emptyOverview);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Phase 2: the appointments list is one server-side page now — the five
  // rows this card renders. A2: that page is filtered to TODAY, so its
  // `total` would be today's count; the "All appointments" stat therefore
  // reads the overview's all-time `appointments_count` instead.
  const [queue, setQueue] = useState<QueueResponse>(emptyQueue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Part C — cursor for the admin-only "new bookings" feed. `null` means
  // "not primed yet": the first (cursor-less) call is a baseline that
  // answers an empty `data` + the current MAX(id), so bookings that
  // already exist are never toasted as new.
  const recentCursorRef = useRef<number | null>(null);
  const recentPrimedRef = useRef(false);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      // Phase 1: the overview endpoint already provides every summary
      // count this page renders, so the patients/reviews/messages full
      // lists are no longer fetched (the messages list was never even
      // rendered). The appointments list stays because the "Today's
      // Appointments" card renders real rows from it — Phase 2 makes it a
      // single bounded page (per_page: 5), and A2 narrows that page to
      // TODAY (Africa/Cairo) so the card only ever shows today's rows.
      //
      // The overview is the one fetch without a fallback catch: it drives
      // every stat on the page, so its failure must reach the catch below
      // and surface the error banner (A3) instead of silently showing 0s.
      const [overviewData, appointmentsPage, doctorsData] = await Promise.all([
        dashboardService.getOverview(),
        appointmentsService
          .getPage({ per_page: 5, date: cairoToday() })
          .catch(() => null),
        doctorsService.getAll().catch(() => [] as Doctor[]),
      ]);

      const firstDoctor = doctorsData[0];
      const queueData = firstDoctor
        ? await queueService.today(firstDoctor.id).catch(() => emptyQueue)
        : emptyQueue;
      setOverview(overviewData);
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      setAppointments(
        Array.isArray(appointmentsPage?.data) ? appointmentsPage.data : []
      );
      setQueue(queueData);
    } catch (error) {
      setError(getErrorMessage(error, dict.dashboard.loadError));
      setOverview(emptyOverview);
      setDoctors([]);
      setAppointments([]);
      setQueue(emptyQueue);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboardData();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /* ── Part C — admin-only "new bookings" toast ───────────────────── */

  // Best-effort feed: a failed poll must never disturb the dashboard
  // (useVisibilityPoll swallows rejections too — this try/catch keeps the
  // error handling local and the loop alive either way).
  const pollRecentAppointments = async () => {
    if (user?.role !== "admin") return;

    try {
      const response = await appointmentsService.getRecent(
        recentCursorRef.current ?? undefined
      );

      const rows = Array.isArray(response.data) ? response.data : [];

      if (rows.length > 0) {
        const newest = rows[rows.length - 1];

        // Advance to the LAST RETURNED row, never `latest_id`: latest_id
        // is the true MAX(id) and can sit past the 20-row cap, which
        // would skip bookings that were never reported to this client.
        recentCursorRef.current = newest.id;

        showToast(
          newest.patient_name
            ? `${dict.dashboard.newAppointmentTitle}: ${newest.patient_name}`
            : dict.dashboard.newAppointmentBody,
          "success"
        );
      } else if (recentCursorRef.current === null) {
        // Still unprimed (the baseline call above failed earlier): adopt
        // the server's MAX(id) so the next poll reports only newer rows.
        recentCursorRef.current = response.latest_id;
      }
    } catch {
      // Transient failure — keep the previous cursor and try again on the
      // next tick; nothing on screen depends on this feed.
    }
  };

  // Prime the cursor once per mount with a cursor-less baseline call
  // (no `after_id` → empty `data` + current MAX(id)), so bookings that
  // already exist are never presented as "new". Runs when the caller is
  // confirmed an admin; a failed prime is repaired by the poll above.
  useEffect(() => {
    if (recentPrimedRef.current || user?.role !== "admin") return;

    recentPrimedRef.current = true;

    void (async () => {
      try {
        const response = await appointmentsService.getRecent();
        recentCursorRef.current = response.latest_id;
      } catch {
        // Leave the cursor null — pollRecentAppointments re-primes it.
      }
    })();
  }, [user?.role]);

  // 15s cadence while the tab is visible (pauses when hidden, one
  // catch-up tick on return) — same cadence as the other dashboard pages.
  useVisibilityPoll(pollRecentAppointments, 15000);

  return (
    <DashboardLayout title={dict.dashboard.overviewTitle} description={dict.dashboard.overviewDescription}>
      {/* A3 — the loading / error states this page always tracked but
          never showed: a loading line during the first (or a retried)
          load, and the error banner with a retry action. */}
      {loading && (
        <p className="mb-6 text-sm text-slate-500">{dict.dashboard.loading}</p>
      )}

      {error && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void loadDashboardData()}
            className="rounded-xl border border-red-200 bg-white px-4 py-2 font-semibold text-red-600 transition hover:bg-red-100"
          >
            {dict.dashboard.retry}
          </button>
        </div>
      )}

      {/* Part C — "new appointment" toast (4s auto-dismiss). */}
      {ToastElement}

      {/* Hero */}
      <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-xs sm:text-sm uppercase tracking-[0.25em] text-sky-100">
              {dict.dashboard.heroTag}
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold">
              {dict.dashboard.welcome}
            </h1>

            <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-sky-100">
              {dict.dashboard.heroDesc}
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard/appointments"
                className="rounded-xl bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-sky-700 transition hover:scale-105"
              >
                {dict.dashboard.appointments}
              </Link>

              <Link
                href="/dashboard/doctors"
                className="rounded-xl border border-white/30 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                {dict.dashboard.doctors}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-white/10 p-4 sm:p-5 backdrop-blur">
              <p className="text-xs sm:text-sm text-sky-100">{dict.dashboard.todayAppointments}</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">{overview.appointments_today}</h2>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 sm:p-5 backdrop-blur">
              <p className="text-xs sm:text-sm text-sky-100">{dict.dashboard.waitingQueue}</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">{queue.waiting.length}</h2>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 sm:p-5 backdrop-blur">
              <p className="text-xs sm:text-sm text-sky-100">{dict.dashboard.messages}</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">{overview.messages_count}</h2>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 sm:p-5 backdrop-blur">
              <p className="text-xs sm:text-sm text-sky-100">{dict.dashboard.reviews}</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">{overview.reviews_count}</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="mb-8">
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm text-slate-500">{dict.dashboard.doctors}</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">{doctors.length}</h2>
            <p className="mt-3 text-sm text-sky-600">{dict.dashboard.registeredDoctors}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm text-slate-500">{dict.dashboard.patients}</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">{overview.patients_count}</h2>
            <p className="mt-3 text-sm text-emerald-600">{dict.dashboard.totalPatients}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm text-slate-500">{dict.dashboard.appointments}</p>
            {/* A2: the row list is filtered to today, so its `total` is
                today's count — this all-time stat reads the overview. */}
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">{overview.appointments_count}</h2>
            <p className="mt-3 text-sm text-orange-600">{dict.dashboard.allAppointments}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm text-slate-500">{dict.dashboard.reviews}</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">{overview.reviews_count}</h2>
            <p className="mt-3 text-sm text-pink-600">{dict.dashboard.patientReviews}</p>
          </div>
        </div>
      </section>

      {/* Queue + Today's Appointments */}
      <section className="mb-8 grid gap-6 xl:grid-cols-3">
        {/* Queue */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">{dict.dashboard.queue}</h2>
            <Link href="/dashboard/queue" className="text-sm font-semibold text-sky-600 hover:underline">
              {dict.dashboard.open}
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 sm:p-4 text-center">
              <p className="text-xs sm:text-sm text-slate-500">{dict.dashboard.current}</p>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold">
                {queue.current ? "#" + queue.current.queue_number : "--"}
              </h3>
            </div>

            <div className="rounded-2xl bg-yellow-50 p-3 sm:p-4 text-center">
              <p className="text-xs sm:text-sm text-yellow-700">{dict.dashboard.waiting}</p>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold text-yellow-600">
                {queue.waiting.length}
              </h3>
            </div>

            <div className="rounded-2xl bg-green-50 p-3 sm:p-4 text-center">
              <p className="text-xs sm:text-sm text-green-700">{dict.dashboard.finished}</p>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold text-green-600">
                {queue.finished.length}
              </h3>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">{dict.dashboard.todayApptsTitle}</h2>
            <Link href="/dashboard/appointments" className="text-sm font-semibold text-sky-600 hover:underline">
              {dict.dashboard.viewAll}
            </Link>
          </div>

          <div className="space-y-4">
            {appointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
              >
                <div>
                  <h3 className="font-semibold">{appointment.patient.name}</h3>
                  <p className="text-sm text-slate-500">{appointment.doctor.name}</p>
                </div>

                <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
                  #{appointment.queue_number}
                </span>
              </div>
            ))}

            {appointments.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                {dict.dashboard.noAppts}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Activity + Quick Actions */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">{dict.dashboard.recentActivity}</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
              {dict.dashboard.live}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-xl">
                👨‍⚕️
              </div>
              <div>
                <p className="font-semibold">{doctors.length} {dict.dashboard.registeredDoctors}</p>
                <p className="text-sm text-slate-500">{dict.home.hero.cardTag}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl">
                👥
              </div>
              <div>
                <p className="font-semibold">{overview.patients_count} {dict.dashboard.totalPatients}</p>
                <p className="text-sm text-slate-500">{dict.dashboard.stats.active}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl">
                📅
              </div>
              <div>
                <p className="font-semibold">{overview.appointments_count} {dict.dashboard.allAppointments}</p>
                <p className="text-sm text-slate-500">{dict.dashboard.overviewTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-xl">
                ⭐
              </div>
              <div>
                <p className="font-semibold">{overview.reviews_count} {dict.dashboard.patientReviews}</p>
                <p className="text-sm text-slate-500">{dict.home.testimonials.tag}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold">{dict.dashboard.quickActions}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/dashboard/doctors"
              className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-sky-500 hover:bg-sky-50"
            >
              <div className="text-3xl">👨‍⚕️</div>
              <h3 className="mt-4 font-bold">{dict.dashboard.doctors}</h3>
              <p className="mt-2 text-sm text-slate-500">{dict.dashboard.manageDoctors}</p>
            </Link>

            <Link
              href="/dashboard/patients"
              className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-50"
            >
              <div className="text-3xl">👥</div>
              <h3 className="mt-4 font-bold">{dict.dashboard.patients}</h3>
              <p className="mt-2 text-sm text-slate-500">{dict.dashboard.viewPatients}</p>
            </Link>

            <Link
              href="/dashboard/appointments"
              className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-orange-500 hover:bg-orange-50"
            >
              <div className="text-3xl">📅</div>
              <h3 className="mt-4 font-bold">{dict.dashboard.appointments}</h3>
              <p className="mt-2 text-sm text-slate-500">{dict.dashboard.openAppts}</p>
            </Link>

            <Link
              href="/dashboard/services"
              className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-purple-500 hover:bg-purple-50"
            >
              <div className="text-3xl">🩺</div>
              <h3 className="mt-4 font-bold">{dict.dashboardPages.services.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{dict.dashboard.clinicServices}</p>
            </Link>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
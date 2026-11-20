"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";

import AppointmentTable from "@/components/dashboard/appointments/AppointmentTable";
import AppointmentForm from "@/components/dashboard/appointments/AppointmentForm";
import CompletePaymentDialog from "@/components/dashboard/appointments/CompletePaymentDialog";
import DeleteAppointmentDialog from "@/components/dashboard/appointments/DeleteAppointmentDialog";
import SearchAppointment from "@/components/dashboard/appointments/SearchAppointment";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import { appointmentsService } from "@/services/appointments.service";
import { doctorsService } from "@/services/doctors.service";
import { patientsService } from "@/services/patients.service";
import { servicesService } from "@/services/services.service";
import { exportAppointments, exportRevenue } from "@/services/export.service";

import { useVisibilityPoll } from "@/hooks/useVisibilityPoll";

import type { Service } from "@/types/service";
import type {
  Appointment,
  AppointmentCreatePayload,
  PaymentMethod,
} from "@/types/appointment";
import type { Doctor } from "@/types/doctor";
import type { Patient } from "@/types/patient";

import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

/**
 * Phase 2 — server-side pagination.
 *
 * Rows are fetched one page at a time (the backend's default is 15, its
 * hard cap 50), so every count rendered here comes from the pagination
 * envelope instead of `appointments.length`, which now only ever reports
 * the size of the page currently on screen.
 */
const PAGE_SIZE = 15;

type StatusFilter = "all" | Appointment["status"];

/** What a request actually asks the server for. */
type AppliedQuery = {
  page: number;
  search: string;
  status: StatusFilter;
};

const initialQuery: AppliedQuery = { page: 1, search: "", status: "all" };

/** The slice of the pagination envelope this screen renders. */
type PageMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
};

const emptyPageMeta: PageMeta = {
  current_page: 1,
  per_page: PAGE_SIZE,
  total: 0,
  last_page: 1,
  from: null,
  to: null,
};

export default function DashboardAppointmentsPage() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const dict = getDictionary(language);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Appointment | null>(null);

  // A/B: the Complete + payment dialog target.
  const [appointmentToComplete, setAppointmentToComplete] =
    useState<Appointment | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Phase 2 — server-side pagination metadata for the table below.
  const [pageMeta, setPageMeta] = useState<PageMeta>(emptyPageMeta);

  const isAdmin = user?.role === "admin";

  // Unmount guard for the background refresh (same semantics as the
  // effect-local flag it replaces).
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Only the newest request may touch the table: a slow answer for an
  // older page or filter is discarded instead of overwriting a newer one.
  const requestIdRef = useRef(0);

  // The query the server last answered for. Page jumps, mutations and
  // the background poll all resume from it, so the active search/status
  // are never lost between requests.
  const appliedQueryRef = useRef<AppliedQuery>({ ...initialQuery });

  /**
   * Fetch ONE page of appointments.
   *
   * `silent` skips the skeleton: the debounced search/status change and
   * the 15s poll refresh the table in place, exactly like the client-side
   * filtering they replaced. The initial load, a page jump and every
   * post-mutation refresh keep the skeleton the screen always showed.
   */
  const fetchAppointments = useCallback(
    async (query: AppliedQuery, options: { silent?: boolean } = {}) => {
      const requestId = ++requestIdRef.current;
      const silent = options.silent === true;

      appliedQueryRef.current = query;

      if (!silent) {
        setIsLoading(true);
      }

      try {
        let current = query;

        // Re-ask at most once: when the requested page no longer exists
        // (a row was deleted, or a filter shrank the result set) land on
        // the last page that does instead of rendering an empty table
        // under a stale "Page 3 of 3" label.
        for (let attempt = 0; ; attempt += 1) {
          const page = await appointmentsService.getPage({
            page: current.page,
            per_page: PAGE_SIZE,
            search: current.search || undefined,
            status: current.status === "all" ? undefined : current.status,
          });

          // A newer request owns the UI now — drop this answer.
          if (requestId !== requestIdRef.current || !mountedRef.current) {
            return;
          }

          const pageIsGone =
            page.data.length === 0 &&
            page.total > 0 &&
            current.page > page.last_page;

          if (pageIsGone && attempt < 1) {
            current = { ...current, page: page.last_page };
            appliedQueryRef.current = current;
            continue;
          }

          setAppointments(page.data);
          setPageMeta({
            current_page: page.current_page,
            per_page: page.per_page,
            total: page.total,
            last_page: page.last_page,
            from: page.from,
            to: page.to,
          });
          setError("");
          return;
        }
      } catch (err) {
        if (requestId !== requestIdRef.current || !mountedRef.current) {
          return;
        }

        setError(
          getErrorMessage(
            err,
            "Failed to load appointments."
          )
        );
      } finally {
        // Clear the skeleton only for the request that still owns the UI:
        // a superseded request must never hide the newer one's loading.
        if (requestId === requestIdRef.current && mountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    loadData();
  }, []);

  // Background refresh: identical 15s cadence and error behavior, but
  // paused while the tab is hidden (Phase 1), never overlapping a
  // still-pending request, and scoped to the page on screen instead of
  // re-pulling every appointment.
  const refreshAppointments = async () => {
    try {
      await fetchAppointments(appliedQueryRef.current, { silent: true });
    } catch {
      // Keep current appointments visible while background refresh fails.
    }
  };

  useVisibilityPoll(refreshAppointments, 15000);

  /**
   * Dropdown data for the create/edit form.
   *
   * Kept separate from the appointments fetch so it is obvious that a
   * mutation refreshes both, exactly as it always did.
   */
  async function loadLookupData() {
    const [doctorsData, patientsData, servicesData] = await Promise.all([
      doctorsService.getAll(),
      patientsService.getAll(),
      servicesService.getAll(),
    ]);

    setDoctors(doctorsData);
    setPatients(patientsData);
    setServices(servicesData);
  }

  /**
   * Load the screen: lookup lists + the page currently on screen
   * (page 1, unfiltered, on first load).
   *
   * Every mutation already called this, so post-mutation refresh keeps
   * working the same way — it just now refreshes ONE page with the
   * active filters instead of re-pulling the whole table.
   */
  async function loadData() {
    try {
      await Promise.all([
        loadLookupData(),
        fetchAppointments({ ...appliedQueryRef.current }),
      ]);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to load appointments."
        )
      );
    }
  }

  function goToPage(page: number) {
    if (
      page < 1 ||
      page > pageMeta.last_page ||
      page === pageMeta.current_page
    ) {
      return;
    }

    void fetchAppointments({ ...appliedQueryRef.current, page });
  }

  // Server-side search & status filter.
  //
  // The old client-side `filteredAppointments` memo could only filter
  // rows already in memory, so it silently stopped matching the moment a
  // result set spanned pages. The server owns filtering now; this
  // debounce keeps one request per settled change (not per keystroke)
  // and always restarts from page 1.
  const isFirstQueryEffect = useRef(true);

  useEffect(() => {
    // The initial load already fetched page 1 with these defaults.
    if (isFirstQueryEffect.current) {
      isFirstQueryEffect.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      void fetchAppointments(
        { page: 1, search: search.trim(), status: statusFilter },
        { silent: true }
      );
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search, statusFilter, fetchAppointments]);

  function openCreateForm() {
    setEditingAppointment(null);
    setShowForm(true);
  }

  function openEditForm(appointment: Appointment) {
    setEditingAppointment(appointment);
    setShowForm(true);
  }

  function closeForm() {
    setEditingAppointment(null);
    setShowForm(false);
  }
    async function handleSubmit(
    payload: AppointmentCreatePayload
  ) {
    try {
      setIsSubmitting(true);
      setError("");

      if (editingAppointment) {
        await appointmentsService.update(
          editingAppointment.id,
          payload
        );
      } else {
        await appointmentsService.create(
          payload
        );
      }

      closeForm();

      await loadData();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to save appointment."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function askDelete(
    appointment: Appointment
  ) {
    setAppointmentToDelete(appointment);
  }

  function closeDeleteDialog() {
    setAppointmentToDelete(null);
  }

  async function confirmDelete() {
    if (!appointmentToDelete) return;

    try {
      await appointmentsService.delete(
        appointmentToDelete.id
      );

      await loadData();

      closeDeleteDialog();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to cancel appointment."
        )
      );
    }
  }

  async function handleReceivePayment(
    appointment: Appointment,
    method: PaymentMethod
  ) {
    try {
      await appointmentsService.updatePayment(
        appointment.id,
        method
      );

      await loadData();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to receive payment."
        )
      );
    }
  }

  // D: direct status transitions (Start / Skip) with an immediate
  // refresh after the backend confirms the change.
  async function handleStatusChange(
    appointment: Appointment,
    status: "arrived" | "in_progress" | "no_show"
  ) {
    try {
      await appointmentsService.updateStatus(
        appointment.id,
        status
      );

      await loadData();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to update appointment status."
        )
      );
    }
  }

  function openCompleteDialog(appointment: Appointment) {
    setAppointmentToComplete(appointment);
  }

  function closeCompleteDialog() {
    if (isCompleting) return;
    setAppointmentToComplete(null);
  }

  // A/B: one request records the payment and completes the appointment
  // atomically on the backend; the list refreshes immediately after.
  async function handleComplete(
    method: PaymentMethod | null
  ) {
    if (!appointmentToComplete) return;

    try {
      setIsCompleting(true);

      await appointmentsService.complete(
        appointmentToComplete.id,
        method
      );

      setAppointmentToComplete(null);

      await loadData();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to complete appointment."
        )
      );
    } finally {
      setIsCompleting(false);
    }
  }

  return (
    <DashboardLayout
      title={dict.dashboardPages.appointments.title}
      description={dict.dashboardPages.appointments.description}
    >
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                {editingAppointment
                  ? "Edit Appointment"
                  : "Add Appointment"}
              </h2>

              <p className="mt-2 text-slate-500">
                {editingAppointment
                  ? "Update appointment information."
                  : "Create a new appointment."}
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={closeForm}
            >
              ← Back
            </Button>
          </div>

          <AppointmentForm
            doctors={doctors}
            patients={patients}
            services={services}
            initialData={editingAppointment}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Appointments
              </h2>

              <p className="mt-2 text-slate-500">
                Manage all clinic appointments.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="ghost"
                onClick={exportAppointments}
              >
                📊 Export Excel
              </Button>

              {/* E: completed + paid revenue only, with server-computed
                  totals and per-method breakdown. */}
              <Button
                variant="ghost"
                onClick={() => exportRevenue()}
              >
                💰 Revenue Export
              </Button>

              {isAdmin && (
                <Button onClick={openCreateForm}>
                  + Add Appointment
                </Button>
              )}
            </div>
          </div>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Appointments
              </p>

              <h3 className="mt-3 text-4xl font-bold text-slate-900">
                {pageMeta.total}
              </h3>
            </div>

            <div className="lg:col-span-2">
              <SearchAppointment
                value={search}
                onChange={setSearch}
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="arrived">Arrived</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <SkeletonTable rows={5} cols={5} />
          ) : (
            <AppointmentTable
              appointments={appointments}
              onEdit={openEditForm}
              onCancel={askDelete}
              onStatusChange={handleStatusChange}
              onComplete={openCompleteDialog}
              onReceivePayment={handleReceivePayment}
            />
          )}

          {/* Phase 2 — pagination, in the screen's own design language.
              Rendered only when the result set really does span pages,
              so a single-page table looks exactly as it did before. */}
          {pageMeta.last_page > 1 && (
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing {pageMeta.from ?? 0}–{pageMeta.to ?? 0} of{" "}
                {pageMeta.total} appointments
              </p>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading || pageMeta.current_page <= 1}
                  onClick={() => goToPage(pageMeta.current_page - 1)}
                >
                  ← Previous
                </Button>

                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  Page {pageMeta.current_page} of {pageMeta.last_page}
                </span>

                <Button
                  variant="ghost"
                  className="disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={
                    isLoading || pageMeta.current_page >= pageMeta.last_page
                  }
                  onClick={() => goToPage(pageMeta.current_page + 1)}
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <CompletePaymentDialog
        open={appointmentToComplete !== null}
        patientName={appointmentToComplete?.patient.name}
        serviceName={appointmentToComplete?.service.name}
        amount={appointmentToComplete?.service.price ?? 0}
        isPaid={
          appointmentToComplete?.payment.status === "paid"
        }
        isSubmitting={isCompleting}
        onCancel={closeCompleteDialog}
        onConfirm={handleComplete}
      />

      <DeleteAppointmentDialog
        open={appointmentToDelete !== null}
        patientName={appointmentToDelete?.patient.name}
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </DashboardLayout>
  );
}
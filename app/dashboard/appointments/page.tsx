"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";

import AppointmentTable from "@/components/dashboard/appointments/AppointmentTable";
import AppointmentForm from "@/components/dashboard/appointments/AppointmentForm";
import DeleteAppointmentDialog from "@/components/dashboard/appointments/DeleteAppointmentDialog";
import SearchAppointment from "@/components/dashboard/appointments/SearchAppointment";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import { appointmentsService } from "@/services/appointments.service";
import { doctorsService } from "@/services/doctors.service";
import { patientsService } from "@/services/patients.service";
import { servicesService } from "@/services/services.service";
import { exportAppointments } from "@/services/export.service";
import type { Service } from "@/types/service";

import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";

import type {
  Appointment,
  AppointmentCreatePayload,
} from "@/types/appointment";
import type { Doctor } from "@/types/doctor";
import type { Patient } from "@/types/patient";

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

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadData();
  }, []);
    async function loadData() {
    try {
      setIsLoading(true);

     const [
       appointmentsData,
       doctorsData,
       patientsData,
       servicesData,
      ] = await Promise.all([
        appointmentsService.getAll(),
        doctorsService.getAll(),
        patientsService.getAll(),
        servicesService.getAll(),
      ]);

      setAppointments(appointmentsData);
      setDoctors(doctorsData);
      setPatients(patientsData);
      setServices(servicesData);

      setError("");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to load appointments."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  const filteredAppointments = useMemo(() => {
    let data = appointments;

    if (statusFilter !== "all") {
      data = data.filter(
        (appointment) =>
          appointment.status === statusFilter
      );
    }

    if (!search.trim()) return data;

    const q = search.toLowerCase();

    return data.filter((appointment) => {
      return (
        appointment.patient.name
          .toLowerCase()
          .includes(q) ||
        appointment.doctor.name
          .toLowerCase()
          .includes(q) ||
        appointment.status
          .toLowerCase()
          .includes(q)
      );
    });
  }, [appointments, search, statusFilter]);

  function openCreateForm() {
    setEditingAppointment(null);
    setShowForm(true);
  }

  function openEditForm(
    appointment: Appointment
  ) {
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

              {isAdmin && (
                <Button onClick={openCreateForm}>
                  + Add Appointment
                </Button>
              )}

            </div>

          </div>

          <div className="mb-6 grid gap-6 lg:grid-cols-4">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Appointments
              </p>

              <h3 className="mt-3 text-4xl font-bold text-slate-900">
                {appointments.length}
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
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
              >
                <option value="all">
                  All Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="arrived">
                  Arrived
                </option>

                <option value="in_progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>

                <option value="no_show">
                  No Show
                </option>

              </select>

            </div>

          </div>

          {isLoading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              Loading appointments...
            </div>
          ) : (
            <AppointmentTable
              appointments={filteredAppointments}
              onEdit={openEditForm}
              onCancel={askDelete}
            />
          )}

        </>
      )}

      <DeleteAppointmentDialog
        open={appointmentToDelete !== null}
        patientName={
          appointmentToDelete?.patient.name
        }
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
      />

    </DashboardLayout>
  );
}
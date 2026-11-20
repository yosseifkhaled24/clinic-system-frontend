"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";

import DoctorTable from "@/components/dashboard/doctors/DoctorTable";
import DoctorForm from "@/components/dashboard/doctors/DoctorForm";
import DeleteDoctorDialog from "@/components/dashboard/doctors/DeleteDoctorDialog";
import SearchDoctor from "@/components/dashboard/doctors/SearchDoctor";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import { doctorsService } from "@/services/doctors.service";

import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";
import { SkeletonTable } from "@/components/ui/Skeleton";


import type { Doctor } from "@/types/doctor";

export default function DashboardDoctorsPage() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const dict = getDictionary(language);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingDoctor, setEditingDoctor] =
    useState<Doctor | null>(null);

  const [doctorToDelete, setDoctorToDelete] =
    useState<Doctor | null>(null);

  const [search, setSearch] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
    try {
      setIsLoading(true);

      const response = await doctorsService.getAll();

      setDoctors(response);

      setError("");
    } catch (err) {
      // A3: this rejection used to escape the function (no catch), so the
      // initial load ended in an unhandled promise rejection and the
      // error banner below stayed empty. Surface it instead — the stale
      // list (if any) stays visible underneath.
      setError(
        getErrorMessage(
          err,
          "Unable to load doctors."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  const filteredDoctors = useMemo(() => {
    if (!search.trim()) return doctors;

    const q = search.toLowerCase();

    return doctors.filter((doctor) => {
      return (
        doctor.name.toLowerCase().includes(q) ||
        (doctor.specialty ?? "")
          .toLowerCase()
          .includes(q) ||
        (doctor.email ?? "")
          .toLowerCase()
          .includes(q) ||
        (doctor.phone ?? "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [doctors, search]);

  function openCreateForm() {
    setEditingDoctor(null);
    setShowForm(true);
  }

  function openEditForm(doctor: Doctor) {
    setEditingDoctor(doctor);
    setShowForm(true);
  }

  function closeForm() {
    setEditingDoctor(null);
    setShowForm(false);
  }

  async function handleSubmit(form: FormData) {
    try {
      setIsSubmitting(true);
      setError("");

      if (editingDoctor) {
        await doctorsService.update(editingDoctor.id, form);
      } else {
        await doctorsService.create(form);
      }

      closeForm();

      await loadDoctors();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to save doctor."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function askDelete(doctor: Doctor) {
    setDoctorToDelete(doctor);
  }

  function closeDeleteDialog() {
    setDoctorToDelete(null);
  }

  async function confirmDelete() {
    if (!doctorToDelete) return;

    try {
      await doctorsService.delete(
        doctorToDelete.id
      );

      setDoctors((prev) =>
        prev.filter(
          (d) => d.id !== doctorToDelete.id
        )
      );

      closeDeleteDialog();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to delete doctor."
        )
      );
    }
  }
  return (
  <DashboardLayout
    title={dict.dashboardPages.doctors.title}
    description={dict.dashboardPages.doctors.description}
  >
    {error && (
      <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    )}

    {showForm ? (
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold text-slate-900">
              {editingDoctor ? "Edit Doctor" : "Add Doctor"}
            </h2>

            <p className="mt-2 text-slate-500">
              {editingDoctor
                ? "Update doctor information."
                : "Fill doctor information to create a new doctor."}
            </p>

          </div>

          <Button
            variant="ghost"
            onClick={closeForm}
          >
            ← Back
          </Button>

        </div>

        <DoctorForm
          initialData={editingDoctor}
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
              Doctors
            </h2>

            <p className="mt-2 text-slate-500">
              Manage all doctors in your clinic.
            </p>

          </div>

          {isAdmin && (
            <Button onClick={openCreateForm}>
              + Add Doctor
            </Button>
          )}

        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Doctors
            </p>

            <h3 className="mt-3 text-4xl font-bold text-slate-900">
              {doctors.length}
            </h3>

          </div>

          <div className="md:col-span-2">

            <SearchDoctor
              value={search}
              onChange={setSearch}
            />

          </div>

        </div>

        {isLoading ? (
          <SkeletonTable rows={5} cols={4} />
        ) : (
          <DoctorTable
            doctors={filteredDoctors}
            onEdit={openEditForm}
            onDelete={askDelete}
          />
        )}

      </>
    )}

    <DeleteDoctorDialog
      open={doctorToDelete !== null}
      doctorName={doctorToDelete?.name}
      onCancel={closeDeleteDialog}
      onConfirm={confirmDelete}
    />

  </DashboardLayout>
);
}
"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";

import SpecialtyTable from "@/components/dashboard/specialties/SpecialtyTable";
import SpecialtyForm from "@/components/dashboard/specialties/SpecialtyForm";
import DeleteSpecialtyDialog from "@/components/dashboard/specialties/DeleteSpecialtyDialog";
import SearchSpecialty from "@/components/dashboard/specialties/SearchSpecialty";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import { specialtiesService } from "@/services/specialties.service";

import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";
import { SkeletonTable } from "@/components/ui/Skeleton";

import type { Specialty } from "@/types/specialty";

export default function DashboardSpecialtiesPage() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const dict = getDictionary(language);

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingSpecialty, setEditingSpecialty] =
    useState<Specialty | null>(null);

  const [specialtyToDelete, setSpecialtyToDelete] =
    useState<Specialty | null>(null);

  const [search, setSearch] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadSpecialties();
  }, []);

  async function loadSpecialties() {
    try {
      setIsLoading(true);

      const response = await specialtiesService.getAll();

      setSpecialties(response);

      setError("");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to load specialties."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  const filteredSpecialties = useMemo(() => {
    if (!search.trim()) return specialties;

    const q = search.toLowerCase();

    return specialties.filter((specialty) => {
      return specialty.name.toLowerCase().includes(q);
    });
  }, [specialties, search]);

  function openCreateForm() {
    setEditingSpecialty(null);
    setShowForm(true);
  }

  function openEditForm(specialty: Specialty) {
    setEditingSpecialty(specialty);
    setShowForm(true);
  }

  function closeForm() {
    setEditingSpecialty(null);
    setShowForm(false);
  }

  async function handleSubmit(payload: { name: string }) {
    try {
      setIsSubmitting(true);
      setError("");

      if (editingSpecialty) {
        await specialtiesService.update(
          editingSpecialty.id,
          payload
        );
      } else {
        await specialtiesService.create(payload);
      }

      closeForm();

      await loadSpecialties();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to save specialty."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function askDelete(specialty: Specialty) {
    setSpecialtyToDelete(specialty);
  }

  function closeDeleteDialog() {
    setSpecialtyToDelete(null);
  }

  async function confirmDelete() {
    if (!specialtyToDelete) return;

    try {
      await specialtiesService.delete(
        specialtyToDelete.id
      );

      setSpecialties((prev) =>
        prev.filter(
          (s) => s.id !== specialtyToDelete.id
        )
      );

      closeDeleteDialog();
    } catch (err) {
      // Specialties assigned to doctors are refused by the API (409) —
      // its message is shown in the error banner above the table.
      setError(
        getErrorMessage(
          err,
          "Failed to delete specialty."
        )
      );

      closeDeleteDialog();
    }
  }

  return (
    <DashboardLayout
      title={dict.dashboardPages.specialties.title}
      description={dict.dashboardPages.specialties.description}
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
                {editingSpecialty ? "Edit Specialty" : "Add Specialty"}
              </h2>

              <p className="mt-2 text-slate-500">
                {editingSpecialty
                  ? "Update the specialty name."
                  : "Fill the specialty name to create a new specialty."}
              </p>

            </div>

            <Button
              variant="ghost"
              onClick={closeForm}
            >
              ← Back
            </Button>

          </div>

          <SpecialtyForm
            initialData={editingSpecialty}
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
                Specialties
              </h2>

              <p className="mt-2 text-slate-500">
                Manage the medical specialties doctors are assigned to.
              </p>

            </div>

            {isAdmin && (
              <Button onClick={openCreateForm}>
                + Add Specialty
              </Button>
            )}

          </div>

          <div className="mb-6 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Total Specialties
              </p>

              <h3 className="mt-3 text-4xl font-bold text-slate-900">
                {specialties.length}
              </h3>

            </div>

            <div className="md:col-span-2">

              <SearchSpecialty
                value={search}
                onChange={setSearch}
              />

            </div>

          </div>

          {isLoading ? (
            <SkeletonTable rows={5} cols={2} />
          ) : (
            <SpecialtyTable
              specialties={filteredSpecialties}
              onEdit={openEditForm}
              onDelete={askDelete}
            />
          )}

        </>
      )}

      <DeleteSpecialtyDialog
        open={specialtyToDelete !== null}
        specialtyName={specialtyToDelete?.name}
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
      />

    </DashboardLayout>
  );
}

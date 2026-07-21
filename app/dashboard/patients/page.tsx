"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

import PatientTable from "@/components/dashboard/Patient/PatientTable";
import PatientForm from "@/components/dashboard/Patient/PatientForm";
import DeletePatientDialog from "@/components/dashboard/Patient/DeletePatientDialog";
import SearchPatient from "@/components/dashboard/Patient/SearchPatient";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import { patientsService } from "@/services/patients.service";

import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";

import type { Patient } from "@/types/patient";

export default function DashboardPatientsPage() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const dict = getDictionary(language);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingPatient, setEditingPatient] =
    useState<Patient | null>(null);

  const [patientToDelete, setPatientToDelete] =
    useState<Patient | null>(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      setIsLoading(true);

      const response = await patientsService.getAll();

      setPatients(response);

      setError("");
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to load patients.")
      );
    } finally {
      setIsLoading(false);
    }
  }

  const filteredPatients = useMemo(() => {
    if (!search.trim()) return patients;

    const q = search.toLowerCase();

    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(q) ||
        patient.phone.toLowerCase().includes(q) ||
        (patient.email ?? "")
          .toLowerCase()
          .includes(q)
    );
  }, [patients, search]);

  function openEditForm(patient: Patient) {
    setEditingPatient(patient);
    setShowForm(true);
  }

  function closeForm() {
    setEditingPatient(null);
    setShowForm(false);
  }

  async function handleSubmit(
    patient: Partial<Patient>
  ) {
    if (!editingPatient) return;

    try {
      setIsSubmitting(true);

      await patientsService.update(
        editingPatient.id,
        patient
      );

      closeForm();

      await loadPatients();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to update patient."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function askDelete(patient: Patient) {
    setPatientToDelete(patient);
  }

  function closeDeleteDialog() {
    setPatientToDelete(null);
  }

  async function confirmDelete() {
    if (!patientToDelete) return;

    try {
      await patientsService.delete(
        patientToDelete.id
      );

      setPatients((prev) =>
        prev.filter(
          (p) => p.id !== patientToDelete.id
        )
      );

      closeDeleteDialog();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to delete patient."
        )
      );
    }
  }
  return (
  <DashboardLayout
    title="Patients"
    description="Manage clinic patients"
  >
    {error && (
      <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    )}

    {showForm ? (
      <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            
            <p className="mt-2 text-slate-500">
              Update patient information.
            </p>
          </div>

          <button
            onClick={closeForm}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium transition hover:bg-slate-100"
          >
            ← Back
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <PatientForm
            initialData={editingPatient}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </div>
      </>
    ) : (
      <>
        <div className="mb-6">
          <SearchPatient
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">
            Total Patients
          </div>

          <div className="mt-2 text-3xl font-bold text-slate-900">
            {patients.length}
          </div>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <PatientTable
            patients={filteredPatients}
            onEdit={openEditForm}
            onDelete={askDelete}
          />
        )}
      </>
    )}

    <DeletePatientDialog
      open={patientToDelete !== null}
      patientName={patientToDelete?.name}
      onCancel={closeDeleteDialog}
      onConfirm={confirmDelete}
    />
  </DashboardLayout>
);
}
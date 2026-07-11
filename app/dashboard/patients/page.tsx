"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/errors";
import { getDictionary } from "@/lib/i18n";
import { patientsService } from "@/services/patients.service";
import type { Patient } from "@/types/patient";

export default function DashboardPatientsPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const dict = getDictionary(language);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    address: "",
  });

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
    loadPatients();
  }, [user]);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const response = await patientsService.getAll();
      setPatients(response);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load patients."));
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingId(patient.id);
    setFormData({
      name: patient.name || "",
      email: patient.email || "",
      phone: patient.phone || "",
      gender: patient.gender || "",
      date_of_birth: patient.date_of_birth || "",
      address: patient.address || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    try {
      await patientsService.delete(id);
      setPatients(patients.filter((p) => p.id !== id));
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete patient."));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: (formData.gender as "male" | "female" | null) || null,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
      };

      if (editingId) {
        await patientsService.update(editingId, payload);
        setPatients(
          patients.map((p) =>
            p.id === editingId ? { ...p, ...payload } : p
          )
        );
      } else {
        const newPatient = await patientsService.create(payload);
        setPatients([...patients, newPatient]);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        address: "",
      });
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to save patient."));
    }
  };

  return (
    <DashboardLayout title={dict.dashboardPages.patients.title} description={dict.dashboardPages.patients.description}>
      <div className="space-y-6">
        {isAdmin && (
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                name: "",
                email: "",
                phone: "",
                gender: "",
                date_of_birth: "",
                address: "",
              });
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            {showForm ? "Cancel" : "+ Add Patient"}
          </button>
        )}

        {showForm && isAdmin && (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {editingId ? "Edit Patient" : "Add Patient"}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              {editingId ? "Update Patient" : "Add Patient"}
            </button>
          </form>
        )}

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <div className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-slate-600">{dict.dashboard.loading}</p>
          ) : patients.length === 0 ? (
            <p className="text-sm text-slate-600">No patients found.</p>
          ) : (
            patients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{patient.name}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{patient.email}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{patient.phone}</p>
                </div>
                {isAdmin && (
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(patient)}
                      className="rounded px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="rounded px-3 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/errors";
import { getDictionary } from "@/lib/i18n";
import { appointmentsService } from "@/services/appointments.service";
import type { Appointment } from "@/types/appointment";

export default function DashboardAppointmentsPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const dict = getDictionary(language);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
    loadAppointments();
  }, [user]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await appointmentsService.getAll();
      setAppointments(response);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load appointments."));
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAppointment = appointments.find((a) => a.id === selectedId);

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100",
    confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100",
    completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100",
  };

  return (
    <DashboardLayout title={dict.dashboardPages.appointments.title} description={dict.dashboardPages.appointments.description}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Appointments ({appointments.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoading ? (
              <p className="text-sm text-slate-600">{dict.dashboard.loading}</p>
            ) : error && !isAdmin ? (
              <p className="text-sm text-rose-600">{error}</p>
            ) : appointments.length === 0 ? (
              <p className="text-sm text-slate-600">No appointments.</p>
            ) : (
              appointments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => setSelectedId(apt.id)}
                  className={`w-full rounded-xl p-3 text-left text-sm transition ${
                    selectedId === apt.id
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "border border-slate-200 text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <p className="font-medium line-clamp-1">{apt.doctor?.name || "Doctor"}</p>
                  <p className="text-xs opacity-75">{apt.appointment_date}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedAppointment ? (
            <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {selectedAppointment.doctor?.name || "Doctor"}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      statusColor[selectedAppointment.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedAppointment.doctor?.specialty || ""}
                </p>
              </div>

              <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-700">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    Date & Time
                  </p>
                  <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                    {selectedAppointment.appointment_date}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    Patient
                  </p>
                  <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                    {selectedAppointment.patient?.name || "N/A"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedAppointment.patient?.email || ""}
                  </p>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                      Notes
                    </p>
                    <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300">Select an appointment to view details</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

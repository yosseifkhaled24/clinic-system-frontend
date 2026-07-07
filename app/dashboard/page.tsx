"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { appointmentsService } from "@/services/appointments.service";
import { dashboardService } from "@/services/dashboard.service";
import { patientsService } from "@/services/patients.service";
import type { Appointment } from "@/types/appointment";
import type { DashboardOverview } from "@/types/dashboard";
import type { Patient } from "@/types/patient";

const fallbackOverview: DashboardOverview = {
  appointments: 24,
  patients: 128,
  pendingReviews: 7,
};

const fallbackAppointments: Appointment[] = [
  { id: 1, title: "Cardiology follow-up", date: "Today • 09:00", status: "Confirmed" },
  { id: 2, title: "Orthopedic review", date: "Today • 11:30", status: "Pending" },
  { id: 3, title: "General checkup", date: "Today • 14:00", status: "Confirmed" },
];

const fallbackPatients: Patient[] = [
  { id: 1, name: "Amina Ali", email: "amina@example.com", status: "Active" },
  { id: 2, name: "Omar Khaled", email: "omar@example.com", status: "Follow-up" },
];

const quickActions = ["Add patient", "Create appointment", "Send reminder"];

export default function DashboardPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [overview, setOverview] = useState<DashboardOverview>(fallbackOverview);
  const [appointments, setAppointments] = useState<Appointment[]>(fallbackAppointments);
  const [patients, setPatients] = useState<Patient[]>(fallbackPatients);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDashboardData = async () => {
      setLoading(true);

      try {
        const [overviewData, appointmentsData, patientsData] = await Promise.all([
          dashboardService.getOverview(),
          appointmentsService.getAll(),
          patientsService.getAll(),
        ]);

        if (!active) return;

        setOverview((overviewData as DashboardOverview) ?? fallbackOverview);
        setAppointments((appointmentsData as Appointment[]) ?? fallbackAppointments);
        setPatients((patientsData as Patient[]) ?? fallbackPatients);
      } catch {
        if (active) {
          setOverview(fallbackOverview);
          setAppointments(fallbackAppointments);
          setPatients(fallbackPatients);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: dict.dashboard.stats.appointments, value: String(overview.appointments ?? appointments.length), detail: dict.dashboard.stats.today },
      { label: dict.dashboard.stats.patients, value: String(overview.patients ?? patients.length), detail: dict.dashboard.stats.active },
      { label: dict.dashboard.stats.pendingReviews, value: String(overview.pendingReviews ?? 0), detail: dict.dashboard.stats.needsAttention },
    ],
    [appointments.length, overview, patients.length],
  );

  const todayAppointments = useMemo(() => appointments.slice(0, 3), [appointments]);

  return (
    <DashboardLayout title={dict.dashboard.overviewTitle} description={dict.dashboard.overviewDescription}>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{dict.dashboard.todayAppointments}</h2>
            <span className="text-sm text-slate-500">{loading ? dict.dashboard.loading : `${todayAppointments.length} ${dict.dashboard.scheduled}`}</span>
          </div>
          <div className="space-y-3">
            {todayAppointments.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.status}</p>
                </div>
                <span className="text-sm font-semibold text-slate-700">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">{dict.dashboard.quickActions}</h2>
          <div className="mt-4 space-y-2">
            {quickActions.map((action) => (
              <button
                key={action}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span>{action}</span>
                <span>→</span>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{dict.dashboard.recentPatients}</p>
            <div className="mt-3 space-y-2">
              {patients.slice(0, 3).map((patient) => (
                <div key={patient.id} className="flex items-center justify-between text-sm text-slate-600">
                  <span>{patient.name}</span>
                  <span>{patient.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { appointmentsService } from "@/services/appointments.service";
import type { Appointment } from "@/types/appointment";

export default function DashboardAppointmentsPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    appointmentsService.getAll().then((response) => {
      const list = Array.isArray(response) ? response : (response as { data?: Appointment[] }).data || [];
      setAppointments(list);
    });
  }, []);

  return (
    <DashboardLayout title={dict.dashboardPages.appointments.title} description={dict.dashboardPages.appointments.description}>
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{appointment.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{appointment.date}</p>
              </div>
              <span className="text-sm text-slate-500">{appointment.status}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

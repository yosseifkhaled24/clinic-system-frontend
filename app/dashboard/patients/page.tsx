"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { patientsService } from "@/services/patients.service";
import type { Patient } from "@/types/patient";

export default function DashboardPatientsPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    patientsService.getAll().then((response) => {
      const list = Array.isArray(response) ? response : (response as { data?: Patient[] }).data || [];
      setPatients(list);
    });
  }, []);

  return (
    <DashboardLayout title={dict.dashboardPages.patients.title} description={dict.dashboardPages.patients.description}>
      <div className="space-y-3">
        {patients.map((patient) => (
          <div key={patient.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                <p className="text-sm text-slate-600">{patient.email}</p>
              </div>
              <span className="text-sm text-slate-500">{patient.status}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { doctorsService } from "@/services/doctors.service";
import type { Doctor } from "@/types/doctor";

export default function DashboardDoctorsPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    doctorsService.getAll().then((response) => {
      const list = Array.isArray(response) ? response : (response as { data?: Doctor[] }).data || [];
      setDoctors(list);
    });
  }, []);

  return (
    <DashboardLayout title={dict.dashboardPages.doctors.title} description={dict.dashboardPages.doctors.description}>
      <div className="space-y-3">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{doctor.name}</h3>
                <p className="text-sm text-slate-600">{doctor.specialty}</p>
              </div>
              <span className="text-sm text-slate-500">{doctor.experience}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

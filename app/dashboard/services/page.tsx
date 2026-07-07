"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { servicesService } from "@/services/services.service";
import type { ServiceItem } from "@/types/service";

export default function DashboardServicesPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    servicesService.getAll().then((response) => {
      const list = Array.isArray(response) ? response : (response as { data?: ServiceItem[] }).data || [];
      setServices(list);
    });
  }, []);

  return (
    <DashboardLayout title={dict.dashboardPages.services.title} description={dict.dashboardPages.services.description}>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="rounded-2xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">{service.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{service.description}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

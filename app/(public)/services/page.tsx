"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { servicesService } from "@/services/services.service";
import type { ServiceItem } from "@/types/service";

export default function ServicesPage() {
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
    <Container className="py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">{dict.services.title}</h1>
        <p className="mt-2 text-slate-600">{dict.services.description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{service.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{service.description}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}

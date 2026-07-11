"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { ApiImage } from "@/components/ui/ApiImage";
import { useLanguage } from "@/context/LanguageContext";
import { getErrorMessage } from "@/lib/errors";
import { getDictionary } from "@/lib/i18n";
import { servicesService } from "@/services/services.service";
import type { ServiceItem } from "@/types/service";

export default function ServicesPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    servicesService.getAll().then((response) => {
      setServices(response);
    }).catch((error) => {
      setError(getErrorMessage(error, "Unable to load services."));
      setServices([]);
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <Container className="py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">{dict.services.title}</h1>
        <p className="mt-2 text-slate-600">{dict.services.description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {isLoading ? <p className="text-sm text-slate-600">{dict.dashboard.loading}</p> : null}
        {!isLoading && error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {!isLoading && !error && services.length === 0 ? <p className="text-sm text-slate-600">No services available.</p> : null}
        {services.map((service) => (
          <div key={service.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <ApiImage src={service.image_url} alt={service.name} className="mb-4 h-40 w-full rounded-2xl object-cover" fallbackClassName="mb-4 flex h-40 w-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500" />
            <h2 className="text-xl font-semibold text-slate-900">{service.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{service.description}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}

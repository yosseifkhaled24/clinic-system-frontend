"use client";

import { useEffect, useState } from "react";
import { servicesService } from "@/services/services.service";
import type { Service } from "@/types/service";
import { getErrorMessage } from "@/lib/errors";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

import ServiceCard from "./ServiceCard";

export default function ServicesGrid() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    servicesService
      .getAll()
      .then(setServices)
      .catch((error) => {
        setError(getErrorMessage(error, "Unable to load services."));
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {dict.services.title}
          </h2>

          <p className="mt-3 text-base text-slate-500 sm:text-lg">
            {dict.services.description}
          </p>
        </div>

        {loading && (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm space-y-4"
              >
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="py-16 text-center text-red-500">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
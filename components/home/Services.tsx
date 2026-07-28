"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Stethoscope, ArrowRight } from "lucide-react";

import { servicesService } from "@/services/services.service";
import type { Service } from "@/types/service";
import { getErrorMessage } from "@/lib/errors";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export default function Services() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    servicesService
      .getAll()
      .then((data) => {
        setServices(data.slice(0, 6));
      })
      .catch((error) => {
        setError(getErrorMessage(error, "Unable to load services."));
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
            {dict.home.services.tag}
          </span>

          <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
            {dict.home.services.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 sm:text-lg">
            {dict.home.services.description}
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {loading && (
            <p className="col-span-full text-center text-slate-500">
              {dict.dashboard.loading}
            </p>
          )}

          {!loading && error && (
            <p className="col-span-full text-center text-red-500">{error}</p>
          )}

          {!loading && !error && services.length === 0 && (
            <p className="col-span-full text-center text-slate-500">
              {dict.home.services.noServices}
            </p>
          )}

          {!loading &&
            !error &&
            services.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div>
                  <div className="mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                    <Stethoscope size={28} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {service.name}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-500 text-sm sm:text-base">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="rounded-full bg-sky-100 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-sky-700">
                    {service.price
                      ? `${service.price} ${dict.home.serviceCard.egp}`
                      : dict.home.serviceCard.contactUs}
                  </span>

                  <Link href={`/booking?service=${service.id}`}>
                    <button className="flex items-center gap-2 rounded-2xl bg-black px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-none">
                      {dict.home.serviceCard.book}
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
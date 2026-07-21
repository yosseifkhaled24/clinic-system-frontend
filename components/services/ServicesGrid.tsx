"use client";

import { useEffect, useState } from "react";
import { servicesService } from "@/services/services.service";
import type { Service } from "@/types/service";
import { getErrorMessage } from "@/lib/errors";

import ServiceCard from "./ServiceCard";

export default function ServicesGrid() {

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

    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">

          <h2 className="text-4xl font-bold text-slate-900">

            Our Medical Services

          </h2>

          <p className="mt-4 text-slate-500">

            Choose the healthcare service that suits your needs.

          </p>

        </div>
                {loading && (

          <div className="py-20 text-center text-slate-500">

            Loading services...

          </div>

        )}

       {!loading && error && (
  <div className="py-20 text-center text-red-500">
    {error}
  </div>
)}

{!loading && !error && (
  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
    {services.map((service) => (
      <ServiceCard
        key={service.id}
        service={service}
      />
    ))}
  </div>
)}

      </div>

    </section>

  );

}
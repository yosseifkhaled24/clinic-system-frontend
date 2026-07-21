"use client";

import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";

import { servicesService } from "@/services/services.service";
import type { Service } from "@/types/service";
import { getErrorMessage } from "@/lib/errors";
export default function Services() {
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
    <section className="bg-slate-50 py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
            Our Services
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Medical Services We Provide
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Professional healthcare services with experienced doctors
            and modern medical technology.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

  {loading && (
    <p className="col-span-3 text-center text-slate-500">
      Loading services...
    </p>
  )}

  {!loading && error && (
    <p className="col-span-3 text-center text-red-500">
      {error}
    </p>
  )}

  {!loading && !error && services.length === 0 && (
    <p className="col-span-3 text-center text-slate-500">
      No services available.
    </p>
  )}

  {!loading &&
    !error &&
    services.map((service) => (
      <div
        key={service.id}
        className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
          <Stethoscope size={30} />
        </div>

        <h3 className="text-2xl font-bold text-slate-900">
          {service.name}
        </h3>

        <p className="mt-4 leading-7 text-slate-500">
          {service.description}
        </p>

        <button className="mt-8 font-semibold text-sky-600 transition group-hover:translate-x-2">
          Learn More →
        </button>
      </div>
    ))}

</div>

      </div>

    </section>
  );
}
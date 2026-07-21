"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ApiImage } from "@/components/ui/ApiImage";
import type { Service } from "@/types/service";

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({
  service,
}: ServiceCardProps) {

  return (

    <div className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

      <div className="overflow-hidden">

        <ApiImage
          src={service.image_url}
          alt={service.name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
          fallbackClassName="flex h-64 w-full items-center justify-center bg-slate-100 text-slate-400"
        />

      </div>

      <div className="p-7">
        <h2 className="text-2xl font-bold text-slate-900">

  {service.name}

</h2>

<p className="mt-4 line-clamp-3 leading-7 text-slate-500">

  {service.description}

</p>

<div className="mt-8 flex items-center justify-between">

  <span className="rounded-full bg-sky-100 px-4 py-2 font-semibold text-sky-700">

    {service.price ? `${service.price} EGP` : "Contact Us"}

  </span>

  <Link
    href={`/booking?service=${service.id}`}
    className="flex items-center gap-2 font-semibold text-sky-600 transition hover:translate-x-1"
  >

    Book

    <ArrowRight size={18} />

  </Link>

</div>

      </div>

    </div>

  );

}
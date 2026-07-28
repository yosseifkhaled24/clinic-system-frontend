"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ApiImage } from "@/components/ui/ApiImage";
import type { Service } from "@/types/service";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  return (
    <div className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between">
      <div>
        <div className="overflow-hidden">
          <ApiImage
            src={service.image_url}
            alt={service.name}
            className="h-60 sm:h-64 w-full object-cover transition duration-500 group-hover:scale-110"
            fallbackClassName="flex h-60 sm:h-64 w-full items-center justify-center bg-slate-100 text-slate-400"
          />
        </div>

        <div className="p-6 sm:p-7">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {service.name}
          </h2>

          <p className="mt-3 sm:mt-4 line-clamp-3 leading-7 text-slate-500 text-sm sm:text-base">
            {service.description}
          </p>

          <div className="mt-6 sm:mt-8 flex items-center justify-between">
            <span className="rounded-full bg-sky-100 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-sky-700">
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
      </div>
    </div>
  );
}
"use client";

import {
  ShieldCheck,
  Clock3,
  HeartHandshake,
  BadgeCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export default function WhyChooseUs() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const features = [
    {
      title: dict.home.whyChooseUs.feature1Title,
      description: dict.home.whyChooseUs.feature1Desc,
      icon: ShieldCheck,
      color: "bg-sky-100 text-sky-600",
    },
    {
      title: dict.home.whyChooseUs.feature2Title,
      description: dict.home.whyChooseUs.feature2Desc,
      icon: Clock3,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: dict.home.whyChooseUs.feature3Title,
      description: dict.home.whyChooseUs.feature3Desc,
      icon: HeartHandshake,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: dict.home.whyChooseUs.feature4Title,
      description: dict.home.whyChooseUs.feature4Desc,
      icon: BadgeCheck,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
            {dict.home.whyChooseUs.tag}
          </span>

          <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
            {dict.home.whyChooseUs.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 sm:text-lg">
            {dict.home.whyChooseUs.description}
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex flex-col sm:flex-row gap-5 sm:gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div
                  className={`flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl ${feature.color}`}
                >
                  <Icon size={28} />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2.5 leading-7 text-slate-500 text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
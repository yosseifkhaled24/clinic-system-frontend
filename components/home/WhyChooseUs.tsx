"use client";

import {
  ShieldCheck,
  Clock3,
  HeartHandshake,
  BadgeCheck,
} from "lucide-react";

export default function WhyChooseUs() {

  const features = [
    {
      title: "Trusted Doctors",
      description: "Certified specialists with years of medical experience.",
      icon: ShieldCheck,
      color: "bg-sky-100 text-sky-600",
    },

    {
      title: "24/7 Support",
      description: "Our team is always available whenever you need help.",
      icon: Clock3,
      color: "bg-emerald-100 text-emerald-600",
    },

    {
      title: "Patient Care",
      description: "Your health and comfort are always our priority.",
      icon: HeartHandshake,
      color: "bg-pink-100 text-pink-600",
    },

    {
      title: "Quality Service",
      description: "Modern equipment with high quality healthcare.",
      icon: BadgeCheck,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (

    <section className="bg-slate-50 py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">

            Why Choose Us

          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">

            Healthcare You Can Trust

          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">

            We provide reliable healthcare services with professional
            doctors and modern technology.

          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2">
                      {features.map((feature) => {

            const Icon = feature.icon;

            return (

              <div
                key={feature.title}
                className="flex gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color}`}
                >

                  <Icon size={30} />

                </div>

                <div>

                  <h3 className="text-2xl font-bold text-slate-900">

                    {feature.title}

                  </h3>

                  <p className="mt-3 leading-7 text-slate-500">

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
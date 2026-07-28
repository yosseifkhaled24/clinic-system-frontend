"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export default function Hero() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 py-16 text-white sm:py-20 lg:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left / Main content */}
        <div>
          <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
            {dict.home.hero.pretitle}
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:mt-8 lg:text-6xl">
            {dict.home.hero.title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-sky-100 sm:text-lg">
            {dict.home.hero.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            {/* First button: solid black with white text */}
            <Link href="/booking" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto rounded-2xl bg-black px-8 py-4 sm:py-6 text-base font-semibold text-white transition-none">
                {dict.home.hero.ctaBook}
              </button>
            </Link>

            {/* Second button: transparent with white border and white text */}
            <Link href="/doctors" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto rounded-2xl border border-white/40 bg-transparent px-8 py-4 sm:py-6 text-base font-semibold text-white transition-none">
                {dict.home.hero.ctaExplore}
              </button>
            </Link>
          </div>
        </div>

        {/* Right / Stats card */}
        <div className="relative">
          <div className="rounded-[28px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur sm:rounded-[32px] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-200">
              {dict.home.hero.cardTag}
            </p>

            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
              {dict.home.hero.cardTitle}
            </h2>

            <p className="mt-4 text-sm text-sky-100 sm:text-base">
              {dict.home.hero.cardDesc}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { value: "+120", label: dict.home.hero.doctors },
                { value: "+8K", label: dict.home.hero.patients },
                { value: "+15K", label: dict.home.hero.appointments },
                { value: "24/7", label: dict.home.hero.support },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/10 p-4 text-center sm:p-5"
                >
                  <p className="text-3xl font-bold sm:text-4xl">{stat.value}</p>
                  <span className="text-xs text-sky-100 sm:text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Background blobs */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
    </section>
  );
}
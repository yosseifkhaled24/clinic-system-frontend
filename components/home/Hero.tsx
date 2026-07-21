"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export default function Hero() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 py-24 text-white">

      <Container className="grid items-center gap-16 lg:grid-cols-2">
                <div>

          <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
            {dict.home.hero.pretitle}
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight lg:text-6xl">
            {dict.home.hero.title}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-sky-100">
            {dict.home.hero.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link href="/booking">
              <Button className="rounded-2xl px-8 py-6 text-base">
                {dict.home.hero.ctaBook}
              </Button>
            </Link>

            <Link href="/doctors">
              <Button
                variant="ghost"
                className="rounded-2xl border border-white/20 bg-white/10 px-8 py-6 text-base text-white hover:bg-white/20"
              >
                {dict.home.hero.ctaExplore}
              </Button>
            </Link>

          </div>

        </div>
                {/* Right Side */}

        <div className="relative">

          <div className="rounded-[32px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-200">
              Trusted Healthcare
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              Book appointments with the best doctors.
            </h2>

            <p className="mt-4 text-sky-100">
              Fast booking, trusted specialists, secure medical records,
              and an easy-to-use clinic management experience.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-white/10 p-5 text-center">

                <p className="text-4xl font-bold">
                  +120
                </p>

                <span className="text-sm text-sky-100">
                  Doctors
                </span>

              </div>

              <div className="rounded-2xl bg-white/10 p-5 text-center">

                <p className="text-4xl font-bold">
                  +8K
                </p>

                <span className="text-sm text-sky-100">
                  Patients
                </span>

              </div>

              <div className="rounded-2xl bg-white/10 p-5 text-center">

                <p className="text-4xl font-bold">
                  +15K
                </p>

                <span className="text-sm text-sky-100">
                  Appointments
                </span>

              </div>

              <div className="rounded-2xl bg-white/10 p-5 text-center">

                <p className="text-4xl font-bold">
                  24/7
                </p>

                <span className="text-sm text-sky-100">
                  Support
                </span>

              </div>

            </div>

          </div>
                  </div>

        {/* Background Effects */}

        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

      </Container>

    </section>
  );
}
       
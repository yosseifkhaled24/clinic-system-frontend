"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export default function CTA() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl sm:rounded-[40px] bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 px-6 py-12 sm:px-10 sm:py-20 text-center text-white shadow-2xl">
          <span className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
            {dict.home.cta.tag}
          </span>

          <h2 className="mt-6 sm:mt-8 text-3xl sm:text-5xl font-bold">
            {dict.home.cta.title}
          </h2>

          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-sky-100">
            {dict.home.cta.description}
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            {/* First button: solid black with white text */}
            <Link href="/booking" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto rounded-2xl bg-black px-8 py-4 sm:py-6 text-base font-semibold text-white transition-none">
                {dict.home.cta.book}
              </button>
            </Link>

            {/* Second button: transparent with white border like the reference image */}
            <Link href="/contact" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto rounded-2xl border border-white/40 bg-transparent px-8 py-4 sm:py-6 text-base font-semibold text-white transition-none">
                {dict.home.cta.contact}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
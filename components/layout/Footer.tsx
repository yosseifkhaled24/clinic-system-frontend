"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export function Footer() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  return (
    <footer className="border-t border-slate-200 bg-slate-950 py-8 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>{dict.footer.copyright}</p>
        <div className="flex gap-4">
          <a href="/contact" className="transition hover:text-white">
            {dict.footer.contact}
          </a>
          <a href="/doctors" className="transition hover:text-white">
            {dict.footer.doctors}
          </a>
        </div>
      </div>
    </footer>
  );
}

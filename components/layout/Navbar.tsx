"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { getDictionary } from "@/lib/i18n";

export function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const dict = getDictionary(language);
  const isAuthenticated = Boolean(user);
  const displayName = user?.name || user?.email || dict.profile.title;

  const links = [
    { label: dict.nav.home, href: "/" },
    { label: dict.nav.doctors, href: "/doctors" },
    { label: dict.nav.services, href: "/services" },
    { label: dict.nav.reviews, href: "/reviews" },
    { label: dict.nav.booking, href: "/booking" },
    { label: dict.nav.contact, href: "/contact" },
  ];

  return (
    <header className="border-b border-slate-200 bg-white/90 text-slate-900 backdrop-blur dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold">
          MediCare
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-slate-900 dark:hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {language === "en" ? "العربية" : "English"}
          </button>
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {displayName}
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">{dict.nav.login}</Button>
              </Link>
              <Link href="/register">
                <Button>{dict.nav.register}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

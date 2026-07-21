"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Moon,
  Sun,
  UserRound,
  LayoutDashboard,
  House,
  Stethoscope,
  BriefcaseMedical,
  Star,
  CalendarDays,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

import { getDictionary } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();

  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const dict = getDictionary(language);

  const isAuthenticated = Boolean(user);

  const displayName =
    user?.name || user?.email || dict.profile.title;

  const links = [
    {
      label: dict.nav.home,
      href: "/",
      icon: House,
    },
    {
      label: dict.nav.doctors,
      href: "/doctors",
      icon: Stethoscope,
    },
    {
      label: dict.nav.services,
      href: "/services",
      icon: BriefcaseMedical,
    },
    {
      label: dict.nav.reviews,
      href: "/reviews",
      icon: Star,
    },
    {
      label: dict.nav.booking,
      href: "/booking",
      icon: CalendarDays,
    },
    {
      label: dict.nav.contact,
      href: "/contact",
      icon: Phone,
    },
  ];

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/80">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link
          href="/"
          className="text-4xl font-extrabold tracking-tight text-sky-700 transition hover:scale-105 dark:text-sky-400"
        >
          MediCare
        </Link>

        <nav className="hidden items-center gap-2 md:flex">

          {links.map((link) => {

            const Icon = link.icon;

            return (

              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? "bg-sky-100 text-sky-700 shadow-sm dark:bg-sky-900/30 dark:text-sky-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-400"
                }`}
              >

                <Icon size={16} />

                {link.label}

              </Link>

            );

          })}

        </nav>

        <div className="flex items-center gap-3">

          {user?.role === "admin" && (

            <Link href="/dashboard">

              <Button className="rounded-full bg-sky-600 px-5 hover:bg-sky-700">

                <LayoutDashboard
                  size={18}
                  className="mr-2"
                />

                Dashboard

              </Button>

            </Link>

          )}
                    <button
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {theme === "light" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>

          <button
            onClick={toggleLanguage}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {language === "en"
              ? "العربية"
              : "English"}
          </button>

          {isAuthenticated ? (
            <>

              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-600"
              >

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/40">

                  <UserRound
                    size={17}
                    className="text-sky-700 dark:text-sky-300"
                  />

                </div>

                <span className="max-w-[120px] truncate">
                  {displayName}
                </span>

              </Link>

              <Button
                variant="ghost"
                onClick={() => logout()}
                className="rounded-full border border-red-200 px-4 text-red-600 transition-all hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950"
              >
                Logout
              </Button>

            </>
          ) : (
            <>

              <Link href="/login">

                <Button
                  variant="ghost"
                  className="rounded-full"
                >
                  {dict.nav.login}
                </Button>

              </Link>

              <Link href="/register">

                <Button className="rounded-full px-6">
                  {dict.nav.register}
                </Button>

              </Link>

            </>
          )}

        </div>

      </div>

    </header>
  );
}
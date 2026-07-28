"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  UserRound,
  LayoutDashboard,
  House,
  Stethoscope,
  BriefcaseMedical,
  Star,
  CalendarDays,
  Phone,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import { getDictionary } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();

  const dict = getDictionary(language);

  const isAuthenticated = Boolean(user);

  const displayName =
    user?.name || user?.email || dict.profile.title;

  const links = [
    { label: dict.nav.home, href: "/", icon: House },
    { label: dict.nav.doctors, href: "/doctors", icon: Stethoscope },
    { label: dict.nav.services, href: "/services", icon: BriefcaseMedical },
    { label: dict.nav.reviews, href: "/reviews", icon: Star },
    { label: dict.nav.booking, href: "/booking", icon: CalendarDays },
    { label: dict.nav.contact, href: "/contact", icon: Phone },
  ];

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-sky-700 transition hover:scale-105 sm:text-4xl"
          onClick={closeMobile}
        >
          MediCare
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-300 lg:px-4 ${
                  pathname === link.href
                    ? "bg-sky-100 text-sky-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-sky-600"
                }`}
              >
                <Icon size={16} />
                <span className="hidden lg:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {user?.role === "admin" && (
            <Link href="/dashboard">
              <Button className="rounded-full bg-sky-600 px-4 hover:bg-sky-700 lg:px-5">
                <LayoutDashboard size={18} className="mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Dashboard</span>
              </Button>
            </Link>
          )}

          <button
            onClick={toggleLanguage}
            className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
          >
            {language === "en" ? "العربية" : "English"}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100">
                  <UserRound size={15} className="text-sky-700" />
                </div>
                <span className="hidden max-w-[100px] truncate text-sm lg:inline">
                  {displayName}
                </span>
              </Link>

              <Button
                variant="ghost"
                onClick={() => logout()}
                className="rounded-full border border-red-200 px-3 text-red-600 transition-all hover:bg-red-50 hover:text-red-700"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="rounded-full">
                  {dict.nav.login}
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full px-5">
                  {dict.nav.register}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-100"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white/95 backdrop-blur-xl md:hidden">
          <nav className="space-y-1 px-4 py-4">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    pathname === link.href
                        ? "bg-sky-100 text-sky-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-sky-600"
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 px-4 py-4">
            <div className="flex flex-col gap-3">
              {user?.role === "admin" && (
                <Link href="/dashboard" onClick={closeMobile}>
                  <Button className="w-full rounded-2xl bg-sky-600 hover:bg-sky-700">
                    <LayoutDashboard size={18} className="mr-2" />
                    Dashboard
                  </Button>
                </Link>
              )}

              <button
                onClick={() => { toggleLanguage(); closeMobile(); }}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium transition hover:bg-slate-100"
              >
                {language === "en" ? "العربية" : "English"}
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={closeMobile}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 font-medium transition hover:bg-slate-100"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100">
                      <UserRound size={16} className="text-sky-700" />
                    </div>
                    <span className="truncate">{displayName}</span>
                  </Link>

                  <Button
                    variant="ghost"
                    onClick={() => { void logout(); closeMobile(); }}
                    className="w-full rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={closeMobile}>
                    <Button variant="ghost" className="w-full rounded-2xl">
                      {dict.nav.login}
                    </Button>
                  </Link>
                  <Link href="/register" onClick={closeMobile}>
                    <Button className="w-full rounded-2xl">
                      {dict.nav.register}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
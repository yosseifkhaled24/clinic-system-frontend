"use client";

import Link from "next/link";
import { Bell, Globe, Moon, Search, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { getDictionary } from "@/lib/i18n";

export default function DashboardNavbar() {
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const dict = getDictionary(language);

  return (
    <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:rounded-3xl sm:px-6 sm:py-4">
      {/* Left */}
      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold text-slate-900 sm:text-2xl">
          {dict.dashboard.title}
        </h1>
        <p className="truncate text-xs text-slate-500 sm:text-sm">
          {dict.dashboard.welcome}, {user?.name || "Administrator"}
        </p>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* Return to Home Page button */}
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <Home size={16} />
          <span>{dict.nav.home}</span>
        </Link>

        {/* Search — desktop only */}
        <div className="hidden items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 lg:flex">
          <Search size={18} className="mr-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none"
          />
        </div>

        {/* Language */}
        <button
          onClick={toggleLanguage}
          aria-label="Toggle language"
          className="hidden rounded-xl border border-slate-200 p-2.5 transition hover:bg-slate-100 sm:block text-xs font-bold"
        >
          {language === "ar" ? "EN" : "عربي"}
        </button>

        {/* Theme */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-xl border border-slate-200 p-2.5 transition hover:bg-slate-100"
        >
          {theme === "light" ? <Moon size={16} /> : <Bell size={16} />}
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1.5 sm:gap-3 sm:px-4 sm:py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-sm font-bold text-white sm:h-10 sm:w-10">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name || "Administrator"}</p>
            <p className="text-xs capitalize text-slate-500">{user?.role || "Admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
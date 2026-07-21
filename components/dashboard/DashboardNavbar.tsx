"use client";

import { Bell, Globe, Moon, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function DashboardNavbar() {
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="mb-8 flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-sm text-slate-500">
          Welcome back, {user?.name || "Administrator"}
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        <div className="hidden items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 lg:flex">

          <Search
            size={18}
            className="mr-2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none"
          />

        </div>

        <button
          onClick={toggleLanguage}
          className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100"
        >
          <Globe size={18} />
        </button>

        <button
          onClick={toggleTheme}
          className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100"
        >
          <Moon size={18} />
        </button>

        <button className="relative rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100">

          <Bell size={18} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 font-bold text-white">

            {user?.name?.charAt(0).toUpperCase() || "A"}

          </div>

          <div className="hidden lg:block">

            <p className="text-sm font-semibold text-slate-900">

              {user?.name || "Administrator"}

            </p>

            <p className="text-xs capitalize text-slate-500">

              {user?.role || "Admin"}

            </p>

          </div>

        </div>

      </div>

    </header>
  );
}
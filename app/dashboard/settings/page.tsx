"use client";

import { useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

import { useLanguage } from "@/context/LanguageContext";

import { getDictionary } from "@/lib/i18n";

export default function DashboardSettingsPage() {
  const { language } = useLanguage();

  const dict = getDictionary(language);

  const [formData, setFormData] = useState({
    name: "Admin",
    email: "admin@clinic.com",
    phone: "+20 100 000 0000",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    language: "English",
  });

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    setSuccess("");
    setError("");

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      setSuccess("Settings updated successfully.");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title={dict.dashboardPages.settings.title}
      description={
        dict.dashboardPages.settings.description
      }
    >      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {success && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-900">
            Profile Information
          </h2>

          <p className="mt-2 text-slate-500">
            Update your personal information.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </label>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
              />

            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-900">
            Security
          </h2>

          <p className="mt-2 text-slate-500">
            Change your account password.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
              />

            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-900">
            Preferences
          </h2>

          <p className="mt-2 text-slate-500">
            Customize your dashboard preferences.
          </p>

          <div className="mt-8">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Language
            </label>

            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
            >
              <option>English</option>
              <option>Arabic</option>
            </select>

          </div>

        </div>

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-sky-600 px-8 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </DashboardLayout>
  );
}
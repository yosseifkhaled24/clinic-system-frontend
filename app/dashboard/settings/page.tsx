"use client";

import { useEffect, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";

import {
  profileService,
  type UpdateProfilePayload,
  type ChangePasswordPayload,
} from "@/services/profile.service";

export default function DashboardSettingsPage() {
  const { language } = useLanguage();
  const { user, refreshUser } = useAuth();

  const dict = getDictionary(language);

  // ── Profile form ──────────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // ── Password form ─────────────────────────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Pre-fill profile form with data from auth context
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess("");
    setProfileError("");

    try {
      const payload: UpdateProfilePayload = {
        name: profileForm.name || undefined,
        email: profileForm.email || undefined,
        phone: profileForm.phone || undefined,
      };

      await profileService.updateProfile(payload);
      await refreshUser();

      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileError(getErrorMessage(err, "Failed to update profile."));
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess("");
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      setPasswordLoading(false);
      return;
    }

    try {
      const payload: ChangePasswordPayload = {
        current_password: passwordForm.currentPassword,
        password: passwordForm.newPassword,
        password_confirmation: passwordForm.confirmPassword,
      };

      await profileService.changePassword(payload);

      setPasswordSuccess("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(getErrorMessage(err, "Failed to change password."));
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout
      title={dict.dashboardPages.settings.title}
      description={dict.dashboardPages.settings.description}
    >
      <div className="space-y-8">

        {/* ── Profile Information ───────────────────────────────────────────── */}
        <form onSubmit={handleProfileSubmit}>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <h2 className="text-2xl font-bold text-slate-900">Profile Information</h2>
            <p className="mt-2 text-slate-500">Update your personal information.</p>

            {profileSuccess && (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                {profileError}
              </div>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
                <input
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={profileLoading}
                className="rounded-2xl bg-sky-600 px-8 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {profileLoading ? "Saving..." : "Save Profile"}
              </button>
            </div>

          </div>
        </form>

        {/* ── Security / Password ───────────────────────────────────────────── */}
        <form onSubmit={handlePasswordSubmit}>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <h2 className="text-2xl font-bold text-slate-900">Security</h2>
            <p className="mt-2 text-slate-500">Change your account password.</p>

            {passwordSuccess && (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                {passwordError}
              </div>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={passwordLoading}
                className="rounded-2xl bg-slate-800 px-8 py-3 font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>
            </div>

          </div>
        </form>

      </div>
    </DashboardLayout>
  );
}
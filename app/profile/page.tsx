"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { profileService } from "@/services/profile.service";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [profile, setProfile] = useState<{ name?: string; email?: string } | null>(user);
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setProfile(user);
      setName(user.name || "");
    }

    profileService.getProfile().then((response) => {
      const serverProfile = (response as { user?: { name?: string; email?: string } }).user || response;
      if (serverProfile) {
        const nextProfile = serverProfile as { name?: string; email?: string };
        setProfile(nextProfile);
        setName(nextProfile.name || "");
      }
    });
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await profileService.updateProfile({
        name,
        password: password || undefined,
      });
      const updatedProfile = (response as { user?: { name?: string; email?: string } }).user || response;
      const nextProfile = updatedProfile as { name?: string; email?: string };
      if (nextProfile) {
        setProfile(nextProfile);
        updateUser(nextProfile);
        setName(nextProfile.name || "");
        setPassword("");
        setMessage(dict.profile.success);
      }
    } catch {
      setError(dict.profile.error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container className="py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{dict.profile.title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{dict.profile.description}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-400">{dict.profile.name}</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{profile?.name || dict.profile.loading}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-400">{dict.profile.email}</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{profile?.email || dict.profile.loading}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="profile-name">
              {dict.profile.editName}
            </label>
            <input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder={dict.profile.namePlaceholder}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="profile-password">
              {dict.profile.password}
            </label>
            <input
              id="profile-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder={dict.profile.passwordPlaceholder}
            />
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={isSaving}>
            {isSaving ? dict.profile.saving : dict.profile.save}
          </Button>

          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </form>
      </div>
    </Container>
  );
}

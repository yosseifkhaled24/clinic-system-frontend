"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ApiImage } from "@/components/ui/ApiImage";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getErrorMessage } from "@/lib/errors";
import { getDictionary } from "@/lib/i18n";
import { profileService } from "@/services/profile.service";
import { doctorsService } from "@/services/doctors.service";
import { appointmentsService } from "@/services/appointments.service";
import { contactService } from "@/services/contact.service";
import type { Doctor } from "@/types/doctor";
import type { Appointment } from "@/types/appointment";

export default function ProfilePage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<{ name?: string; email?: string; phone?: string | null } | null>(user);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user && !authLoading) {
      router.replace("/login");
      return;
    }

    if (!user) return;

    Promise.all([
      profileService.getProfile().then(setProfile).catch(() => null),
      doctorsService.getAll().then(setDoctors).catch(() => null),
      appointmentsService.getAll().then(setAppointments).catch(() => null),
    ]).catch(() => {
      setError("Unable to load data.");
    }).finally(() => setIsLoading(false));
  }, [authLoading, user, router]);


  return (
    <Container className="py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{dict.profile.title}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{profile?.name || "User"}</p>
          </div>
          <button
            type="button"
            onClick={() => logout().then(() => router.push("/"))}
            className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 flex gap-4 border-b border-slate-200 dark:border-slate-700">
          {[
            { id: "profile", label: "Profile" },
            { id: "doctors", label: "Doctors" },
            { id: "appointments", label: "Appointments" },
            { id: "messages", label: "Messages" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "border-b-2 border-slate-900 text-slate-900 dark:border-white dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">{dict.dashboard.loading}</p>
        ) : error ? (
          <p className="mt-6 text-sm text-rose-600">{error}</p>
        ) : (
          <div className="mt-8">
            {activeTab === "profile" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{dict.profile.name}</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{profile?.name}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{dict.profile.email}</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{profile?.email}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Phone</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{profile?.phone || "—"}</p>
                </div>
              </div>
            )}

            {activeTab === "doctors" && (
              <div className="grid gap-6 md:grid-cols-2">
                {doctors.length === 0 ? (
                  <p className="text-sm text-slate-600">No doctors available.</p>
                ) : (
                  doctors.map((doctor) => (
                    <div key={doctor.id} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                      <ApiImage
                        src={doctor.image_url}
                        alt={doctor.name}
                        className="mb-4 h-40 w-full rounded-xl object-cover"
                        fallbackClassName="mb-4 flex h-40 w-full items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500"
                      />
                      <p className="text-sm font-semibold text-sky-600">{doctor.specialty || "Specialist"}</p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{doctor.name}</h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{doctor.bio}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "appointments" && (
              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <p className="text-sm text-slate-600">No appointments found.</p>
                ) : (
                  appointments.map((appointment) => (
                    <div key={appointment.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{appointment.doctor.name}</h3>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{appointment.appointment_date}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "messages" && (
              <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Messages functionality can be extended here to send/receive messages with doctors or staff.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}


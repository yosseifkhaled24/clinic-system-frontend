"use client";

import { useEffect, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

import QueueDoctorSelect from "@/components/dashboard/queue/QueueDoctorSelect";
import QueueCurrent from "@/components/dashboard/queue/QueueCurrent";
import QueueWaiting from "@/components/dashboard/queue/QueueWaiting";
import QueueFinished from "@/components/dashboard/queue/QueueFinished";

import { useLanguage } from "@/context/LanguageContext";

import { doctorsService } from "@/services/doctors.service";
import { queueService } from "@/services/queue.service";

import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";

import type { Doctor } from "@/types/doctor";
import type { QueueResponse } from "@/types/queue";

export default function DashboardQueuePage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | "">("");

  const [queue, setQueue] = useState<QueueResponse>({
    current: null,
    waiting: [],
    finished: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (!selectedDoctor) return;
    loadQueue(selectedDoctor);
  }, [selectedDoctor]);

  async function loadDoctors() {
    try {
      setIsLoading(true);
      const response = await doctorsService.getAll();
      setDoctors(response);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load doctors."));
    } finally {
      setIsLoading(false);
    }
  }

  async function loadQueue(doctorId: number) {
    try {
      const response = await queueService.today(doctorId);
      setQueue(response);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load queue."));
    }
  }

  return (
    <DashboardLayout
      title={dict.dashboardPages.queue.title}
      description={dict.dashboardPages.queue.description}
    >
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-3xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">

          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Queue Management</h2>
            <p className="mt-2 text-slate-500">Manage today&apos;s patient queue for every doctor.</p>
          </div>

          {/* Doctor selector always visible */}
          <QueueDoctorSelect
            doctors={doctors}
            value={selectedDoctor}
            onChange={setSelectedDoctor}
          />

          {/* Stats + queue details — only after a doctor is selected */}
          {selectedDoctor ? (
            <div className="space-y-6">

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-slate-500">Waiting Patients</p>
                  <h3 className="mt-3 text-4xl font-bold text-yellow-600">{queue.waiting.length}</h3>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-slate-500">Current Patient</p>
                  <h3 className="mt-3 text-4xl font-bold text-green-600">{queue.current ? 1 : 0}</h3>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-slate-500">Finished Today</p>
                  <h3 className="mt-3 text-4xl font-bold text-sky-600">{queue.finished.length}</h3>
                </div>
              </div>

              <QueueCurrent patient={queue.current} />

              <div className="grid gap-6 lg:grid-cols-2">
                <QueueWaiting patients={queue.waiting} />
                <QueueFinished patients={queue.finished} />
              </div>

            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-12 text-center shadow-sm sm:p-16">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-4xl sm:h-24 sm:w-24 sm:text-5xl">
                👨‍⚕️
              </div>
              <h2 className="mt-6 text-xl font-bold text-slate-900 sm:text-2xl">Select a Doctor</h2>
              <p className="mt-3 text-slate-500">
                Choose a doctor above to view today&apos;s queue, current patient, waiting list and finished patients.
              </p>
            </div>
          )}

        </div>
      )}
    </DashboardLayout>
  );
}
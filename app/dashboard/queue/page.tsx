"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { getErrorMessage } from "@/lib/errors";
import { getDictionary } from "@/lib/i18n";
import { doctorsService } from "@/services/doctors.service";
import { queueService } from "@/services/queue.service";
import type { QueueResponse } from "@/types/queue";

const emptyQueue: QueueResponse = {
  current: null,
  waiting: [],
  finished: [],
};

export default function DashboardQueuePage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [queue, setQueue] = useState<QueueResponse>(emptyQueue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    doctorsService.getAll().then((doctors) => {
      const firstDoctor = doctors[0];
      if (!firstDoctor) {
        setQueue(emptyQueue);
        return;
      }

      queueService.getToday(firstDoctor.id).then(setQueue).catch((error) => {
        setError(getErrorMessage(error, "Unable to load queue."));
        setQueue(emptyQueue);
      });
    }).catch((error) => {
      setError(getErrorMessage(error, "Unable to load queue."));
      setQueue(emptyQueue);
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout title={dict.dashboardPages.queue.title} description={dict.dashboardPages.queue.description}>
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-slate-600">
        {isLoading ? <p className="mb-4 text-sm">{dict.dashboard.loading}</p> : null}
        {!isLoading && error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}
        {!isLoading && !error && !queue.current && queue.waiting.length === 0 && queue.finished.length === 0 ? (
          <p className="mb-4 text-sm">No queue items found.</p>
        ) : null}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <h3 className="font-semibold text-slate-900">Current</h3>
            <p className="mt-2 text-sm">{queue.current?.patient?.name || "No current patient"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Waiting</h3>
            <p className="mt-2 text-sm">{queue.waiting.length}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Finished</h3>
            <p className="mt-2 text-sm">{queue.finished.length}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

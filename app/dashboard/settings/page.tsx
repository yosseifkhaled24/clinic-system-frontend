"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export default function DashboardSettingsPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  return (
    <DashboardLayout title={dict.dashboardPages.settings.title} description={dict.dashboardPages.settings.description}>
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
        {dict.dashboardPages.settings.placeholder}
      </div>
    </DashboardLayout>
  );
}

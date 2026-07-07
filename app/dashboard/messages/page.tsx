"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export default function DashboardMessagesPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  return (
    <DashboardLayout title={dict.dashboardPages.messages.title} description={dict.dashboardPages.messages.description}>
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
        {dict.dashboardPages.messages.placeholder}
      </div>
    </DashboardLayout>
  );
}

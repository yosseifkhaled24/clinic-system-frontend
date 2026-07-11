"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/errors";
import { getDictionary } from "@/lib/i18n";
import { contactService } from "@/services/contact.service";
import type { ContactMessage } from "@/types/contact";

export default function DashboardMessagesPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const dict = getDictionary(language);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    setIsLoading(true);
    contactService.getAll().then(setMessages).catch((error) => {
      setError(getErrorMessage(error, "Unable to load messages."));
    }).finally(() => setIsLoading(false));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      await contactService.delete(id);
      setMessages(messages.filter((m) => m.id !== id));
      setSelectedId(null);
    } catch (error) {
      setError(getErrorMessage(error, "Failed to delete message."));
    }
  };

  const selectedMessage = messages.find((m) => m.id === selectedId);

  return (
    <DashboardLayout title={dict.dashboardPages.messages.title} description={dict.dashboardPages.messages.description}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Messages ({messages.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoading ? (
              <p className="text-sm text-slate-600">{dict.dashboard.loading}</p>
            ) : error && !isAdmin ? (
              <p className="text-sm text-rose-600">{error}</p>
            ) : messages.length === 0 ? (
              <p className="text-sm text-slate-600">No messages.</p>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedId(msg.id)}
                  className={`w-full rounded-xl p-3 text-left text-sm transition ${
                    selectedId === msg.id
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "border border-slate-200 text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <p className="font-medium line-clamp-1">{msg.name}</p>
                  <p className="text-xs opacity-75 line-clamp-1">{msg.email}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{selectedMessage.name}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{selectedMessage.email}</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="rounded px-3 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Message</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-900 dark:text-slate-100">{selectedMessage.message}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}


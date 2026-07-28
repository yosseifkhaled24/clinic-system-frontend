"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";

import { contactService } from "@/services/contact.service";

import type { ContactMessage } from "@/types/contact";

export default function DashboardMessagesPage() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const dict = getDictionary(language);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);

  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      setIsLoading(true);

      const response =
        await contactService.getAll();

      setMessages(response);
      setFilteredMessages(response);

      setError("");

    } catch (err) {

      setError(
        getErrorMessage(
          err,
          "Unable to load messages."
        )
      );

      setMessages([]);
      setFilteredMessages([]);

    } finally {

      setIsLoading(false);

    }
  }

  useEffect(() => {

    const keyword = search.toLowerCase();

    setFilteredMessages(

      messages.filter((message) =>

        message.name
          .toLowerCase()
          .includes(keyword) ||

        message.email
          .toLowerCase()
          .includes(keyword) ||

        message.message
          .toLowerCase()
          .includes(keyword)

      )

    );

  }, [search, messages]);

  const totalMessages = useMemo(
    () => messages.length,
    [messages]
  );

  const todayMessages = useMemo(() => {

    const today = new Date().toDateString();

    return messages.filter((message) => {

      if (!message.created_at) return false;

      return (
        new Date(message.created_at).toDateString() ===
        today
      );

    }).length;

  }, [messages]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this message?")) return;

    try {
      await contactService.delete(id);
      // Removing from messages triggers the useEffect that re-filters
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete message."));
    }
  }

  return (
    <DashboardLayout
      title={dict.dashboardPages.messages.title}
      description={
        dict.dashboardPages.messages.description
      }
    >
            {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading messages...
        </div>
      ) : (
        <div className="space-y-8">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Contact Messages
              </h2>

              <p className="mt-2 text-slate-500">
                Manage customer messages and inquiries.
              </p>

            </div>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Total Messages
              </p>

              <h3 className="mt-3 text-4xl font-bold text-sky-600">
                {totalMessages}
              </h3>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Today
              </p>

              <h3 className="mt-3 text-4xl font-bold text-green-600">
                {todayMessages}
              </h3>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Results
              </p>

              <h3 className="mt-3 text-4xl font-bold text-amber-500">
                {filteredMessages.length}
              </h3>

            </div>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search Messages
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, email or message..."
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />

          </div>

          {filteredMessages.length === 0 ? (
                        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">

              <div className="text-6xl">
                📭
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                No Messages Found
              </h2>

              <p className="mt-3 text-slate-500">
                There are no contact messages matching your search.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {filteredMessages.map((message) => (

                <div
                  key={message.id}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-sky-200 hover:shadow-md"
                >

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                    <div className="flex items-center gap-5">

                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-2xl">
                        👤
                      </div>

                      <div>

                        <h3 className="text-xl font-bold text-slate-900">
                          {message.name}
                        </h3>

                        <p className="mt-1 text-slate-500">
                          {message.email}
                        </p>

                      </div>

                    </div>

                    {isAdmin && (

                      <button
                        onClick={() =>
                          handleDelete(message.id)
                        }
                        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>

                    )}

                  </div>

                  <div className="mt-8 rounded-2xl bg-slate-50 p-6">

                    <h4 className="mb-3 text-lg font-semibold text-slate-900">
                      Message
                    </h4>

                    <p className="whitespace-pre-wrap leading-8 text-slate-700">
                      {message.message}
                    </p>

                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">

                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                      ID #{message.id}
                    </span>

                    {message.created_at && (

                      <span className="text-sm text-slate-500">
                        {new Date(
                          message.created_at
                        ).toLocaleString()}
                      </span>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

    </DashboardLayout>
  );
}
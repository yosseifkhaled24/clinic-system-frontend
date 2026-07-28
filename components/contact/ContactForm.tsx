"use client";

import { useState } from "react";

import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";

import { contactService } from "@/services/contact.service";

export default function ContactForm() {
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setStatus("");
    setIsLoading(true);

    try {
      await contactService.send({
        name,
        email,
        subject,
        message,
      });

      setIsSuccess(true);
      setStatus(dict.contact.success);

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setIsSuccess(false);

      setStatus(getErrorMessage(error, dict.contact.error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl rounded-3xl sm:rounded-[32px] border border-slate-200 bg-white p-6 sm:p-10 shadow-xl">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {dict.contact.formTitle}
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-500">
              {dict.contact.formDesc}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {dict.contact.name}
              </label>

              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base outline-none transition focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {dict.contact.email}
              </label>

              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base outline-none transition focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {dict.contact.subject}
              </label>

              <input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base outline-none transition focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {dict.contact.message}
              </label>

              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base outline-none transition focus:border-sky-500"
              />
            </div>

            {status && (
              <p
                className={`text-sm font-medium ${
                  isSuccess ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {status}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-black py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white transition-none"
            >
              {isLoading ? dict.dashboard.loading : dict.contact.submit}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
"use client";

import { useState } from "react";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

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

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
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

      setStatus(
        getErrorMessage(
          error,
          dict.contact.error
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-10 shadow-xl">

          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-slate-900">
              Send Us A Message
            </h2>

            <p className="mt-4 text-slate-500">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                {dict.contact.name}
              </label>

              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                {dict.contact.email}
              </label>

              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Subject
              </label>

              <input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                {dict.contact.message}
              </label>

              <textarea
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-sky-500"
              />
            </div>

            {status && (
              <p
                className={`text-sm ${
                  isSuccess
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {status}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4"
            >
              {isLoading
                ? dict.dashboard.loading
                : dict.contact.submit}
            </Button>

          </form>

        </div>
      </Container>
    </section>
  );
}
"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { contactService } from "@/services/contact.service";

export default function ContactPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await contactService.send({ name, email, message });
      setStatus(dict.contact.success);
    } catch {
      setStatus(dict.contact.error);
    }
  };

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{dict.contact.title}</h1>
        <p className="mt-2 text-slate-600">{dict.contact.description}</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">{dict.contact.name}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">{dict.contact.email}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">{dict.contact.message}</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" rows={4} />
          </div>
          {status ? <p className="text-sm text-slate-600">{status}</p> : null}
          <Button type="submit">{dict.contact.submit}</Button>
        </form>
      </div>
    </Container>
  );
}

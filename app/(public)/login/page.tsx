"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/profile");
    } catch {
      setError(dict.auth.login.error);
    }
  };

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{dict.auth.login.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{dict.auth.login.description}</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">{dict.auth.login.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">{dict.auth.login.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
            />
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" className="w-full">{dict.auth.login.submit}</Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          {dict.auth.login.noAccount} <Link href="/register" className="font-semibold text-slate-900">{dict.auth.login.registerLink}</Link>
        </p>
      </div>
    </Container>
  );
}

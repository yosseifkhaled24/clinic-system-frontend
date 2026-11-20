"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";
import { getDictionary } from "@/lib/i18n";
import { authService } from "@/services/auth.service";

type Notice = { tone: "ok" | "error"; text: string } | null;

export default function RegisterPage() {
  const { register } = useAuth();
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // SEC-03: set once the account exists. The form is replaced by the
  // verification-required state inside the same card (no design change).
  const [registered, setRegistered] = useState(false);
  const [notificationSent, setNotificationSent] = useState(true);
  const [resendNotice, setResendNotice] = useState<Notice>(null);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const result = await register(fullName, phone, email, password);
      setNotificationSent(result.notification_sent ?? true);
      setRegistered(true);
    } catch (error) {
      setError(
        getErrorStatus(error) === 429
          ? dict.auth.register.throttle
          : getErrorMessage(error, dict.auth.register.error),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendNotice(null);
    setIsResending(true);
    try {
      await authService.resendVerification({ email, password });
      setResendNotice({ tone: "ok", text: dict.auth.register.resendSent });
    } catch (error) {
      setResendNotice({
        tone: "error",
        text:
          getErrorStatus(error) === 429
            ? dict.auth.register.resendThrottle
            : getErrorMessage(error, dict.auth.register.resendError),
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">
          {registered ? dict.auth.register.verifyTitle : dict.auth.register.title}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {registered ? dict.auth.register.verifyDescription : dict.auth.register.description}
        </p>

        {registered ? (
          <div className="mt-8 space-y-4">
            <p className="text-sm text-slate-600">
              {dict.auth.register.verifySent}{" "}
              <span className="font-semibold text-slate-900">{email}</span>
            </p>
            {!notificationSent ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {dict.auth.register.emailNotSent}
              </p>
            ) : null}
            {resendNotice ? (
              <p
                className={`rounded-xl border px-4 py-3 text-sm ${
                  resendNotice.tone === "ok"
                    ? "border-sky-200 bg-sky-50 text-sky-700"
                    : "border-rose-200 bg-rose-50 text-rose-600"
                }`}
              >
                {resendNotice.text}
              </p>
            ) : null}
            <Button
              type="button"
              className="w-full"
              disabled={isResending}
              onClick={handleResend}
            >
              {isResending ? dict.dashboard.loading : dict.auth.register.resend}
            </Button>
            <p className="text-sm text-slate-600">
              <Link href="/login" className="font-semibold text-slate-900">
                {dict.auth.register.loginLink}
              </Link>
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">{dict.auth.register.fullName}</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">{dict.auth.register.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">{dict.auth.register.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
              />
            </div>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? dict.dashboard.loading : dict.auth.register.submit}</Button>
          </form>
        )}

        {!registered ? (
          <p className="mt-4 text-sm text-slate-600">
            {dict.auth.register.alreadyRegistered} <Link href="/login" className="font-semibold text-slate-900">{dict.auth.register.loginLink}</Link>
          </p>
        ) : null}
      </div>
    </Container>
  );
}

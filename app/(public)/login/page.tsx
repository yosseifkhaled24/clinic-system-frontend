"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getErrorCode, getErrorMessage, getErrorStatus } from "@/lib/errors";
import { getDictionary } from "@/lib/i18n";
import { authService } from "@/services/auth.service";

type Notice = { tone: "ok" | "error"; text: string } | null;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // SEC-03: set when the backend rejects the login because the address
  // is not verified yet (403, code=email_not_verified). The panel offers
  // the credential-gated resend action.
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendNotice, setResendNotice] = useState<Notice>(null);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const loggedInUser = await login(email, password);
      router.push(loggedInUser.role === "admin" ? "/dashboard" : "/profile");
    } catch (error) {
      if (getErrorStatus(error) === 403 && getErrorCode(error) === "email_not_verified") {
        setNeedsVerification(true);
        setResendNotice(null);
        setError("");
      } else if (getErrorStatus(error) === 429) {
        setError(dict.auth.login.throttle);
      } else {
        setError(getErrorMessage(error, dict.auth.login.error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendNotice(null);
    setIsResending(true);
    try {
      await authService.resendVerification({ email, password });
      setResendNotice({ tone: "ok", text: dict.auth.login.resendSent });
    } catch (error) {
      setResendNotice({
        tone: "error",
        text:
          getErrorStatus(error) === 429
            ? dict.auth.login.resendThrottle
            : getErrorMessage(error, dict.auth.login.resendError),
      });
    } finally {
      setIsResending(false);
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
          {needsVerification ? (
            <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p>{dict.auth.login.verifyNotice}</p>
              {resendNotice ? (
                <p
                  className={`rounded-lg border px-3 py-2 text-sm ${
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
                variant="ghost"
                disabled={isResending}
                onClick={handleResend}
              >
                {isResending ? dict.dashboard.loading : dict.auth.login.resend}
              </Button>
            </div>
          ) : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? dict.dashboard.loading : dict.auth.login.submit}</Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          {dict.auth.login.noAccount} <Link href="/register" className="font-semibold text-slate-900">{dict.auth.login.registerLink}</Link>
        </p>
      </div>
    </Container>
  );
}

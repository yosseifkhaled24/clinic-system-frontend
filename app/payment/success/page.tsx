"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { paymentService } from "@/services/payment.service";

type Phase = "loading" | "confirmed" | "pending" | "failed" | "unavailable";

// SEC-06: a delayed webhook must not look like a failure — while Stripe
// reports the session as paid but the signed confirmation has not
// landed yet, re-check automatically a few times before settling on the
// pending state (the user can always re-check manually).
const AUTO_RECHECK_LIMIT = 3;
const AUTO_RECHECK_DELAY_MS = 5000;

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { language } = useLanguage();
  const dict = getDictionary(language);
  // Without a session id there is nothing to check — start honestly in
  // the "unable to verify" state instead of spinning forever.
  const [phase, setPhase] = useState<Phase>(() => (sessionId ? "loading" : "unavailable"));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [attempt, setAttempt] = useState(0);

  /**
   * SEC-06: the success page NEVER trusts the redirect — it asks the
   * backend, which reads the real Stripe session state server-side.
   * Any error (unknown session, not configured, Stripe unreachable)
   * resolves to an honest "unable to verify" state; a redirect alone
   * never marks the appointment as paid.
   */
  const checkStatus = useCallback(async () => {
    if (!sessionId) {
      setPhase("unavailable");
      return;
    }

    setIsRefreshing(true);
    try {
      const result = await paymentService.status(sessionId);
      setPhase(result.status);
    } catch {
      setPhase("unavailable");
    } finally {
      setIsRefreshing(false);
      setAttempt((value) => value + 1);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    // Deferred into a timer callback so no state is written synchronously
    // during the effect body (cascading renders); every later check flows
    // through the same function from timers / user actions.
    const timer = setTimeout(checkStatus, 0);

    return () => clearTimeout(timer);
  }, [sessionId, checkStatus]);

  // Delayed-webhook handling: keep re-checking a pending state a few
  // times, then stop (the manual "Check again" button stays available).
  useEffect(() => {
    if (phase !== "pending" || attempt === 0 || attempt > AUTO_RECHECK_LIMIT) {
      return;
    }

    const timer = setTimeout(checkStatus, AUTO_RECHECK_DELAY_MS);

    return () => clearTimeout(timer);
  }, [phase, attempt, checkStatus]);

  const content = {
    loading: {
      icon: "⏳",
      title: dict.payment.checking.title,
      description: dict.payment.checking.description,
      headingClass: "text-slate-700",
    },
    confirmed: {
      icon: "✅",
      title: dict.payment.confirmed.title,
      description: dict.payment.confirmed.description,
      headingClass: "text-green-600",
    },
    pending: {
      icon: "⏳",
      title: dict.payment.pending.title,
      description: dict.payment.pending.description,
      headingClass: "text-amber-600",
    },
    failed: {
      icon: "❌",
      title: dict.payment.failed.title,
      description: dict.payment.failed.description,
      headingClass: "text-rose-600",
    },
    unavailable: {
      icon: "⚠️",
      title: dict.payment.unavailable.title,
      description: dict.payment.unavailable.description,
      headingClass: "text-slate-900",
    },
  }[phase];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl" aria-hidden="true">
          {content.icon}
        </div>

        <h1 className={`text-3xl font-bold ${content.headingClass}`}>
          {content.title}
        </h1>

        <p className="mt-4 text-slate-600">{content.description}</p>

        {phase !== "loading" && phase !== "confirmed" ? (
          <button
            type="button"
            onClick={checkStatus}
            disabled={isRefreshing}
            className="mt-6 inline-block rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            {isRefreshing ? dict.payment.checking.title : dict.payment.refresh}
          </button>
        ) : null}

        <a
          href="/profile"
          className="mt-8 inline-block rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
        >
          {dict.payment.back}
        </a>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  // useSearchParams (session_id deep link from Stripe) needs a Suspense
  // boundary under the app router for static prerendering.
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50" aria-busy="true">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
            <div className="mb-4 text-6xl" aria-hidden="true">⏳</div>
            <p className="text-slate-600">&nbsp;</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

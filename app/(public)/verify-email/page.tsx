"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { API_BASE_URL } from "@/lib/axios";

type VerifiedState = "checking" | "verified" | "expired" | "invalid" | "unknown";

const linkButtonClass =
  "mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700";

/**
 * Derive the page state from the query parameters during render:
 *  - ?status=...      → the backend already validated the link and told
 *                       us the outcome (verified | expired | invalid).
 *  - signed params    → still "checking": the effect below follows the
 *                       rebuilt signed backend URL, which redirects back
 *                       with ?status=...
 *  - anything else    → nothing to verify from this URL.
 */
function readState(params: URLSearchParams): VerifiedState {
  const status = params.get("status");
  if (
    status === "verified" ||
    status === "expired" ||
    status === "invalid" ||
    status === "unknown"
  ) {
    return status;
  }

  if (
    params.get("id") &&
    params.get("hash") &&
    params.get("expires") &&
    params.get("signature")
  ) {
    return "checking";
  }

  return "unknown";
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [state] = useState<VerifiedState>(() => readState(searchParams));
  const forwarded = useRef(false);

  useEffect(() => {
    if (state !== "checking" || forwarded.current) {
      return;
    }

    // SEC-03: arriving straight from the email button — the link carries
    // the signed backend parameters (id/hash in the path of the original
    // signed URL, surfaced here as query parameters). Rebuild the EXACT
    // signed backend request (original expires&signature order — the HMAC
    // covers that byte sequence) and follow it; the backend verifies it
    // and redirects back to this page with ?status=...
    forwarded.current = true;

    const id = searchParams.get("id");
    const hash = searchParams.get("hash");
    const expires = searchParams.get("expires");
    const signature = searchParams.get("signature");

    window.location.replace(
      `${API_BASE_URL}/email/verify/${encodeURIComponent(id ?? "")}/${encodeURIComponent(hash ?? "")}` +
        `?expires=${encodeURIComponent(expires ?? "")}&signature=${encodeURIComponent(signature ?? "")}`,
    );
  }, [searchParams, state]);

  const content = {
    checking: {
      icon: "✉️",
      title: dict.auth.verifyEmail.checking.title,
      description: dict.auth.verifyEmail.checking.description,
      headingClass: "text-slate-700",
      cta: null as React.ReactNode,
    },
    verified: {
      icon: "✅",
      title: dict.auth.verifyEmail.verified.title,
      description: dict.auth.verifyEmail.verified.description,
      headingClass: "text-green-600",
      cta: (
        <Link href="/login" className={linkButtonClass}>
          {dict.auth.verifyEmail.loginLink}
        </Link>
      ),
    },
    expired: {
      icon: "⏳",
      title: dict.auth.verifyEmail.expired.title,
      description: dict.auth.verifyEmail.expired.description,
      headingClass: "text-amber-600",
      cta: (
        <Link href="/login" className={linkButtonClass}>
          {dict.auth.verifyEmail.loginLink}
        </Link>
      ),
    },
    invalid: {
      icon: "⛔",
      title: dict.auth.verifyEmail.invalid.title,
      description: dict.auth.verifyEmail.invalid.description,
      headingClass: "text-rose-600",
      cta: (
        <Link href="/login" className={linkButtonClass}>
          {dict.auth.verifyEmail.loginLink}
        </Link>
      ),
    },
    unknown: {
      icon: "✉️",
      title: dict.auth.verifyEmail.unknown.title,
      description: dict.auth.verifyEmail.unknown.description,
      headingClass: "text-slate-900",
      cta: (
        <Link href="/login" className={linkButtonClass}>
          {dict.auth.verifyEmail.loginLink}
        </Link>
      ),
    },
  }[state];

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-4 text-6xl" aria-hidden="true">
          {content.icon}
        </div>
        <h1 className={`text-3xl font-semibold ${content.headingClass}`}>{content.title}</h1>
        <p className="mt-4 text-sm text-slate-600">{content.description}</p>
        {content.cta}
        <p className="mt-6 text-sm text-slate-600">
          <Link href="/" className="font-semibold text-slate-900">
            {dict.auth.verifyEmail.homeLink}
          </Link>
        </p>
      </div>
    </Container>
  );
}

export default function VerifyEmailPage() {
  // useSearchParams (signed-link deep links) needs a Suspense boundary
  // under the app router for static prerendering, same as /booking.
  return (
    <Suspense
      fallback={
        <Container className="flex min-h-[70vh] items-center justify-center py-16">
          <p className="text-sm text-slate-500">&nbsp;</p>
        </Container>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

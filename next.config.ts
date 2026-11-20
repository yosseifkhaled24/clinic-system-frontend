import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const apiOrigin = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

let apiHostname = "127.0.0.1";
try {
  apiHostname = new URL(apiOrigin).hostname;
} catch {
  // keep default
}

const nextConfig: NextConfig = {
   
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: apiHostname,
      },
      {
        protocol: "https",
        hostname: apiHostname,
      },
      {
        protocol: "https",
        hostname: "*.railway.app",
      },
      {
        protocol: "https",
        hostname: "clinic-system-full-production.up.railway.app",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // SEC-17 (existing headers, preserved):
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // SEC-17: CSP in REPORT-ONLY mode first. Enforcing it outright
          // could break Next.js (inline bootstrap scripts need nonces,
          // styled-jsx injects styles) — violations are only logged to the
          // console until the policy is proven safe, so nothing breaks.
          // HSTS is intentionally omitted: local development runs over
          // plain HTTP and an HSTS header would poison browsers for
          // localhost. Production MUST terminate TLS at the proxy/platform
          // and enable HSTS there (deployment requirement — no code value
          // invented here).
          {
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              // Next.js injects inline bootstrap scripts and uses eval in
              // dev; a nonce-based policy requires middleware and is a
              // follow-up hardening step, not part of this task.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Inline styles (styled-jsx / Tailwind runtime injection).
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              // XHR/fetch: same-origin + the Laravel API origin; Stripe is
              // allowed so a future Stripe.js integration (or iframe
              // checkout) cannot be silently blocked when enforcement is
              // turned on.
              `connect-src 'self' ${apiOrigin} https://api.stripe.com`,
              "frame-src https://js.stripe.com https://hooks.stripe.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

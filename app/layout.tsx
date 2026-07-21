import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";

import "./globals.css";

export const metadata: Metadata = {
  title: "MediCare",
  description:
    "A modern medical frontend experience for booking and care management.",
};

const themeScript = `
(function () {
  try {
    const stored = localStorage.getItem("theme") || "system";

    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const dark =
      stored === "dark" ||
      (stored === "system" && systemDark);

    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />
      </head>

      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">

        <AuthProvider>

          <ThemeProvider>

            <LanguageProvider>

              <Navbar />

              <main className="flex-1">
                {children}
              </main>

              <Footer />

            </LanguageProvider>

          </ThemeProvider>

        </AuthProvider>

      </body>
    </html>
  );
}
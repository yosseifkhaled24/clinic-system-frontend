import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

import "./globals.css";

export const metadata: Metadata = {
  title: "MediCare",
  description:
    "A modern medical frontend experience for booking and care management.",
};

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
      <head />

      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors duration-300">

        <AuthProvider>

          <LanguageProvider>

            <Navbar />

            <main className="flex-1">
              {children}
            </main>

            <Footer />

          </LanguageProvider>

        </AuthProvider>

      </body>
    </html>
  );
}
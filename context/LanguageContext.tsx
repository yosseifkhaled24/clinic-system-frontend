"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface LanguageContextValue {
  language: "en" | "ar";
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<"en" | "ar">("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as "en" | "ar" | null;
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((current) => (current === "en" ? "ar" : "en"));
  };

  const value = useMemo(() => ({ language, toggleLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

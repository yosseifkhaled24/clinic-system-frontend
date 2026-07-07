import en from "@/locales/en/common.json";
import ar from "@/locales/ar/common.json";

export type Language = "en" | "ar";

const dictionaries = { en, ar } as const;

export function getDictionary(language: Language) {
  return dictionaries[language];
}

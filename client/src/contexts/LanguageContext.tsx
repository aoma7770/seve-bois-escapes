import React, { createContext, useContext, useState, useCallback } from "react";
import { detectBrowserLanguage } from "@/lib/localeLanguage";

export type Language = "fr" | "en" | "nl";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (translations: { fr: string; en: string; nl: string }) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: () => {},
  t: (translations) => translations.fr,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sevebois-lang");
      if (stored === "en" || stored === "nl" || stored === "fr") return stored;

      const detected = detectBrowserLanguage();
      localStorage.setItem("sevebois-lang", detected);
      localStorage.setItem("sevebois-lang-source", "auto");
      return detected;
    }
    return "en";
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("sevebois-lang", l);
      localStorage.setItem("sevebois-lang-source", "manual");
    }
  }, []);

  const t = useCallback(
    (translations: { fr: string; en: string; nl: string }) => {
      return translations[lang];
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

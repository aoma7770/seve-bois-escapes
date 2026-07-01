import React, { createContext, useContext, useState, useCallback } from "react";

export type Language = "fr" | "en" | "nl";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (translations: { fr: string; en: string; nl: string }) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: () => {},
  t: (translations) => translations.fr,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("sevebois-lang") as Language) || "fr";
    }
    return "fr";
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("sevebois-lang", l);
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

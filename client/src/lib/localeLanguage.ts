import type { Language } from "@/contexts/LanguageContext";

/**
 * Select the public language from browser locale preferences without using an
 * IP redirect. Only French Belgium/France and Dutch Belgium/Netherlands are
 * mapped automatically; all other locales default to English.
 */
export function languageFromBrowserLocales(locales: readonly string[]): Language {
  for (const locale of locales) {
    const normalized = locale.trim().toLowerCase().replace("_", "-");
    if (normalized === "fr" || normalized === "fr-be" || normalized === "fr-fr") return "fr";
    if (normalized === "nl" || normalized === "nl-be" || normalized === "nl-nl") return "nl";
    if (normalized === "en" || normalized.startsWith("en-")) return "en";
  }

  return "en";
}

export function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "en";
  const locales = navigator.languages?.length ? navigator.languages : [navigator.language];
  return languageFromBrowserLocales(locales);
}

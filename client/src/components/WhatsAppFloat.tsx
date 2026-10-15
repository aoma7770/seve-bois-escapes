import { useLanguage } from "@/contexts/LanguageContext";
import { trackEvent } from "@/lib/analytics";

export const WHATSAPP_NUMBER = "15554425152";

export const whatsappMessages = {
  fr: "Bonjour, je suis intéressé(e) par votre propriété et j'aimerais recevoir de l'aide.",
  en: "Hello, I am interested in your property and would like some assistance.",
  nl: "Hallo, ik ben geïnteresseerd in uw accommodatie en ontvang graag hulp.",
} as const;

export function getWhatsAppHref(lang: keyof typeof whatsappMessages) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessages[lang])}`;
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M20.52 3.45A11.82 11.82 0 0 0 12.08 0C5.55 0 .24 5.31.24 11.84c0 2.09.55 4.13 1.59 5.92L.14 24l6.38-1.67a11.86 11.86 0 0 0 5.56 1.41h.01c6.52 0 11.83-5.31 11.83-11.84 0-3.16-1.23-6.13-3.4-8.45Zm-8.44 18.26h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.84 9.84 0 0 1-1.51-5.2C2.16 6.4 6.6 1.96 12.08 1.96a9.8 9.8 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.89 7c0 5.48-4.44 9.85-9.88 9.85Zm5.41-7.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.5 1.69.64.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

export function WhatsAppIconLink() {
  const { lang, t } = useLanguage();
  const label = t({ fr: "Discuter avec nous sur WhatsApp", en: "Chat with us on WhatsApp", nl: "Chat met ons op WhatsApp" });

  return (
    <a
      href={getWhatsAppHref(lang)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_chat_opened", { language: lang, destination: "availability_row" })}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-all duration-200 hover:bg-[#1ebe5d] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      aria-label={label}
      title={label}
      data-analytics-label="WhatsApp chat"
    >
      <WhatsAppGlyph />
    </a>
  );
}

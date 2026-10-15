import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackEvent } from "@/lib/analytics";

export const WHATSAPP_NUMBER = "15554425152";

export const whatsappMessages = {
  fr: "Bonjour, je suis intéressé(e) par votre propriété et j'aimerais recevoir de l'aide.",
  en: "Hello, I am interested in your property and would like some assistance.",
  be: "Hallo, ik ben geïnteresseerd in uw accommodatie en ontvang graag hulp.",
} as const;

export function getWhatsAppHref(lang: keyof typeof whatsappMessages) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessages[lang])}`;
}

export default function WhatsAppFloat() {
  const { lang, t } = useLanguage();
  const href = getWhatsAppHref(lang);

  const handleClick = () => {
    trackEvent("whatsapp_chat_opened", { language: lang, destination: "floating_button" });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed right-4 bottom-24 sm:right-6 sm:bottom-6 z-40 flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-xl transition-all duration-200 hover:bg-[#1ebe5d] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      aria-label={t({ fr: "Discuter avec nous sur WhatsApp", en: "Chat with us on WhatsApp", be: "Chat met ons op WhatsApp" })}
      data-analytics-label="WhatsApp chat"
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
        <MessageCircle size={23} fill="white" strokeWidth={1.8} />
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#25D366] bg-[#7CFF9F]" aria-label={t({ fr: "En ligne", en: "Online", be: "Online" })} />
      </span>
      <span className="hidden sm:block text-sm font-semibold leading-tight">
        {t({ fr: "Discutez avec nous", en: "Chat with us now", be: "Chat nu met ons" })}
        <span className="block text-[11px] font-normal text-white/85">{t({ fr: "Réponse rapide", en: "Quick reply", be: "Snel antwoord" })}</span>
      </span>
    </a>
  );
}

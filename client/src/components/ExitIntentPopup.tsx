import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ExitIntentPopup() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", marketingConsent: false });
  const triggered = useRef(false);

  useEffect(() => {
    const shown = window.sessionStorage.getItem("sevebois-exit-popup");
    if (shown) return;

    let lastScrollY = window.scrollY;
    let hasMeaningfulScroll = window.scrollY > 160;
    let hiddenAt = 0;

    const trigger = () => {
      if (triggered.current) return;
      triggered.current = true;
      window.sessionStorage.setItem("sevebois-exit-popup", "shown");
      window.setTimeout(() => setVisible(true), 120);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Desktop exit intent: the pointer reaches the browser chrome.
      if (e.clientY <= 0) trigger();
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > 160) hasMeaningfulScroll = true;
      // On touch devices, a deliberate upward swipe is the closest reliable
      // equivalent to moving the pointer toward the browser's close/back UI.
      if (hasMeaningfulScroll && lastScrollY - currentY > 70) trigger();
      lastScrollY = currentY;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        hiddenAt = Date.now();
        return;
      }
      // If the visitor returns from the browser/tab switcher, offer the guide
      // while they are still deciding whether to leave.
      if (hiddenAt && Date.now() - hiddenAt > 400 && (hasMeaningfulScroll || window.innerWidth < 768)) trigger();
    };

    // A shorter fallback catches visitors who do not move the pointer or
    // scroll upward. It is intentionally delayed to avoid interrupting entry.
    const mobileTimer = window.setTimeout(() => {
      if (window.innerWidth < 768) trigger();
    }, 18000);

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(mobileTimer);
    };
  }, []);

  const guideRequest = trpc.newsletter.requestGuide.useMutation({
    onSuccess: () => {
      toast.success(t({ fr: "Merci pour votre intérêt ! Le guide gratuit vient d’être envoyé à votre adresse email. Bonne découverte des Ardennes !", en: "Thank you for your interest! We’ve sent the free guide to your inbox — enjoy discovering the Semois and the Belgian Ardennes.", be: "Bedankt voor uw interesse! We hebben de gratis gids naar uw inbox gestuurd — veel ontdekkingsplezier in de Semois en de Belgische Ardennen!" }));
      setVisible(false);
    },
    onError: () => {
      toast.error(t({ fr: "Une erreur est survenue.", en: "Something went wrong.", be: "Er is iets misgegaan." }));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.marketingConsent) return;
    guideRequest.mutate({ firstName: form.firstName, lastName: form.lastName, email: form.email, marketingConsent: true, source: "exit_popup" });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md max-h-[92vh] w-full overflow-y-auto overflow-x-hidden animate-scale-in">
        {/* Image strip */}
        <div
          className="h-28 sm:h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(/manus-storage/enhanced_hero_exterior_900690b4_1db4629c.webp)` }}
        />
        <div className="p-5 sm:p-7">
          <button
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div className="divider-ochre mb-4" />
          <h3 className="text-subheadline text-[var(--forest-950)] mb-2">
            {t({ fr: "Avant de partir…", en: "Before you go…", be: "Voordat je gaat..." })}
          </h3>
          <p className="text-sm text-[var(--slate-600)] leading-relaxed mb-5">
            {t({
              fr: "Recevez gratuitement notre guide « Explorer la Semois & les Ardennes belges » — sentiers, kayak, villages et bonnes adresses.",
              en: "Get our free guide \"Exploring the Semois & the Belgian Ardennes\" — trails, kayaking, villages and local gems.",
              be: "Ontvang gratis onze gids \"De Semois & de Belgische Ardennen verkennen\" — paden, kajakken, dorpen en lokale juweeltjes."
            })}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder={t({ fr: "Votre prénom", en: "Your first name", be: "Je voornaam" })}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
              className="input-eco"
            />
            <input
              type="text"
              placeholder={t({ fr: "Votre nom", en: "Your last name", be: "Je achternaam" })}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
              className="input-eco"
            />
            <input
              type="email"
              placeholder={t({ fr: "Votre email", en: "Your email", be: "Je e-mailadres" })}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="input-eco"
            />
            <label className="flex items-start gap-2 text-xs text-[var(--slate-500)]"><input type="checkbox" checked={form.marketingConsent} onChange={(e) => setForm({ ...form, marketingConsent: e.target.checked })} required className="mt-0.5 accent-[var(--forest-700)]" />{t({ fr: "J'accepte de recevoir le guide et les informations de Sève & Bois.", en: "I agree to receive the guide and Green Cottages updates.", be: "Ik ga akkoord met de gids en updates van Green Cottages." })}</label>
            <p className="text-xs text-[var(--slate-400)]">
              {t({
                fr: "Pas de spam. Désabonnement en un clic. Conforme RGPD.",
                en: "No spam. Unsubscribe anytime. GDPR compliant.",
                be: "Geen spam. Afmelden met één klik. GDPR-conform."
              })}
            </p>
            <button
              type="submit"
              disabled={guideRequest.isPending}
              className="btn-primary w-full"
            >
              {guideRequest.isPending
                ? t({ fr: "Envoi...", en: "Sending...", be: "Verzenden..." })
                : t({ fr: "Recevoir le guide gratuit", en: "Get the free guide", be: "Gratis gids ontvangen" })}
            </button>
          </form>

          <button
            onClick={() => setVisible(false)}
            className="mt-3 w-full text-center text-xs text-[var(--slate-400)] hover:text-[var(--slate-600)] transition-colors"
          >
            {t({ fr: "Non merci, continuer sans le guide", en: "No thanks, continue without the guide", be: "Nee dank je, doorgaan zonder gids" })}
          </button>
        </div>
      </div>
    </div>
  );
}

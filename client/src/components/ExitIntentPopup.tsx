import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ExitIntentPopup() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const triggered = useRef(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("sevebois-exit-popup");
    if (shown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !triggered.current) {
        triggered.current = true;
        sessionStorage.setItem("sevebois-exit-popup", "shown");
        setTimeout(() => setVisible(true), 200);
      }
    };

    // Also show after 45s on mobile (no mouse leave event)
    const mobileTimer = setTimeout(() => {
      if (!triggered.current) {
        triggered.current = true;
        sessionStorage.setItem("sevebois-exit-popup", "shown");
        setVisible(true);
      }
    }, 45000);

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, []);

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success(t({ fr: "Guide envoyé ! Vérifiez votre boîte mail.", en: "Guide sent! Check your inbox.", be: "Gids verzonden! Controleer uw inbox." }));
      setVisible(false);
    },
    onError: () => {
      toast.error(t({ fr: "Une erreur est survenue.", en: "Something went wrong.", be: "Er is iets misgegaan." }));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribe.mutate({ email, name, source: "exit_popup" });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Image strip */}
        <div
          className="h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(/manus-storage/enhanced_hero_exterior_900690b4.png)` }}
        />
        <div className="p-7">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-eco"
            />
            <input
              type="email"
              placeholder={t({ fr: "Votre email", en: "Your email", be: "Je e-mailadres" })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-eco"
            />
            <p className="text-xs text-[var(--slate-400)]">
              {t({
                fr: "Pas de spam. Désabonnement en un clic. Conforme RGPD.",
                en: "No spam. Unsubscribe anytime. GDPR compliant.",
                be: "Geen spam. Afmelden met één klik. GDPR-conform."
              })}
            </p>
            <button
              type="submit"
              disabled={subscribe.isPending}
              className="btn-primary w-full"
            >
              {subscribe.isPending
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

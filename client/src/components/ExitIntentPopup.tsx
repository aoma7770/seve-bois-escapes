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
      toast.success(t("Guide envoyé ! Vérifiez votre boîte mail.", "Guide sent! Check your inbox."));
      setVisible(false);
    },
    onError: () => {
      toast.error(t("Une erreur est survenue.", "Something went wrong."));
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
            {t("Avant de partir…", "Before you go…")}
          </h3>
          <p className="text-sm text-[var(--slate-600)] leading-relaxed mb-5">
            {t(
              "Recevez gratuitement notre guide « Explorer la Semois & les Ardennes belges » — sentiers, kayak, villages et bonnes adresses.",
              "Get our free guide \"Exploring the Semois & the Belgian Ardennes\" — trails, kayaking, villages and local gems."
            )}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder={t("Votre prénom", "Your first name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-eco"
            />
            <input
              type="email"
              placeholder={t("Votre email", "Your email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-eco"
            />
            <p className="text-xs text-[var(--slate-400)]">
              {t(
                "Pas de spam. Désabonnement en un clic. Conforme RGPD.",
                "No spam. Unsubscribe anytime. GDPR compliant."
              )}
            </p>
            <button
              type="submit"
              disabled={subscribe.isPending}
              className="btn-primary w-full"
            >
              {subscribe.isPending
                ? t("Envoi...", "Sending...")
                : t("Recevoir le guide gratuit", "Get the free guide")}
            </button>
          </form>

          <button
            onClick={() => setVisible(false)}
            className="mt-3 w-full text-center text-xs text-[var(--slate-400)] hover:text-[var(--slate-600)] transition-colors"
          >
            {t("Non merci, continuer sans le guide", "No thanks, continue without the guide")}
          </button>
        </div>
      </div>
    </div>
  );
}

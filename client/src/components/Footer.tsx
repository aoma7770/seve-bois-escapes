import { Link } from "wouter";
import { Mail, Phone, Instagram, Facebook } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success(t({ fr: "Merci ! Vous êtes inscrit.", en: "Thank you! You're subscribed.", be: "Thank you! You're subscribed." }));
      setEmail("");
      setName("");
    },
    onError: (err) => {
      if (err.message.includes("already")) {
        toast.info(t({ fr: "Vous êtes déjà inscrit.", en: "You're already subscribed.", be: "You're already subscribed." }));
      } else {
        toast.error(t({ fr: "Une erreur est survenue.", en: "Something went wrong.", be: "Something went wrong." }));
      }
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribe.mutate({ email, name, source: "footer" });
  };

  return (
    <footer className="bg-[var(--forest-950)] text-[var(--cream-100)]">
      {/* Main footer content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="font-serif text-2xl font-semibold text-white mb-3">
              Sève & Bois
            </div>
            <p className="text-sm text-[var(--forest-300)] leading-relaxed mb-4 italic">
              {t({ fr: "Déconnectez. Respirez. Tout est prévu.", en: "Disconnect. Breathe. Everything's taken care of.", be: "Disconnect. Breathe. Everything's taken care of." })}
            </p>
            <p className="text-sm text-[var(--forest-300)] leading-relaxed">
              {t({ fr: "Deux cottages éco-conçus au cœur de l'Ardenne belge, à Lafarêt, sur les rives de la Semois.", en: "Two eco-designed cottages in the heart of the Belgian Ardennes, in Lafarêt, on the banks of the Semois.", be: "Twee eco-ontworpen cottages in het hart van de Belgische Ardennen, in Lafarêt, aan de oevers van de Semois." })}
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              <a
                href="https://instagram.com/sevebois"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[var(--forest-800)] flex items-center justify-center hover:bg-[var(--ochre-600)] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com/sevebois"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[var(--forest-800)] flex items-center justify-center hover:bg-[var(--ochre-600)] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-caption text-[var(--forest-400)] mb-4">
              {t({ fr: "Navigation", en: "Navigation", be: "Navigation" })}
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/cottages/la-seve", label: t({ fr: "La Sève", en: "La Sève", be: "La Sève" }) },
                { href: "/cottages/le-bois", label: t({ fr: "Le Bois", en: "Le Bois", be: "Le Bois" }) },
                { href: "/location", label: t({ fr: "Le Lieu", en: "The Location", be: "The Location" }) },
                { href: "/sustainability", label: t({ fr: "Durabilité", en: "Sustainability", be: "Sustainability" }) },
                { href: "/rates", label: t({ fr: "Tarifs & Disponibilités", en: "Rates & Availability", be: "Rates & Availability" }) },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: t({ fr: "Contact & Réserver", en: "Contact & Book", be: "Contact & Book" }) },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--forest-300)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-caption text-[var(--forest-400)] mb-4">
              {t({ fr: "Contact", en: "Contact", be: "Contact" })}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@sevebois.be"
                  className="flex items-center gap-2 text-sm text-[var(--forest-300)] hover:text-white transition-colors"
                >
                  <Mail size={14} className="shrink-0" />
                  support@sevebois.be
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/32467808179"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[var(--forest-300)] hover:text-white transition-colors"
                >
                  <Phone size={14} className="shrink-0" />
                  +32 467 80 81 79
                </a>
              </li>
            </ul>

            {/* Trust badges */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-[var(--forest-400)]">
                <span className="w-5 h-5 rounded-full bg-[var(--forest-700)] flex items-center justify-center text-white text-xs">✓</span>
                {t({ fr: "Approuvé par la commune", en: "Council-approved", be: "Council-approved" })}
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--forest-400)]">
                <span className="w-5 h-5 rounded-full bg-[var(--forest-700)] flex items-center justify-center text-white text-xs">♻</span>
                {t({ fr: "Énergie 100% renouvelable", en: "100% renewable energy", be: "100% renewable energy" })}
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--forest-400)]">
                <span className="w-5 h-5 rounded-full bg-[var(--forest-700)] flex items-center justify-center text-white text-xs">🔒</span>
                {t({ fr: "Paiement sécurisé", en: "Secure payment", be: "Secure payment" })}
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-caption text-[var(--forest-400)] mb-4">
              {t({ fr: "Guide Gratuit", en: "Free Guide", be: "Free Guide" })}
            </h4>
            <p className="text-sm text-[var(--forest-300)] leading-relaxed mb-4">
              {t({ fr: "Recevez notre guide gratuit « Explorer la Semois & les Ardennes belges ».", en: "Receive our free guide \"Exploring the Semois & the Belgian Ardennes\".", be: "Receive our free guide \"Exploring the Semois & the Belgian Ardennes\"." })}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="text"
                placeholder={t({ fr: "Votre prénom", en: "Your first name", be: "Your first name" })}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded bg-[var(--forest-800)] border border-[var(--forest-700)] text-white placeholder-[var(--forest-400)] text-sm focus:outline-none focus:border-[var(--ochre-400)] transition-colors"
              />
              <input
                type="email"
                placeholder={t({ fr: "Votre email", en: "Your email", be: "Your email" })}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded bg-[var(--forest-800)] border border-[var(--forest-700)] text-white placeholder-[var(--forest-400)] text-sm focus:outline-none focus:border-[var(--ochre-400)] transition-colors"
              />
              <button
                type="submit"
                disabled={subscribe.isPending}
                className="w-full py-2.5 bg-[var(--ochre-600)] hover:bg-[var(--ochre-700)] text-white text-sm font-semibold rounded transition-colors disabled:opacity-60"
              >
                {subscribe.isPending
                  ? t({ fr: "Inscription...", en: "Subscribing...", be: "Subscribing..." })
                  : t({ fr: "Recevoir le guide", en: "Get the guide", be: "Get the guide" })}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--forest-800)]">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--forest-500)]">
            © {new Date().getFullYear()} Sève & Bois Escapes. {t({ fr: "Tous droits réservés.", en: "All rights reserved.", be: "All rights reserved." })}
          </p>
          <div className="flex items-center gap-4">
            {[
              { href: "/privacy", label: t({ fr: "Confidentialité", en: "Privacy", be: "Privacy" }) },
              { href: "/terms", label: t({ fr: "Conditions", en: "Terms", be: "Terms" }) },
              { href: "/cookies", label: "Cookies" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-[var(--forest-500)] hover:text-[var(--forest-300)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

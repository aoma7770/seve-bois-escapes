import { useLanguage } from "@/contexts/LanguageContext";
export default function CookiePage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-12 text-white"><div className="container"><h1 className="text-headline text-white">{t("Politique de cookies", "Cookie Policy")}</h1></div></div>
      <div className="container py-16 max-w-3xl prose-eco">
        <p className="text-caption text-[var(--slate-500)] mb-8">{t("Dernière mise à jour : juillet 2025", "Last updated: July 2025")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("Qu'est-ce qu'un cookie ?", "What is a cookie?")}</h2>
        <p className="text-lead mb-6">{t("Un cookie est un petit fichier texte stocké sur votre appareil lors de votre visite sur un site web. Il permet au site de mémoriser vos préférences et d'améliorer votre expérience.", "A cookie is a small text file stored on your device when you visit a website. It allows the site to remember your preferences and improve your experience.")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("Cookies essentiels", "Essential cookies")}</h2>
        <p className="text-lead mb-6">{t("Ces cookies sont nécessaires au fonctionnement du site (mémorisation de votre langue, de votre session). Ils ne peuvent pas être désactivés.", "These cookies are necessary for the site to function (remembering your language, your session). They cannot be disabled.")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("Cookies analytiques", "Analytical cookies")}</h2>
        <p className="text-lead mb-6">{t("Avec votre consentement, nous utilisons des cookies analytiques anonymisés pour comprendre comment les visiteurs utilisent notre site et l'améliorer. Aucune donnée personnelle n'est partagée avec des tiers.", "With your consent, we use anonymised analytical cookies to understand how visitors use our site and improve it. No personal data is shared with third parties.")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("Gérer vos préférences", "Managing your preferences")}</h2>
        <p className="text-lead">{t("Vous pouvez modifier vos préférences de cookies à tout moment en cliquant sur 'Gérer les cookies' dans le pied de page, ou en configurant votre navigateur pour refuser les cookies.", "You can change your cookie preferences at any time by clicking 'Manage cookies' in the footer, or by configuring your browser to refuse cookies.")}</p>
      </div>
    </div>
  );
}

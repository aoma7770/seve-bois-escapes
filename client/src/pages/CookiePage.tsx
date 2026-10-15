import { useLanguage } from "@/contexts/LanguageContext";
export default function CookiePage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-12 text-white"><div className="container"><h1 className="text-headline text-white">{t({ fr: "Politique de cookies", en: "Cookie Policy", nl: "Cookiebeleid" })}</h1></div></div>
      <div className="container py-16 max-w-3xl prose-eco">
        <p className="text-caption text-[var(--slate-500)] mb-8">{t({ fr: "Dernière mise à jour : juillet 2025", en: "Last updated: July 2025", nl: "Laatst bijgewerkt: juli 2025" })}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "Qu'est-ce qu'un cookie ?", en: "What is a cookie?", nl: "Wat is een koekje?" })}</h2>
        <p className="text-lead mb-6">{t({ fr: "Un cookie est un petit fichier texte stocké sur votre appareil lors de votre visite sur un site web. Il permet au site de mémoriser vos préférences et d'améliorer votre expérience.", en: "A cookie is a small text file stored on your device when you visit a website. It allows the site to remember your preferences and improve your experience.", nl: "Een cookie is een klein tekstbestand dat op uw apparaat wordt opgeslagen wanneer u een website bezoekt. Hierdoor kan de site uw voorkeuren onthouden en uw ervaring verbeteren." })}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "Cookies essentiels", en: "Essential cookies", nl: "Essentiële koekjes" })}</h2>
        <p className="text-lead mb-6">{t({ fr: "Ces cookies sont nécessaires au fonctionnement du site (mémorisation de votre langue, de votre session). Ils ne peuvent pas être désactivés.", en: "These cookies are necessary for the site to function (remembering your language, your session). They cannot be disabled.", nl: "Deze cookies zijn noodzakelijk om de site te laten functioneren (het onthouden van uw taal, uw sessie). Ze kunnen niet worden uitgeschakeld." })}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "Cookies analytiques", en: "Analytical cookies", nl: "Analytische cookies" })}</h2>
        <p className="text-lead mb-6">{t({ fr: "Avec votre consentement, nous utilisons des cookies analytiques anonymisés pour comprendre comment les visiteurs utilisent notre site et l'améliorer. Aucune donnée personnelle n'est partagée avec des tiers.", en: "With your consent, we use anonymised analytical cookies to understand how visitors use our site and improve it. No personal data is shared with third parties.", nl: "Met uw toestemming gebruiken wij geanonimiseerde analytische cookies om te begrijpen hoe bezoekers onze site gebruiken en om deze te verbeteren. Er worden geen persoonsgegevens gedeeld met derden." })}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "Gérer vos préférences", en: "Managing your preferences", nl: "Beheer uw voorkeuren" })}</h2>
        <p className="text-lead">{t({ fr: "Vous pouvez modifier vos préférences de cookies à tout moment en cliquant sur 'Gérer les cookies' dans le pied de page, ou en configurant votre navigateur pour refuser les cookies.", en: "You can change your cookie preferences at any time by clicking 'Manage cookies' in the footer, or by configuring your browser to refuse cookies.", nl: "U kunt uw cookievoorkeuren op elk moment wijzigen door in de voettekst op ‘Cookies beheren’ te klikken, of door uw browser zo te configureren dat cookies worden geweigerd." })}</p>
      </div>
    </div>
  );
}

import { useLanguage } from "@/contexts/LanguageContext";
export default function PrivacyPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-12 text-white"><div className="container"><h1 className="text-headline text-white">{t("Politique de confidentialité", "Privacy Policy")}</h1></div></div>
      <div className="container py-16 max-w-3xl prose-eco">
        <p className="text-caption text-[var(--slate-500)] mb-8">{t("Dernière mise à jour : juillet 2025", "Last updated: July 2025")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("1. Responsable du traitement", "1. Data controller")}</h2>
        <p className="text-lead mb-6">{t("Sève & Bois Escapes, Laforêt, Wallonie, Belgique. Contact : support@sevebois.be", "Sève & Bois Escapes, Laforêt, Wallonia, Belgium. Contact: support@sevebois.be")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("2. Données collectées", "2. Data collected")}</h2>
        <p className="text-lead mb-6">{t("Nous collectons les données que vous nous fournissez lors d'une réservation ou d'une prise de contact : nom, email, téléphone, dates de séjour, nombre de personnes. Nous collectons également des données de navigation anonymisées via des cookies analytiques (avec votre consentement).", "We collect the data you provide when making a booking or contact: name, email, phone, stay dates, number of guests. We also collect anonymised browsing data via analytical cookies (with your consent).")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("3. Finalités du traitement", "3. Purposes of processing")}</h2>
        <p className="text-lead mb-6">{t("Vos données sont utilisées pour : traiter votre réservation, vous envoyer une confirmation, vous contacter en cas de besoin, améliorer notre service. Nous ne vendons jamais vos données à des tiers.", "Your data is used to: process your booking, send you a confirmation, contact you if needed, improve our service. We never sell your data to third parties.")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("4. Vos droits (RGPD)", "4. Your rights (GDPR)")}</h2>
        <p className="text-lead mb-6">{t("Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition. Pour exercer ces droits, contactez-nous à support@sevebois.be.", "In accordance with GDPR, you have the right to access, rectification, erasure, portability and objection. To exercise these rights, contact us at support@sevebois.be.")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("5. Conservation des données", "5. Data retention")}</h2>
        <p className="text-lead mb-6">{t("Les données de réservation sont conservées 5 ans à des fins comptables. Les données de newsletter sont conservées jusqu'à désinscription.", "Booking data is retained for 5 years for accounting purposes. Newsletter data is retained until unsubscription.")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("6. Cookies", "6. Cookies")}</h2>
        <p className="text-lead">{t("Nous utilisons des cookies essentiels (fonctionnement du site) et analytiques (avec consentement). Voir notre politique de cookies pour plus de détails.", "We use essential cookies (site functionality) and analytical cookies (with consent). See our cookie policy for more details.")}</p>
      </div>
    </div>
  );
}

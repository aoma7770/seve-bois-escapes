import { useLanguage } from "@/contexts/LanguageContext";
export default function TermsPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-12 text-white"><div className="container"><h1 className="text-headline text-white">{t({ fr: "Conditions générales & de réservation", en: "Terms & Booking Conditions", be: "Algemene voorwaarden & reserveringsvoorwaarden" })}</h1></div></div>
      <div className="container py-16 max-w-3xl prose-eco">
        <p className="text-caption text-[var(--slate-500)] mb-8">{t({ fr: "Dernière mise à jour : juillet 2025", en: "Last updated: July 2025", be: "Laatst bijgewerkt: juli 2025" })}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "1. Réservation", en: "1. Booking", be: "1. Boeking" })}</h2>
        <p className="text-lead mb-6">{t({ fr: "La réservation est confirmée à réception du paiement intégral. Un email de confirmation vous est envoyé dans les 24h. Le séjour minimum est de 2 nuits.", en: "The booking is confirmed upon receipt of full payment. A confirmation email is sent within 24 hours. The minimum stay is 2 nights.", be: "De boeking wordt bevestigd na ontvangst van volledige betaling. Een bevestigingsemail wordt binnen 24 uur verzonden. De minimale verblijfsduur is 2 nachten." })}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "2. Annulation", en: "2. Cancellation", be: "2. Annulering" })}</h2>
        <p className="text-lead mb-6">{t({ fr: "Annulation gratuite jusqu'à 14 jours avant l'arrivée. Entre 7 et 14 jours : remboursement de 50% du montant total. Moins de 7 jours avant l'arrivée : aucun remboursement. En cas de force majeure, nous étudions chaque situation individuellement.", en: "Free cancellation up to 14 days before arrival. Between 7 and 14 days: 50% refund of total amount. Less than 7 days before arrival: no refund. In case of force majeure, we consider each situation individually.", be: "Gratis annulering tot 14 dagen voor aankomst. Tussen 7 en 14 dagen: 50% terugbetaling van het totaalbedrag. Minder dan 7 dagen voor aankomst: geen terugbetaling. In geval van overmacht bekijken we elke situatie individueel." })}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "3. Arrivée & départ", en: "3. Check-in & check-out", be: "3. Aankomst & vertrek" })}</h2>
        <p className="text-lead mb-6">{t({ fr: "Arrivée à partir de 16h. Départ avant 11h. Des arrangements différents peuvent être convenus sous réserve de disponibilité.", en: "Check-in from 4pm. Check-out before 11am. Different arrangements can be agreed subject to availability.", be: "Aankomst vanaf 16:00 uur. Vertrek voor 11:00 uur. Andere afspraken kunnen worden gemaakt onder voorbehoud van beschikbaarheid." })}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "4. Règlement intérieur", en: "4. House rules", be: "4. Huisregels" })}</h2>
        <p className="text-lead mb-6">{t({ fr: "Non-fumeur à l'intérieur. Respect du voisinage et de la nature. Animaux acceptés sur demande. Tout dommage causé au cottage sera facturé au locataire.", en: "Non-smoking indoors. Respect for neighbours and nature. Pets accepted on request. Any damage caused to the cottage will be charged to the tenant.", be: "Rookvrij binnenshuis. Respect voor buren en natuur. Huisdieren welkom op aanvraag. Eventuele schade aan het cottage wordt in rekening gebracht bij de huurder." })}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "5. Responsabilité", en: "5. Liability", be: "5. Aansprakelijkheid" })}</h2>
        <p className="text-lead">{t({ fr: "Sève & Bois Escapes ne peut être tenu responsable des accidents survenus en dehors du cottage. Les locataires sont responsables de leur propre sécurité lors des activités extérieures.", en: "Sève & Bois Escapes cannot be held responsible for accidents occurring outside the cottage. Tenants are responsible for their own safety during outdoor activities.", be: "Sève & Bois Escapes kan niet verantwoordelijk worden gehouden voor ongevallen buiten het cottage. Huurders zijn verantwoordelijk voor hun eigen veiligheid tijdens buitenactiviteiten." })}</p>
      </div>
    </div>
  );
}

import { useLanguage } from "@/contexts/LanguageContext";
export default function TermsPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-12 text-white"><div className="container"><h1 className="text-headline text-white">{t("Conditions générales & de réservation", "Terms & Booking Conditions")}</h1></div></div>
      <div className="container py-16 max-w-3xl prose-eco">
        <p className="text-caption text-[var(--slate-500)] mb-8">{t("Dernière mise à jour : juillet 2025", "Last updated: July 2025")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("1. Réservation", "1. Booking")}</h2>
        <p className="text-lead mb-6">{t("La réservation est confirmée à réception du paiement intégral. Un email de confirmation vous est envoyé dans les 24h. Le séjour minimum est de 2 nuits.", "The booking is confirmed upon receipt of full payment. A confirmation email is sent within 24 hours. The minimum stay is 2 nights.")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("2. Annulation", "2. Cancellation")}</h2>
        <p className="text-lead mb-6">{t("Annulation gratuite jusqu'à 14 jours avant l'arrivée. Entre 7 et 14 jours : remboursement de 50% du montant total. Moins de 7 jours avant l'arrivée : aucun remboursement. En cas de force majeure, nous étudions chaque situation individuellement.", "Free cancellation up to 14 days before arrival. Between 7 and 14 days: 50% refund of total amount. Less than 7 days before arrival: no refund. In case of force majeure, we consider each situation individually.")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("3. Arrivée & départ", "3. Check-in & check-out")}</h2>
        <p className="text-lead mb-6">{t("Arrivée à partir de 16h. Départ avant 11h. Des arrangements différents peuvent être convenus sous réserve de disponibilité.", "Check-in from 4pm. Check-out before 11am. Different arrangements can be agreed subject to availability.")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("4. Règlement intérieur", "4. House rules")}</h2>
        <p className="text-lead mb-6">{t("Non-fumeur à l'intérieur. Respect du voisinage et de la nature. Animaux acceptés sur demande. Tout dommage causé au cottage sera facturé au locataire.", "Non-smoking indoors. Respect for neighbours and nature. Pets accepted on request. Any damage caused to the cottage will be charged to the tenant.")}</p>
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t("5. Responsabilité", "5. Liability")}</h2>
        <p className="text-lead">{t("Sève & Bois Escapes ne peut être tenu responsable des accidents survenus en dehors du cottage. Les locataires sont responsables de leur propre sécurité lors des activités extérieures.", "Sève & Bois Escapes cannot be held responsible for accidents occurring outside the cottage. Tenants are responsible for their own safety during outdoor activities.")}</p>
      </div>
    </div>
  );
}

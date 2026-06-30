import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";

interface FaqItem { q: string; a: string; }
interface FaqGroup { title: string; items: FaqItem[]; }

export default function FaqPage() {
  const { t } = useLanguage();
  const [openItem, setOpenItem] = useState<string | null>(null);

  const groups: FaqGroup[] = [
    {
      title: t("Réservation & paiement", "Booking & payment"),
      items: [
        { q: t("Comment réserver ?", "How do I book?"), a: t("Directement sur ce site via notre formulaire de réservation sécurisé. Choisissez vos dates, remplissez vos coordonnées, et payez par carte via Stripe. Vous recevrez une confirmation par email.", "Directly on this website via our secure booking form. Choose your dates, fill in your details, and pay by card via Stripe. You'll receive a confirmation by email.") },
        { q: t("Quels modes de paiement acceptez-vous ?", "What payment methods do you accept?"), a: t("Nous acceptons toutes les cartes bancaires principales (Visa, Mastercard, American Express) via Stripe, notre processeur de paiement sécurisé.", "We accept all major credit cards (Visa, Mastercard, American Express) via Stripe, our secure payment processor.") },
        { q: t("Quelle est la politique d'annulation ?", "What is the cancellation policy?"), a: t("Annulation gratuite jusqu'à 14 jours avant l'arrivée. Entre 7 et 14 jours : remboursement de 50%. Moins de 7 jours : non remboursable. Contactez-nous pour toute situation particulière.", "Free cancellation up to 14 days before arrival. Between 7 and 14 days: 50% refund. Less than 7 days: non-refundable. Contact us for any special circumstances.") },
        { q: t("Puis-je réserver en direct plutôt que via Airbnb ?", "Can I book direct rather than via Airbnb?"), a: t("Oui — et c'est le meilleur moyen. En réservant directement, vous obtenez le meilleur tarif (pas de frais de plateforme), un contact direct avec votre hôte, et une flexibilité accrue.", "Yes — and it's the best way. By booking directly, you get the best rate (no platform fees), direct contact with your host, and greater flexibility.") },
      ],
    },
    {
      title: t("Le cottage", "The cottage"),
      items: [
        { q: t("Y a-t-il du wifi ?", "Is there wifi?"), a: t("Oui. Wifi haut débit inclus dans les deux cottages. Vous pouvez télétravailler confortablement si nécessaire.", "Yes. High-speed wifi included in both cottages. You can work remotely comfortably if needed.") },
        { q: t("Y a-t-il du chauffage ?", "Is there heating?"), a: t("Oui. Chauffage central inclus. Le cottage est confortable en toutes saisons.", "Yes. Central heating included. The cottage is comfortable in all seasons.") },
        { q: t("Qu'est-ce qui est inclus dans le prix ?", "What's included in the price?"), a: t("Le logement, le wifi, le chauffage, l'eau chaude, le linge de maison (draps, serviettes), et l'accès à tous les équipements. Les frais de ménage (€75–90) sont indiqués séparément.", "Accommodation, wifi, heating, hot water, household linen (sheets, towels), and access to all amenities. Cleaning fees (€75–90) are listed separately.") },
        { q: t("Les animaux sont-ils acceptés ?", "Are pets allowed?"), a: t("Oui, sur demande et sous réserve d'acceptation. Merci de nous contacter avant de réserver.", "Yes, on request and subject to acceptance. Please contact us before booking.") },
        { q: t("Quelles sont les heures d'arrivée et de départ ?", "What are the check-in and check-out times?"), a: t("Arrivée à partir de 16h, départ avant 11h. Des arrangements différents peuvent être convenus sous réserve de disponibilité.", "Check-in from 4pm, check-out before 11am. Different arrangements can be agreed subject to availability.") },
      ],
    },
    {
      title: t("Le lieu & comment y venir", "Location & getting here"),
      items: [
        { q: t("Où se trouve exactement le cottage ?", "Where exactly is the cottage?"), a: t("À Laforêt, dans la province de Namur, Wallonie, Belgique. Sur les rives de la Semois, à quelques minutes du centre du village.", "In Laforêt, in the province of Namur, Wallonia, Belgium. On the banks of the Semois, a few minutes from the village centre.") },
        { q: t("Comment y accéder depuis Bruxelles ?", "How to get there from Brussels?"), a: t("Environ 2h en voiture via l'E411 direction Luxembourg, sortie Bertrix. Les coordonnées GPS vous seront envoyées avec votre confirmation de réservation.", "About 2 hours by car via the E411 towards Luxembourg, exit Bertrix. GPS coordinates will be sent with your booking confirmation.") },
        { q: t("Y a-t-il un parking ?", "Is there parking?"), a: t("Oui, parking privé gratuit sur place.", "Yes, free private parking on site.") },
      ],
    },
    {
      title: t("Pour les premiers séjours en nature", "For first-timers"),
      items: [
        { q: t("Je n'ai jamais fait de séjour en nature. Est-ce pour moi ?", "I've never done a nature stay. Is this for me?"), a: t("Absolument. Vous n'avez besoin d'aucune expérience, d'aucun équipement, et de rien à planifier. Le cottage est entièrement équipé — wifi, chauffage, eau chaude, cuisine complète, vrais lits. Vous arrivez, la forêt fait le reste.", "Absolutely. You need no experience, no equipment, and nothing to plan. The cottage is fully equipped — wifi, heating, hot water, full kitchen, real beds. You arrive, the forest does the rest.") },
        { q: t("Est-ce que je serai isolé(e) ?", "Will I be isolated?"), a: t("Vous serez au cœur de la nature, mais pas loin de tout. Le village de Laforêt est à quelques minutes à pied, avec des restaurants et commerces. Et vous aurez le wifi et le téléphone.", "You'll be in the heart of nature, but not far from everything. The village of Laforêt is a few minutes on foot, with restaurants and shops. And you'll have wifi and phone signal.") },
        { q: t("Que faire si j'ai un problème ?", "What if I have a problem?"), a: t("Votre hôte est joignable par WhatsApp (+32 467 80 81 79) et par email (support@sevebois.be) à tout moment pendant votre séjour.", "Your host is reachable by WhatsApp (+32 467 80 81 79) and email (support@sevebois.be) at any time during your stay.") },
      ],
    },
    {
      title: t("Durabilité", "Sustainability"),
      items: [
        { q: t("Le cottage est-il vraiment éco-responsable ?", "Is the cottage truly eco-responsible?"), a: t("Oui. Le cottage est construit avec des matériaux naturels et éco-certifiés, alimenté à 100% par des énergies renouvelables, et conçu pour minimiser son impact environnemental. Ce n'est pas un argument marketing — c'est le fondement de notre projet.", "Yes. The cottage is built with natural, eco-certified materials, powered 100% by renewable energy, and designed to minimise its environmental impact. This is not a marketing argument — it is the foundation of our project.") },
        { q: t("Avez-vous des certifications officielles ?", "Do you have official certifications?"), a: t("Nos cottages sont officiellement approuvés et licenciés par la commune locale, ce qui garantit le respect des réglementations en vigueur, y compris environnementales.", "Our cottages are officially approved and licensed by the local council, which guarantees compliance with current regulations, including environmental ones.") },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-16 text-white">
        <div className="container">
          <p className="text-caption text-[var(--ochre-300)] mb-3">FAQ</p>
          <h1 className="text-headline text-white">{t("Questions fréquentes", "Frequently asked questions")}</h1>
        </div>
      </div>
      <div className="container py-16 max-w-4xl">
        <div className="space-y-12">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-subheadline text-[var(--forest-950)] mb-6 pb-3 border-b border-[var(--cream-300)]">{group.title}</h2>
              <div className="space-y-3">
                {group.items.map(({ q, a }) => {
                  const key = `${group.title}-${q}`;
                  const isOpen = openItem === key;
                  return (
                    <div key={q} className="bg-white rounded-xl border border-[var(--cream-300)] overflow-hidden">
                      <button
                        onClick={() => setOpenItem(isOpen ? null : key)}
                        className="w-full flex items-center justify-between p-5 text-left font-semibold text-[var(--forest-900)] hover:bg-[var(--cream-50)] transition-colors"
                      >
                        {q}
                        <ChevronDown size={16} className={`shrink-0 text-[var(--ochre-500)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-sm text-[var(--slate-600)] leading-relaxed border-t border-[var(--cream-200)] pt-4">{a}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 bg-[var(--forest-50)] rounded-2xl p-8 text-center">
          <h3 className="text-subheadline text-[var(--forest-950)] mb-4">{t("Vous n'avez pas trouvé votre réponse ?", "Didn't find your answer?")}</h3>
          <p className="text-lead mb-6">{t("Contactez-nous directement — nous répondons sous 24h.", "Contact us directly — we reply within 24 hours.")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn-primary">{t("Nous contacter", "Contact us")}</Link>
            <a href="https://wa.me/32467808179" target="_blank" rel="noopener noreferrer" className="btn-outline">{t("WhatsApp", "WhatsApp")}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

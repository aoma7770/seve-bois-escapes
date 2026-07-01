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
      title: t({ fr: "Réservation & paiement", en: "Booking & payment", nl: "Booking & payment" }),
      items: [
        { q: t({ fr: "Comment réserver ?", en: "How do I book?", nl: "How do I book?" }), a: t({ fr: "Directement sur ce site via notre formulaire de réservation sécurisé. Choisissez vos dates, remplissez vos coordonnées, et payez par carte via Stripe. Vous recevrez une confirmation par email.", en: "Directly on this website via our secure booking form. Choose your dates, fill in your details, and pay by card via Stripe. You'll receive a confirmation by email.", nl: "Directly on this website via our secure booking form. Choose your dates, fill in your details, and pay by card via Stripe. You'll receive a confirmation by email." }) },
        { q: t({ fr: "Quels modes de paiement acceptez-vous ?", en: "What payment methods do you accept?", nl: "What payment methods do you accept?" }), a: t({ fr: "Nous acceptons toutes les cartes bancaires principales (Visa, Mastercard, American Express) via Stripe, notre processeur de paiement sécurisé.", en: "We accept all major credit cards (Visa, Mastercard, American Express) via Stripe, our secure payment processor.", nl: "We accept all major credit cards (Visa, Mastercard, American Express) via Stripe, our secure payment processor." }) },
        { q: t({ fr: "Quelle est la politique d'annulation ?", en: "What is the cancellation policy?", nl: "What is the cancellation policy?" }), a: t({ fr: "Annulation gratuite jusqu'à 14 jours avant l'arrivée. Entre 7 et 14 jours : remboursement de 50%. Moins de 7 jours : non remboursable. Contactez-nous pour toute situation particulière.", en: "Free cancellation up to 14 days before arrival. Between 7 and 14 days: 50% refund. Less than 7 days: non-refundable. Contact us for any special circumstances.", nl: "Free cancellation up to 14 days before arrival. Between 7 and 14 days: 50% refund. Less than 7 days: non-refundable. Contact us for any special circumstances." }) },
        { q: t({ fr: "Puis-je réserver en direct plutôt que via Airbnb ?", en: "Can I book direct rather than via Airbnb?", nl: "Can I book direct rather than via Airbnb?" }), a: t({ fr: "Oui — et c'est le meilleur moyen. En réservant directement, vous obtenez le meilleur tarif (pas de frais de plateforme), un contact direct avec votre hôte, et une flexibilité accrue.", en: "Yes — and it's the best way. By booking directly, you get the best rate (no platform fees), direct contact with your host, and greater flexibility.", nl: "Yes — and it's the best way. By booking directly, you get the best rate (no platform fees), direct contact with your host, and greater flexibility." }) },
      ],
    },
    {
      title: t({ fr: "Le cottage", en: "The cottage", nl: "The cottage" }),
      items: [
        { q: t({ fr: "Y a-t-il du wifi ?", en: "Is there wifi?", nl: "Is there wifi?" }), a: t({ fr: "Oui. Wifi haut débit inclus dans les deux cottages. Vous pouvez télétravailler confortablement si nécessaire.", en: "Yes. High-speed wifi included in both cottages. You can work remotely comfortably if needed.", nl: "Yes. High-speed wifi included in both cottages. You can work remotely comfortably if needed." }) },
        { q: t({ fr: "Y a-t-il du chauffage ?", en: "Is there heating?", nl: "Is there heating?" }), a: t({ fr: "Oui. Chauffage central inclus. Le cottage est confortable en toutes saisons.", en: "Yes. Central heating included. The cottage is comfortable in all seasons.", nl: "Yes. Central heating included. The cottage is comfortable in all seasons." }) },
        { q: t({ fr: "Qu'est-ce qui est inclus dans le prix ?", en: "What's included in the price?", nl: "What's included in the price?" }), a: t({ fr: "Le logement, le wifi, le chauffage, l'eau chaude, le linge de maison (draps, serviettes), et l'accès à tous les équipements. Les frais de ménage (€75–90) sont indiqués séparément.", en: "Accommodation, wifi, heating, hot water, household linen (sheets, towels), and access to all amenities. Cleaning fees (€75–90) are listed separately.", nl: "Accommodation, wifi, heating, hot water, household linen (sheets, towels), and access to all amenities. Cleaning fees (€75–90) are listed separately." }) },
        { q: t({ fr: "Les animaux sont-ils acceptés ?", en: "Are pets allowed?", nl: "Are pets allowed?" }), a: t({ fr: "Oui, sur demande et sous réserve d'acceptation. Merci de nous contacter avant de réserver.", en: "Yes, on request and subject to acceptance. Please contact us before booking.", nl: "Yes, on request and subject to acceptance. Please contact us before booking." }) },
        { q: t({ fr: "Quelles sont les heures d'arrivée et de départ ?", en: "What are the check-in and check-out times?", nl: "What are the check-in and check-out times?" }), a: t({ fr: "Arrivée à partir de 16h, départ avant 11h. Des arrangements différents peuvent être convenus sous réserve de disponibilité.", en: "Check-in from 4pm, check-out before 11am. Different arrangements can be agreed subject to availability.", nl: "Check-in from 4pm, check-out before 11am. Different arrangements can be agreed subject to availability." }) },
      ],
    },
    {
      title: t({ fr: "Le lieu & comment y venir", en: "Location & getting here", nl: "Location & getting here" }),
      items: [
        { q: t({ fr: "Où se trouve exactement le cottage ?", en: "Where exactly is the cottage?", nl: "Where exactly is the cottage?" }), a: t({ fr: "À Laforêt, dans la province de Namur, Wallonie, Belgique. Sur les rives de la Semois, à quelques minutes du centre du village.", en: "In Laforêt, in the province of Namur, Wallonia, Belgium. On the banks of the Semois, a few minutes from the village centre.", nl: "In Laforêt, in the province of Namur, Wallonia, Belgium. On the banks of the Semois, a few minutes from the village centre." }) },
        { q: t({ fr: "Comment y accéder depuis Bruxelles ?", en: "How to get there from Brussels?", nl: "How to get there from Brussels?" }), a: t({ fr: "Environ 2h en voiture via l'E411 direction Luxembourg, sortie Bertrix. Les coordonnées GPS vous seront envoyées avec votre confirmation de réservation.", en: "About 2 hours by car via the E411 towards Luxembourg, exit Bertrix. GPS coordinates will be sent with your booking confirmation.", nl: "About 2 hours by car via the E411 towards Luxembourg, exit Bertrix. GPS coordinates will be sent with your booking confirmation." }) },
        { q: t({ fr: "Y a-t-il un parking ?", en: "Is there parking?", nl: "Is there parking?" }), a: t({ fr: "Oui, parking privé gratuit sur place.", en: "Yes, free private parking on site.", nl: "Yes, free private parking on site." }) },
      ],
    },
    {
      title: t({ fr: "Pour les premiers séjours en nature", en: "For first-timers", nl: "For first-timers" }),
      items: [
        { q: t({ fr: "Je n'ai jamais fait de séjour en nature. Est-ce pour moi ?", en: "I've never done a nature stay. Is this for me?", nl: "I've never done a nature stay. Is this for me?" }), a: t({ fr: "Absolument. Vous n'avez besoin d'aucune expérience, d'aucun équipement, et de rien à planifier. Le cottage est entièrement équipé — wifi, chauffage, eau chaude, cuisine complète, vrais lits. Vous arrivez, la forêt fait le reste.", en: "Absolutely. You need no experience, no equipment, and nothing to plan. The cottage is fully equipped — wifi, heating, hot water, full kitchen, real beds. You arrive, the forest does the rest.", nl: "Absolutely. You need no experience, no equipment, and nothing to plan. The cottage is fully equipped — wifi, heating, hot water, full kitchen, real beds. You arrive, the forest does the rest." }) },
        { q: t({ fr: "Est-ce que je serai isolé(e) ?", en: "Will I be isolated?", nl: "Will I be isolated?" }), a: t({ fr: "Vous serez au cœur de la nature, mais pas loin de tout. Le village de Laforêt est à quelques minutes à pied, avec des restaurants et commerces. Et vous aurez le wifi et le téléphone.", en: "You'll be in the heart of nature, but not far from everything. The village of Laforêt is a few minutes on foot, with restaurants and shops. And you'll have wifi and phone signal.", nl: "You'll be in the heart of nature, but not far from everything. The village of Laforêt is a few minutes on foot, with restaurants and shops. And you'll have wifi and phone signal." }) },
        { q: t({ fr: "Que faire si j'ai un problème ?", en: "What if I have a problem?", nl: "What if I have a problem?" }), a: t({ fr: "Votre hôte est joignable par WhatsApp (+32 467 80 81 79) et par email (support@sevebois.be) à tout moment pendant votre séjour.", en: "Your host is reachable by WhatsApp (+32 467 80 81 79) and email (support@sevebois.be) at any time during your stay.", nl: "Your host is reachable by WhatsApp (+32 467 80 81 79) and email (support@sevebois.be) at any time during your stay." }) },
      ],
    },
    {
      title: t({ fr: "Durabilité", en: "Sustainability", nl: "Sustainability" }),
      items: [
        { q: t({ fr: "Le cottage est-il vraiment éco-responsable ?", en: "Is the cottage truly eco-responsible?", nl: "Is the cottage truly eco-responsible?" }), a: t({ fr: "Oui. Le cottage est construit avec des matériaux naturels et éco-certifiés, alimenté à 100% par des énergies renouvelables, et conçu pour minimiser son impact environnemental. Ce n'est pas un argument marketing — c'est le fondement de notre projet.", en: "Yes. The cottage is built with natural, eco-certified materials, powered 100% by renewable energy, and designed to minimise its environmental impact. This is not a marketing argument — it is the foundation of our project.", nl: "Yes. The cottage is built with natural, eco-certified materials, powered 100% by renewable energy, and designed to minimise its environmental impact. This is not a marketing argument — it is the foundation of our project." }) },
        { q: t({ fr: "Avez-vous des certifications officielles ?", en: "Do you have official certifications?", nl: "Do you have official certifications?" }), a: t({ fr: "Nos cottages sont officiellement approuvés et licenciés par la commune locale, ce qui garantit le respect des réglementations en vigueur, y compris environnementales.", en: "Our cottages are officially approved and licensed by the local council, which guarantees compliance with current regulations, including environmental ones.", nl: "Our cottages are officially approved and licensed by the local council, which guarantees compliance with current regulations, including environmental ones." }) },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-16 text-white">
        <div className="container">
          <p className="text-caption text-[var(--ochre-300)] mb-3">FAQ</p>
          <h1 className="text-headline text-white">{t({ fr: "Questions fréquentes", en: "Frequently asked questions", nl: "Frequently asked questions" })}</h1>
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
          <h3 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "Vous n'avez pas trouvé votre réponse ?", en: "Didn't find your answer?", nl: "Didn't find your answer?" })}</h3>
          <p className="text-lead mb-6">{t({ fr: "Contactez-nous directement — nous répondons sous 24h.", en: "Contact us directly — we reply within 24 hours.", nl: "Contact us directly — we reply within 24 hours." })}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn-primary">{t({ fr: "Nous contacter", en: "Contact us", nl: "Contact us" })}</Link>
            <a href="https://wa.me/32467808179" target="_blank" rel="noopener noreferrer" className="btn-outline">{t({ fr: "WhatsApp", en: "WhatsApp", nl: "WhatsApp" })}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

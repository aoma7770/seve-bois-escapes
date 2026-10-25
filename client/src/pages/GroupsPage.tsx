import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "../../../shared/seo";

export default function GroupsPage() {
  const { lang, t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-16 text-white">
        <div className="container">
          <p className="text-caption text-[var(--ochre-300)] mb-3">{t({ fr: "Pour les groupes", en: "For groups", nl: "Voor groepen" })}</p>
          <h1 className="text-headline text-white">{t({ fr: "Gîte 12 personnes Ardennes", en: "Group accommodation in the Ardennes", nl: "Groepsaccommodatie Ardennen" })}</h1>
        </div>
      </div>
      <div className="container py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <section>
            <div className="divider-ochre mb-6" />
            <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "Tout le site, rien que pour vous", en: "The whole site, exclusively yours", nl: "Het hele terrein, exclusief voor u" })}</h2>
            <p className="text-lead mb-5">{t({ fr: "Réservez La Sève et Le Bois ensemble pour profiter exclusivement des deux cottages, du jardin et de l'espace extérieur. Rien n'est partagé : vous disposez d'un lieu privé pour les familles et les amis, avec une capacité de quatre à douze personnes.", en: "Book La Sève and Le Bois together for exclusive use of both cottages, the garden and outdoor space. Nothing is shared: you have a private setting for family and friends, with capacity for four to twelve guests.", nl: "Boek La Sève en Le Bois samen voor exclusief gebruik van beide cottages, de tuin en de buitenruimte. Er wordt niets gedeeld: u heeft een privéplek voor familie en vrienden, met plaats voor vier tot twaalf gasten." })}</p>
            <p className="text-[var(--slate-600)] mb-6">{t({ fr: "Chaque cottage dispose de deux chambres, d'une salle de bain, d'une cuisine et d'un espace de vie. Le total exact est calculé selon vos dates et le nombre de voyageurs sur la page de réservation.", en: "Each cottage has two bedrooms, one bathroom, a kitchen and a living area. The exact total is calculated from your dates and number of guests on the booking page.", nl: "Elke cottage heeft twee slaapkamers, één badkamer, een keuken en een leefruimte. Het exacte totaal wordt op de boekingspagina berekend op basis van uw data en aantal gasten." })}</p>
            <Link href="/booking?cottage=both" className="btn-primary">{t({ fr: "Vérifier les disponibilités", en: "Check availability", nl: "Beschikbaarheid controleren" })}</Link>
          </section>
          <aside className="bg-white rounded-2xl border border-[var(--cream-300)] p-8 shadow-sm">
            <h2 className="text-subheadline text-[var(--forest-950)] mb-5">{t({ fr: "Pour votre séjour", en: "For your stay", nl: "Voor uw verblijf" })}</h2>
            <ul className="space-y-3 text-sm text-[var(--slate-700)]">
              {[t({ fr: "4 à 12 voyageurs", en: "4–12 guests", nl: "4–12 gasten" }), t({ fr: "Deux cottages, jardin et extérieur en exclusivité", en: "Both cottages, garden and outdoor space exclusively", nl: "Beide cottages, tuin en buitenruimte exclusief" }), t({ fr: "Wi-Fi haut débit, chauffage central et eau chaude", en: "High-speed Wi-Fi, central heating and hot water", nl: "Snelle wifi, centrale verwarming en warm water" }), t({ fr: "Animaux acceptés : écrivez-nous avant de réserver avec le type et la taille", en: "Pets welcome: message us before booking with the type and size", nl: "Huisdieren welkom: stuur ons vóór het boeken het type en de grootte" })].map((item) => <li key={item} className="flex items-start gap-3"><span className="text-[var(--ochre-500)]">✓</span>{item}</li>)}
            </ul>
            <Link href={localizedPath("/contact", lang)} className="btn-outline w-full text-center mt-6">{t({ fr: "Nous contacter", en: "Contact us", nl: "Neem contact op" })}</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

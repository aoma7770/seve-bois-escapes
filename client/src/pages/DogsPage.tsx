import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "../../../shared/seo";

export default function DogsPage() {
  const { lang, t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-16 text-white">
        <div className="container">
          <p className="text-caption text-[var(--ochre-300)] mb-3">{t({ fr: "Animaux acceptés", en: "Pets welcome", nl: "Huisdieren welkom" })}</p>
          <h1 className="text-headline text-white">{t({ fr: "Gîte avec chien Ardennes", en: "Dog-friendly cottage in the Ardennes", nl: "Vakantiehuis Ardennen met hond" })}</h1>
        </div>
      </div>
      <div className="container py-16 max-w-4xl">
        <div className="divider-ochre mb-6" />
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "Venez avec votre animal", en: "Bring your pet", nl: "Breng uw huisdier mee" })}</h2>
        <p className="text-lead mb-6">{t({ fr: "Les animaux de compagnie sont acceptés dans nos deux cottages contemporains en bois à Laforêt. Pour nous permettre de préparer votre séjour, envoyez-nous un message avant de réserver en indiquant le type et la taille de votre animal.", en: "Pets are welcome at our two contemporary timber cottages in Laforêt. To help us prepare for your stay, message us before booking with the type and size of your pet.", nl: "Huisdieren zijn welkom in onze twee moderne houten cottages in Laforêt. Om uw verblijf goed voor te bereiden, stuurt u ons vóór het boeken een bericht met het type en de grootte van uw huisdier." })}</p>
        <p className="text-[var(--slate-600)] mb-8">{t({ fr: "Nous vous répondrons avec les informations nécessaires avant de confirmer votre réservation.", en: "We will reply with the information you need before you confirm your booking.", nl: "Wij antwoorden met de nodige informatie voordat u uw boeking bevestigt." })}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={localizedPath("/contact", lang)} className="btn-primary">{t({ fr: "Nous écrire", en: "Message us", nl: "Stuur ons een bericht" })}</Link>
          <Link href="/booking" className="btn-outline">{t({ fr: "Voir les disponibilités", en: "View availability", nl: "Beschikbaarheid bekijken" })}</Link>
        </div>
      </div>
    </div>
  );
}

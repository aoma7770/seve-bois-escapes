import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "../../../shared/seo";

export default function SustainabilityPage() {
  const { lang, t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-16 text-white">
        <div className="container">
          <p className="text-caption text-[var(--ochre-300)] mb-3">{t({ fr: "Le séjour", en: "The stay", nl: "Het verblijf" })}</p>
          <h1 className="text-headline text-white">{t({ fr: "Un confort simple au cœur de Laforêt", en: "Simple comfort in the heart of Laforêt", nl: "Eenvoudig comfort in het hart van Laforêt" })}</h1>
        </div>
      </div>
      <div className="container py-16 max-w-4xl">
        <div className="divider-ochre mb-6" />
        <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "Pensé pour ralentir", en: "Designed for slowing down", nl: "Ontworpen om te vertragen" })}</h2>
        <p className="text-lead mb-8">{t({ fr: "Les cottages sont entourés de forêt et de paysages de la vallée de la Semois. À l'intérieur, vous trouverez une cuisine équipée, du Wi-Fi haut débit, le chauffage central, l'eau chaude, le linge de lit et les serviettes, ainsi qu'un espace de vie confortable.", en: "The cottages are surrounded by woodland and Semois valley landscapes. Inside, you will find an equipped kitchen, high-speed Wi-Fi, central heating, hot water, bed linen and towels, plus a comfortable living area.", nl: "De cottages liggen tussen bos en landschappen van de Semoisvallei. Binnen vindt u een uitgeruste keuken, snelle wifi, centrale verwarming, warm water, bedlinnen en handdoeken, plus een comfortabele leefruimte." })}</p>
        <p className="text-lead mb-8">{t({ fr: "Le village et les activités de la région sont à découvrir à votre rythme. Les activités et services voisins sont indépendants : vérifiez leurs horaires, leurs saisons et leurs conditions avant de partir.", en: "Discover the village and the wider region at your own pace. Nearby activities and services are independently operated: check their opening times, seasons and conditions before you go.", nl: "Ontdek het dorp en de regio op uw eigen ritme. Nabije activiteiten en diensten worden onafhankelijk georganiseerd: controleer openingstijden, seizoenen en omstandigheden voordat u vertrekt." })}</p>
        <Link href={localizedPath("/location", lang)} className="btn-primary">{t({ fr: "Explorer Laforêt", en: "Explore Laforêt", nl: "Ontdek Laforêt" })}</Link>
      </div>
    </div>
  );
}

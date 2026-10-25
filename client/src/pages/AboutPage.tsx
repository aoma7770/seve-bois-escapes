import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "../../../shared/seo";

export default function AboutPage() {
  const { lang, t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="bg-[var(--forest-900)] py-16 text-white">
        <div className="container">
          <p className="text-caption text-[var(--ochre-300)] mb-3">{t({ fr: "À propos", en: "About", nl: "Over ons" })}</p>
          <h1 className="text-headline text-white">{t({ fr: "Sève & Bois Cottages à Laforêt : notre histoire", en: "Sève & Bois Cottages in Laforêt: about us", nl: "Sève & Bois Cottages in Laforêt: over ons" })}</h1>
        </div>
      </div>
      <div className="container py-16 max-w-4xl space-y-10">
        <section>
          <div className="divider-ochre mb-6" />
          <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "Deux cottages contemporains en bois", en: "Two contemporary timber cottages", nl: "Twee moderne houten cottages" })}</h2>
          <p className="text-lead">{t({ fr: "Green Cottages of Laforêt réunit La Sève et Le Bois, deux cottages contemporains en bois installés côte à côte sur un même site privé à Laforêt. Chaque cottage comprend deux chambres, une salle de bain, une cuisine et un espace de vie, pour accueillir jusqu'à six personnes.", en: "Green Cottages of Laforêt brings together La Sève and Le Bois, two contemporary timber cottages side by side on one private site in Laforêt. Each cottage has two bedrooms, one bathroom, a kitchen and a living area, sleeping up to six guests.", nl: "Green Cottages of Laforêt bestaat uit La Sève en Le Bois, twee moderne houten cottages naast elkaar op één privéterrein in Laforêt. Elke cottage heeft twee slaapkamers, één badkamer, een keuken en een leefruimte voor maximaal zes gasten." })}</p>
        </section>
        <section>
          <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "Un séjour à votre rythme", en: "A stay at your own pace", nl: "Een verblijf op uw eigen ritme" })}</h2>
          <p className="text-lead">{t({ fr: "Les deux cottages peuvent aussi être réservés ensemble pour profiter exclusivement des deux logements, du jardin et de l'espace extérieur, sans espace partagé, pour quatre à douze personnes. Le Wi-Fi haut débit, le chauffage central, l'eau chaude, la cuisine équipée, le linge de lit et les serviettes font partie des équipements approuvés du séjour.", en: "The two cottages can also be booked together for exclusive use of both homes, the garden and outdoor space, with nothing shared, for four to twelve guests. High-speed Wi-Fi, central heating, hot water, an equipped kitchen, bed linen and towels are among the approved facilities for your stay.", nl: "De twee cottages kunnen ook samen worden geboekt voor exclusief gebruik van beide woningen, de tuin en de buitenruimte, zonder gedeelde ruimtes, voor vier tot twaalf gasten. Snelle wifi, centrale verwarming, warm water, een uitgeruste keuken, bedlinnen en handdoeken behoren tot de goedgekeurde voorzieningen." })}</p>
        </section>
        <section className="bg-[var(--forest-50)] rounded-2xl p-8">
          <h2 className="text-subheadline text-[var(--forest-950)] mb-4">{t({ fr: "Laforêt et la vallée", en: "Laforêt and the valley", nl: "Laforêt en de vallei" })}</h2>
          <p className="text-lead mb-6">{t({ fr: "Le village de Laforêt, à Vresse-sur-Semois, offre un point de départ pour découvrir les maisons en schiste, l'église Sainte-Agathe, les séchoirs à tabac, les lavoirs, les fontaines et les promenades locales. Les activités voisines sont indépendantes : vérifiez leurs saisons, horaires et conditions.", en: "The village of Laforêt, in Vresse-sur-Semois, offers a base for discovering schist farmhouses, St Agatha's church, tobacco-drying sheds, washhouses, fountains and local walks. Nearby experiences are independently operated, so check their seasons, opening times and conditions.", nl: "Het dorp Laforêt in Vresse-sur-Semois is een uitvalsbasis om vakwerkhuizen in leisteen, de Sint-Agathakerk, tabaksschuren, wasplaatsen, fonteinen en lokale wandelingen te ontdekken. Nabije ervaringen worden onafhankelijk georganiseerd; controleer seizoenen, openingstijden en omstandigheden." })}</p>
          <Link href={localizedPath("/location", lang)} className="btn-outline">{t({ fr: "Découvrir le lieu", en: "Discover the location", nl: "Ontdek de locatie" })}</Link>
        </section>
      </div>
    </div>
  );
}

export type SeoLanguage = "fr" | "nl" | "en";

export const SEO_LANGUAGES: SeoLanguage[] = ["fr", "nl", "en"];
export const SEO_SITE_URL = "https://www.sevebois.be";
export const SEO_BRAND_REFERENCE = "Green Cottages of Laforêt";
export const SEO_BUSINESS_NAME = "Sève & Bois Cottages";

export interface SeoPage {
  key: string;
  lang: SeoLanguage;
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  primaryKeyword: string;
  noindex?: boolean;
}

const pages: SeoPage[] = [
  {
    key: "home",
    lang: "fr",
    path: "/fr/",
    title: "Gîte Ardennes à Laforêt | Deux gîtes en bois | Sève & Bois",
    description: "Gîte Ardennes à Laforêt : deux gîtes contemporains en bois, jusqu'à 12 personnes, dans la vallée de la Semois. Réservez en direct.",
    h1: "Gîte Ardennes à Laforêt",
    intro: "Bienvenue chez Green Cottages of Laforêt : deux gîtes contemporains en bois, La Sève et Le Bois, au cœur de Laforêt.",
    primaryKeyword: "gîte Ardennes",
  },
  {
    key: "home",
    lang: "nl",
    path: "/nl/",
    title: "Vakantiehuis Ardennen | 2 houten cottages | Sève & Bois",
    description: "Vakantiehuis Ardennen in Laforêt: twee moderne houten cottages voor 2 tot 12 personen in de Semoisvallei. Boek direct bij de eigenaars.",
    h1: "Vakantiehuis Ardennen in Laforêt",
    intro: "Welkom bij Green Cottages of Laforêt: twee moderne houten cottages, La Sève en Le Bois, midden in Laforêt.",
    primaryKeyword: "vakantiehuis Ardennen",
  },
  {
    key: "home",
    lang: "en",
    path: "/en/",
    title: "Ardennes Cottage in Laforêt | Timber Cottages | Sève & Bois",
    description: "Ardennes cottage in Laforêt: two contemporary timber cottages for up to 12 guests in the Semois Valley. Book direct with your hosts.",
    h1: "Ardennes cottage in Laforêt",
    intro: "Welcome to Green Cottages of Laforêt: two contemporary timber cottages, La Sève and Le Bois, in the heart of Laforêt.",
    primaryKeyword: "Ardennes cottage",
  },
  {
    key: "la-seve",
    lang: "fr",
    path: "/fr/la-seve",
    title: "Gîte 2 personnes Ardennes | La Sève à Laforêt | Sève & Bois",
    description: "Gîte 2 personnes Ardennes : La Sève, gîte en bois lumineux à Laforêt, 2 chambres, jusqu'à 6 personnes. Réservez en direct.",
    h1: "Gîte 2 personnes Ardennes : La Sève",
    intro: "Découvrez La Sève, l'un des deux gîtes contemporains en bois de Green Cottages of Laforêt.",
    primaryKeyword: "gîte 2 personnes Ardennes",
  },
  {
    key: "la-seve",
    lang: "nl",
    path: "/nl/la-seve",
    title: "Vakantiehuis Ardennen 2 personen | La Sève | Sève & Bois",
    description: "Vakantiehuis Ardennen 2 personen: La Sève, lichte houten cottage in Laforêt met 2 slaapkamers, tot 6 gasten. Boek direct bij ons.",
    h1: "Vakantiehuis Ardennen 2 personen: La Sève",
    intro: "Ontdek La Sève, een van de twee moderne houten cottages van Green Cottages of Laforêt.",
    primaryKeyword: "vakantiehuis Ardennen 2 personen",
  },
  {
    key: "la-seve",
    lang: "en",
    path: "/en/la-seve",
    title: "Cottage for Two in the Ardennes | La Sève | Sève & Bois",
    description: "Cottage for two in the Ardennes: La Sève, a light-filled timber cottage in Laforêt with 2 bedrooms, sleeping up to 6. Book direct.",
    h1: "Cottage for two in the Ardennes: La Sève",
    intro: "Discover La Sève, one of the two contemporary timber cottages at Green Cottages of Laforêt.",
    primaryKeyword: "cottage for two Ardennes",
  },
  {
    key: "le-bois",
    lang: "fr",
    path: "/fr/le-bois",
    title: "Gîte 6 personnes Ardennes | Le Bois à Laforêt | Sève & Bois",
    description: "Gîte 6 personnes Ardennes : Le Bois, gîte en bois à Laforêt avec 2 chambres, canapé-lit et grand séjour-repas. Réservez en direct.",
    h1: "Gîte 6 personnes Ardennes : Le Bois",
    intro: "Découvrez Le Bois, l'un des deux gîtes contemporains en bois de Green Cottages of Laforêt.",
    primaryKeyword: "gîte 6 personnes Ardennes",
  },
  {
    key: "le-bois",
    lang: "nl",
    path: "/nl/le-bois",
    title: "Vakantiehuis Ardennen 6 personen | Le Bois | Sève & Bois",
    description: "Vakantiehuis Ardennen 6 personen: Le Bois, houten cottage in Laforêt met 2 slaapkamers, slaapbank en ruime woon-eetruimte. Boek direct bij ons.",
    h1: "Vakantiehuis Ardennen 6 personen: Le Bois",
    intro: "Ontdek Le Bois, een van de twee moderne houten cottages van Green Cottages of Laforêt.",
    primaryKeyword: "vakantiehuis Ardennen 6 personen",
  },
  {
    key: "le-bois",
    lang: "en",
    path: "/en/le-bois",
    title: "6-Person Cottage in the Ardennes | Le Bois | Sève & Bois",
    description: "6-person cottage in the Ardennes: Le Bois, a timber cottage in Laforêt with 2 bedrooms, a sofa bed and an open living-dining space. Book direct.",
    h1: "6-person cottage in the Ardennes: Le Bois",
    intro: "Discover Le Bois, one of the two contemporary timber cottages at Green Cottages of Laforêt.",
    primaryKeyword: "6-person cottage Ardennes",
  },
  {
    key: "groups",
    lang: "fr",
    path: "/fr/gite-12-personnes-ardennes",
    title: "Gîte 12 personnes Ardennes | Site privé entier | Sève & Bois",
    description: "Gîte 12 personnes Ardennes : réservez nos deux gîtes en bois à Laforêt et profitez seuls de tout le site privé. Familles et amis. Réservez en direct.",
    h1: "Gîte 12 personnes Ardennes",
    intro: "Réservez les deux gîtes de Green Cottages of Laforêt pour profiter en exclusivité du site privé, du jardin et de l'espace extérieur.",
    primaryKeyword: "gîte 12 personnes Ardennes",
  },
  {
    key: "groups",
    lang: "nl",
    path: "/nl/groepsaccommodatie-ardennen",
    title: "Groepsaccommodatie Ardennen | Tot 12 gasten | Sève & Bois",
    description: "Groepsaccommodatie Ardennen: huur beide houten cottages in Laforêt en heb het hele privéterrein voor jezelf, tot 12 personen. Boek direct bij ons.",
    h1: "Groepsaccommodatie Ardennen",
    intro: "Boek beide cottages van Green Cottages of Laforêt en geniet exclusief van het privédomein, de tuin en de buitenruimte.",
    primaryKeyword: "groepsaccommodatie Ardennen",
  },
  {
    key: "groups",
    lang: "en",
    path: "/en/group-accommodation-ardennes",
    title: "Group Accommodation Ardennes | Sleeps 12 | Sève & Bois",
    description: "Group accommodation in the Ardennes: book both timber cottages in Laforêt and have the whole private site for up to 12 guests. Book direct with us.",
    h1: "Group accommodation in the Ardennes",
    intro: "Book both cottages at Green Cottages of Laforêt for exclusive use of the private site, garden and outdoor space.",
    primaryKeyword: "group accommodation Ardennes",
  },
  {
    key: "dogs",
    lang: "fr",
    path: "/fr/gite-chien-ardennes",
    title: "Gîte avec chien Ardennes | Laforêt, Semois | Sève & Bois",
    description: "Gîte avec chien Ardennes : venez avec votre chien dans nos gîtes en bois à Laforêt, dans la vallée de la Semois. Réservez en direct.",
    h1: "Gîte avec chien Ardennes",
    intro: "Green Cottages of Laforêt accueille les animaux de compagnie : écrivez-nous avant de réserver avec le type et la taille de votre animal.",
    primaryKeyword: "gîte avec chien Ardennes",
  },
  {
    key: "dogs",
    lang: "nl",
    path: "/nl/vakantiehuis-ardennen-hond",
    title: "Vakantiehuis Ardennen met hond | Laforêt | Sève & Bois",
    description: "Vakantiehuis Ardennen met hond: neem je hond mee naar onze houten cottages in Laforêt, in de Semoisvallei. Boek direct bij ons.",
    h1: "Vakantiehuis Ardennen met hond",
    intro: "Huisdieren zijn welkom bij Green Cottages of Laforêt: stuur ons vóór het boeken het type en de grootte van uw huisdier.",
    primaryKeyword: "vakantiehuis Ardennen met hond",
  },
  {
    key: "dogs",
    lang: "en",
    path: "/en/dog-friendly-cottage-ardennes",
    title: "Dog-Friendly Cottage Ardennes | Laforêt | Sève & Bois",
    description: "Dog-friendly cottage Ardennes: bring your dog to our timber cottages in Laforêt, in the Semois Valley. Book direct with your hosts.",
    h1: "Dog-friendly cottage in the Ardennes",
    intro: "Pets are welcome at Green Cottages of Laforêt: message us before booking with the type and size of your pet.",
    primaryKeyword: "pet-friendly cottage Ardennes",
  },
  {
    key: "location",
    lang: "fr",
    path: "/fr/gite-vresse-sur-semois",
    title: "Gîte Vresse-sur-Semois | Laforêt, Ardennes | Sève & Bois",
    description: "Gîte Vresse-sur-Semois : séjournez à Laforêt, l'un des Plus Beaux Villages de Wallonie, entre forêts et balades balisées. Réservez en direct.",
    h1: "Gîte Vresse-sur-Semois : Laforêt et la vallée",
    intro: "Green Cottages of Laforêt se trouve à Laforêt, 5550 Vresse-sur-Semois, dans les Ardennes belges.",
    primaryKeyword: "gîte Vresse-sur-Semois",
  },
  {
    key: "location",
    lang: "nl",
    path: "/nl/vakantiehuis-vresse-sur-semois",
    title: "Vakantiehuis Vresse-sur-Semois | Laforêt | Sève & Bois",
    description: "Vakantiehuis Vresse-sur-Semois: verblijf in Laforêt, een van de Mooiste Dorpen van Wallonië, tussen bossen en wandelroutes. Boek direct bij ons.",
    h1: "Vakantiehuis Vresse-sur-Semois: Laforêt en de vallei",
    intro: "Green Cottages of Laforêt ligt in Laforêt, 5550 Vresse-sur-Semois, in de Belgische Ardennen.",
    primaryKeyword: "vakantiehuis Vresse-sur-Semois",
  },
  {
    key: "location",
    lang: "en",
    path: "/en/vresse-sur-semois-cottage",
    title: "Cottage Vresse-sur-Semois | Laforêt, Ardennes | Sève & Bois",
    description: "Cottage in Vresse-sur-Semois: stay in Laforêt, one of the Most Beautiful Villages of Wallonia, with forest trails nearby. Book direct.",
    h1: "Cottage Vresse-sur-Semois: Laforêt and the valley",
    intro: "Green Cottages of Laforêt is in Laforêt, 5550 Vresse-sur-Semois, in the Belgian Ardennes.",
    primaryKeyword: "Vresse-sur-Semois cottage",
  },
  {
    key: "about",
    lang: "fr",
    path: "/fr/a-propos",
    title: "Sève & Bois Cottages | À propos de Laforêt, Ardennes",
    description: "À propos de Sève & Bois Cottages : deux gîtes en bois contemporains à Laforêt, dans les Ardennes belges. Découvrez notre univers et réservez en direct.",
    h1: "Sève & Bois Cottages à Laforêt : notre histoire",
    intro: "Green Cottages of Laforêt réunit deux gîtes contemporains en bois : La Sève et Le Bois.",
    primaryKeyword: "Sève & Bois Cottages",
  },
  {
    key: "about",
    lang: "nl",
    path: "/nl/over-ons",
    title: "Sève & Bois Cottages | Over ons in Laforêt, Ardennen",
    description: "Over Sève & Bois Cottages: twee eigentijdse houten vakantiehuisjes in Laforêt, in de Ardennen. Ontdek ons verhaal en boek vandaag rechtstreeks.",
    h1: "Sève & Bois Cottages in Laforêt: over ons",
    intro: "Green Cottages of Laforêt bestaat uit twee moderne houten cottages: La Sève en Le Bois.",
    primaryKeyword: "Sève & Bois Cottages",
  },
  {
    key: "about",
    lang: "en",
    path: "/en/about",
    title: "Sève & Bois Cottages | About Laforêt, Ardennes",
    description: "About Sève & Bois Cottages: two contemporary timber cottages in Laforêt, in the Belgian Ardennes. Discover our setting and book your stay direct.",
    h1: "Sève & Bois Cottages in Laforêt: about us",
    intro: "Green Cottages of Laforêt brings together two contemporary timber cottages: La Sève and Le Bois.",
    primaryKeyword: "Sève & Bois Cottages",
  },
  {
    key: "rates",
    lang: "fr",
    path: "/fr/tarifs",
    title: "Gîte Ardennes : tarifs à Laforêt | Sève & Bois Cottages",
    description: "Gîte Ardennes à Laforêt : consultez les tarifs dès 150 € par cottage et par nuit, puis obtenez le total selon vos dates et vos voyageurs. Réservez en direct.",
    h1: "Gîte Ardennes à Laforêt : tarifs",
    intro: "Consultez les tarifs de Green Cottages of Laforêt et calculez le total exact selon vos dates et le nombre de voyageurs.",
    primaryKeyword: "gîte Ardennes",
  },
  {
    key: "rates",
    lang: "nl",
    path: "/nl/prijzen",
    title: "Vakantiehuis Ardennen: prijzen in Laforêt | Sève & Bois",
    description: "Vakantiehuis Ardennen in Laforêt: bekijk tarieven vanaf €150 per cottage per nacht, plus €40 per extra gast. Bereken uw totaal en boek direct.",
    h1: "Vakantiehuis Ardennen in Laforêt: prijzen",
    intro: "Bekijk de tarieven van Green Cottages of Laforêt en bereken het exacte totaal voor uw data en aantal gasten.",
    primaryKeyword: "vakantiehuis Ardennen",
  },
  {
    key: "rates",
    lang: "en",
    path: "/en/rates",
    title: "Ardennes cottage rates in Laforêt | Sève & Bois Cottages",
    description: "Ardennes cottage rates in Laforêt: from €150 per cottage per night, plus €40 per extra guest. See your exact total for your dates and book direct.",
    h1: "Ardennes cottage in Laforêt: rates",
    intro: "See Green Cottages of Laforêt rates and calculate the exact total for your dates and number of guests.",
    primaryKeyword: "Ardennes cottage",
  },
  {
    key: "faq",
    lang: "fr",
    path: "/fr/faq",
    title: "Gîte Ardennes | FAQ Sève & Bois Cottages à Laforêt",
    description: "Gîte Ardennes à Laforêt : réponses sur la réservation, les cottages, l’arrivée, les animaux et le séjour. Consultez la FAQ et réservez en direct.",
    h1: "Gîte Ardennes à Laforêt",
    intro: "Retrouvez les réponses aux questions fréquentes sur Green Cottages of Laforêt, la réservation et votre séjour.",
    primaryKeyword: "gîte Ardennes",
  },
  {
    key: "faq",
    lang: "nl",
    path: "/nl/faq",
    title: "Vakantiehuis Ardennen | FAQ Sève & Bois in Laforêt",
    description: "Vakantiehuis Ardennen in Laforêt: antwoorden over boeken, cottages, aankomst, huisdieren en verblijf. Bekijk de FAQ en boek direct bij Sève & Bois.",
    h1: "Vakantiehuis Ardennen in Laforêt",
    intro: "Lees de antwoorden op veelgestelde vragen over Green Cottages of Laforêt, boeken en uw verblijf.",
    primaryKeyword: "vakantiehuis Ardennen",
  },
  {
    key: "faq",
    lang: "en",
    path: "/en/faq",
    title: "Ardennes Cottage FAQ | Sève & Bois in Laforêt",
    description: "Ardennes cottage in Laforêt: answers about booking, cottages, arrival, pets and your stay. Read the FAQ and book direct with Sève & Bois Cottages.",
    h1: "Ardennes cottage in Laforêt",
    intro: "Find answers about Green Cottages of Laforêt, booking, arrival, amenities, pets and your stay.",
    primaryKeyword: "Ardennes cottage",
  },
  {
    key: "contact",
    lang: "fr",
    path: "/fr/contact",
    title: "Contact Sève & Bois Cottages à Laforêt | Ardennes",
    description: "Contact Sève & Bois Cottages à Laforêt : posez vos questions sur les deux gîtes contemporains et votre séjour. Écrivez-nous ou appelez le +32 467 80 81 79.",
    h1: "Contact Sève & Bois Cottages à Laforêt",
    intro: "Contactez Green Cottages of Laforêt pour préparer votre séjour à Laforêt, Vresse-sur-Semois.",
    primaryKeyword: "Contact Sève & Bois Cottages",
  },
  {
    key: "contact",
    lang: "nl",
    path: "/nl/contact",
    title: "Contact Sève & Bois Cottages in Laforêt | Ardennen",
    description: "Contact Sève & Bois Cottages in Laforêt: stel uw vragen over de twee moderne houten cottages en uw verblijf. Mail of bel +32 467 80 81 79.",
    h1: "Contact Sève & Bois Cottages in Laforêt",
    intro: "Neem contact op met Green Cottages of Laforêt voor uw verblijf in Laforêt, Vresse-sur-Semois.",
    primaryKeyword: "Contact Sève & Bois Cottages",
  },
  {
    key: "contact",
    lang: "en",
    path: "/en/contact",
    title: "Contact Sève & Bois Cottages in Laforêt | Ardennes",
    description: "Contact Sève & Bois Cottages in Laforêt: ask about the two contemporary timber cottages and your stay. Email us or call +32 467 80 81 79 today.",
    h1: "Contact Sève & Bois Cottages in Laforêt",
    intro: "Contact Green Cottages of Laforêt about your stay in Laforêt, Vresse-sur-Semois.",
    primaryKeyword: "Contact Sève & Bois Cottages",
  },
  {
    key: "terms",
    lang: "en",
    path: "/terms",
    title: "Booking Terms | Sève & Bois Cottages",
    description: "Read the booking terms, cancellation information and house rules for Sève & Bois Cottages in Laforêt.",
    h1: "Booking terms",
    intro: "The booking terms and house rules for your stay at Sève & Bois Cottages.",
    primaryKeyword: "Sève & Bois booking terms",
  },
  {
    key: "privacy",
    lang: "en",
    path: "/privacy",
    title: "Privacy Policy | Sève & Bois Cottages",
    description: "Read the privacy policy for Sève & Bois Cottages and learn how enquiry, booking and consent data are handled.",
    h1: "Privacy policy",
    intro: "How Sève & Bois Cottages handles personal data and consent.",
    primaryKeyword: "Sève & Bois privacy policy",
  },
  {
    key: "cookies",
    lang: "en",
    path: "/cookies",
    title: "Cookie Policy | Sève & Bois Cottages",
    description: "Learn how Sève & Bois Cottages uses essential and consent-based analytics cookies on this website.",
    h1: "Cookie policy",
    intro: "Information about cookies and consent on the Sève & Bois Cottages website.",
    primaryKeyword: "Sève & Bois cookie policy",
  },
];

export const SEO_PAGES = pages;
export const SEO_PAGE_BY_PATH = new Map(pages.map((page) => [page.path, page]));

export function getSeoPage(pathname: string): SeoPage | undefined {
  return SEO_PAGE_BY_PATH.get(pathname);
}

export function getLanguageFromPath(pathname: string): SeoLanguage | undefined {
  const segment = pathname.split("/")[1];
  return segment === "fr" || segment === "nl" || segment === "en" ? segment : undefined;
}

export function localizedPath(pathname: string, lang: SeoLanguage): string {
  if (pathname === "/" || pathname === "/fr/" || pathname === "/nl/" || pathname === "/en/") return `/${lang}/`;
  if (pathname.startsWith("/booking") || pathname.startsWith("/admin") || pathname === "/terms" || pathname === "/privacy" || pathname === "/cookies") return pathname;
  const withoutLanguage = pathname.replace(/^\/(fr|nl|en)(?=\/|$)/, "");
  const routeMap: Record<string, Record<SeoLanguage, string>> = {
    "/cottages/la-seve": { fr: "/fr/la-seve", nl: "/nl/la-seve", en: "/en/la-seve" },
    "/la-seve": { fr: "/fr/la-seve", nl: "/nl/la-seve", en: "/en/la-seve" },
    "/cottages/le-bois": { fr: "/fr/le-bois", nl: "/nl/le-bois", en: "/en/le-bois" },
    "/le-bois": { fr: "/fr/le-bois", nl: "/nl/le-bois", en: "/en/le-bois" },
    "/location": { fr: "/fr/gite-vresse-sur-semois", nl: "/nl/vakantiehuis-vresse-sur-semois", en: "/en/vresse-sur-semois-cottage" },
    "/rates": { fr: "/fr/tarifs", nl: "/nl/prijzen", en: "/en/rates" },
    "/faq": { fr: "/fr/faq", nl: "/nl/faq", en: "/en/faq" },
    "/contact": { fr: "/fr/contact", nl: "/nl/contact", en: "/en/contact" },
    "/about": { fr: "/fr/a-propos", nl: "/nl/over-ons", en: "/en/about" },
    "/groups": { fr: "/fr/gite-12-personnes-ardennes", nl: "/nl/groepsaccommodatie-ardennen", en: "/en/group-accommodation-ardennes" },
    "/dogs": { fr: "/fr/gite-chien-ardennes", nl: "/nl/vakantiehuis-ardennen-hond", en: "/en/dog-friendly-cottage-ardennes" },
  };
  return routeMap[withoutLanguage]?.[lang] ?? `/${lang}${withoutLanguage || "/"}`;
}

export function getAlternateLinks(page: SeoPage): Array<{ lang: string; href: string }> {
  return SEO_PAGES.filter((candidate) => candidate.key === page.key).map((candidate) => ({
    lang: candidate.lang,
    href: `${SEO_SITE_URL}${candidate.path}`,
  }));
}

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Wifi, Flame, Car, Utensils, Droplets, Leaf, Users, Bed, Bath, ChevronLeft, ChevronRight, X, Calendar } from "lucide-react";
import { COTTAGE1_IMAGES, COTTAGE2_IMAGES, HERO_EXTERIOR, COTTAGE2_EXTERIOR, LIVING_ROOM_C1, COTTAGE2_LIVING, BEDROOM_C1, KITCHEN_C1, BATHROOM_C1 } from "../../../shared/images";

interface Props { slug: string; }

const COTTAGE_DATA = {
  "la-seve": {
    images: [HERO_EXTERIOR, LIVING_ROOM_C1, BEDROOM_C1, KITCHEN_C1, BATHROOM_C1, ...COTTAGE1_IMAGES.slice(5, 12)],
    capacity: 6, bedrooms: 2, bathrooms: 1, living_areas: 1,
    amenities: [
      { icon: Wifi, fr: "Wifi haut débit", en: "High-speed Wifi", be: "Snelle WiFi" },
      { icon: Flame, fr: "Chauffage inclus", en: "Heating included", be: "Verwarming inbegrepen" },
      { icon: Utensils, fr: "Cuisine équipée", en: "Fully equipped kitchen", be: "Volledig uitgeruste keuken" },
      { icon: Droplets, fr: "Eau chaude", en: "Hot water", be: "Warm water" },
      { icon: Car, fr: "Parking gratuit", en: "Free parking", be: "Gratis parkeren" },
      { icon: Leaf, fr: "Énergie renouvelable", en: "Renewable energy", be: "Hernieuwbare energie" },
    ],
    kitchen_amenities: [
      { fr: "Machine à café", en: "Coffee machine", be: "Koffiezetapparaat" },
      { fr: "Lave-linge", en: "Washing machine", be: "Wasmachine" },
      { fr: "Sèche-linge", en: "Dryer", be: "Droger" },
      { fr: "Lave-vaisselle", en: "Dishwasher", be: "Vaatwasser" },
      { fr: "Réfrigérateur", en: "Refrigerator", be: "Koelkast" },
      { fr: "Four", en: "Oven", be: "Oven" },
      { fr: "Plaques de cuisson", en: "Stove", be: "Kookplaat" },
      { fr: "Ustensiles de cuisine", en: "Kitchen utensils", be: "Keukengerei" },
    ],
    priceFrom: 150,
  },
  "le-bois": {
    images: [COTTAGE2_EXTERIOR, COTTAGE2_LIVING, ...COTTAGE2_IMAGES.slice(2, 10)],
    capacity: 6, bedrooms: 2, bathrooms: 1, living_areas: 1,
    amenities: [
      { icon: Wifi, fr: "Wifi haut débit", en: "High-speed Wifi", be: "Snelle WiFi" },
      { icon: Flame, fr: "Chauffage inclus", en: "Heating included", be: "Verwarming inbegrepen" },
      { icon: Utensils, fr: "Cuisine équipée", en: "Fully equipped kitchen", be: "Volledig uitgeruste keuken" },
      { icon: Droplets, fr: "Eau chaude", en: "Hot water", be: "Warm water" },
      { icon: Car, fr: "Parking gratuit", en: "Free parking", be: "Gratis parkeren" },
      { icon: Leaf, fr: "Énergie renouvelable", en: "Renewable energy", be: "Hernieuwbare energie" },
    ],
    kitchen_amenities: [
      { fr: "Machine à café", en: "Coffee machine", be: "Koffiezetapparaat" },
      { fr: "Lave-linge", en: "Washing machine", be: "Wasmachine" },
      { fr: "Sèche-linge", en: "Dryer", be: "Droger" },
      { fr: "Lave-vaisselle", en: "Dishwasher", be: "Vaatwasser" },
      { fr: "Réfrigérateur", en: "Refrigerator", be: "Koelkast" },
      { fr: "Four", en: "Oven", be: "Oven" },
      { fr: "Plaques de cuisson", en: "Stove", be: "Kookplaat" },
      { fr: "Ustensiles de cuisine", en: "Kitchen utensils", be: "Keukengerei" },
    ],
    priceFrom: 150,
  },
};

export default function CottagePage({ slug }: Props) {
  const { t } = useLanguage();
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { data: cottage } = trpc.cottages.bySlug.useQuery({ slug });
  const data = COTTAGE_DATA[slug as keyof typeof COTTAGE_DATA];

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!data) return null;

  const images = data.images;
  const name = slug === "la-seve" ? "La Sève" : "Le Bois";

  const prev = () => setGalleryIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setGalleryIndex((i) => (i + 1) % images.length);

  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      {/* Hero gallery */}
      <div className="relative h-[60vh] md:h-[75vh] overflow-hidden bg-[var(--forest-900)]">
        <img
          src={images[galleryIndex]}
          alt={`${name} — photo ${galleryIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />

        {/* Gallery controls */}
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors">
          <ChevronRight size={20} />
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-black/40 text-white text-xs px-3 py-1 rounded-full">
          {galleryIndex + 1} / {images.length}
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-8 left-8">
          <p className="text-caption text-[var(--ochre-300)] mb-2">{t({ fr: "Sève & Bois Escapes", en: "Sève & Bois Escapes", be: "Sève & Bois Escapes" })}</p>
          <h1 className="text-display text-white">{name}</h1>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="bg-[var(--forest-950)] py-3 overflow-x-auto">
        <div className="flex gap-2 px-4 w-max mx-auto">
          {images.slice(0, 10).map((img, i) => (
            <button
              key={i}
              onClick={() => setGalleryIndex(i)}
              className={`w-16 h-12 rounded overflow-hidden shrink-0 transition-all ${i === galleryIndex ? "ring-2 ring-[var(--ochre-400)]" : "opacity-60 hover:opacity-90"}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <div>
              <div className="divider-ochre mb-4" />
              <h2 className="text-headline text-[var(--forest-950)] mb-4">
                {slug === "la-seve"
                  ? t({ fr: "Un cottage pensé pour la nature — et pour vous.", en: "A cottage built for nature — and for you.", be: "A cottage built for nature — and for you." })
                  : t({ fr: "Plus d'espace. Même esprit.", en: "More space. Same spirit.", be: "More space. Same spirit." })}
              </h2>
              <p className="text-lead mb-4">
                {slug === "la-seve"
                  ? t({ fr: "La Sève est notre premier cottage — intime, chaleureux, et tourné vers la forêt. Deux chambres, une cuisine complète, une salle de bain aux carreaux vert forêt, et des baies vitrées qui ouvrent sur la nature. Tout est là. Il ne vous reste qu'à arriver.", en: "La Sève is our first cottage — intimate, warm, and facing the forest. Two bedrooms, a full kitchen, a bathroom with forest-green tiles, and floor-to-ceiling glazing opening onto nature. Everything is here. All you need to do is arrive.", be: "La Sève is our first cottage — intimate, warm, and facing the forest. Two bedrooms, a full kitchen, a bathroom with forest-green tiles, and floor-to-ceiling glazing opening onto nature. Everything is here. All you need to do is arrive." })
                  : t({ fr: "Le Bois accueille jusqu'à six personnes dans un espace plus généreux, avec trois chambres et deux salles de bain. Idéal pour les familles ou les groupes d'amis. Le même esprit éco-luxe, avec davantage de place pour respirer.", en: "Le Bois welcomes up to six guests in a more generous space, with three bedrooms and two bathrooms. Ideal for families or groups of friends. The same eco-luxe spirit, with more room to breathe.", be: "Le Bois welcomes up to six guests in a more generous space, with three bedrooms and two bathrooms. Ideal for families or groups of friends. The same eco-luxe spirit, with more room to breathe." })}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 mt-6">
                {[
                  { icon: Users, label: t({ fr: `${data.capacity} personnes`, en: `${data.capacity} guests`, be: `${data.capacity} gasten` }) },
                  { icon: Bed, label: t({ fr: `${data.bedrooms} chambres`, en: `${data.bedrooms} bedrooms`, be: `${data.bedrooms} slaapkamers` }) },
                  { icon: Bath, label: t({ fr: `${data.bathrooms} salle${data.bathrooms > 1 ? "s" : ""} de bain`, en: `${data.bathrooms} bathroom${data.bathrooms > 1 ? "s" : ""}`, be: `${data.bathrooms} badkamer${data.bathrooms > 1 ? "s" : ""}` }) },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-[var(--forest-700)]">
                    <Icon size={18} />
                    <span className="text-sm font-semibold">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-subheadline text-[var(--forest-950)] mb-6">
                {t({ fr: "Équipements inclus", en: "What's included", be: "What's included" })}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {data.amenities.map(({ icon: Icon, fr, en }) => (
                  <div key={fr} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[var(--cream-300)]">
                    <div className="w-9 h-9 rounded-lg bg-[var(--forest-50)] flex items-center justify-center text-[var(--forest-600)]">
                      <Icon size={18} />
                    </div>
                    <span className="text-sm font-medium text-[var(--forest-800)]">{t({ fr, en, be: en })}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House rules */}
            <div className="bg-[var(--forest-50)] rounded-2xl p-8">
              <h3 className="text-subheadline text-[var(--forest-950)] mb-4">
                {t({ fr: "Règlement intérieur", en: "House rules", be: "House rules" })}
              </h3>
              <ul className="space-y-2 text-sm text-[var(--slate-700)]">
                {[
                  t({ fr: "Arrivée à partir de 16h, départ avant 11h", en: "Check-in from 4pm, check-out before 11am", be: "Check-in from 4pm, check-out before 11am" }),
                  t({ fr: "Animaux acceptés sur demande", en: "Pets welcome on request", be: "Pets welcome on request" }),
                  t({ fr: "Non-fumeur à l'intérieur", en: "Non-smoking indoors", be: "Non-smoking indoors" }),
                  t({ fr: "Séjour minimum 2 nuits", en: "Minimum 2-night stay", be: "Minimum 2-night stay" }),
                  t({ fr: "Respect du voisinage et de la nature", en: "Respect for neighbours and nature", be: "Respect for neighbours and nature" }),
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-2">
                    <span className="text-[var(--ochre-500)] mt-0.5">·</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Eco features */}
            <div>
              <h3 className="text-subheadline text-[var(--forest-950)] mb-4">
                {t({ fr: "Engagement éco-responsable", en: "Eco commitment", be: "Eco commitment" })}
              </h3>
              <p className="text-lead">
                {t({ fr: "Ce cottage est construit avec des matériaux naturels et éco-certifiés. Il est alimenté à 100% par des énergies renouvelables. Séjourner ici, c'est choisir la nature sans compromis.", en: "This cottage is built with natural, eco-certified materials and powered 100% by renewable energy. Staying here means choosing nature without compromise.", be: "This cottage is built with natural, eco-certified materials and powered 100% by renewable energy. Staying here means choosing nature without compromise." })}
              </p>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-[var(--cream-300)] overflow-hidden">
              <div className="bg-[var(--forest-700)] p-6 text-white">
                <p className="text-caption text-[var(--forest-300)] mb-1">{t({ fr: "À partir de", en: "From", be: "From" })}</p>
                <div className="text-4xl font-serif font-bold">€{data.priceFrom}</div>
                <p className="text-sm text-[var(--forest-300)] mt-1">{t({ fr: "/ nuit", en: "/ night", be: "/ night" })}</p>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-[var(--slate-600)]">
                  {t({ fr: "Réservez en direct pour le meilleur tarif. Pas de frais de plateforme.", en: "Book direct for the best rate. No platform fees.", be: "Book direct for the best rate. No platform fees." })}
                </p>
                <Link
                  href={`/booking?cottage=${slug}`}
                  className="btn-primary w-full text-center flex items-center justify-center gap-2"
                >
                  <Calendar size={16} />
                  {t({ fr: "Vérifier les disponibilités", en: "Check availability", be: "Check availability" })}
                </Link>
                <Link
                  href="/contact"
                  className="btn-outline w-full text-center"
                >
                  {t({ fr: "Envoyer une demande", en: "Send an enquiry", be: "Send an enquiry" })}
                </Link>
                <div className="pt-2 border-t border-[var(--cream-200)]">
                  <div className="flex items-center gap-2 text-xs text-[var(--slate-500)]">
                    <span>🔒</span>
                    {t({ fr: "Paiement sécurisé via Stripe", en: "Secure payment via Stripe", be: "Secure payment via Stripe" })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

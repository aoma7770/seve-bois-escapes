import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/contexts/LanguageContext";
import { Wifi, Flame, Car, Utensils, Droplets, Leaf, Users, Bed, Bath, ChevronLeft, ChevronRight, X, Calendar } from "lucide-react";
import { HERMAN_COTTAGE1_IMAGES, HERMAN_COTTAGE2_IMAGES } from "../../../shared/herman-images";

interface Props { slug: string; }

const COTTAGE_DATA = {
  "la-seve": {
    images: HERMAN_COTTAGE1_IMAGES.all,
    capacity: 6, bedrooms: 2, bathrooms: 1, living_areas: 1,
    amenities: [
      { icon: Wifi, fr: "WiFi gratuit", en: "Free WiFi", nl: "Gratis WiFi" },
      { icon: Car, fr: "Parking gratuit", en: "Free parking", nl: "Gratis parkeren" },
      { icon: Leaf, fr: "Isolation exceptionnelle", en: "Exceptional insulation", nl: "Uitzonderlijke isolatie" },
      { icon: Flame, fr: "Chauffage inclus", en: "Heating included", nl: "Verwarming inbegrepen" },
      { icon: Utensils, fr: "Cuisine équipée", en: "Fully equipped kitchen", nl: "Volledig uitgeruste keuken" },
      { icon: Droplets, fr: "Eau chaude", en: "Hot water", nl: "Warm water" },
    ],
    kitchen_amenities: [
      { fr: "Machine à café", en: "Coffee machine", nl: "Koffiezetapparaat" },
      { fr: "Lave-vaisselle", en: "Dishwasher", nl: "Vaatwasser" },
      { fr: "Réfrigérateur avec congélateur", en: "Fridge with freezer", nl: "Koelkast met vriezer" },
      { fr: "Sèche-linge", en: "Dryer machine", nl: "Droger" },
      { fr: "Ustensiles de cuisine", en: "Kitchen utensils", nl: "Keukengerei" },
    ],
    other_amenities: [
      { fr: "Sèche-cheveux", en: "Hair dryer", nl: "Haardroger" },
      { fr: "Ventilateur", en: "Fan", nl: "Ventilator" },
      { fr: "Rideaux occultants épais", en: "Thick blackout curtains", nl: "Dikke verduisteringsgordijnen" },
      { fr: "Borne de recharge EV", en: "EV charging station", nl: "EV-laadstation" },
      { fr: "Entrée sans clé (code)", en: "Keyless entry (code lock)", nl: "Sleutelvrije ingang (codeslot)" },
      { fr: "Caméra de sécurité extérieure", en: "Exterior security camera", nl: "Externe beveiligingscamera" },
      { fr: "Mobilier de jardin", en: "Garden furniture", nl: "Tuinmeubilair" },
      { fr: "Détecteurs de fumée", en: "Smoke detectors", nl: "Rookmelders" },
    ],
    priceFrom: 150,
  },
  "le-bois": {
    images: HERMAN_COTTAGE2_IMAGES.all,
    capacity: 6, bedrooms: 2, bathrooms: 1, living_areas: 1,
    amenities: [
      { icon: Wifi, fr: "WiFi gratuit", en: "Free WiFi", nl: "Gratis WiFi" },
      { icon: Car, fr: "Parking gratuit", en: "Free parking", nl: "Gratis parkeren" },
      { icon: Leaf, fr: "Isolation exceptionnelle", en: "Exceptional insulation", nl: "Uitzonderlijke isolatie" },
      { icon: Flame, fr: "Chauffage inclus", en: "Heating included", nl: "Verwarming inbegrepen" },
      { icon: Utensils, fr: "Cuisine équipée", en: "Fully equipped kitchen", nl: "Volledig uitgeruste keuken" },
      { icon: Droplets, fr: "Eau chaude", en: "Hot water", nl: "Warm water" },
    ],
    kitchen_amenities: [
      { fr: "Machine à café", en: "Coffee machine", nl: "Koffiezetapparaat" },
      { fr: "Lave-vaisselle", en: "Dishwasher", nl: "Vaatwasser" },
      { fr: "Réfrigérateur avec congélateur", en: "Fridge with freezer", nl: "Koelkast met vriezer" },
      { fr: "Sèche-linge", en: "Dryer machine", nl: "Droger" },
      { fr: "Ustensiles de cuisine", en: "Kitchen utensils", nl: "Keukengerei" },
    ],
    other_amenities: [
      { fr: "Sèche-cheveux", en: "Hair dryer", nl: "Haardroger" },
      { fr: "Ventilateur", en: "Fan", nl: "Ventilator" },
      { fr: "Rideaux occultants épais", en: "Thick blackout curtains", nl: "Dikke verduisteringsgordijnen" },
      { fr: "Borne de recharge EV", en: "EV charging station", nl: "EV-laadstation" },
      { fr: "Entrée sans clé (code)", en: "Keyless entry (code lock)", nl: "Sleutelvrije ingang (codeslot)" },
      { fr: "Caméra de sécurité extérieure", en: "Exterior security camera", nl: "Externe beveiligingscamera" },
      { fr: "Mobilier de jardin", en: "Garden furniture", nl: "Tuinmeubilair" },
      { fr: "Détecteurs de fumée", en: "Smoke detectors", nl: "Rookmelders" },
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

  const databaseImages = cottage?.photos?.map((photo) => photo.url) ?? [];
  const images = databaseImages.length > 0 ? databaseImages : data.images;
  const name = slug === "la-seve" ? "La Sève" : "Le Bois";

  const prev = () => setGalleryIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setGalleryIndex((i) => (i + 1) % images.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, images.length]);

  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      {/* Hero gallery */}
      <div data-analytics-gallery={name} className="relative h-[60vh] md:h-[75vh] overflow-hidden bg-[var(--forest-900)]">
        <button
          type="button"
          onClick={() => {
            trackEvent("gallery_opened", { gallery_name: name, photo_index: galleryIndex + 1 });
            setLightboxOpen(true);
          }}
          className="absolute inset-0 z-[1] cursor-zoom-in"
          aria-label={t({ fr: `Ouvrir la galerie complète de ${name}`, en: `Open the full ${name} gallery`, nl: `Open de volledige galerij van ${name}` })}
        >
          <img
            src={images[galleryIndex]}
            alt={`${name} — photo ${galleryIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-500"
            loading="eager"
          />
        </button>

        {/* Gallery controls */}
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors" aria-label={t({ fr: "Photo précédente", en: "Previous photo", nl: "Vorige foto" })}>
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors" aria-label={t({ fr: "Photo suivante", en: "Next photo", nl: "Volgende foto" })}>
          <ChevronRight size={20} />
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-black/40 text-white text-xs px-3 py-1 rounded-full">
          {galleryIndex + 1} / {images.length}
        </div>

      </div>

      <div className="bg-white border-b border-[var(--cream-200)]">
        <div className="container py-6">
          <p className="text-caption text-[var(--forest-600)] mb-2">{t({ fr: "Sève & Bois Escapes", en: "Sève & Bois Escapes", nl: "Sève & Bois ontsnapt" })}</p>
          <h1 className="text-headline text-[var(--forest-950)]">{name}</h1>
          <p className="text-sm text-[var(--slate-500)] mt-2">{t({ fr: "Cliquez sur une photo pour ouvrir la galerie complète.", en: "Click any photo to open the full gallery.", nl: "Klik op een foto om de volledige galerij te openen." })}</p>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div data-analytics-gallery={`${name}_thumbnails`} className="bg-[var(--forest-950)] py-3 overflow-x-auto">
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

      {lightboxOpen && (
        <div data-analytics-gallery={`${name}_lightbox`} className="fixed inset-0 z-[120] bg-black/95 flex flex-col" role="dialog" aria-modal="true" aria-label={t({ fr: `Galerie de ${name}`, en: `${name} gallery`, nl: `${name} galerij` })}>
          <div className="flex items-center justify-between px-4 py-3 text-white shrink-0">
            <p className="text-sm font-medium">{name} <span className="text-white/60">· {galleryIndex + 1} / {images.length}</span></p>
            <button type="button" onClick={() => setLightboxOpen(false)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center" aria-label={t({ fr: "Fermer la galerie", en: "Close gallery", nl: "Galerij sluiten" })}>
              <X size={22} />
            </button>
          </div>
          <div className="relative flex-1 min-h-0 flex items-center justify-center px-12 sm:px-20 py-2">
            <img src={images[galleryIndex]} alt={`${name} — photo ${galleryIndex + 1}`} className="max-h-full max-w-full object-contain" />
            <button type="button" onClick={prev} className="absolute left-3 sm:left-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center" aria-label={t({ fr: "Photo précédente", en: "Previous photo", nl: "Vorige foto" })}><ChevronLeft size={24} /></button>
            <button type="button" onClick={next} className="absolute right-3 sm:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center" aria-label={t({ fr: "Photo suivante", en: "Next photo", nl: "Volgende foto" })}><ChevronRight size={24} /></button>
          </div>
          <div className="shrink-0 overflow-x-auto px-4 py-3">
            <div className="flex gap-2 justify-center w-max min-w-full">
              {images.map((img, index) => (
                <button key={img + index} type="button" onClick={() => setGalleryIndex(index)} className={`w-16 h-12 sm:w-20 sm:h-14 shrink-0 overflow-hidden rounded ${index === galleryIndex ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"}`} aria-label={t({ fr: `Ouvrir la photo ${index + 1}`, en: `Open photo ${index + 1}`, nl: `Foto ${index + 1} openen` })}>
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
                  ? t({ fr: "Un cottage pensé pour la nature — et pour vous.", en: "A cottage built for nature — and for you.", nl: "Een huisje gebouwd voor de natuur — en voor jou." })
                  : t({ fr: "Plus d'espace. Même esprit.", en: "More space. Same spirit.", nl: "Meer ruimte. Dezelfde geest." })}
              </h2>
              <p className="text-lead mb-4">
                {t({ fr: "Chaque cottage accueille jusqu'à 6 personnes : 2 chambres avec lit Queen (2 personnes chacun) + canapé-lit dans le salon (2 personnes). Une salle de bain complète, une cuisine équipée, et tous les équipements pour les familles. Réservez ce cottage seul, ou choisissez les deux cottages pour un groupe de 4 à 12 personnes.", en: "Each cottage welcomes up to 6 guests: 2 bedrooms with Queen beds (2 people each) + sofa bed in the living room (2 people). A full bathroom, equipped kitchen, and family-friendly amenities. Book this cottage on its own, or choose both cottages for a group of 4–12 guests.", nl: "Elk cottage biedt plaats aan tot 6 gasten: 2 slaapkamers met Queensbedden (2 personen elk) + slaapbank in de woonkamer (2 personen). Een volledige badkamer, uitgeruste keuken en gezinsvriendelijke voorzieningen. Boek dit cottage afzonderlijk of kies beide cottages voor een groep van 4–12 gasten." })}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 mt-6">
                {[
                  { icon: Users, label: t({ fr: `${data.capacity} personnes`, en: `${data.capacity} guests`, nl: `${data.capacity} gasten` }) },
                  { icon: Bed, label: t({ fr: `${data.bedrooms} chambres`, en: `${data.bedrooms} bedrooms`, nl: `${data.bedrooms} slaapkamers` }) },
                  { icon: Bath, label: t({ fr: `${data.bathrooms} salle${data.bathrooms > 1 ? "s" : ""} de bain`, en: `${data.bathrooms} bathroom${data.bathrooms > 1 ? "s" : ""}`, nl: `${data.bathrooms} badkamer${data.bathrooms > 1 ? "s" : ""}` }) },
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
                {t({ fr: "Équipements inclus", en: "What's included", nl: "Wat is inbegrepen" })}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {data.amenities.map(({ icon: Icon, fr, en, nl }) => (
                  <div key={fr} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[var(--cream-300)]">
                    <div className="w-9 h-9 rounded-lg bg-[var(--forest-50)] flex items-center justify-center text-[var(--forest-600)]">
                      <Icon size={18} />
                    </div>
                    <span className="text-sm font-medium text-[var(--forest-800)]">{t({ fr, en, nl })}</span>
                  </div>
                ))}
              </div>
              
              {/* Kitchen & Laundry Amenities */}
              <div className="mt-8">
                <h4 className="text-body-bold text-[var(--forest-950)] mb-4">
                  {t({ fr: "Cuisine & Buanderie", en: "Kitchen & Laundry", nl: "Keuken & Wasserij" })}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {data.kitchen_amenities?.map(({ fr, en, nl }) => (
                    <div key={fr} className="flex items-center gap-2 p-3 bg-[var(--cream-50)] rounded-lg border border-[var(--cream-200)]">
                      <span className="text-[var(--ochre-500)]">✓</span>
                      <span className="text-sm text-[var(--forest-700)]">{t({ fr, en, nl })}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Other Amenities */}
              {data.other_amenities && data.other_amenities.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-body-bold text-[var(--forest-950)] mb-4">
                    {t({ fr: "Confort & Sécurité", en: "Comfort & Security", nl: "Comfort & Veiligheid" })}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {data.other_amenities.map(({ fr, en, nl }) => (
                      <div key={fr} className="flex items-center gap-2 p-3 bg-[var(--cream-50)] rounded-lg border border-[var(--cream-200)]">
                        <span className="text-[var(--ochre-500)]">✓</span>
                        <span className="text-sm text-[var(--forest-700)]">{t({ fr, en, nl })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* House rules */}
            <div className="bg-[var(--forest-50)] rounded-2xl p-8">
              <h3 className="text-subheadline text-[var(--forest-950)] mb-4">
                {t({ fr: "Règlement intérieur", en: "House rules", nl: "Huisregels" })}
              </h3>
              <ul className="space-y-2 text-sm text-[var(--slate-700)]">
                {[
                  t({ fr: "Arrivée à partir de 16h, départ avant 11h", en: "Check-in from 4pm, check-out before 11am", nl: "Inchecken vanaf 16.00 uur, uitchecken voor 11.00 uur" }),
                  t({ fr: "Animaux acceptés sur demande", en: "Pets welcome on request", nl: "Huisdieren welkom op aanvraag" }),
                  t({ fr: "Non-fumeur à l'intérieur", en: "Non-smoking indoors", nl: "Niet-roken binnenshuis" }),
                  t({ fr: "Séjour minimum 2 nuits", en: "Minimum 2-night stay", nl: "Minimaal verblijf van 2 nachten" }),
                  t({ fr: "Respect du voisinage et de la nature", en: "Respect for neighbours and nature", nl: "Respect voor buren en natuur" }),
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
                {t({ fr: "Engagement éco-responsable", en: "Eco commitment", nl: "Eco-engagement" })}
              </h3>
              <p className="text-lead">
                {t({ fr: "Ce cottage est construit avec des matériaux naturels et éco-certifiés. Il est alimenté à 100% par des énergies renouvelables. Séjourner ici, c'est choisir la nature sans compromis.", en: "This cottage is built with natural, eco-certified materials and powered 100% by renewable energy. Staying here means choosing nature without compromise.", nl: "Dit huisje is gebouwd met natuurlijke, eco-gecertificeerde materialen en wordt voor 100% aangedreven door hernieuwbare energie. Hier verblijven betekent kiezen voor de natuur zonder compromissen." })}
              </p>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-[var(--cream-300)] overflow-hidden">
              <div className="bg-[var(--forest-700)] p-6 text-white">
                <h3 className="text-subheadline text-white">{t({ fr: "Prêt à réserver?", en: "Ready to book?", nl: "Klaar om te boeken?" })}</h3>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-[var(--slate-600)]">
                  {t({ fr: "À partir de €150 / nuit pour ce cottage. Réservez en direct pour le meilleur tarif, sans frais de plateforme.", en: "From €150 / night for this cottage. Book direct for the best rate, with no platform fees.", nl: "Vanaf €150 / nacht voor dit cottage. Boek rechtstreeks voor het beste tarief, zonder platformkosten." })}
                </p>
                <Link
                  href={`/booking?cottage=${slug}`}
                  className="btn-primary w-full text-center flex items-center justify-center gap-2"
                >
                  <Calendar size={16} />
                  {t({ fr: "Vérifier les disponibilités", en: "Check availability", nl: "Controleer beschikbaarheid" })}
                </Link>
                <Link
                  href="/contact"
                  className="btn-outline w-full text-center"
                >
                  {t({ fr: "Envoyer une demande", en: "Send an enquiry", nl: "Stuur een aanvraag" })}
                </Link>
                <div className="pt-2 border-t border-[var(--cream-200)]">
                  <div className="flex items-center gap-2 text-xs text-[var(--slate-500)]">
                    <span>🔒</span>
                    {t({ fr: "Paiement sécurisé via Stripe", en: "Secure payment via Stripe", nl: "Veilig betalen via Stripe" })}
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

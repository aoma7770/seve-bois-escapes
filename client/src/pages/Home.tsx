import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import Slideshow from "@/components/Slideshow";
import { trpc } from "@/lib/trpc";
import {
  Wifi, Flame, Car, Utensils, Droplets, Users,
  ChevronRight, ArrowRight
} from "lucide-react";
import {
  HERO_EXTERIOR, LIVING_ROOM_C1, COTTAGE2_EXTERIOR,
  TERRACE_SIDE, BATHROOM_C1, BEDROOM_C1, KITCHEN_C1
} from "../../../shared/images";
import { HERMAN_COTTAGE1_IMAGES, HERMAN_COTTAGE2_IMAGES } from "../../../shared/herman-images";
import { localizedPath } from "../../../shared/seo";
import { trackEvent } from "@/lib/analytics";

type AnimationType = 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'slide-in-up' | 'pop' | 'rotate-in';

function useScrollAnimation(animType: AnimationType = 'slide-in-up') {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, className: visible ? `animate-${animType}` : "opacity-0" };
}

function FadeSection({ children, className = "", delay = 0, animation = 'slide-in-up' }: { children: React.ReactNode; className?: string; delay?: number; animation?: AnimationType }) {
  const { ref, className: animClass } = useScrollAnimation(animation);
  return (
    <div ref={ref} className={`${animClass} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Home() {
  const { lang, t } = useLanguage();
  
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroParallax, setHeroParallax] = useState(0);
  const [newsletterForm, setNewsletterForm] = useState({ firstName: "", lastName: "", email: "", marketingConsent: false });
  const [newsletterDone, setNewsletterDone] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setHeroParallax(Math.min(window.scrollY * 0.16, 96)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", handleScroll); };
  }, []);

  const guideMutation = trpc.newsletter.requestGuide.useMutation({
    onSuccess: () => {
      trackEvent("guide_request_success", { lead_source: "homepage_cta" });
      setNewsletterDone(true);
    },
    onError: (error) => trackEvent("guide_request_error", { lead_source: "homepage_cta", error_message: error.message.slice(0, 120) }),
  });

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterForm.firstName || !newsletterForm.lastName || !newsletterForm.email || !newsletterForm.marketingConsent) return;
    trackEvent("guide_request_submitted", { lead_source: "homepage_cta" });
    guideMutation.mutate({ firstName: newsletterForm.firstName, lastName: newsletterForm.lastName, email: newsletterForm.email, marketingConsent: true, source: "homepage_cta" });
  };

  return (
    <div className="min-h-screen bg-[var(--cream-50)]">

      {/* HERO - SLIDESHOW */}
      <section className="relative h-screen min-h-[560px] sm:min-h-[600px] max-h-[900px] overflow-hidden">
        <div className="absolute inset-[-10%] will-change-transform" style={{ transform: `translate3d(0, ${heroParallax}px, 0) scale(1.08)` }}>
          <Slideshow
            images={HERMAN_COTTAGE1_IMAGES.hero}
            autoplay={true}
            interval={6000}
            className="h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/65" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container text-center text-white">
            <p className="text-caption text-[var(--ochre-300)] mb-4 animate-fade-up" style={{color: '#ffffff'}}>
              {t({ fr: "Laforêt · Ardennes belges · Vallée de la Semois", en: "Laforêt · Belgian Ardennes · Semois valley", nl: "Laforêt · Belgische Ardennen · Semoisvallei" })}
            </p>
            <h1 className="text-display text-white mb-6 px-2 animate-fade-up delay-100 max-w-3xl mx-auto">
              {t({ fr: "Gîte Ardennes à Laforêt", en: "Ardennes cottage in Laforêt", nl: "Vakantiehuis Ardennen in Laforêt" })}
            </h1>
            <p className="text-lead text-white/85 mb-10 animate-fade-up delay-200 max-w-2xl mx-auto" style={{color: '#ffffff'}}>
              {t({ fr: "Deux cottages contemporains en bois, La Sève et Le Bois, avec des équipements pensés pour un séjour confortable à Laforêt.", en: "Two contemporary timber cottages, La Sève and Le Bois, with thoughtful facilities for a comfortable stay in Laforêt.", nl: "Twee moderne houten cottages, La Sève en Le Bois, met voorzieningen voor een comfortabel verblijf in Laforêt." })}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-up delay-300 px-4 sm:px-0">
              <Link href="/booking" className="btn-primary sm:w-auto text-base px-8 py-4">
                {t({ fr: "Vérifier les disponibilités", en: "Check availability", nl: "Controleer beschikbaarheid" })}
              </Link>
              <Link href={localizedPath("/cottages/la-seve", lang)} className="btn-ghost sm:w-auto text-base px-8 py-4">
                {t({ fr: "Découvrir les cottages", en: "Discover the cottages", nl: "Ontdek de huisjes" })}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-[var(--forest-950)] py-4">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center">
            {[
              t({ fr: "Cœur de l'Ardenne belge", en: "Heart of the Belgian Ardennes", nl: "Hart van de Belgische Ardennen" }),
              t({ fr: "Wi-Fi haut débit", en: "High-speed Wi-Fi", nl: "Snelle wifi" }),
              t({ fr: "Chauffage central", en: "Central heating", nl: "Centrale verwarming" }),
              t({ fr: "Cuisine équipée", en: "Equipped kitchen", nl: "Uitgeruste keuken" }),
              t({ fr: "Animaux acceptés", en: "Pets welcome", nl: "Huisdieren welkom" }),
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[var(--forest-300)]">
                {i > 0 && <span className="hidden sm:block text-[var(--forest-700)]">·</span>}
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY HIGHLIGHTS */}
      <section className="py-16 bg-[var(--cream-50)]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: "🐾", label: t({ fr: "Animaux acceptés", en: "Pets welcome", nl: "Huisdieren welkom" }) },
              { icon: "⚡", label: t({ fr: "Recharge EV", en: "EV charging", nl: "EV-opladen" }) },
              { icon: "📶", label: t({ fr: "WiFi gratuit", en: "Free WiFi", nl: "Gratis WiFi" }) },
              { icon: "🌊", label: t({ fr: "Vallée de la Semois", en: "Semois valley", nl: "Semoisvallei" }) },
              { icon: "🍳", label: t({ fr: "Cuisine équipée", en: "Equipped kitchen", nl: "Uitgeruste keuken" }) },
            ].map((item, i) => (
              <FadeSection key={i} delay={i * 50} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="text-sm font-medium text-[var(--forest-900)]">{item.label}</p>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* THE PROMISE */}
      <section className="py-24 bg-[var(--cream-50)]">
        <div className="container max-w-4xl text-center">
          <FadeSection>
            <div className="divider-ochre mx-auto mb-6" />
            <h2 className="text-headline text-[var(--forest-950)] mb-6">
              {t({ fr: "Loin de la ville. Au plus près de l'essentiel.", en: "Far from the city. Close to what matters.", nl: "Ver van de stad. Dichtbij wat ertoe doet." })}
            </h2>
            <p className="text-lead max-w-3xl mx-auto">
              {t({ fr: "À Laforêt, le temps ralentit. Les deux cottages offrent un espace confortable pour se retrouver, avec une cuisine équipée, du chauffage central, de l'eau chaude et le Wi-Fi haut débit.", en: "In Laforêt, time slows down. The two cottages offer a comfortable place to reconnect, with an equipped kitchen, central heating, hot water and high-speed Wi-Fi.", nl: "In Laforêt vertraagt de tijd. De twee cottages bieden een comfortabele plek om samen te zijn, met een uitgeruste keuken, centrale verwarming, warm water en snelle wifi." })}
            </p>
          </FadeSection>
        </div>
      </section>

      {/* FOR EVERY NATURE LOVER */}
      <section className="py-20 bg-white">
        <div className="container">
          <FadeSection className="text-center mb-14">
            <p className="text-caption text-[var(--ochre-500)] mb-3">{t({ fr: "Pour tous les amoureux de la nature", en: "For every nature lover", nl: "Voor iedere natuurliefhebber" })}</p>
            <h2 className="text-headline text-[var(--forest-950)]">
              {t({ fr: "Connecté quand il faut, déconnecté quand vous voulez.", en: "Connected when you need it, unplugged when you want it.", nl: "Aangesloten wanneer u het nodig heeft, losgekoppeld wanneer u dat wilt." })}
            </h2>
          </FadeSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeSection delay={100}>
              <div className="rounded-2xl overflow-hidden h-full bg-[var(--forest-50)]">
                <img src={HERMAN_COTTAGE1_IMAGES.livingRoom[0]} alt="Intérieur cosy du cottage" className="w-full h-64 object-cover" loading="lazy" />
                <div className="p-8">
                  <div className="divider-ochre mb-4" />
                  <h3 className="text-subheadline text-[var(--forest-950)] mb-4">
                    {t({ fr: "Première fois en pleine nature ? Vous êtes au bon endroit.", en: "First time in the wild? You're in exactly the right place.", nl: "Eerste keer in het wild? Je bent precies op de juiste plek." })}
                  </h3>
                  <p className="text-[var(--slate-600)] leading-relaxed mb-4">
                    {t({
                      fr: "Pas d'expérience requise, pas de matériel à prévoir, rien à planifier. WiFi gratuit, chauffage, eau chaude, un vrai lit confortable, une cuisine complète. Vous arrivez, la forêt fait le reste.",
                      en: "No experience needed, no equipment to bring, nothing to plan. Free WiFi, heating, hot water, a real comfortable bed, a full kitchen. You arrive, the forest does the rest.",
                      nl: "Geen ervaring nodig, geen uitrusting nodig, niets in te plannen. Gratis WiFi, verwarming, warm water, een echt comfortabel bed, een volledige keuken. Je arriveert, het bos doet de rest."
                    })}
                  </p>
                  <Link href={localizedPath("/faq", lang)} className="text-sm font-semibold text-[var(--forest-600)] flex items-center gap-1 hover:gap-2 transition-all">
                    {t({ fr: "Vos questions, nos réponses", en: "Your questions, our answers", nl: "Uw vragen, onze antwoorden" })} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </FadeSection>
            <FadeSection delay={200}>
              <div className="rounded-2xl overflow-hidden h-full bg-[var(--forest-50)]">
                <img src={HERMAN_COTTAGE1_IMAGES.hero[5]} alt="Extérieur du cottage avec jardin fleuri" className="w-full h-64 object-cover" loading="lazy" />
                <div className="p-8">
                  <div className="divider-ochre mb-4" />
                  <h3 className="text-subheadline text-[var(--forest-950)] mb-4">
                    {t({ fr: "Déjà amoureux du grand air ? Le terrain de jeu est immense.", en: "Already an outdoors soul? The playground is vast.", nl: "Ben je al een buitenziel? De speeltuin is enorm." })}
                  </h3>
                  <p className="text-[var(--slate-600)] leading-relaxed mb-4">
                    {t({
                      fr: "Forêts, sentiers balisés et patrimoine de village vous invitent à découvrir la région. Les expériences voisines sont indépendantes : vérifiez les saisons et les conditions.",
                      en: "Forests, marked trails and village heritage invite you to discover the region. Nearby experiences are independently operated: check seasons and current conditions.",
                      nl: "Bossen, gemarkeerde wandelroutes en dorpserfgoed nodigen u uit om de regio te ontdekken. Nabije ervaringen worden onafhankelijk georganiseerd: controleer seizoenen en omstandigheden."
                    })}
                  </p>
                  <Link href={localizedPath("/location", lang)} className="text-sm font-semibold text-[var(--forest-600)] flex items-center gap-1 hover:gap-2 transition-all">
                    {t({ fr: "Explorer la région", en: "Explore the region", nl: "Verken de regio" })} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* THE COTTAGES */}
      <section className="py-24 bg-[var(--cream-100)]">
        <div className="container">
          <FadeSection className="text-center mb-14" animation="fade-in">
            <p className="text-caption text-[var(--ochre-500)] mb-3">{t({ fr: "Nos cottages", en: "Our cottages", nl: "Onze huisjes" })}</p>
            <h2 className="text-headline text-[var(--forest-950)]">
              {t({ fr: "Un cottage pensé pour la nature — et pour vous.", en: "A cottage built for nature — and for you.", nl: "Een huisje gebouwd voor de natuur — en voor jou." })}
            </h2>
          </FadeSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FadeSection delay={100} animation="slide-in-left">
              <div className="card-eco group">
                <Link href={localizedPath("/cottages/la-seve", lang)} className="block relative h-72 overflow-hidden" aria-label={t({ fr: "Découvrir La Sève", en: "Discover La Sève", nl: "Ontdek La Sève" })}>
                  <img src={HERMAN_COTTAGE1_IMAGES.livingRoom[0]} alt="La Sève — lounge room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </Link>
                <div className="p-7">
                  <h3 className="text-subheadline text-[var(--forest-950)] mb-2">La Sève</h3>
                  <p className="text-sm text-[var(--slate-600)] mb-4 leading-relaxed">
                    {t({ fr: "2 chambres · 6 personnes · Baies vitrées sur la forêt · Salle de bain aux carreaux vert forêt", en: "2 bedrooms · 6 guests · Floor-to-ceiling glazing onto the forest · Forest-green tiled bathroom", nl: "2 slaapkamers · 6 gasten · Kamerhoge beglazing met uitzicht op het bos · Bosgroen betegelde badkamer" })}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[{ icon: Wifi, label: "Wi-Fi" }, { icon: Flame, label: t({ fr: "Chauffage", en: "Heating", nl: "Verwarming" }) }, { icon: Utensils, label: t({ fr: "Cuisine", en: "Kitchen", nl: "Keuken" }) }, { icon: Users, label: t({ fr: "6 personnes", en: "6 guests", nl: "6 gasten" }) }].map(({ icon: Icon, label }) => (
                      <span key={label} className="flex items-center gap-1.5 text-xs text-[var(--forest-700)] bg-[var(--forest-50)] px-3 py-1.5 rounded-full">
                        <Icon size={12} /> {label}
                      </span>
                    ))}
                  </div>
                  <Link href={localizedPath("/cottages/la-seve", lang)} className="btn-outline w-full text-center">{t({ fr: "Découvrir La Sève", en: "Discover La Sève", nl: "Ontdek La Sève" })}</Link>
                </div>
              </div>
            </FadeSection>
            <FadeSection delay={200} animation="slide-in-right">
              <div className="card-eco group">
                <Link href={localizedPath("/cottages/le-bois", lang)} className="block relative h-72 overflow-hidden" aria-label={t({ fr: "Découvrir Le Bois", en: "Discover Le Bois", nl: "Ontdek Le Bois" })}>
                  <img src={HERMAN_COTTAGE2_IMAGES.livingRoom[0]} alt="Le Bois — lounge room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </Link>
                <div className="p-7">
                  <h3 className="text-subheadline text-[var(--forest-950)] mb-2">Le Bois</h3>
                  <p className="text-sm text-[var(--slate-600)] mb-4 leading-relaxed">
                    {t({ fr: "2 chambres · 6 personnes · Terrasse panoramique · Poêle à bois", en: "2 bedrooms · 6 guests · Panoramic terrace · Wood-burning stove", nl: "2 slaapkamers · 6 gasten · Panoramisch terras · Houtkachel" })}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[{ icon: Wifi, label: "Wi-Fi" }, { icon: Flame, label: t({ fr: "Poêle à bois", en: "Wood stove", nl: "Houtkachel" }) }, { icon: Users, label: "6" }, { icon: Utensils, label: t({ fr: "Cuisine", en: "Kitchen", nl: "Keuken" }) }].map(({ icon: Icon, label }) => (
                      <span key={label} className="flex items-center gap-1.5 text-xs text-[var(--forest-700)] bg-[var(--forest-50)] px-3 py-1.5 rounded-full">
                        <Icon size={12} /> {label}
                      </span>
                    ))}
                  </div>
                  <Link href={localizedPath("/cottages/le-bois", lang)} className="btn-outline w-full text-center">{t({ fr: "Découvrir Le Bois", en: "Discover Le Bois", nl: "Ontdek Le Bois" })}</Link>
                </div>
              </div>
            </FadeSection>
          </div>
          <FadeSection delay={300} className="mt-8" animation="fade-in">
            <div className="rounded-2xl bg-[var(--forest-900)] text-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="text-caption text-[var(--ochre-300)] mb-2" style={{color: '#f8f7f7'}}>{t({ fr: "Pour les groupes", en: "For groups", nl: "Voor groepen" })}</p>
                <h3 className="font-serif text-2xl" style={{color: '#fafafa'}}>{t({ fr: "Réservez les deux cottages", en: "Book both cottages", nl: "Boek beide cottages" })}</h3>
                <p className="text-sm text-white/75 mt-2" style={{color: '#f9f6f6'}}>{t({ fr: "Pour 4 à 12 personnes, avec un tarif calculé selon le nombre de voyageurs.", en: "For 4–12 guests, with the rate calculated from the number of travellers.", nl: "Voor 4–12 gasten, met de prijs berekend volgens het aantal reizigers." })}</p>
              </div>
              <Link href="/booking?cottage=both" className="btn-ghost shrink-0 text-center">{t({ fr: "Choisir les options", en: "Choose your option", nl: "Kies uw optie" })}</Link>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-24 bg-[var(--forest-950)] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={HERMAN_COTTAGE1_IMAGES.hero[5]} alt="Beautiful forest landscape in Laforêt Belgian Ardennes" className="w-full h-full object-cover" loading="lazy" decoding="async" />
        </div>
        <div className="container relative z-10">
          <FadeSection className="max-w-3xl">
            <p className="text-caption text-[var(--ochre-400)] mb-4" style={{color: '#f6f4f4'}}>{t({ fr: "Le Lieu", en: "The Location", nl: "De locatie" })}</p>
            <h2 className="text-headline text-white mb-6">
              {t({ fr: "Laforêt : l'un des plus beaux villages de Wallonie.", en: "Laforêt: one of the most beautiful villages in Wallonia.", nl: "Laforêt: één van de mooiste dorpen van Wallonië." })}
            </h2>
            <p className="text-lead text-white/80 mb-8" style={{color: '#ffffff'}}>
              {t({ fr: "Maisons en pierre ardoisée, collines boisées, la Semois qui serpente en contrebas. À 2h de Bruxelles — assez proche pour s'échapper, assez loin pour vraiment décrocher.", en: "Slate-roofed stone houses, forested hills, the Semois winding below. 2 hours from Brussels — close enough to escape to, far enough to truly switch off.", nl: "Stenen huizen met leien daken, beboste heuvels en de Semois die beneden kronkelt. 2 uur van Brussel — dichtbij genoeg om te ontsnappen, ver genoeg om echt tot rust te komen." })}
            </p>
          </FadeSection>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-10">
            {[
              { icon: "🛶", fr: "Kayak", en: "Kayaking", nl: "Kajakken" },
              { icon: "🥾", fr: "Randonnées", en: "Hiking & viewpoints", nl: "Wandelen & uitzichtpunten" },
              { icon: "✨", fr: "Étoiles", en: "Stargazing", nl: "Sterren kijken" },
              { icon: "🍽️", fr: "Gastronomie", en: "Gastronomy", nl: "Gastronomie" },
              { icon: "🚴", fr: "Cyclisme", en: "Cycling", nl: "Fietsen" },
            ].map(({ icon, fr, en, nl }, idx) => (
              <div key={fr} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center hover:bg-white/15 transition-colors animate-pop" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="text-3xl mb-2">{icon}</div>
                <p className="text-sm font-semibold text-white">{t({ fr, en, nl })}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href={localizedPath("/location", lang)} className="btn-ghost inline-flex items-center gap-2">
              {t({ fr: "Explorer la région", en: "Explore the region", nl: "Verken de regio" })} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* DIRECT BOOKING VALUE PROP */}
      <section className="py-20 bg-white">
        <div className="container max-w-3xl text-center">
          <FadeSection>
            <div className="divider-ochre mx-auto mb-6" />
            <h2 className="text-headline text-[var(--forest-950)] mb-4">{t({ fr: "Réservez en direct, simplement.", en: "Book direct, simply.", nl: "Boek direct, eenvoudig." })}</h2>
            <p className="text-lead mb-8">{t({ fr: "Pas de frais de plateforme lorsque vous réservez en direct. Vous échangez avec l'équipe et voyez le total exact selon vos dates et vos voyageurs.", en: "No platform fees when you book direct. You can speak with the team and see the exact total for your dates and guests.", nl: "Geen platformkosten wanneer u rechtstreeks boekt. U kunt met het team overleggen en het exacte totaal voor uw data en gasten bekijken." })}</p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {[
                { icon: "💳", label: t({ fr: "Paiement sécurisé", en: "Secure payment", nl: "Veilige betaling" }) },
                { icon: "✓", label: t({ fr: "Pas de frais de plateforme", en: "No platform fees", nl: "Geen platformkosten" }) },
                { icon: "👤", label: t({ fr: "Hôte humain & disponible", en: "Real human host", nl: "Echte menselijke gastheer" }) },
                { icon: "🔒", label: t({ fr: "Données protégées RGPD", en: "GDPR protected", nl: "AVG beschermd" }) },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-[var(--forest-700)] bg-[var(--forest-50)] px-4 py-2.5 rounded-full font-medium">
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
            <Link href="/booking" className="btn-primary text-base px-10 py-4">{t({ fr: "Vérifier les disponibilités", en: "Check availability", nl: "Controleer beschikbaarheid" })}</Link>
          </FadeSection>
        </div>
      </section>

      {/* SCARCITY */}
      <section className="py-10 bg-[var(--ochre-100)] border-y border-[var(--ochre-200)]">
        <div className="container text-center">
          <p className="text-[var(--ochre-800)] font-semibold">
            {t({ fr: "Deux cottages. Des dates limitées. Les plus beaux week-ends partent vite.", en: "Two cottages. Limited dates. The best weekends go fast.", nl: "Twee huisjes. Beperkte data. De beste weekenden gaan snel." })}
            {" "}
            <Link href="/booking" className="underline hover:no-underline">{t({ fr: "Vérifier les disponibilités →", en: "Check availability →", nl: "Beschikbaarheid controleren →" })}</Link>
          </p>
        </div>
      </section>

      {/* FAQ TEASER */}
      <section className="py-24 bg-[var(--cream-50)]">
        <div className="container max-w-3xl">
          <FadeSection className="text-center mb-12">
            <p className="text-caption text-[var(--ochre-500)] mb-3">FAQ</p>
            <h2 className="text-headline text-[var(--forest-950)]">{t({ fr: "Questions fréquentes", en: "Frequently asked questions", nl: "Veelgestelde vragen" })}</h2>
          </FadeSection>
          <div className="space-y-4">
            {[
              { q: t({ fr: "Comment accéder aux cottages ?", en: "How do I get to the cottages?", nl: "Hoe kom ik bij de huisjes?" }), a: t({ fr: "Laforêt se trouve à environ 2h de Bruxelles via l'E411, et est facilement accessible depuis la France, le Luxembourg et les Pays-Bas.", en: "Laforêt is about 2 hours from Brussels via the E411, and easily accessible from France, Luxembourg and the Netherlands.", nl: "Laforêt ligt op ongeveer 2 uur rijden van Brussel via de E411, en is gemakkelijk bereikbaar vanuit Frankrijk, Luxemburg en Nederland." }) },
              { q: t({ fr: "C'est adapté si je n'ai jamais fait ça ?", en: "Is it suitable if I've never done this?", nl: "Is het geschikt als ik dit nog nooit heb gedaan?" }), a: t({ fr: "Absolument. Tout est prévu : wifi, chauffage, eau chaude, lit confortable, cuisine complète. Vous n'avez besoin d'aucune expérience ni équipement.", en: "Absolutely. Everything is provided: wifi, heating, hot water, comfortable bed, full kitchen. You need no experience or equipment.", nl: "Absoluut. Alles is aanwezig: wifi, verwarming, warm water, comfortabel bed, volledige keuken. Je hebt geen ervaring of uitrusting nodig." }) },
              { q: t({ fr: "Y a-t-il du wifi et du chauffage ?", en: "Is there wifi and heating?", nl: "Is er wifi en verwarming?" }), a: t({ fr: "Oui. Wifi haut débit et chauffage inclus dans les deux cottages.", en: "Yes. High-speed wifi and heating included in both cottages.", nl: "Ja. Hoge snelheid wifi en verwarming inbegrepen in beide huisjes." }) },
              { q: t({ fr: "Qu'est-ce qui est inclus dans le prix ?", en: "What's included in the price?", nl: "Wat is inbegrepen in de prijs?" }), a: t({ fr: "Le logement, le wifi, le chauffage, l'eau chaude, le linge de maison, et l'accès à tous les équipements.", en: "Accommodation, wifi, heating, hot water, household linen, and access to all amenities.", nl: "Accommodatie, wifi, verwarming, warm water, huishoudlinnen en toegang tot alle voorzieningen." }) },
              { q: t({ fr: "Puis-je réserver directement ?", en: "Can I book direct?", nl: "Kan ik rechtstreeks boeken?" }), a: t({ fr: "Oui. Il n'y a pas de frais de plateforme lorsque vous réservez en direct, et vous pouvez nous contacter pour préparer votre séjour.", en: "Yes. There are no platform fees when you book direct, and you can contact the team to prepare your stay.", nl: "Ja. Wanneer u rechtstreeks boekt, zijn er geen platformkosten en kunt u contact opnemen met het team om uw verblijf voor te bereiden." }) },
            ].map(({ q, a }, i) => (
              <FadeSection key={i} delay={i * 50}>
                <details className="group bg-white rounded-xl border border-[var(--cream-300)] overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-[var(--forest-900)] hover:bg-[var(--cream-50)] transition-colors list-none">
                    {q}
                    <ChevronRight size={16} className="shrink-0 text-[var(--ochre-500)] group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-[var(--slate-600)] leading-relaxed border-t border-[var(--cream-200)] pt-4">{a}</div>
                </details>
              </FadeSection>
            ))}
          </div>
          <FadeSection className="text-center mt-8">
            <Link href={localizedPath("/faq", lang)} className="text-sm font-semibold text-[var(--forest-600)] flex items-center justify-center gap-1 hover:gap-2 transition-all">
              {t({ fr: "Toutes les questions", en: "All questions", nl: "Alle vragen" })} <ArrowRight size={14} />
            </Link>
          </FadeSection>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 overflow-hidden">
        <img src={HERMAN_COTTAGE1_IMAGES.hero[3]} alt="Votre evasion vous attend" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="container relative z-10 text-center text-white">
          <FadeSection>
            <div className="divider-ochre mx-auto mb-6" />
            <h2 className="text-display text-white mb-6 max-w-2xl mx-auto">
              {t({ fr: "Votre évasion vous attend.", en: "Your escape is waiting.", nl: "Je ontsnapping wacht." })}
            </h2>
            <p className="text-lead text-white/85 mb-10 max-w-xl mx-auto" style={{color: '#ffffff'}}>
              {t({ fr: "Deux cottages. Le village de Laforêt. La vallée de la Semois. Il ne manque plus que vous.", en: "Two cottages. The village of Laforêt. The Semois valley. All that's missing is you.", nl: "Twee cottages. Het dorp Laforêt. De Semoisvallei. Het enige dat ontbreekt, bent u." })}
            </p>
            <Link href="/booking" className="btn-primary text-base px-10 py-4 mb-6 inline-block">
              {t({ fr: "Vérifier les disponibilités", en: "Check availability", nl: "Controleer beschikbaarheid" })}
            </Link>
            {!newsletterDone ? (
              <div className="mt-10 max-w-md mx-auto">
                <p className="text-sm text-white/70 mb-4">{t({ fr: "Pas encore prêt ? Recevez notre guide gratuit des Ardennes.", en: "Not ready yet? Get our free Ardennes guide.", nl: "Nog niet klaar? Ontvang onze gratis Ardennengids." })}</p>
                <form data-analytics-form="free_guide_homepage" onSubmit={handleNewsletter} className="space-y-2 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input type="text" placeholder={t({ fr: "Prénom", en: "First name", nl: "Voornaam" })} value={newsletterForm.firstName} onChange={(e) => setNewsletterForm({ ...newsletterForm, firstName: e.target.value })} required className="px-4 py-3 rounded-lg bg-white/15 border border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 backdrop-blur-sm" />
                    <input type="text" placeholder={t({ fr: "Nom", en: "Last name", nl: "Achternaam" })} value={newsletterForm.lastName} onChange={(e) => setNewsletterForm({ ...newsletterForm, lastName: e.target.value })} required className="px-4 py-3 rounded-lg bg-white/15 border border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 backdrop-blur-sm" />
                  </div>
                  <input type="email" placeholder={t({ fr: "Votre email", en: "Your email", nl: "Uw e-mail" })} value={newsletterForm.email} onChange={(e) => setNewsletterForm({ ...newsletterForm, email: e.target.value })} required className="w-full px-4 py-3 rounded-lg bg-white/15 border border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 backdrop-blur-sm" />
                  <label className="flex items-start gap-2 text-xs text-white/75"><input type="checkbox" checked={newsletterForm.marketingConsent} onChange={(e) => setNewsletterForm({ ...newsletterForm, marketingConsent: e.target.checked })} required className="mt-0.5 accent-[var(--ochre-500)]" />{t({ fr: "J'accepte de recevoir le guide et les informations de Sève & Bois.", en: "I agree to receive the guide and Green Cottages updates.", nl: "Ik ga akkoord met de gids en updates van Green Cottages." })}</label>
                  <button type="submit" disabled={guideMutation.isPending} className="w-full px-5 py-3 bg-[var(--ochre-500)] hover:bg-[var(--ochre-600)] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap disabled:opacity-60">
                    {guideMutation.isPending ? t({ fr: "Envoi…", en: "Sending…", nl: "Verzenden…" }) : t({ fr: "Recevoir le guide par email", en: "Email me the guide", nl: "Ontvang de gids per e-mail" })}
                  </button>
                </form>
              </div>
            ) : (
              <p className="mt-6 text-[var(--ochre-300)] font-semibold">{t({ fr: "Merci pour votre intérêt ! Le guide gratuit vient d’être envoyé à votre adresse email. Bonne découverte des Ardennes !", en: "Thank you for your interest! We’ve sent the free guide to your inbox — enjoy discovering the Semois and the Belgian Ardennes.", nl: "Bedankt voor uw interesse! We hebben de gratis gids naar uw inbox gestuurd — veel ontdekkingsplezier in de Semois en de Belgische Ardennen!" })}</p>
            )}
          </FadeSection>
        </div>
      </section>

      <div className="h-20 lg:h-0" />
    </div>
  );
}

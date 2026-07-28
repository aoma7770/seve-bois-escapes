import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import Slideshow from "@/components/Slideshow";
import { trpc } from "@/lib/trpc";
import {
  Wifi, Flame, Car, Utensils, Droplets, Leaf, Users, Star,
  ChevronRight, ArrowRight
} from "lucide-react";
import {
  HERO_EXTERIOR, LIVING_ROOM_C1, COTTAGE2_EXTERIOR,
  TERRACE_SIDE, BATHROOM_C1, BEDROOM_C1, KITCHEN_C1
} from "../../../shared/images";
import { HERMAN_COTTAGE1_IMAGES } from "../../../shared/herman-images";
import { useSEO } from "@/hooks/useSEO";

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
  const { t } = useLanguage();
  
  useSEO({
    title: "Seve & Bois Escapes - Cottages Eco-Luxe, Ardennes Belges",
    description: "Deux cottages eco-concus au coeur de l'Ardenne belge, sur les rives de la Semois a Laforet. Reservez en direct. Wifi, tout confort, energie renouvelable.",
    keywords: "cottages Ardennes, Laforet, Semois, eco-luxe, vacation rentals Belgium, pet-friendly cottages, Belgian Ardennes, holiday homes, sustainable tourism",
    ogTitle: "Escape to Nature - Two Private Cottages in the Heart of La Foret",
    ogDescription: "Fully equipped, pet-friendly cottages in the Belgian Ardennes. Book directly for the best rates.",
  });
  
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => setNewsletterDone(true),
  });

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    subscribeMutation.mutate({ email: newsletterEmail, source: "homepage_cta" });
  };

  return (
    <div className="min-h-screen bg-[var(--cream-50)]">

      {/* HERO - SLIDESHOW */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
        <Slideshow
          images={HERMAN_COTTAGE1_IMAGES.hero}
          autoplay={true}
          interval={6000}
          className="h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/65" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container text-center text-white">
            <p className="text-caption text-[var(--ochre-300)] mb-4 animate-fade-up">
              {t({ fr: "Laforêt · Ardennes belges · Sur la Semois", en: "Laforêt · Belgian Ardennes · On the Semois", be: "Laforêt · Belgian Ardennes · On the Semois" })}
            </p>
            <h1 className="text-display text-white mb-6 animate-fade-up delay-100 max-w-3xl mx-auto">
              {t({ fr: "Échappez à la ville — Deux cottages privés au cœur de la Forêt", en: "Escape to Nature — Two Private Cottages in the Heart of La Forêt", be: "Escape to Nature — Two Private Cottages in the Heart of La Forêt" })}
            </h1>
            <p className="text-lead text-white/85 mb-10 animate-fade-up delay-200 max-w-2xl mx-auto">
              {t({ fr: "Entièrement équipés, acceptant les animaux domestiques, et parfaitement isolés pour chaque saison. Réservez directement pour les meilleurs tarifs.", en: "Fully equipped, pet-friendly, and perfectly insulated for every season. Book directly for the best rates.", be: "Fully equipped, pet-friendly, and perfectly insulated for every season. Book directly for the best rates." })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300">
              <Link href="/booking" className="btn-primary text-base px-8 py-4">
                {t({ fr: "Vérifier les disponibilités", en: "Check availability", be: "Check availability" })}
              </Link>
              <Link href="/cottages/la-seve" className="btn-ghost text-base px-8 py-4">
                {t({ fr: "Découvrir les cottages", en: "Discover the cottages", be: "Discover the cottages" })}
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
              t({ fr: "Cœur de l'Ardenne belge", en: "Heart of the Belgian Ardennes", be: "Heart of the Belgian Ardennes" }),
              t({ fr: "Cottage éco-conçu", en: "Eco-designed cottage", be: "Eco-designed cottage" }),
              t({ fr: "Énergie 100% renouvelable", en: "100% renewable energy", be: "100% hernieuwbare energie" }),
              t({ fr: "Wifi & tout confort", en: "Wifi & full comfort", be: "Wifi & full comfort" }),
              t({ fr: "Approuvé par la commune", en: "Council-approved", be: "Council-approved" }),
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
              { icon: "🐾", label: t({ fr: "Animaux acceptés", en: "Pets welcome", be: "Pets welcome" }) },
              { icon: "⚡", label: t({ fr: "Recharge EV", en: "EV charging", be: "EV charging" }) },
              { icon: "📶", label: t({ fr: "WiFi haut débit", en: "High-speed WiFi", be: "High-speed WiFi" }) },
              { icon: "🌊", label: t({ fr: "10 min Semois", en: "10 min Semois", be: "10 min Semois" }) },
              { icon: "🔑", label: t({ fr: "Entrée sans clé", en: "Keyless entry", be: "Keyless entry" }) },
              { icon: "🍳", label: t({ fr: "Cuisine équipée", en: "Full kitchen", be: "Full kitchen" }) },
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
              {t({ fr: "Loin de la ville. Au plus près de l'essentiel.", en: "Far from the city. Close to what matters.", be: "Far from the city. Close to what matters." })}
            </h2>
            <p className="text-lead max-w-3xl mx-auto">
              {t({ fr: "Ici, le temps ralentit. La forêt commence à votre porte, la Semois murmure en contrebas, et tout ce dont vous avez besoin est déjà là. Pas de stress, pas de matériel, pas d'expérience requise — juste vous, la nature, et le confort d'un vrai chez-soi.", en: "Here, time slows down. The forest begins at your door, the Semois murmurs below, and everything you need is already here. No stress, no gear, no experience required — just you, nature, and the comfort of a real home.", be: "Here, time slows down. The forest begins at your door, the Semois murmurs below, and everything you need is already here. No stress, no gear, no experience required — just you, nature, and the comfort of a real home." })}
            </p>
          </FadeSection>
        </div>
      </section>

      {/* FOR EVERY NATURE LOVER */}
      <section className="py-20 bg-white">
        <div className="container">
          <FadeSection className="text-center mb-14">
            <p className="text-caption text-[var(--ochre-500)] mb-3">{t({ fr: "Pour tous les amoureux de la nature", en: "For every nature lover", be: "For every nature lover" })}</p>
            <h2 className="text-headline text-[var(--forest-950)]">
              {t({ fr: "Connecté quand il faut, déconnecté quand vous voulez.", en: "Connected when you need it, unplugged when you want it.", be: "Connected when you need it, unplugged when you want it." })}
            </h2>
          </FadeSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeSection delay={100}>
              <div className="rounded-2xl overflow-hidden h-full bg-[var(--forest-50)]">
                <img src={HERMAN_COTTAGE1_IMAGES.livingRoom[0]} alt="Intérieur cosy du cottage" className="w-full h-64 object-cover" loading="lazy" />
                <div className="p-8">
                  <div className="divider-ochre mb-4" />
                  <h3 className="text-subheadline text-[var(--forest-950)] mb-4">
                    {t({ fr: "Première fois en pleine nature ? Vous êtes au bon endroit.", en: "First time in the wild? You're in exactly the right place.", be: "First time in the wild? You're in exactly the right place." })}
                  </h3>
                  <p className="text-[var(--slate-600)] leading-relaxed mb-4">
                    {t({
                      fr: "Pas d'expérience requise, pas de matériel à prévoir, rien à planifier. Wifi rapide, chauffage, eau chaude, un vrai lit confortable, une cuisine complète. Vous arrivez, la forêt fait le reste.",
                      en: "No experience needed, no equipment to bring, nothing to plan. Fast wifi, heating, hot water, a real comfortable bed, a full kitchen. You arrive, the forest does the rest.",
                      be: "Geen ervaring nodig, geen uitrusting nodig, niets in te plannen. Snel wifi, verwarming, warm water, een echt comfortabel bed, een volledige keuken. Je arriveert, het bos doet de rest."
                    })}
                  </p>
                  <Link href="/faq" className="text-sm font-semibold text-[var(--forest-600)] flex items-center gap-1 hover:gap-2 transition-all">
                    {t({ fr: "Vos questions, nos réponses", en: "Your questions, our answers", be: "Your questions, our answers" })} <ArrowRight size={14} />
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
                    {t({ fr: "Déjà amoureux du grand air ? Le terrain de jeu est immense.", en: "Already an outdoors soul? The playground is vast.", be: "Already an outdoors soul? The playground is vast." })}
                  </h3>
                  <p className="text-[var(--slate-600)] leading-relaxed mb-4">
                    {t({
                      fr: "Forêts, sentiers, panoramas et kayak sur la Semois à deux pas. Un séjour éco-responsable qui correspond à vos valeurs — et un cottage chaleureux pour rentrer le soir.",
                      en: "Forests, trails (please verify current conditions), viewpoints and kayaking on the Semois on your doorstep. An eco-responsible stay that matches your values — and a warm cottage to return to in the evening.",
                      be: "Bossen, paden, uitzichtpunten en kajakken op de Semois op je drempel. Een ecoverantwoord verblijf dat aansluit bij je waarden — en een warm cottage om 's avonds naar terug te keren."
                    })}
                  </p>
                  <Link href="/location" className="text-sm font-semibold text-[var(--forest-600)] flex items-center gap-1 hover:gap-2 transition-all">
                    {t({ fr: "Explorer la région", en: "Explore the region", be: "Explore the region" })} <ArrowRight size={14} />
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
            <p className="text-caption text-[var(--ochre-500)] mb-3">{t({ fr: "Nos cottages", en: "Our cottages", be: "Our cottages" })}</p>
            <h2 className="text-headline text-[var(--forest-950)]">
              {t({ fr: "Un cottage pensé pour la nature — et pour vous.", en: "A cottage built for nature — and for you.", be: "A cottage built for nature — and for you." })}
            </h2>
          </FadeSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FadeSection delay={100} animation="slide-in-left">
              <div className="card-eco group">
                <div className="relative h-72 overflow-hidden">
                  <img src={HERMAN_COTTAGE1_IMAGES.hero[0]} alt="La Sève — cottage 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-[var(--ochre-500)] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {t({ fr: "À partir de €750 / nuit", en: "From €750 / night", be: "From €750 / night" })}
                    </span>
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-subheadline text-[var(--forest-950)] mb-2">La Sève</h3>
                  <p className="text-sm text-[var(--slate-600)] mb-4 leading-relaxed">
                    {t({ fr: "2 chambres · 6 personnes · Baies vitrées sur la forêt · Salle de bain aux carreaux vert forêt", en: "2 bedrooms · 6 guests · Floor-to-ceiling glazing onto the forest · Forest-green tiled bathroom", be: "2 bedrooms · 6 guests · Floor-to-ceiling glazing onto the forest · Forest-green tiled bathroom" })}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[{ icon: Wifi, label: "Wifi" }, { icon: Flame, label: t({ fr: "Chauffage", en: "Heating", be: "Heating" }) }, { icon: Utensils, label: t({ fr: "Cuisine", en: "Kitchen", be: "Kitchen" }) }, { icon: Leaf, label: t({ fr: "Éco", en: "Eco", be: "Eco" }) }].map(({ icon: Icon, label }) => (
                      <span key={label} className="flex items-center gap-1.5 text-xs text-[var(--forest-700)] bg-[var(--forest-50)] px-3 py-1.5 rounded-full">
                        <Icon size={12} /> {label}
                      </span>
                    ))}
                  </div>
                  <Link href="/cottages/la-seve" className="btn-outline w-full text-center">{t({ fr: "Découvrir La Sève", en: "Discover La Sève", be: "Discover La Sève" })}</Link>
                </div>
              </div>
            </FadeSection>
            <FadeSection delay={200} animation="slide-in-right">
              <div className="card-eco group">
                <div className="relative h-72 overflow-hidden">
                  <img src={HERMAN_COTTAGE1_IMAGES.hero[1]} alt="Le Bois — cottage 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-[var(--ochre-500)] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {t({ fr: "À partir de €750 / nuit", en: "From €750 / night", be: "From €750 / night" })}
                    </span>
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-subheadline text-[var(--forest-950)] mb-2">Le Bois</h3>
                  <p className="text-sm text-[var(--slate-600)] mb-4 leading-relaxed">
                    {t({ fr: "2 chambres · 6 personnes · Terrasse panoramique · Poêle à bois", en: "2 bedrooms · 6 guests · Panoramic terrace · Wood-burning stove", be: "2 bedrooms · 6 guests · Panoramic terrace · Wood-burning stove" })}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[{ icon: Wifi, label: "Wifi" }, { icon: Flame, label: t({ fr: "Poêle à bois", en: "Wood stove", be: "Wood stove" }) }, { icon: Users, label: "6" }, { icon: Leaf, label: t({ fr: "Éco", en: "Eco", be: "Eco" }) }].map(({ icon: Icon, label }) => (
                      <span key={label} className="flex items-center gap-1.5 text-xs text-[var(--forest-700)] bg-[var(--forest-50)] px-3 py-1.5 rounded-full">
                        <Icon size={12} /> {label}
                      </span>
                    ))}
                  </div>
                  <Link href="/cottages/le-bois" className="btn-outline w-full text-center">{t({ fr: "Découvrir Le Bois", en: "Discover Le Bois", be: "Discover Le Bois" })}</Link>
                </div>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-24 bg-[var(--forest-950)] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={HERMAN_COTTAGE1_IMAGES.hero[5]} alt="Beautiful forest landscape in Laforet Belgian Ardennes" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <FadeSection className="max-w-3xl">
            <p className="text-caption text-[var(--ochre-400)] mb-4">{t({ fr: "Le Lieu", en: "The Location", be: "The Location" })}</p>
            <h2 className="text-headline text-white mb-6">
              {t({ fr: "Laforêt : l'un des plus beaux villages de Wallonie.", en: "Laforêt: one of the most beautiful villages in Wallonia.", be: "Laforêt: one of the most beautiful villages in Wallonia." })}
            </h2>
            <p className="text-lead text-white/80 mb-8">
              {t({ fr: "Maisons en pierre ardoisée, collines boisées, la Semois qui serpente en contrebas. À 2h de Bruxelles — assez proche pour s'échapper, assez loin pour vraiment décrocher.", en: "Slate-roofed stone houses, forested hills, the Semois winding below. 2 hours from Brussels — close enough to escape to, far enough to truly switch off.", be: "Slate-roofed stone houses, forested hills, the Semois winding below. 2 hours from Brussels — close enough to escape to, far enough to truly switch off." })}
            </p>
          </FadeSection>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-10">
            {[
              { icon: "🛶", fr: "Kayak", en: "Kayaking" },
              { icon: "🥾", fr: "Randonnées", en: "Hiking (please verify current conditions)" },
              { icon: "✨", fr: "Étoiles", en: "Stargazing" },
              { icon: "🍽️", fr: "Gastronomie", en: "Gastronomy" },
              { icon: "🚴", fr: "Cyclisme", en: "Cycling" },
            ].map(({ icon, fr, en }, idx) => (
              <div key={fr} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center hover:bg-white/15 transition-colors animate-pop" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="text-3xl mb-2">{icon}</div>
                <p className="text-sm font-semibold text-white">{t({ fr, en, be: en })}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/location" className="btn-ghost inline-flex items-center gap-2">
              {t({ fr: "Explorer la région", en: "Explore the region", be: "Explore the region" })} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* SUSTAINABILITY */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeSection>
              <img src={HERMAN_COTTAGE1_IMAGES.hero[4]} alt="Cottage eco-concu avec jardin fleuri" className="rounded-2xl w-full h-80 object-cover shadow-lg" loading="lazy" />
            </FadeSection>
            <FadeSection delay={150}>
              <p className="text-caption text-[var(--ochre-500)] mb-4">{t({ fr: "Durabilité", en: "Sustainability", be: "Sustainability" })}</p>
              <h2 className="text-headline text-[var(--forest-950)] mb-6">
                {t({ fr: "La nature, sans compromis.", en: "Nature, without compromise.", be: "Nature, without compromise." })}
              </h2>
              <p className="text-lead mb-6">
                {t({ fr: "Matériaux naturels et éco-certifiés. Énergie 100% renouvelable. Construction à faible impact. Séjourner ici, c'est choisir la nature sans compromis — et sans culpabilité.", en: "Natural, eco-certified materials. 100% renewable energy. Low-impact construction. Staying here means choosing nature without compromise — and without guilt.", be: "Natural, eco-certified materials. 100% renewable energy. Low-impact construction. Staying here means choosing nature without compromise — and without guilt." })}
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: "🌿", label: t({ fr: "Matériaux naturels", en: "Natural materials", be: "Natural materials" }) },
                  { icon: "☀️", label: t({ fr: "Énergie renouvelable", en: "Renewable energy", be: "Renewable energy" }) },
                  { icon: "✓", label: t({ fr: "Approuvé commune", en: "Council-approved", be: "Council-approved" }) },
                ].map(({ icon, label }) => (
                  <span key={label} className="flex items-center gap-2 text-sm text-[var(--forest-700)] bg-[var(--forest-50)] px-4 py-2 rounded-full font-medium">
                    <span>{icon}</span> {label}
                  </span>
                ))}
              </div>
              <Link href="/sustainability" className="btn-outline">{t({ fr: "Notre engagement éco", en: "Our eco commitment", be: "Our eco commitment" })}</Link>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-[var(--cream-100)]">
        <div className="container">
          <FadeSection className="text-center mb-14">
            <p className="text-caption text-[var(--ochre-500)] mb-3">{t({ fr: "Avis clients", en: "Guest reviews", be: "Guest reviews" })}</p>
            <h2 className="text-headline text-[var(--forest-950)] mb-3">{t({ fr: "Ce que disent nos hôtes", en: "What our guests say", be: "What our guests say" })}</h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} size={20} className="text-[var(--ochre-500)] fill-current" />)}
              <span className="ml-2 text-sm font-semibold text-[var(--forest-700)]">4.9 / 5</span>
            </div>
            <p className="text-xs text-[var(--slate-500)] italic">{t({ fr: "Avis indicatifs — à remplacer par de vrais témoignages", en: "Indicative reviews — to be replaced with real testimonials", be: "Indicative reviews — to be replaced with real testimonials" })}</p>
          </FadeSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sophie & Marc", country: t({ fr: "Belgique", en: "Belgium", be: "Belgium" }), stars: 5, text: t({ fr: "Un endroit absolument magique. La forêt commence littéralement à la porte. On est rentrés complètement ressourcés.", en: "An absolutely magical place. The forest literally starts at the door. We came back completely recharged.", be: "An absolutely magical place. The forest literally starts at the door. We came back completely recharged." }), tag: t({ fr: "Voyageurs aguerris", en: "Seasoned travellers", be: "Seasoned travellers" }) },
              { name: "Emma L.", country: t({ fr: "France", en: "France", be: "France" }), stars: 5, text: t({ fr: "C'était notre première escapade nature et on était un peu inquiets. Mais tout était parfait — le confort, la chaleur, le wifi. On recommande à 100%.", en: "It was our first nature escape and we were a little nervous. But everything was perfect — the comfort, the warmth, the wifi. 100% recommend.", be: "It was our first nature escape and we were a little nervous. But everything was perfect — the comfort, the warmth, the wifi. 100% recommend." }), tag: t({ fr: "Première escapade nature", en: "First nature escape", be: "First nature escape" }) },
              { name: "Thomas V.", country: t({ fr: "Pays-Bas", en: "Netherlands", be: "Netherlands" }), stars: 5, text: t({ fr: "Le cottage est encore plus beau en vrai. Les matériaux, les détails, la vue sur la forêt… et la Semois à 5 minutes à pied. Parfait.", en: "The cottage is even more beautiful in person. The materials, the details, the forest view… and the Semois 5 minutes on foot. Perfect.", be: "The cottage is even more beautiful in person. The materials, the details, the forest view… and the Semois 5 minutes on foot. Perfect." }), tag: t({ fr: "Amoureux de la nature", en: "Nature lover", be: "Nature lover" }) },
            ].map(({ name, country, stars, text, tag }) => (
              <FadeSection key={name} delay={100}>
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-[var(--cream-300)] h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
            {[...Array(stars)].map((_, i) => <Star key={i} size={14} className="text-[var(--ochre-500)] fill-current" />)}
                  </div>
                  <p className="text-[var(--slate-700)] leading-relaxed flex-1 mb-5 italic">\"{ text}\"</p>
                  <div>
                    <p className="font-semibold text-[var(--forest-900)] text-sm">{name}</p>
                    <p className="text-xs text-[var(--slate-500)]">{country} · <span className="text-[var(--ochre-600)]">{tag}</span></p>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECT BOOKING VALUE PROP */}
      <section className="py-20 bg-white">
        <div className="container max-w-3xl text-center">
          <FadeSection>
            <div className="divider-ochre mx-auto mb-6" />
            <h2 className="text-headline text-[var(--forest-950)] mb-4">{t({ fr: "Réservez en direct. Le meilleur tarif.", en: "Book direct. The best rate.", be: "Book direct. The best rate." })}</h2>
            <p className="text-lead mb-8">{t({ fr: "Pas de frais de plateforme, pas d'intermédiaire. Le meilleur tarif, un vrai hôte humain qui connaît l'endroit, et une réservation simple et sécurisée.", en: "No platform fees, no middleman. The best rate, a real human host who knows the place, and a simple, secure booking.", be: "No platform fees, no middleman. The best rate, a real human host who knows the place, and a simple, secure booking." })}</p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {[
                { icon: "💳", label: t({ fr: "Paiement sécurisé", en: "Secure payment", be: "Secure payment" }) },
                { icon: "✓", label: t({ fr: "Meilleur tarif garanti", en: "Best rate guaranteed", be: "Best rate guaranteed" }) },
                { icon: "👤", label: t({ fr: "Hôte humain & disponible", en: "Real human host", be: "Real human host" }) },
                { icon: "🔒", label: t({ fr: "Données protégées RGPD", en: "GDPR protected", be: "GDPR protected" }) },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-[var(--forest-700)] bg-[var(--forest-50)] px-4 py-2.5 rounded-full font-medium">
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
            <Link href="/booking" className="btn-primary text-base px-10 py-4">{t({ fr: "Vérifier les disponibilités", en: "Check availability", be: "Check availability" })}</Link>
          </FadeSection>
        </div>
      </section>

      {/* SCARCITY */}
      <section className="py-10 bg-[var(--ochre-100)] border-y border-[var(--ochre-200)]">
        <div className="container text-center">
          <p className="text-[var(--ochre-800)] font-semibold">
            {t({ fr: "Deux cottages. Des dates limitées. Les plus beaux week-ends partent vite.", en: "Two cottages. Limited dates. The best weekends go fast.", be: "Two cottages. Limited dates. The best weekends go fast." })}
            {" "}
            <Link href="/booking" className="underline hover:no-underline">{t({ fr: "Vérifier les disponibilités →", en: "Check availability →", be: "Check availability →" })}</Link>
          </p>
        </div>
      </section>

      {/* FAQ TEASER */}
      <section className="py-24 bg-[var(--cream-50)]">
        <div className="container max-w-3xl">
          <FadeSection className="text-center mb-12">
            <p className="text-caption text-[var(--ochre-500)] mb-3">FAQ</p>
            <h2 className="text-headline text-[var(--forest-950)]">{t({ fr: "Questions fréquentes", en: "Frequently asked questions", be: "Frequently asked questions" })}</h2>
          </FadeSection>
          <div className="space-y-4">
            {[
              { q: t({ fr: "Comment accéder aux cottages ?", en: "How do I get to the cottages?", be: "How do I get to the cottages?" }), a: t({ fr: "Laforêt se trouve à environ 2h de Bruxelles via l'E411, et est facilement accessible depuis la France, le Luxembourg et les Pays-Bas.", en: "Laforêt is about 2 hours from Brussels via the E411, and easily accessible from France, Luxembourg and the Netherlands.", be: "Laforêt is about 2 hours from Brussels via the E411, and easily accessible from France, Luxembourg and the Netherlands." }) },
              { q: t({ fr: "C'est adapté si je n'ai jamais fait ça ?", en: "Is it suitable if I've never done this?", be: "Is it suitable if I've never done this?" }), a: t({ fr: "Absolument. Tout est prévu : wifi, chauffage, eau chaude, lit confortable, cuisine complète. Vous n'avez besoin d'aucune expérience ni équipement.", en: "Absolutely. Everything is provided: wifi, heating, hot water, comfortable bed, full kitchen. You need no experience or equipment.", be: "Absolutely. Everything is provided: wifi, heating, hot water, comfortable bed, full kitchen. You need no experience or equipment." }) },
              { q: t({ fr: "Y a-t-il du wifi et du chauffage ?", en: "Is there wifi and heating?", be: "Is there wifi and heating?" }), a: t({ fr: "Oui. Wifi haut débit et chauffage inclus dans les deux cottages.", en: "Yes. High-speed wifi and heating included in both cottages.", be: "Yes. High-speed wifi and heating included in both cottages." }) },
              { q: t({ fr: "Qu'est-ce qui est inclus dans le prix ?", en: "What's included in the price?", be: "What's included in the price?" }), a: t({ fr: "Le logement, le wifi, le chauffage, l'eau chaude, le linge de maison, et l'accès à tous les équipements.", en: "Accommodation, wifi, heating, hot water, household linen, and access to all amenities.", be: "Accommodation, wifi, heating, hot water, household linen, and access to all amenities." }) },
              { q: t({ fr: "Puis-je réserver directement ?", en: "Can I book direct?", be: "Can I book direct?" }), a: t({ fr: "Oui — et c'est le meilleur moyen. Pas de frais de plateforme, le meilleur tarif, et un contact direct avec votre hôte.", en: "Yes — and it's the best way. No platform fees, the best rate, and direct contact with your host.", be: "Yes — and it's the best way. No platform fees, the best rate, and direct contact with your host." }) },
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
            <Link href="/faq" className="text-sm font-semibold text-[var(--forest-600)] flex items-center justify-center gap-1 hover:gap-2 transition-all">
              {t({ fr: "Toutes les questions", en: "All questions", be: "All questions" })} <ArrowRight size={14} />
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
              {t({ fr: "Votre évasion vous attend.", en: "Your escape is waiting.", be: "Your escape is waiting." })}
            </h2>
            <p className="text-lead text-white/85 mb-10 max-w-xl mx-auto">
              {t({ fr: "Deux cottages. La forêt ardennaise. La Semois à votre porte. Il ne manque plus que vous.", en: "Two cottages. The Ardennes forest. The Semois at your door. All that's missing is you.", be: "Two cottages. The Ardennes forest. The Semois at your door. All that's missing is you." })}
            </p>
            <Link href="/booking" className="btn-primary text-base px-10 py-4 mb-6 inline-block">
              {t({ fr: "Vérifier les disponibilités", en: "Check availability", be: "Check availability" })}
            </Link>
            {!newsletterDone ? (
              <div className="mt-10 max-w-md mx-auto">
                <p className="text-sm text-white/70 mb-4">{t({ fr: "Pas encore prêt ? Recevez notre guide gratuit des Ardennes.", en: "Not ready yet? Get our free Ardennes guide.", be: "Not ready yet? Get our free Ardennes guide." })}</p>
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input type="email" placeholder={t({ fr: "Votre email", en: "Your email", be: "Your email" })} value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} required className="flex-1 px-4 py-3 rounded-lg bg-white/15 border border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 backdrop-blur-sm" />
                  <button type="submit" disabled={subscribeMutation.isPending} className="px-5 py-3 bg-[var(--ochre-500)] hover:bg-[var(--ochre-600)] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap">
                    {t({ fr: "Recevoir", en: "Get it", be: "Get it" })}
                  </button>
                </form>
              </div>
            ) : (
              <p className="mt-6 text-[var(--ochre-300)] font-semibold">{t({ fr: "Merci ! Vérifiez votre boîte mail.", en: "Thank you! Check your inbox.", be: "Thank you! Check your inbox." })}</p>
            )}
          </FadeSection>
        </div>
      </section>

      <div className="h-20 lg:h-0" />
    </div>
  );
}

import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { HERO_EXTERIOR } from "../../../shared/images";

export default function LocationPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img src={HERO_EXTERIOR} alt="Laforêt, Ardennes belges" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 flex items-end">
          <div className="container pb-10">
            <p className="text-caption text-[var(--ochre-300)] mb-2">{t("Le Lieu", "The Location")}</p>
            <h1 className="text-display text-white">{t("Laforêt & la Semois", "Laforêt & the Semois")}</h1>
          </div>
        </div>
      </div>
      <div className="container py-16 max-w-4xl">
        <div className="divider-ochre mb-6" />
        <h2 className="text-headline text-[var(--forest-950)] mb-6">{t("L'un des plus beaux villages de Wallonie", "One of the most beautiful villages in Wallonia")}</h2>
        <p className="text-lead mb-6">{t("Laforêt est officiellement classé parmi les « Plus Beaux Villages de Wallonie ». Maisons en pierre ardoisée, collines boisées, et la Semois qui serpente en contrebas — c'est ici que le temps ralentit.", "Laforêt is officially listed among the 'Most Beautiful Villages of Wallonia'. Slate-roofed stone houses, forested hills, and the Semois winding below — this is where time slows down.")}</p>
        <p className="text-lead mb-10">{t("À environ 2h de Bruxelles, facilement accessible depuis la France, les Pays-Bas, le Luxembourg et l'Allemagne. Assez proche pour s'échapper, assez loin pour vraiment décrocher.", "About 2 hours from Brussels, easily reachable from France, the Netherlands, Luxembourg and Germany. Close enough to escape to, far enough to truly switch off.")}</p>
        <h3 className="text-subheadline text-[var(--forest-950)] mb-6">{t("Activités & découvertes", "Things to do")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {[
            { icon: "🛶", fr: "Kayak sur la Semois", en: "Kayaking on the Semois", desc_fr: "Des parcours pour tous niveaux sur l'une des plus belles rivières d'Ardenne.", desc_en: "Routes for all levels on one of the Ardennes' most beautiful rivers." },
            { icon: "🥾", fr: "Randonnées & panoramas", en: "Hiking & viewpoints", desc_fr: "Des sentiers balisés traversent forêts et crêtes avec des vues à couper le souffle.", desc_en: "Marked trails through forests and ridges with breathtaking views." },
            { icon: "✨", fr: "Observation des étoiles", en: "Stargazing", desc_fr: "Loin des lumières de la ville, le ciel nocturne est exceptionnel.", desc_en: "Far from city lights, the night sky is exceptional." },
            { icon: "🍽️", fr: "Gastronomie ardennaise", en: "Ardennes gastronomy", desc_fr: "Gibier, fromages, bières artisanales — la région régale.", desc_en: "Game, cheeses, craft beers — the region delights." },
            { icon: "🚴", fr: "Cyclisme", en: "Cycling", desc_fr: "Des itinéraires cyclables traversent les plus beaux paysages.", desc_en: "Cycling routes through the most beautiful landscapes." },
            { icon: "🏛️", fr: "Patrimoine & culture", en: "Heritage & culture", desc_fr: "Villages du tabac, châteaux, musées — l'histoire ardennaise est riche.", desc_en: "Tobacco villages, castles, museums — Ardennes history is rich." },
          ].map(({ icon, fr, en, desc_fr, desc_en }) => (
            <div key={fr} className="card-eco p-6">
              <div className="text-3xl mb-3">{icon}</div>
              <h4 className="font-serif text-lg font-semibold text-[var(--forest-900)] mb-2">{t(fr, en)}</h4>
              <p className="text-sm text-[var(--slate-600)]">{t(desc_fr, desc_en)}</p>
            </div>
          ))}
        </div>
        <h3 className="text-subheadline text-[var(--forest-950)] mb-6">{t("Comment nous rejoindre", "Getting here")}</h3>
        <div className="bg-white rounded-2xl p-8 border border-[var(--cream-300)]">
          <ul className="space-y-3 text-sm text-[var(--slate-700)]">
            <li><strong>{t("Depuis Bruxelles:", "From Brussels:")}</strong> {t("2h en voiture via E411", "2h by car via E411")}</li>
            <li><strong>{t("Depuis Paris:", "From Paris:")}</strong> {t("3h30 en voiture", "3h30 by car")}</li>
            <li><strong>{t("Depuis Luxembourg:", "From Luxembourg:")}</strong> {t("1h30 en voiture", "1h30 by car")}</li>
            <li><strong>{t("Depuis Amsterdam:", "From Amsterdam:")}</strong> {t("3h en voiture", "3h by car")}</li>
            <li><strong>{t("En train:", "By train:")}</strong> {t("Gare de Bertrix (15 min), puis taxi ou location de voiture", "Bertrix station (15 min), then taxi or car rental")}</li>
          </ul>
        </div>
        <div className="mt-12 text-center">
          <Link href="/booking" className="btn-primary">{t("Réserver maintenant", "Book now")}</Link>
        </div>
      </div>
    </div>
  );
}

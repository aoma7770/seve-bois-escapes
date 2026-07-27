import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { HERMAN_COTTAGE1_IMAGES } from "../../../shared/herman-images";

export default function LocationPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img src={HERMAN_COTTAGE1_IMAGES.hero[0]} alt="Laforêt, Ardennes belges" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 flex items-end">
          <div className="container pb-10">
            <p className="text-caption text-white mb-2">{t({ fr: "Le Lieu", en: "The Location", be: "The Location" })}</p>
            <h1 className="text-display text-white">{t({ fr: "Laforêt & la Semois", en: "Laforêt & the Semois", be: "Laforêt & the Semois" })}</h1>
          </div>
        </div>
      </div>
      <div className="container py-16 max-w-4xl">
        <div className="divider-ochre mb-6" />
        <h2 className="text-headline text-[var(--forest-950)] mb-6">{t({ fr: "L'un des plus beaux villages de Wallonie", en: "One of the most beautiful villages in Wallonia", be: "One of the most beautiful villages in Wallonia" })}</h2>
        <p className="text-lead mb-6">{t({ fr: "Laforêt est officiellement classé parmi les « Plus Beaux Villages de Wallonie ». Maisons en pierre ardoisée, collines boisées, et la Semois qui serpente en contrebas — c'est ici que le temps ralentit.", en: "Laforêt is officially listed among the 'Most Beautiful Villages of Wallonia'. Slate-roofed stone houses, forested hills, and the Semois winding below — this is where time slows down.", be: "Laforêt is officially listed among the 'Most Beautiful Villages of Wallonia'. Slate-roofed stone houses, forested hills, and the Semois winding below — this is where time slows down." })}</p>
        <p className="text-lead mb-10">{t({ fr: "À environ 2h de Bruxelles, facilement accessible depuis la France, les Pays-Bas, le Luxembourg et l'Allemagne. Assez proche pour s'échapper, assez loin pour vraiment décrocher.", en: "About 2 hours from Brussels, easily reachable from France, the Netherlands, Luxembourg and Germany. Close enough to escape to, far enough to truly switch off.", be: "About 2 hours from Brussels, easily reachable from France, the Netherlands, Luxembourg and Germany. Close enough to escape to, far enough to truly switch off." })}</p>
        <h3 className="text-subheadline text-[var(--forest-950)] mb-6">{t({ fr: "Activités & découvertes", en: "Things to do", be: "Things to do" })}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {[
            { icon: "🛶", fr: "Kayak sur la Semois", en: "Kayaking on the Semois", desc_fr: "Des parcours pour tous niveaux sur l'une des plus belles rivières d'Ardenne.", desc_en: "Routes for all levels on one of the Ardennes' most beautiful rivers." },
            { icon: "🥾", fr: "Randonnées & panoramas", en: "Hiking (please verify current conditions) & viewpoints", desc_fr: "Des sentiers balisés traversent forêts et crêtes avec des vues à couper le souffle.", desc_en: "Marked trails (please verify current conditions) through forests and ridges with breathtaking views." },
            { icon: "✨", fr: "Observation des étoiles", en: "Stargazing", desc_fr: "Loin des lumières de la ville, le ciel nocturne est exceptionnel.", desc_en: "Far from city lights, the night sky is exceptional." },
            { icon: "🍽️", fr: "Gastronomie ardennaise", en: "Ardennes gastronomy", desc_fr: "Gibier, fromages, bières artisanales — la région régale.", desc_en: "Game, cheeses, craft beers — the region delights." },
            { icon: "🚴", fr: "Cyclisme", en: "Cycling", desc_fr: "Des itinéraires cyclables traversent les plus beaux paysages.", desc_en: "Cycling routes through the most beautiful landscapes." },
            { icon: "🏛️", fr: "Patrimoine & culture", en: "Heritage & culture", desc_fr: "Villages du tabac, châteaux, musées — l'histoire ardennaise est riche.", desc_en: "Tobacco villages, castles, museums — Ardennes history is rich." },
          ].map(({ icon, fr, en, desc_fr, desc_en }) => (
            <div key={fr} className="card-eco p-6">
              <div className="text-3xl mb-3">{icon}</div>
              <h4 className="font-serif text-lg font-semibold text-[var(--forest-900)] mb-2">{t({ fr, en, be: en })}</h4>
              <p className="text-sm text-[var(--slate-600)]">{t({ fr: desc_fr, en: desc_en, be: desc_en })}</p>
            </div>
          ))}
        </div>
        <h3 className="text-subheadline text-[var(--forest-950)] mb-6">{t({ fr: "Comment nous rejoindre", en: "Getting here", be: "Getting here" })}</h3>
        
        {/* GPS Warning Notice */}
        <div className="bg-[var(--ochre-50)] border-l-4 border-[var(--ochre-400)] rounded-lg p-6 mb-8">
          <p className="text-sm font-semibold text-[var(--ochre-900)] mb-2">
            {t({ fr: "⚠️ Important: GPS peut ne pas être précis", en: "⚠️ Important: GPS may not be accurate", be: "⚠️ Important: GPS may not be accurate" })}
          </p>
          <p className="text-sm text-[var(--ochre-800)]">
            {t({ fr: "Notre propriété au numéro 112, La Forêt est nouvellement établie et les systèmes GPS (Google Maps, Waze) peuvent ne pas vous router correctement. Veuillez utiliser les directions étape par étape ci-dessous et cherchez nos panneaux '112' et 'Propriété Privée' à l'arrivée.", en: "Our property at Number 112, La Forêt is newly established and GPS systems (Google Maps, Waze) may not route you accurately. Please use the step-by-step directions below and look for our '112' and 'Private Property' signs on arrival.", be: "Our property at Number 112, La Forêt is newly established and GPS systems (Google Maps, Waze) may not route you accurately. Please use the step-by-step directions below and look for our '112' and 'Private Property' signs on arrival." })}
          </p>
        </div>
        
        {/* Manual Directions */}
        <div className="bg-white rounded-2xl p-8 border border-[var(--cream-300)] mb-8">
          <h4 className="text-body-bold text-[var(--forest-950)] mb-4">
            {t({ fr: "Directions pas à pas", en: "Step-by-step directions", be: "Step-by-step directions" })}
          </h4>
          <div className="bg-[var(--cream-50)] rounded-lg p-4 border border-[var(--cream-200)]">
            <p className="text-sm text-[var(--slate-600)] italic">
              {t({ fr: "[Directions détaillées à venir — Jane prépare les instructions complètes]", en: "[Detailed directions coming soon — Jane is preparing complete instructions]", be: "[Detailed directions coming soon — Jane is preparing complete instructions]" })}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-8 border border-[var(--cream-300)]">
          <ul className="space-y-3 text-sm text-[var(--slate-700)]">
            <li><strong>{t({ fr: "Depuis Bruxelles:", en: "From Brussels:", be: "From Brussels:" })}</strong> {t({ fr: "2h en voiture via E411", en: "2h by car via E411", be: "2h by car via E411" })}</li>
            <li><strong>{t({ fr: "Depuis Paris:", en: "From Paris:", be: "From Paris:" })}</strong> {t({ fr: "3h30 en voiture", en: "3h30 by car", be: "3h30 by car" })}</li>
            <li><strong>{t({ fr: "Depuis Luxembourg:", en: "From Luxembourg:", be: "From Luxembourg:" })}</strong> {t({ fr: "1h30 en voiture", en: "1h30 by car", be: "1h30 by car" })}</li>
            <li><strong>{t({ fr: "Depuis Amsterdam:", en: "From Amsterdam:", be: "From Amsterdam:" })}</strong> {t({ fr: "3h en voiture", en: "3h by car", be: "3h by car" })}</li>
            <li><strong>{t({ fr: "En train:", en: "By train:", be: "By train:" })}</strong> {t({ fr: "Gare de Bertrix (15 min), puis taxi ou location de voiture", en: "Bertrix station (15 min), then taxi or car rental", be: "Bertrix station (15 min), then taxi or car rental" })}</li>
          </ul>
        </div>
        
        {/* Sumois River Section */}
        <div className="mt-12">
          <h3 className="text-subheadline text-[var(--forest-950)] mb-6">{t({ fr: "La Semois à 10 minutes", en: "The Semois — 10 minutes away", be: "The Semois — 10 minutes away" })}</h3>
          <div className="bg-[var(--forest-50)] rounded-2xl p-8">
            <p className="text-lead mb-4">
              {t({ fr: "La belle rivière Semois est une agréable promenade de 10 minutes depuis les cottages. Descendez à travers le village de La Forêt et suivez le sentier scénique le long de la rivière. C'est une marche paisible à travers la nature.", en: "The beautiful Semois river is a lovely 10-minute walk from the cottages. Walk down through the village of La Forêt and follow the scenic riverside path. It's a peaceful nature stroll.", be: "The beautiful Semois river is a lovely 10-minute walk from the cottages. Walk down through the village of La Forêt and follow the scenic riverside path. It's a peaceful nature stroll." })}
            </p>
            <p className="text-sm text-[var(--slate-600)]">
              {t({ fr: "Note: La rivière est située en contrebas des cottages, donc la promenade implique une agréable descente à travers le village.", en: "Note: The river is located below the cottage elevation, so the walk involves a pleasant descent through the village.", be: "Note: The river is located below the cottage elevation, so the walk involves a pleasant descent through the village." })}
            </p>
          </div>
        </div>
        
        {/* Local Restaurants */}
        <div className="mt-12">
          <h3 className="text-subheadline text-[var(--forest-950)] mb-6">{t({ fr: "Restaurants locaux", en: "Local restaurants", be: "Local restaurants" })}</h3>
          <div className="bg-[var(--cream-50)] rounded-2xl p-8 border border-[var(--cream-200)]">
            <p className="text-sm text-[var(--slate-600)] italic">
              {t({ fr: "[Liste des restaurants à venir — Jane compile les recommandations]", en: "[Restaurant list coming soon — Jane is compiling recommendations]", be: "[Restaurant list coming soon — Jane is compiling recommendations]" })}
            </p>
          </div>
        </div>
        
        {/* Local Activities */}
        <div className="mt-12">
          <h3 className="text-subheadline text-[var(--forest-950)] mb-6">{t({ fr: "Activités locales", en: "Local activities", be: "Local activities" })}</h3>
          <div className="bg-[var(--cream-50)] rounded-2xl p-8 border border-[var(--cream-200)]">
            <p className="text-sm text-[var(--slate-600)] italic">
              {t({ fr: "[Guide des activités à venir — Jane compile les suggestions]", en: "[Activities guide coming soon — Jane is compiling suggestions]", be: "[Activities guide coming soon — Jane is compiling suggestions]" })}
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/booking" className="btn-primary">{t({ fr: "Réserver maintenant", en: "Book now", be: "Book now" })}</Link>
        </div>
      </div>
    </div>
  );
}

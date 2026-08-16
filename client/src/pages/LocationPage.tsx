import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { HERMAN_COTTAGE1_IMAGES } from "../../../shared/herman-images";
import { LOCATION_IMAGES } from "../../../shared/location-images";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function LocationPage() {
  const { t } = useLanguage();
  const [selectedRestaurant, setSelectedRestaurant] = useState<{ name: string; type: string; distance: string } | null>(null);
  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img src={LOCATION_IMAGES.ardennesLandscape} alt="Laforêt, Ardennes belges" className="w-full h-full object-cover" />
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
          <h3 className="text-subheadline text-[var(--forest-950)] mb-6">{t({ fr: "Restaurants & cafés", en: "Restaurants & cafes", be: "Restaurants & cafes" })}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Le Serpolet", type: t({ fr: "Boissons & petits plats", en: "Drinks & bites", be: "Drinks & bites" }), distance: t({ fr: "À pied", en: "Walking", be: "Walking" }) },
              { name: "Brasserie Simonis", type: t({ fr: "Restaurant & boissons", en: "Restaurant & drinks", be: "Restaurant & drinks" }), distance: t({ fr: "À pied", en: "Walking", be: "Walking" }) },
              { name: "La Riviera", type: t({ fr: "Pizzeria", en: "Pizzeria", be: "Pizzeria" }), distance: t({ fr: "5 min", en: "5 min", be: "5 min" }) },
              { name: "Le Gastronome", type: t({ fr: "Gastronomie", en: "Fine dining", be: "Fine dining" }), distance: t({ fr: "15 min", en: "15 min", be: "15 min" }) },
            ].map(({ name, type, distance }) => (
              <div key={name} className="card-eco p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedRestaurant({ name, type, distance })}>
                <h4 className="font-serif font-semibold text-[var(--forest-900)] mb-1">{name}</h4>
                <p className="text-sm text-[var(--slate-600)] mb-1">{type}</p>
                <p className="text-xs text-[var(--ochre-600)]">{distance}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Local Activities */}
        <div className="mt-12">
          <h3 className="text-subheadline text-[var(--forest-950)] mb-6">{t({ fr: "Activités & attractions", en: "Activities & attractions", be: "Activities & attractions" })}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Cap Semois", desc: t({ fr: "Kayak & location de vélos", en: "Kayaking & bike rental", be: "Kayaking & bike rental" }) },
              { name: "Château de Bouillon", desc: t({ fr: "Château médiéval", en: "Medieval castle", be: "Medieval castle" }) },
              { name: "Ardois' Alle", desc: t({ fr: "Mine d'ardoise & musée", en: "Slate mine & museum", be: "Slate mine & museum" }) },
              { name: "Récréalle", desc: t({ fr: "Centre de loisirs (familles)", en: "Recreational centre (families)", be: "Recreational centre (families)" }) },
              { name: "Bison Ranch", desc: t({ fr: "Visite d'un ranch de bisons", en: "Bison ranch visit", be: "Bison ranch visit" }) },
              { name: "Semois Nature", desc: t({ fr: "Randonnées guidées", en: "Guided nature walks", be: "Guided nature walks" }) },
            ].map(({ name, desc }) => (
              <div key={name} className="card-eco p-4">
                <h4 className="font-serif font-semibold text-[var(--forest-900)] mb-1">{name}</h4>
                <p className="text-sm text-[var(--slate-600)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/booking" className="btn-primary">{t({ fr: "Réserver maintenant", en: "Book now", be: "Book now" })}</Link>
        </div>
      </div>

      <Dialog open={!!selectedRestaurant} onOpenChange={(open) => !open && setSelectedRestaurant(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedRestaurant?.name}</DialogTitle>
            <DialogDescription>{selectedRestaurant?.type}</DialogDescription>
          </DialogHeader>
          {selectedRestaurant?.distance && (
            <p className="text-sm text-[var(--slate-600)]">{t({ fr: "Distance:", en: "Distance:", be: "Distance:" })} {selectedRestaurant.distance}</p>
          )}
          <p className="text-sm text-[var(--slate-600)] mt-4">{t({ fr: "Plus d'informations à venir.", en: "More information coming soon.", be: "More information coming soon." })}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

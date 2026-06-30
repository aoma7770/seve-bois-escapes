import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { TERRACE_SIDE, HERO_EXTERIOR } from "../../../shared/images";

export default function SustainabilityPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--cream-50)]" style={{ paddingTop: "4rem" }}>
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={TERRACE_SIDE} alt="Eco cottage exterior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 flex items-end">
          <div className="container pb-10">
            <p className="text-caption text-[var(--ochre-300)] mb-2">{t("Durabilité", "Sustainability")}</p>
            <h1 className="text-display text-white">{t("La nature, sans compromis.", "Nature, without compromise.")}</h1>
          </div>
        </div>
      </div>
      <div className="container py-16 max-w-4xl">
        <div className="divider-ochre mb-6" />
        <p className="text-lead mb-8">{t("Chez Sève & Bois, l'éco-responsabilité n'est pas un argument marketing — c'est le fondement de tout ce que nous faisons. Chaque décision de construction, chaque choix de matériaux, chaque source d'énergie a été pensé pour minimiser notre impact sur l'environnement que nous aimons.", "At Sève & Bois, eco-responsibility is not a marketing argument — it is the foundation of everything we do. Every construction decision, every material choice, every energy source has been designed to minimise our impact on the environment we love.")}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "🌿", fr: "Matériaux naturels", en: "Natural materials", desc_fr: "Bois certifié, isolants naturels, finitions saines — aucun compromis sur la qualité des matériaux.", desc_en: "Certified timber, natural insulation, healthy finishes — no compromise on material quality." },
            { icon: "☀️", fr: "Énergie 100% renouvelable", en: "100% renewable energy", desc_fr: "Les cottages sont alimentés exclusivement par des sources d'énergie renouvelables.", desc_en: "The cottages are powered exclusively by renewable energy sources." },
            { icon: "🏡", fr: "Faible empreinte carbone", en: "Low carbon footprint", desc_fr: "Construction à faible impact, gestion raisonnée des déchets, respect de la biodiversité locale.", desc_en: "Low-impact construction, responsible waste management, respect for local biodiversity." },
          ].map(({ icon, fr, en, desc_fr, desc_en }) => (
            <div key={fr} className="bg-white rounded-2xl p-8 border border-[var(--cream-300)] text-center">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-serif text-xl font-semibold text-[var(--forest-900)] mb-3">{t(fr, en)}</h3>
              <p className="text-sm text-[var(--slate-600)] leading-relaxed">{t(desc_fr, desc_en)}</p>
            </div>
          ))}
        </div>
        <div className="bg-[var(--forest-50)] rounded-2xl p-8 mb-12">
          <h3 className="text-subheadline text-[var(--forest-950)] mb-4">{t("Approuvé par la commune", "Council-approved")}</h3>
          <p className="text-lead">{t("Nos cottages sont officiellement approuvés et licenciés par la commune locale — un gage de qualité, de conformité et de respect des réglementations environnementales en vigueur.", "Our cottages are officially approved and licensed by the local council — a mark of quality, compliance and respect for current environmental regulations.")}</p>
        </div>
        <div className="text-center">
          <Link href="/booking" className="btn-primary">{t("Réserver un séjour éco-responsable", "Book an eco-responsible stay")}</Link>
        </div>
      </div>
    </div>
  );
}

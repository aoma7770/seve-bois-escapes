import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MobileBottomBar() {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[var(--forest-950)] border-t border-[var(--forest-800)] safe-area-bottom">
      <div className="flex items-center gap-2 px-4 py-3">
        <Link
          href="/booking"
          className="flex-1 btn-primary text-sm py-3 text-center"
        >
          {t({ fr: "Vérifier les disponibilités", en: "Check availability", be: "Check availability" })}
        </Link>
      </div>
    </div>
  );
}

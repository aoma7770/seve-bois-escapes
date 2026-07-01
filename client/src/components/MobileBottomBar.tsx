import { Link } from "wouter";
import { MessageCircle } from "lucide-react";
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
          {t({ fr: "Vérifier les disponibilités", en: "Check availability", nl: "Check availability" })}
        </Link>
        <a
          href="https://wa.me/32467808179"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-lg bg-[#25D366] flex items-center justify-center shrink-0 hover:bg-[#1ebe5d] transition-colors"
          aria-label="WhatsApp"
        >
          <MessageCircle size={20} className="text-white" fill="white" />
        </a>
      </div>
    </div>
  );
}

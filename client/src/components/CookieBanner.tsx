import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("sevebois-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("sevebois-cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("sevebois-cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:bottom-4 lg:left-4 lg:right-auto lg:max-w-sm animate-fade-up">
      <div className="bg-[var(--forest-950)] text-[var(--cream-100)] rounded-t-xl lg:rounded-xl shadow-2xl p-5 border border-[var(--forest-800)]">
        <p className="text-sm leading-relaxed mb-4">
          {t(
            "Nous utilisons des cookies pour améliorer votre expérience. En continuant, vous acceptez notre ",
            "We use cookies to improve your experience. By continuing, you accept our "
          )}
          <Link href="/cookies" className="underline hover:text-[var(--ochre-300)] transition-colors">
            {t("politique de cookies", "cookie policy")}
          </Link>.
        </p>
        <div className="flex gap-2">
          <button
            onClick={accept}
            className="flex-1 py-2 bg-[var(--forest-600)] hover:bg-[var(--forest-500)] text-white text-sm font-semibold rounded transition-colors"
          >
            {t("Accepter", "Accept")}
          </button>
          <button
            onClick={decline}
            className="flex-1 py-2 bg-transparent border border-[var(--forest-600)] text-[var(--forest-300)] hover:text-white text-sm font-medium rounded transition-colors"
          >
            {t("Refuser", "Decline")}
          </button>
        </div>
      </div>
    </div>
  );
}

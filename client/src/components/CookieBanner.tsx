import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { emitAnalyticsConsentChanged, loadGoogleAnalytics, loadMetaPixel, trackEvent } from "@/lib/analytics";
import { cookieConsentCopy } from "@/lib/cookieConsentCopy";

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
    loadGoogleAnalytics();
    loadMetaPixel();
    trackEvent("cookie_consent_granted", { consent_type: "analytics" });
    emitAnalyticsConsentChanged("accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("sevebois-cookie-consent", "declined");
    emitAnalyticsConsentChanged("declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:bottom-4 lg:left-4 lg:right-auto lg:max-w-sm animate-fade-up">
      <div className="bg-[var(--forest-950)] text-[var(--cream-100)] rounded-t-xl lg:rounded-xl shadow-2xl p-5 border border-[var(--forest-800)]">
        <p className="text-sm leading-relaxed mb-2">{t(cookieConsentCopy.intro)}</p>
        <p className="text-xs leading-relaxed text-[var(--cream-200)] mb-4">
          {t(cookieConsentCopy.detail)}{" "}
          <Link href="/cookies" className="underline hover:text-[var(--ochre-300)] transition-colors">
            {t(cookieConsentCopy.policy)}
          </Link>.
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-2">
          <button
            onClick={accept}
            className="flex-[1.15] min-h-12 py-3 px-4 bg-[var(--ochre-500)] hover:bg-[var(--ochre-400)] text-[var(--forest-950)] text-sm font-bold rounded-lg shadow-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ochre-300)]"
          >
            {t(cookieConsentCopy.accept)}
          </button>
          <button
            onClick={decline}
            className="flex-1 min-h-12 py-3 px-4 bg-transparent border border-[var(--forest-500)] text-[var(--cream-100)] hover:bg-[var(--forest-800)] hover:text-white text-sm font-medium rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cream-100)]"
          >
            {t(cookieConsentCopy.decline)}
          </button>
        </div>
      </div>
    </div>
  );
}

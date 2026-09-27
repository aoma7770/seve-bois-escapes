export const GA4_MEASUREMENT_ID = "G-VR4KH5D142";
const CONSENT_KEY = "sevebois-cookie-consent";
const CONSENT_EVENT = "green-cottages-analytics-consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

export function hasAnalyticsConsent() {
  return typeof window !== "undefined" && window.localStorage.getItem(CONSENT_KEY) === "accepted";
}

export function analyticsConsentEventName() {
  return CONSENT_EVENT;
}

export function emitAnalyticsConsentChanged(value: "accepted" | "declined") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  }
}

export function loadGoogleAnalytics() {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return false;
  if (document.querySelector(`script[data-green-cottages-ga4="${GA4_MEASUREMENT_ID}"]`)) return true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA4_MEASUREMENT_ID, { send_page_view: false, anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  script.dataset.greenCottagesGa4 = GA4_MEASUREMENT_ID;
  document.head.appendChild(script);
  return true;
}

export function trackEvent(name: string, params: AnalyticsEventParams = {}) {
  if (!hasAnalyticsConsent() || typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, {
    ...params,
    page_path: window.location.pathname,
    page_location: window.location.href,
  });
}

export function trackPageView(path: string, title?: string) {
  trackEvent("page_view", { page_path: path, page_title: title ?? document.title });
}

export function safeElementLabel(element: Element) {
  const explicit = element.getAttribute("data-analytics-label") || element.getAttribute("aria-label") || element.getAttribute("title");
  if (explicit) return explicit.slice(0, 100);
  const text = (element.textContent || "").replace(/\s+/g, " ").trim();
  return text.slice(0, 100) || element.tagName.toLowerCase();
}

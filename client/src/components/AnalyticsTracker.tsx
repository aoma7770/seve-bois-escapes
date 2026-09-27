import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  analyticsConsentEventName,
  hasAnalyticsConsent,
  loadGoogleAnalytics,
  safeElementLabel,
  trackEvent,
  trackPageView,
} from "@/lib/analytics";

function getPageTitle() {
  return typeof document === "undefined" ? undefined : document.title;
}

export default function AnalyticsTracker() {
  const [location] = useLocation();
  const [consentVersion, setConsentVersion] = useState(0);

  useEffect(() => {
    const startTracking = () => {
      loadGoogleAnalytics();
      setConsentVersion((version) => version + 1);
    };
    if (hasAnalyticsConsent()) startTracking();
    window.addEventListener(analyticsConsentEventName(), startTracking);
    return () => window.removeEventListener(analyticsConsentEventName(), startTracking);
  }, []);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    loadGoogleAnalytics();
    const path = location.split("?")[0];
    const timer = window.setTimeout(() => trackPageView(path, getPageTitle()), 0);
    return () => window.clearTimeout(timer);
  }, [location, consentVersion]);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    const thresholds = new Set<number>();
    const onScroll = () => {
      const documentHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const percent = Math.min(100, Math.round((window.scrollY / documentHeight) * 100));
      for (const threshold of [25, 50, 75, 90, 100]) {
        if (percent >= threshold && !thresholds.has(threshold)) {
          thresholds.add(threshold);
          trackEvent("scroll_depth", { percent_scrolled: threshold });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location, consentVersion]);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    const startedForms = new WeakSet<HTMLFormElement>();
    const onFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      const form = target?.closest("form") as HTMLFormElement | null;
      if (!form || startedForms.has(form)) return;
      startedForms.add(form);
      trackEvent("form_start", {
        form_name: form.getAttribute("data-analytics-form") || form.getAttribute("aria-label") || form.id || "form",
      });
    };
    const onSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form) return;
      trackEvent("form_submit", {
        form_name: form.getAttribute("data-analytics-form") || form.getAttribute("aria-label") || form.id || "form",
      });
    };
    document.addEventListener("focusin", onFocus);
    document.addEventListener("submit", onSubmit);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("submit", onSubmit);
    };
  }, [location, consentVersion]);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const interactive = target?.closest("a,button,[role='button'],input[type='submit'],input[type='button']");
      if (!interactive) return;
      const href = interactive instanceof HTMLAnchorElement ? interactive.href : undefined;
      const gallery = interactive.closest("[data-analytics-gallery]");
      const bookingAction = interactive.closest("[data-analytics-booking-action]");
      const label = safeElementLabel(interactive);
      trackEvent(gallery ? "gallery_interaction" : bookingAction ? "booking_funnel_action" : "click", {
        element: interactive.tagName.toLowerCase(),
        label,
        href,
        action: interactive.getAttribute("data-analytics-action") || undefined,
        gallery_name: gallery?.getAttribute("data-analytics-gallery") || undefined,
        booking_step: bookingAction?.getAttribute("data-analytics-booking-action") || undefined,
      });
      if (href && /^https?:\/\//.test(href) && !href.startsWith(window.location.origin)) {
        trackEvent("outbound_click", { link_url: href, link_text: label });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [location, consentVersion]);

  return null;
}

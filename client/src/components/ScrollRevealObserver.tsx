import { useEffect } from "react";
import { useLocation } from "wouter";

/** Adds a one-time reveal animation to public page sections and content cards. */
export default function ScrollRevealObserver() {
  const [location] = useLocation();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("main section, main article, main .card-eco"));
    if (!elements.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    elements.forEach((element) => element.classList.add("scroll-reveal"));

    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.add("is-visible");
          observer.unobserve(element);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" },
    );

    elements.forEach((element, index) => {
      element.style.setProperty("--scroll-reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [location]);

  return null;
}

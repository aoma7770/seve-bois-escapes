import { useEffect } from "react";

interface SeoAlternate {
  lang: string;
  href: string;
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  robots?: string;
  lang?: string;
  alternates?: SeoAlternate[];
}

function upsertMeta(selector: string, attribute: string, value: string) {
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, selector.includes("property=") ? selector.split('property="')[1].split('"')[0] : selector.split('name="')[1].split('"')[0]);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}

export function useSEO({ title, description, keywords, ogTitle, ogDescription, ogImage, canonical, robots, lang, alternates = [] }: SEOProps) {
  useEffect(() => {
    document.title = title;
    upsertMeta('meta[name="description"]', "name", description);
    if (keywords) upsertMeta('meta[name="keywords"]', "name", keywords);
    upsertMeta('meta[name="robots"]', "name", robots || "index,follow");
    upsertMeta('meta[property="og:title"]', "property", ogTitle || title);
    upsertMeta('meta[property="og:description"]', "property", ogDescription || description);
    if (ogImage) upsertMeta('meta[property="og:image"]', "property", ogImage);

    if (canonical) {
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (!canonicalTag) {
        canonicalTag = document.createElement("link");
        canonicalTag.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute("href", canonical);
    }

    document.documentElement.lang = lang || "en";
    document.querySelectorAll('link[rel="alternate"][data-sevebois-hreflang]').forEach((tag) => tag.remove());
    for (const alternate of alternates) {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", alternate.lang);
      link.setAttribute("href", alternate.href);
      link.setAttribute("data-sevebois-hreflang", "true");
      document.head.appendChild(link);
    }
    if (alternates.length > 0) {
      const defaultLink = document.createElement("link");
      defaultLink.setAttribute("rel", "alternate");
      defaultLink.setAttribute("hreflang", "x-default");
      defaultLink.setAttribute("href", alternates.find((alternate) => alternate.lang === "en")?.href || alternates[0].href);
      defaultLink.setAttribute("data-sevebois-hreflang", "true");
      document.head.appendChild(defaultLink);
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonical, robots, lang, alternates]);
}

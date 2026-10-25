import { describe, expect, it } from "vitest";
import { getSeoPage, localizedPath, SEO_PAGES } from "../shared/seo";
import { renderSeoTemplate } from "./seo";

describe("multilingual SEO routes", () => {
  it("contains all approved launch pages in French, Dutch and English", () => {
    const launchKeys = new Set(["home", "la-seve", "le-bois", "groups", "dogs", "location", "about", "rates", "faq", "contact"]);
    const launchPages = SEO_PAGES.filter((page) => launchKeys.has(page.key));
    expect(launchPages).toHaveLength(30);
    expect(new Set(launchPages.map((page) => page.lang))).toEqual(new Set(["fr", "nl", "en"]));
    expect(getSeoPage("/fr/gite-12-personnes-ardennes")?.h1).toBe("Gîte 12 personnes Ardennes");
    expect(getSeoPage("/nl/vakantiehuis-ardennen-hond")?.h1).toBe("Vakantiehuis Ardennen met hond");
    expect(getSeoPage("/en/contact")?.title).toContain("Sève & Bois Cottages");
  });

  it("maps shared links to the correct canonical localized slug", () => {
    expect(localizedPath("/", "fr")).toBe("/fr/");
    expect(localizedPath("/location", "nl")).toBe("/nl/vakantiehuis-vresse-sur-semois");
    expect(localizedPath("/cottages/la-seve", "en")).toBe("/en/la-seve");
    expect(localizedPath("/booking?cottage=both", "fr")).toBe("/booking?cottage=both");
  });
});

describe("server-rendered SEO shell", () => {
  const template = '<html lang="en"><head><title>Fallback</title><meta name="description" content="Fallback" /><meta property="og:title" content="Fallback" /><meta property="og:description" content="Fallback" /></head><body></body></html>';

  it("renders canonical, alternates, noscript content and lodging schema", () => {
    const html = renderSeoTemplate(template, "/fr/");
    expect(html).toContain('<title>Gîte Ardennes à Laforêt | Deux gîtes en bois | Sève &amp; Bois</title>');
    expect(html).toContain('name="robots" content="index,follow"');
    expect(html).toContain('rel="canonical" href="https://www.sevebois.be/fr/"');
    expect(html).toContain('hreflang="nl" href="https://www.sevebois.be/nl/"');
    expect(html).toContain("Green Cottages of Laforêt");
    expect(html).toContain('"@type":"LodgingBusiness"');
  });

  it("adds FAQPage structured data on the FAQ route", () => {
    const html = renderSeoTemplate(template, "/en/faq");
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain("How do I book?");
  });

  it("keeps the approved legal URLs indexable", () => {
    const html = renderSeoTemplate(template, "/privacy");
    expect(html).toContain('name="robots" content="index,follow"');
    expect(html).toContain("Privacy Policy | Sève &amp; Bois Cottages");
  });
});

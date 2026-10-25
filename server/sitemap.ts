import type { Express } from "express";
import { SEO_PAGES, SEO_SITE_URL, getAlternateLinks } from "../shared/seo";
const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;");

export function registerSitemapRoute(app: Express) {
  app.get("/sitemap.xml", (_req, res) => {
    const pages = SEO_PAGES.filter((page) => page.key !== "fallback");
    const localizedUrls = pages.map((page) => {
      const alternates = getAlternateLinks(page).map(({ lang, href }) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}" />`).join("");
      const xDefault = getAlternateLinks(page).find((alternate) => alternate.lang === "en");
      const defaultLink = xDefault ? `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefault.href)}" />` : "";
      return `<url><loc>${escapeXml(SEO_SITE_URL + page.path)}</loc>${alternates}${defaultLink}</url>`;
    });
    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${localizedUrls.join("")}</urlset>`);
  });
}

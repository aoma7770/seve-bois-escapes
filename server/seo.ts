import type { Express, Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import { getAlternateLinks, getSeoPage, SEO_BUSINESS_NAME, SEO_BRAND_REFERENCE, SEO_LANGUAGES, SEO_SITE_URL, type SeoPage } from "../shared/seo";

const PREVIEW_MODE = process.env.SEO_PREVIEW_MODE === "true";
const PREVIEW_PASSWORD = process.env.SEO_PREVIEW_PASSWORD || "";

const escapeHtml = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const escapeJson = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

const amenityFeature = [
  "free Wi-Fi",
  "central heating",
  "hot water",
  "equipped kitchen",
  "coffee machine",
  "dishwasher",
  "fridge-freezer",
  "tumble dryer",
  "bed linen and towels",
  "hair dryer",
  "blackout curtains",
  "garden furniture",
  "smoke detectors",
  "free private parking",
  "EV charging point",
];

export const lodgingBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: SEO_BUSINESS_NAME,
  alternateName: SEO_BRAND_REFERENCE,
  description: "Two contemporary timber cottages in Laforêt, Vresse-sur-Semois, in the Belgian Ardennes.",
  url: SEO_SITE_URL,
  telephone: "+32 467 80 81 79",
  email: "support@sevebois.be",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Laforêt",
    postalCode: "5550",
    addressRegion: "Vresse-sur-Semois",
    addressCountry: "BE",
  },
  checkinTime: "16:00",
  checkoutTime: "11:00",
  petsAllowed: true,
  amenityFeature: amenityFeature.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
  sameAs: ["https://www.facebook.com/sevebois", "https://www.linkedin.com/company/sevebois"],
};

function pageForPath(pathname: string): SeoPage | undefined {
  if (pathname === "/") return getSeoPage("/en/");
  return getSeoPage(pathname);
}

function isNoindexPath(pathname: string) {
  return PREVIEW_MODE || pathname.startsWith("/admin") || pathname === "/booking" || pathname === "/booking/confirmation" || pathname === "/blog" || pathname.startsWith("/blog/") || !pageForPath(pathname);
}

function htmlLanguage(pathname: string) {
  return pageForPath(pathname)?.lang || "en";
}

function renderAlternates(page: SeoPage | undefined) {
  if (!page) return "";
  const alternates = getAlternateLinks(page).map(({ lang, href }) => `<link rel="alternate" hreflang="${lang}" href="${href}" data-sevebois-hreflang="true">`);
  const xDefault = getAlternateLinks(page).find((alternate) => alternate.lang === "en");
  if (xDefault) alternates.push(`<link rel="alternate" hreflang="x-default" href="${xDefault.href}" data-sevebois-hreflang="true">`);
  return alternates.join("");
}

export function renderSeoTemplate(template: string, pathname: string) {
  const page = pageForPath(pathname);
  const title = page?.title || `${SEO_BUSINESS_NAME} | Laforêt, Belgian Ardennes`;
  const description = page?.description || "Two contemporary timber cottages in Laforêt, Vresse-sur-Semois, in the Belgian Ardennes.";
  const canonical = `${SEO_SITE_URL}${page?.path || pathname}`;
  const robots = isNoindexPath(pathname) ? "noindex,nofollow" : "index,follow";
  const h1 = page?.h1 || SEO_BUSINESS_NAME;
  const intro = page?.intro || `Welcome to ${SEO_BRAND_REFERENCE}: two contemporary timber cottages, La Sève and Le Bois, in Laforêt.`;
  const language = htmlLanguage(pathname);
  const alternateMarkup = renderAlternates(page);
  const schema = { ...lodgingBusinessSchema, mainEntityOfPage: canonical };
  const faqQuestions = page?.key === "faq" ? {
    fr: [
      ["Comment réserver ?", "Choisissez vos dates, renseignez vos coordonnées et payez par carte via Stripe."],
      ["Les animaux sont-ils acceptés ?", "Oui, sur demande. Contactez-nous avant de réserver avec le type et la taille de votre animal."],
      ["Y a-t-il un parking ?", "Oui, un parking privé gratuit est disponible sur place."],
    ],
    nl: [
      ["Hoe boek ik?", "Kies uw data, vul uw gegevens in en betaal met een kaart via Stripe."],
      ["Zijn huisdieren toegestaan?", "Ja, op aanvraag. Neem contact met ons op vóór het boeken met het type en de grootte van uw huisdier."],
      ["Is er parkeergelegenheid?", "Ja, er is gratis privéparkeergelegenheid op het terrein."],
    ],
    en: [
      ["How do I book?", "Choose your dates, fill in your details and pay by card via Stripe."],
      ["Are pets allowed?", "Yes, on request. Contact us before booking with the type and size of your pet."],
      ["Is there parking?", "Yes, free private parking is available on site."],
    ],
  }[page.lang].map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) : undefined;
  const structuredData = faqQuestions ? [schema, { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqQuestions }] : schema;
  const fallbackLinks = `<nav aria-label="Site links"><a href="${SEO_SITE_URL}/en/">Home</a> <a href="${SEO_SITE_URL}/en/la-seve">La Sève</a> <a href="${SEO_SITE_URL}/en/le-bois">Le Bois</a> <a href="${SEO_SITE_URL}/en/contact">Contact</a></nav>`;
  const noscript = `<noscript><main><h1>${escapeHtml(h1)}</h1><p>${escapeHtml(intro)}</p>${fallbackLinks}</main></noscript>`;

  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${language}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace("</head>", `<meta name="robots" content="${robots}" />${PREVIEW_MODE ? '<meta name="sevebois-preview" content="true" />' : ""}<link rel="canonical" href="${escapeHtml(canonical)}" />${alternateMarkup}<script type="application/ld+json">${escapeJson(structuredData)}</script></head>`)
    .replace("</body>", `${noscript}</body>`);
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function previewAccessMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!PREVIEW_MODE || !PREVIEW_PASSWORD || req.path.startsWith("/api/")) return next();
  const header = req.headers.authorization || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    try {
      const decoded = Buffer.from(encoded, "base64").toString("utf8");
      const separator = decoded.indexOf(":");
      const password = separator >= 0 ? decoded.slice(separator + 1) : "";
      if (safeEqual(password, PREVIEW_PASSWORD)) return next();
    } catch {
      // Fall through to the challenge response.
    }
  }
  res.setHeader("WWW-Authenticate", 'Basic realm="SEO preview"');
  res.status(401).type("text/plain").send("SEO preview access requires the supplied password.");
}

export function registerRobotsRoute(app: Express) {
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(["User-agent: *", PREVIEW_MODE ? "Disallow: /" : "Disallow: /admin\nDisallow: /api", `Sitemap: ${SEO_SITE_URL}/sitemap.xml`].join("\n"));
  });
}

export function registerRedirects(app: Express) {
  const redirects: Record<string, string> = {
    "/cottages/la-seve": "/en/la-seve",
    "/cottages/le-bois": "/en/le-bois",
    "/location": "/en/vresse-sur-semois-cottage",
    "/rates": "/en/rates",
    "/faq": "/en/faq",
    "/contact": "/en/contact",
    "/sustainability": "/en/",
    "/fr/sustainability": "/fr/",
    "/nl/sustainability": "/nl/",
    "/en/sustainability": "/en/",
  };
  for (const [from, to] of Object.entries(redirects)) app.get(from, (_req, res) => res.redirect(301, to));
}

export { SEO_LANGUAGES };

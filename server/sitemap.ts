import type { Express } from "express";
import { getDb } from "./db";
import { blogPosts } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const siteUrl = "https://sevebois.manus.space";
const publicPaths = ["/", "/cottages/la-seve", "/cottages/le-bois", "/location", "/sustainability", "/rates", "/booking", "/faq", "/contact", "/terms", "/privacy", "/cookies", "/blog"];
const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;");

export function registerSitemapRoute(app: Express) {
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const db = await getDb();
      const posts = db ? await db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt }).from(blogPosts).where(eq(blogPosts.isPublished, true)) : [];
      const urls = publicPaths.map((path) => `<url><loc>${siteUrl}${path}</loc></url>`).concat(posts.map((post) => `<url><loc>${siteUrl}/blog/${escapeXml(post.slug)}</loc>${post.updatedAt ? `<lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>` : ""}</url>`));
      res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`);
    } catch (error) {
      console.error("[Sitemap] Failed to generate sitemap", error);
      res.status(500).type("text/plain").send("Sitemap unavailable");
    }
  });
}

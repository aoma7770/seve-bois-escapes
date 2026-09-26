import crypto from "crypto";
import type { Express, Request, Response } from "express";
import { storageGetSignedUrl } from "./storage";

const GUIDE_STORAGE_KEY = "main_cdc2d87b.pdf";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  return process.env.JWT_SECRET || "green-cottages-guide-secret";
}

export function createGuideToken(email: string, now = Math.floor(Date.now() / 1000)) {
  const payload = Buffer.from(JSON.stringify({ email, exp: now + TOKEN_TTL_SECONDS })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function verifyGuideToken(token: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: string; exp?: number };
    if (!decoded.email || !decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded.email;
  } catch {
    return null;
  }
}

export function registerGuideDownloadRoute(app: Express) {
  app.get("/api/guide/download", async (req: Request, res: Response) => {
    const email = verifyGuideToken(String(req.query.token ?? ""));
    if (!email) return res.status(401).send("This guide link is invalid or has expired.");
    try {
      const signedUrl = await storageGetSignedUrl(GUIDE_STORAGE_KEY);
      res.redirect(signedUrl);
    } catch (error) {
      console.error("[Guide] Failed to create signed download URL", error);
      res.status(503).send("The guide is temporarily unavailable.");
    }
  });
}

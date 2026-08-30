import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import type { User } from "../drizzle/schema";
import { adminCredentials } from "../drizzle/schema";
import { getDb } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";

const ADMIN_SESSION_COOKIE = "green_cottages_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = { username: string; exp: number; sessionVersion: number };

function secret() {
  return process.env.JWT_SECRET || "development-only-admin-session-secret";
}

function toBase64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function passwordDigest(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

export function createPasswordRecord(password: string) {
  const salt = randomBytes(32).toString("hex");
  return { passwordSalt: salt, passwordHash: passwordDigest(password, salt) };
}

export function verifyPasswordRecord(password: string, record: { passwordHash: string; passwordSalt: string }) {
  const supplied = Buffer.from(passwordDigest(password, record.passwordSalt), "hex");
  const stored = Buffer.from(record.passwordHash, "hex");
  return supplied.length === stored.length && timingSafeEqual(supplied, stored);
}

function createSessionToken(username: string, sessionVersion: number) {
  const payload: SessionPayload = { username, sessionVersion, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const encoded = toBase64Url(JSON.stringify(payload));
  const signature = createHmac("sha256", secret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function readCookie(req: Request, name: string) {
  const raw = req.headers.cookie || "";
  const match = raw.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

async function credentialFromUsername(username: string) {
  const db = await getDb();
  if (!db) return null;
  return (await db.select().from(adminCredentials).where(eq(adminCredentials.username, username)).limit(1))[0] ?? null;
}

async function userFromUsername(username: string): Promise<User | null> {
  const row = await credentialFromUsername(username);
  if (!row) return null;
  const now = new Date();
  return { id: row.id, openId: `standalone-admin:${row.username}`, name: row.username, email: null, loginMethod: "password", role: "admin", createdAt: row.createdAt, updatedAt: row.updatedAt, lastSignedIn: now };
}

export async function authenticateAdminRequest(req: Request): Promise<User | null> {
  const token = readCookie(req, ADMIN_SESSION_COOKIE);
  if (!token) return null;
  const [encoded, suppliedSignature] = token.split(".");
  if (!encoded || !suppliedSignature) return null;
  const expectedSignature = createHmac("sha256", secret()).update(encoded).digest("base64url");
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as SessionPayload;
    if (!payload.username || payload.sessionVersion === undefined || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    const credential = await credentialFromUsername(payload.username);
    if (!credential || credential.sessionVersion !== payload.sessionVersion) return null;
    return userFromUsername(payload.username);
  } catch {
    return null;
  }
}

export async function loginAdmin(req: Request, res: Response) {
  const username = typeof req.body?.username === "string" ? req.body.username.trim() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!username || !password) return res.status(400).json({ error: "Username and password are required." });
  const db = await getDb();
  if (!db) return res.status(503).json({ error: "Database unavailable." });
  const row = (await db.select().from(adminCredentials).where(eq(adminCredentials.username, username)).limit(1))[0];
  if (!row) return res.status(401).json({ error: "Invalid credentials." });
  if (!verifyPasswordRecord(password, row)) return res.status(401).json({ error: "Invalid credentials." });
  res.cookie(ADMIN_SESSION_COOKIE, createSessionToken(row.username, row.sessionVersion), { ...getSessionCookieOptions(req), maxAge: SESSION_TTL_SECONDS * 1000 });
  return res.json({ success: true, username: row.username });
}

export async function logoutAdmin(req: Request, res: Response) {
  const token = readCookie(req, ADMIN_SESSION_COOKIE);
  if (token) {
    const [encoded] = token.split(".");
    try {
      const payload = JSON.parse(fromBase64Url(encoded)) as SessionPayload;
      const db = await getDb();
      if (db && payload.username) {
        const credential = await credentialFromUsername(payload.username);
        if (credential && credential.sessionVersion === payload.sessionVersion) {
          await db.update(adminCredentials).set({ sessionVersion: credential.sessionVersion + 1 }).where(eq(adminCredentials.username, payload.username));
        }
      }
    } catch {}
  }
  res.clearCookie(ADMIN_SESSION_COOKIE, getSessionCookieOptions(req));
  return res.json({ success: true });
}

export { ADMIN_SESSION_COOKIE };

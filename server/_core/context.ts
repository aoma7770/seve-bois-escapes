import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { authenticateAdminRequest } from "../adminAuth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  adminAuthSource: "staff-session" | "elise-token" | "elise-staff-session" | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let adminAuthSource: TrpcContext["adminAuthSource"] = null;

  try {
    const adminAuthentication = await authenticateAdminRequest(opts.req);
    user = adminAuthentication?.user ?? null;
    adminAuthSource = adminAuthentication?.source ?? null;
    if (!user) user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    adminAuthSource,
  };
}

import { describe, expect, it } from "vitest";
import { ADMIN_SESSION_TTL_SECONDS, ELISE_ADMIN_TOKEN_ENV, authenticateAdminRequest, createPasswordRecord, verifyPasswordRecord } from "./adminAuth";

describe("standalone admin credentials", () => {
  it("stores a salted hash rather than the plaintext password", () => {
    const record = createPasswordRecord("example-password");
    expect(record.passwordHash).not.toBe("example-password");
    expect(record.passwordSalt).not.toBe("");
    expect(verifyPasswordRecord("example-password", record)).toBe(true);
    expect(verifyPasswordRecord("wrong-password", record)).toBe(false);
  });

  it("uses a different salt for separate credential records", () => {
    const first = createPasswordRecord("example-password");
    const second = createPasswordRecord("example-password");
    expect(first.passwordSalt).not.toBe(second.passwordSalt);
    expect(first.passwordHash).not.toBe(second.passwordHash);
  });

  it("keeps an authenticated staff session valid for 24 hours", () => {
    expect(ADMIN_SESSION_TTL_SECONDS).toBe(60 * 60 * 24);
  });

  it("uses a dedicated environment secret for Elise instead of the staff password", () => {
    expect(ELISE_ADMIN_TOKEN_ENV).toBe("ELISE_ADMIN_TOKEN");
  });

  it("authenticates a lightweight bearer request with the configured Elise secret", async () => {
    const token = process.env[ELISE_ADMIN_TOKEN_ENV];
    expect(token).toBeTruthy();
    const request = { headers: { authorization: `Bearer ${token}` } } as any;
    const authentication = await authenticateAdminRequest(request);
    expect(authentication?.source).toBe("elise-token");
    expect(authentication?.user.name).toBe("Elise");
    expect(authentication?.user.role).toBe("admin");
  });
});

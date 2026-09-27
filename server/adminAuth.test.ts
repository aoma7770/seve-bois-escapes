import { describe, expect, it } from "vitest";
import { ADMIN_SESSION_TTL_SECONDS, createPasswordRecord, verifyPasswordRecord } from "./adminAuth";

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
});

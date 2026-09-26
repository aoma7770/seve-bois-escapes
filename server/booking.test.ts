import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { origin: "https://sevebois.be" },
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("auth.logout", () => {
  it("clears session cookie and returns success", async () => {
    const clearedCookies: string[] = [];
    const ctx: TrpcContext = {
      user: { id: 1, openId: "test", email: "test@test.com", name: "Test", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: (name: string) => clearedCookies.push(name) } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
  });
});

describe("newsletter.subscribe validation", () => {
  it("rejects invalid email", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.newsletter.subscribe({ email: "not-an-email" })
    ).rejects.toThrow();
  });
});

describe("enquiries.submit validation", () => {
  it("rejects missing name", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.enquiries.submit({ name: "A", email: "test@test.com", gdprConsent: true })
    ).rejects.toThrow();
  });
});

describe("bookings.createCheckout validation", () => {
  it("rejects invalid email", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.bookings.createCheckout({
        propertyId: 1,
        guestFirstName: "Test",
        guestSurname: "User",
        guestEmail: "not-an-email",
        guestPhone: "+32123456789",
        guestCount: 2,
        checkIn: "2025-08-01",
        checkOut: "2025-08-03",
        gdprConsent: true,
      })
    ).rejects.toThrow();
  });
});


describe("shared booking pricing", () => {
  it("calculates the two-cottage base and extra guests", async () => {
    const { nightlyRate } = await import("../shared/booking");
    expect(nightlyRate("both", 4, { cottageNightlyBase: 150, extraGuestNightly: 40 })).toBe(420);
  });

  it("includes configured fixed and percentage fees in the booking total", async () => {
    const { bookingTotal } = await import("../shared/booking");
    expect(bookingTotal("la-seve", 1, 2, {
      cottageNightlyBase: 150,
      extraGuestNightly: 40,
      extraFees: [{ feeType: "fixed", amount: 20 }, { feeType: "percentage", amount: 10 }],
    })).toBe(350);
  });
});


describe("admin access control", () => {
  it("rejects non-admin users before reaching admin procedures", async () => {
    const caller = appRouter.createCaller({
      ...createPublicContext(),
      user: { id: 2, openId: "user", email: "user@test.com", name: "User", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    });
    await expect(caller.admin.getProperties()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

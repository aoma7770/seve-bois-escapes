import { describe, expect, it } from "vitest";
import { formatWebhookDate } from "./confirmedBooking";

describe("confirmed booking webhook configuration", () => {
  it("formats booking dates as dd/mm/yyyy", () => {
    expect(formatWebhookDate("2027-06-01")).toBe("01/06/2027");
  });

  it("has a reachable GoHighLevel webhook endpoint", async () => {
    const webhookUrl = process.env.GOHIGHLEVEL_CONFIRMED_BOOKING_WEBHOOK_URL;
    expect(webhookUrl).toMatch(/^https:\/\/services\.leadconnectorhq\.com\/hooks\//);

    const response = await fetch(webhookUrl!, {
      method: "HEAD",
      signal: AbortSignal.timeout(8_000),
    });

    // GoHighLevel may reject HEAD because the hook is POST-only; any HTTP response
    // proves the endpoint is reachable without creating a lead or triggering an automation.
    expect(response.status).toBeLessThan(500);
  }, 15_000);
});

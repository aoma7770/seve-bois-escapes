import { eq } from "drizzle-orm";
import { bookings, properties } from "../drizzle/schema";
import { getDb } from "./db";

type DispatchInput = {
  bookingId: number;
  stripeSessionId: string;
  stripeEventId: string;
  recoveryUrl?: string | null;
};

type DispatchResult = {
  sent: boolean;
  skipped?: boolean;
  reason?: string;
};

function trimError(error: unknown) {
  return String(error instanceof Error ? error.message : error).slice(0, 1000);
}

/**
 * Sends one abandoned Checkout event to the admin-configured GoHighLevel inbound webhook.
 * Stripe retries its webhook when this handler returns an error, while the
 * database status prevents ordinary duplicate deliveries from creating repeat
 * CRM follow-ups.
 */
export async function dispatchAbandonedCheckout(input: DispatchInput): Promise<DispatchResult> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const booking = (await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1))[0];
  if (!booking) return { sent: false, skipped: true, reason: "Booking not found" };
  if (booking.abandonedWebhookStatus === "sent") return { sent: true, skipped: true, reason: "Already delivered" };
  if (booking.paymentStatus === "paid" || booking.status === "confirmed") {
    return { sent: false, skipped: true, reason: "Booking was paid or confirmed" };
  }

  const property = (await db.select().from(properties).where(eq(properties.id, booking.propertyId)).limit(1))[0];
  const fallbackProperty = booking.propertyId === 1 ? property : (await db.select().from(properties).where(eq(properties.id, 1)).limit(1))[0];
  const gohighlevelWebhookUrl = property?.gohighlevelWebhookUrl || fallbackProperty?.gohighlevelWebhookUrl || property?.zapierWebhookUrl || fallbackProperty?.zapierWebhookUrl;
  const abandonedAt = new Date();

  await db.update(bookings).set({ status: "abandoned", abandonedAt }).where(eq(bookings.id, booking.id));

  if (!booking.gdprConsent) {
    await db.update(bookings).set({ abandonedWebhookStatus: "failed", abandonedWebhookError: "Skipped because marketing/GDPR consent was not recorded." }).where(eq(bookings.id, booking.id));
    return { sent: false, skipped: true, reason: "No marketing consent" };
  }

  if (!gohighlevelWebhookUrl) {
    await db.update(bookings).set({ abandonedWebhookStatus: "failed", abandonedWebhookError: "No GoHighLevel inbound webhook URL is configured for this property." }).where(eq(bookings.id, booking.id));
    return { sent: false, reason: "No GoHighLevel webhook URL configured" };
  }

  const payload = {
    event_type: "abandoned_checkout",
    event_id: input.stripeEventId,
    occurred_at: abandonedAt.toISOString(),
    source: "green_cottages_laforet",
    booking_id: booking.id,
    stripe_session_id: input.stripeSessionId,
    first_name: booking.guestFirstName,
    last_name: booking.guestSurname,
    guest_name: booking.guestName,
    email: booking.guestEmail,
    phone: booking.guestPhone,
    guest_count: booking.guestCount,
    booking_selection: booking.bookingSelection,
    property_name: property?.nameEn || fallbackProperty?.nameEn || "Green Cottages of Laforêt",
    check_in: String(booking.checkIn),
    check_out: String(booking.checkOut),
    total_amount_eur: Number(booking.totalAmount),
    promotion_code: booking.promotionCode || "",
    promotion_discount_eur: Number(booking.promotionDiscount),
    special_requests: booking.specialRequests || "",
    recovery_url: input.recoveryUrl || booking.stripeRecoveryUrl || "",
    marketing_consent: true,
  };

  try {
    const response = await fetch(gohighlevelWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Green-Cottages-Event": input.stripeEventId,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`GoHighLevel webhook returned HTTP ${response.status}`);

    await db.update(bookings).set({
      abandonedWebhookStatus: "sent",
      abandonedWebhookSentAt: new Date(),
      abandonedWebhookError: null,
      stripeRecoveryUrl: input.recoveryUrl || booking.stripeRecoveryUrl || null,
    }).where(eq(bookings.id, booking.id));
    return { sent: true };
  } catch (error) {
    const message = trimError(error);
    await db.update(bookings).set({
      abandonedWebhookStatus: "failed",
      abandonedWebhookError: message,
      stripeRecoveryUrl: input.recoveryUrl || booking.stripeRecoveryUrl || null,
    }).where(eq(bookings.id, booking.id));
    console.error(`[Abandoned Checkout] GoHighLevel webhook delivery failed for booking ${booking.id}: ${message}`);
    return { sent: false, reason: message };
  }
}

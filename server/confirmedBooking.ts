import { and, eq } from "drizzle-orm";
import { bookings } from "../drizzle/schema";
import { getDb } from "./db";

type DispatchInput = {
  bookingId: number;
  stripeEventId: string;
  stripeSessionId?: string;
};

export async function dispatchConfirmedBooking(input: DispatchInput) {
  const webhookUrl = process.env.GOHIGHLEVEL_CONFIRMED_BOOKING_WEBHOOK_URL;
  const db = await getDb();
  if (!db) return { sent: false, reason: "Database unavailable" } as const;

  const booking = (await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, input.bookingId))
    .limit(1))[0];

  if (!booking) return { sent: false, reason: "Booking not found" } as const;
  if (booking.paymentStatus !== "paid" || booking.status !== "confirmed") {
    return { sent: false, reason: "Booking is not paid and confirmed" } as const;
  }
  if (booking.confirmedWebhookStatus === "sent") {
    return { sent: true, alreadySent: true } as const;
  }
  if (!webhookUrl) {
    const reason = "No confirmed booking webhook is configured.";
    await db.update(bookings).set({ confirmedWebhookStatus: "failed", confirmedWebhookError: reason }).where(eq(bookings.id, input.bookingId));
    return { sent: false, reason } as const;
  }

  const payload = {
    event_type: "booking_confirmed",
    source: booking.source,
    booking_id: booking.id,
    booking_status: booking.status,
    payment_status: booking.paymentStatus,
    stripe_event_id: input.stripeEventId,
    stripe_session_id: input.stripeSessionId ?? booking.stripeSessionId,
    stripe_payment_intent_id: booking.stripePaymentIntentId,
    guest: {
      first_name: booking.guestFirstName || booking.guestName.split(" ")[0] || "",
      last_name: booking.guestSurname || booking.guestName.split(" ").slice(1).join(" "),
      full_name: booking.guestName,
      email: booking.guestEmail,
      phone: booking.guestPhone,
    },
    stay: {
      selection: booking.bookingSelection,
      check_in: String(booking.checkIn),
      check_out: String(booking.checkOut),
      guest_count: booking.guestCount,
      total_amount: Number(booking.totalAmount),
      currency: "EUR",
      cleaning_fee: Number(booking.cleaningFee),
      promotion_code: booking.promotionCode,
      promotion_discount: Number(booking.promotionDiscount),
      special_requests: booking.specialRequests,
    },
    gdpr_consent: booking.gdprConsent,
    confirmed_at: new Date().toISOString(),
  };

  let lastFailure = "Unknown webhook failure";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Green-Cottages-Event": "booking_confirmed",
          "Idempotency-Key": `green-cottages-booking-${booking.id}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8_000),
      });

      if (response.ok) {
        await db.update(bookings).set({
          confirmedWebhookStatus: "sent",
          confirmedWebhookSentAt: new Date(),
          confirmedWebhookEventId: input.stripeEventId,
          confirmedWebhookError: null,
        }).where(and(eq(bookings.id, input.bookingId), eq(bookings.status, "confirmed"), eq(bookings.paymentStatus, "paid")));
        return { sent: true, alreadySent: false } as const;
      }

      const body = (await response.text()).slice(0, 240);
      lastFailure = `HTTP ${response.status}${body ? `: ${body}` : ""}`;
    } catch (error) {
      lastFailure = error instanceof Error ? error.message : String(error);
    }

    console.warn(`[GoHighLevel] Confirmed booking webhook attempt ${attempt}/3 failed: ${lastFailure}`);
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
  }

  await db.update(bookings).set({
    confirmedWebhookStatus: "failed",
    confirmedWebhookEventId: input.stripeEventId,
    confirmedWebhookError: lastFailure,
  }).where(eq(bookings.id, input.bookingId));
  return { sent: false, reason: lastFailure } as const;
}

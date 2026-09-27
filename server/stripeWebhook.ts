import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { bookings } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { dispatchAbandonedCheckout } from "./abandonedCheckout";
import { dispatchConfirmedBooking } from "./confirmedBooking";

const router = Router();

router.post("/webhook", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn("[Stripe Webhook] No webhook secret configured");
    res.json({ received: true });
    return;
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-06-24.dahlia" });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    res.json({ verified: true });
    return;
  }

  console.log(`[Stripe Webhook] Event: ${event.type}`);

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;

    if (bookingId && (event.type === "checkout.session.async_payment_succeeded" || session.payment_status === "paid")) {
      const db = await getDb();
      if (db) {
        await db.update(bookings)
          .set({
            status: "confirmed",
            paymentStatus: "paid",
            stripePaymentIntentId: session.payment_intent as string,
          })
          .where(eq(bookings.id, parseInt(bookingId)));
        console.log(`[Stripe Webhook] Booking ${bookingId} confirmed`);
        const delivery = await dispatchConfirmedBooking({
          bookingId: parseInt(bookingId),
          stripeEventId: event.id,
          stripeSessionId: session.id,
        });
        if (!delivery.sent) {
          console.warn(`[Stripe Webhook] Confirmed booking webhook was not delivered for ${bookingId}: ${delivery.reason ?? "unknown reason"}`);
        }
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;
    if (bookingId) {
      const db = await getDb();
      if (db) {
        const booking = (await db.select({ id: bookings.id, paymentStatus: bookings.paymentStatus, stripeSessionId: bookings.stripeSessionId }).from(bookings).where(eq(bookings.id, parseInt(bookingId))).limit(1))[0];
        if (booking?.paymentStatus !== "paid") {
          await db.update(bookings)
            .set({ status: "abandoned", paymentStatus: "unpaid", abandonedAt: new Date(), stripeRecoveryUrl: session.after_expiration?.recovery?.url ?? null })
            .where(eq(bookings.id, parseInt(bookingId)));
          await dispatchAbandonedCheckout({
            bookingId: parseInt(bookingId),
            stripeSessionId: session.id,
            stripeEventId: event.id,
            recoveryUrl: session.after_expiration?.recovery?.url,
          });
        }
      }
    }
  }

  res.json({ received: true });
});

export default router;

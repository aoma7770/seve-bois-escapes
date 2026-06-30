import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { bookings } from "../drizzle/schema";
import { eq } from "drizzle-orm";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;

    if (bookingId) {
      const db = await getDb();
      if (db) {
        await db.update(bookings)
          .set({
            status: "confirmed",
            stripePaymentIntentId: session.payment_intent as string,
          })
          .where(eq(bookings.id, parseInt(bookingId)));
        console.log(`[Stripe Webhook] Booking ${bookingId} confirmed`);
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;
    if (bookingId) {
      const db = await getDb();
      if (db) {
        await db.update(bookings)
          .set({ status: "cancelled" })
          .where(eq(bookings.id, parseInt(bookingId)));
      }
    }
  }

  res.json({ received: true });
});

export default router;

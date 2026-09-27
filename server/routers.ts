import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { bookings, properties, enquiries, icalFeeds, icalBlocks, newsletterSubscribers, blogPosts, amenities, promotions, seasonalRates, extraFees, propertyPhotos, guestCommunications, visitorPresence } from "../drizzle/schema";
import { eq, and, ne, or, lte, gte, gt, asc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import {
  BookingSelection,
  bookingTotal,
  maximumGuestsForSelection,
  minimumGuestsForSelection,
  nightlyRate,
} from "../shared/booking";
import nodemailer from "nodemailer";
import ical from "node-ical";
import { createGuideToken } from "./guide";
import { dispatchAbandonedCheckout } from "./abandonedCheckout";
import { dispatchConfirmedBooking } from "./confirmedBooking";

// ─── Email helper ─────────────────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "support@sevebois.be",
        pass: process.env.SMTP_PASS || "",
      },
    });
    await transporter.sendMail({
      from: '"Sève & Bois Escapes" <support@sevebois.be>',
      to,
      subject,
      html,
    });
  } catch (err) {
    console.warn("[Email] Failed to send:", err);
  }
}

async function syncGuideLeadToHighLevel(input: { firstName: string; lastName: string; email: string; source?: string }) {
  const webhookUrl = process.env.GOHIGHLEVEL_GUIDE_WEBHOOK_URL;
  if (webhookUrl) {
    const payload = {
      event_type: "guide_request",
      source: input.source || "guide_cta",
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      marketing_consent: true,
      guide_requested: true,
      guide_name: "Exploring the Semois & the Belgian Ardennes",
    };
    let lastFailure = "Unknown webhook failure";
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Green-Cottages-Event": "guide_request" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(8_000),
        });
        if (response.ok) return { synced: true };
        const body = (await response.text()).slice(0, 240);
        lastFailure = `HTTP ${response.status}${body ? `: ${body}` : ""}`;
      } catch (error) {
        lastFailure = error instanceof Error ? error.message : String(error);
      }
      console.warn(`[GoHighLevel] Guide webhook attempt ${attempt}/3 failed: ${lastFailure}`);
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
    return { synced: false, reason: lastFailure };
  }
  const token = process.env.GOHIGHLEVEL_PRIVATE_TOKEN;
  const locationId = process.env.GOHIGHLEVEL_LOCATION_ID;
  if (!token || !locationId) return { synced: false, reason: "No GoHighLevel guide webhook or API credentials are configured." };
  const response = await fetch("https://services.leadconnectorhq.com/contacts/", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Version: "2021-07-28" },
    body: JSON.stringify({ firstName: input.firstName, lastName: input.lastName, email: input.email, locationId, tags: ["warm-lead-guide"], source: "Green Cottages guide" }),
  });
  if (!response.ok) {
    console.warn(`[GoHighLevel] Guide lead sync failed with ${response.status}`);
    return { synced: false, reason: `HTTP ${response.status}` };
  }
  return { synced: true };
}

async function validatePromotion(db: any, input: { propertyId: number; code: string; nights: number; guestCount: number; guestEmail?: string; baseAmount: number }) {
  const code = input.code.trim().toUpperCase();
  const promotion = (await db.select().from(promotions).where(and(eq(promotions.propertyId, input.propertyId), eq(promotions.code, code), eq(promotions.isActive, true))).limit(1))[0];
  if (!promotion) return { valid: false as const, message: "Invalid promo code." };
  const today = new Date().toISOString().slice(0, 10);
  if (promotion.validFrom && today < String(promotion.validFrom)) return { valid: false as const, message: "This promo code is not active yet." };
  if (promotion.validUntil && today > String(promotion.validUntil)) return { valid: false as const, message: "This promo code has expired." };
  if (input.nights < promotion.minimumNights) return { valid: false as const, message: `This code requires at least ${promotion.minimumNights} nights.` };
  if (promotion.minimumGuests && input.guestCount < promotion.minimumGuests) return { valid: false as const, message: `This code requires at least ${promotion.minimumGuests} guests.` };
  if (promotion.maximumGuests && input.guestCount > promotion.maximumGuests) return { valid: false as const, message: `This code is limited to ${promotion.maximumGuests} guests.` };
  if (promotion.eligibleEmail && input.guestEmail?.trim().toLowerCase() !== String(promotion.eligibleEmail).trim().toLowerCase()) return { valid: false as const, message: "This code is not valid for this email address." };
  const paidBookings = await db.select({ id: bookings.id, guestEmail: bookings.guestEmail, promotionCode: bookings.promotionCode }).from(bookings).where(and(eq(bookings.paymentStatus, "paid"), ne(bookings.status, "cancelled"), ne(bookings.status, "refunded")));
  if (promotion.firstBookingOnly && (!input.guestEmail || paidBookings.some((booking: any) => String(booking.guestEmail).toLowerCase() === input.guestEmail!.trim().toLowerCase()))) return { valid: false as const, message: "This code is for first-time bookings only." };
  const codeUses = paidBookings.filter((booking: any) => String(booking.promotionCode ?? "").toUpperCase() === code);
  if (promotion.maxUses && codeUses.length >= promotion.maxUses) return { valid: false as const, message: "This promo code has reached its usage limit." };
  if (promotion.maxUsesPerGuest && input.guestEmail && codeUses.filter((booking: any) => String(booking.guestEmail).toLowerCase() === input.guestEmail!.trim().toLowerCase()).length >= promotion.maxUsesPerGuest) return { valid: false as const, message: "This promo code has already been used for this email address." };
  const rawDiscount = promotion.discountType === "percentage" ? input.baseAmount * Number(promotion.value) / 100 : Number(promotion.value);
  const discount = Math.min(Math.max(0, rawDiscount), Math.max(0, input.baseAmount));
  return { valid: true as const, code, promotion, discount };
}

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

async function syncExternalCalendar(feed: { id: number; propertyId: number; url: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  let parsed: Record<string, any>;
  try {
    parsed = await ical.async.fromURL(feed.url) as Record<string, any>;
  } catch (error) {
    console.error(`[iCal] Failed to import ${feed.url}`, error);
    throw new TRPCError({ code: "BAD_REQUEST", message: "The calendar URL could not be reached or parsed." });
  }
  const blocks = Object.values(parsed)
    .filter((event: any) => event?.type === "VEVENT" && event.start && event.end && new Date(event.end).getTime() > new Date(event.start).getTime())
    .map((event: any) => ({
      feedId: feed.id,
      propertyId: feed.propertyId,
      externalUid: String(event.uid ?? `${feed.id}-${new Date(event.start).getTime()}`),
      checkIn: new Date(event.start).toISOString().slice(0, 10),
      checkOut: new Date(event.end).toISOString().slice(0, 10),
    }));
  await db.delete(icalBlocks).where(eq(icalBlocks.feedId, feed.id));
  if (blocks.length > 0) await db.insert(icalBlocks).values(blocks as any);
  await db.update(icalFeeds).set({ lastSyncedAt: new Date() }).where(eq(icalFeeds.id, feed.id));
  return { imported: blocks.length };
}

// ─── Stripe instance ──────────────────────────────────────────────────────────
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
}

export const appRouter = router({
  analytics: router({
    heartbeat: publicProcedure
      .input(z.object({ sessionKey: z.string().min(16).max(128), path: z.string().max(255), bookingStage: z.string().max(64).default("browsing"), countryCode: z.string().max(8).optional(), language: z.string().max(16).optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        const now = new Date();
        await db.insert(visitorPresence).values({ ...input, lastSeenAt: now }).onDuplicateKeyUpdate({ set: { path: input.path, bookingStage: input.bookingStage, countryCode: input.countryCode, language: input.language, lastSeenAt: now } });
        return { success: true };
      }),
    getLiveActivity: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { activeVisitors: 0, bookingVisitors: 0, visitors: [] };
      const cutoff = new Date(Date.now() - 90 * 1000);
      const visitors = await db.select().from(visitorPresence).where(gt(visitorPresence.lastSeenAt, cutoff));
      return { activeVisitors: visitors.length, bookingVisitors: visitors.filter((visitor) => visitor.path.startsWith("/booking") || visitor.bookingStage !== "browsing").length, visitors: visitors.sort((a, b) => b.lastSeenAt.getTime() - a.lastSeenAt.getTime()).map(({ sessionKey: _sessionKey, ...visitor }) => visitor) };
    }),
  }),
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Cottages ──────────────────────────────────────────────────────────────
  cottages: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(properties).where(eq(properties.isActive, true));
    }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db.select().from(properties).where(eq(properties.slug, input.slug)).limit(1);
        const property = result[0];
        if (!property) return null;
        const photos = await db.select().from(propertyPhotos).where(eq(propertyPhotos.propertyId, property.id)).orderBy(asc(propertyPhotos.displayOrder), asc(propertyPhotos.id));
        return { ...property, photos };
      }),

    pricing: publicProcedure
      .input(z.object({ slug: z.string(), checkIn: z.string().optional(), checkOut: z.string().optional() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const property = (await db.select().from(properties).where(eq(properties.slug, input.slug)).limit(1))[0];
        if (!property) return null;
        let nightlyRate = Number(property.basePriceWeeknight);
        let weekendRate = Number(property.basePriceWeekend);
        let extraGuestRate = Number(property.extraGuestRate);
        if (input.checkIn) {
          const season = (await db.select().from(seasonalRates).where(and(eq(seasonalRates.propertyId, property.id), eq(seasonalRates.isActive, true), lte(seasonalRates.startDate, new Date(input.checkIn)), gte(seasonalRates.endDate, new Date(input.checkIn)))).limit(1))[0];
          if (season) {
            nightlyRate = Number(season.nightlyRate);
            weekendRate = Number(season.weekendRate);
            extraGuestRate = Number(season.extraGuestRate);
          }
        }
        const activeFees = await db.select().from(extraFees).where(and(eq(extraFees.propertyId, property.id), eq(extraFees.isActive, true)));
        return { nightlyRate, weekendRate, extraGuestRate, cleaningFee: Number(property.cleaningFee), minimumStayNights: property.minimumStayNights, extraFees: activeFees.map((fee) => ({ feeType: fee.feeType, amount: Number(fee.amount) })) };
      }),
  }),

  promotions: router({
    validate: publicProcedure
      .input(z.object({ propertyId: z.number(), code: z.string().trim().min(1).max(64), nights: z.number().int().min(1), guestCount: z.number().int().min(1).max(12), guestEmail: z.string().email().optional(), baseAmount: z.number().nonnegative() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const result = await validatePromotion(db, input);
        if (!result.valid) return result;
        return { valid: true as const, code: result.code, discount: Number(result.discount), description: result.promotion.description, name: result.promotion.name };
      }),
  }),

  // ─── Availability ──────────────────────────────────────────────────────────
  availability: router({
    getBookedDates: publicProcedure
      .input(z.object({ propertyId: z.number(), bookingSelection: z.enum(["la-seve", "le-bois", "both"]).default("both") }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const bookingPropertyIds = input.bookingSelection === "both"
          ? [1]
          : [1, input.propertyId];
        const results = await db
          .select({ checkIn: bookings.checkIn, checkOut: bookings.checkOut })
          .from(bookings)
          .where(
            and(
              or(...bookingPropertyIds.map((id) => eq(bookings.propertyId, id))),
              ne(bookings.status, "cancelled"),
              ne(bookings.status, "refunded")
            )
          );
        const externalBlocks = await db
          .select({ checkIn: icalBlocks.checkIn, checkOut: icalBlocks.checkOut })
          .from(icalBlocks)
          .where(or(...bookingPropertyIds.map((id) => eq(icalBlocks.propertyId, id))));
        return [...results, ...externalBlocks];
      }),
  }),

  // ─── Bookings ──────────────────────────────────────────────────────────────
  bookings: router({
    createCheckout: publicProcedure
      .input(z.object({
        propertyId: z.number(),
        bookingSelection: z.enum(["la-seve", "le-bois", "both"]).default("both"),
        guestFirstName: z.string().trim().min(1),
        guestSurname: z.string().trim().min(1),
        guestEmail: z.string().email(),
        guestPhone: z.string().trim().min(5),
        guestCount: z.number().min(1).max(12),
        checkIn: z.string(),
        checkOut: z.string(),
        promoCode: z.string().trim().max(64).optional(),
        specialRequests: z.string().optional(),
        gdprConsent: z.boolean(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        const selectionPropertyId: Record<BookingSelection, number> = {
          "la-seve": 2,
          "le-bois": 3,
          both: 1,
        };
        const expectedPropertyId = selectionPropertyId[input.bookingSelection];
        if (input.propertyId !== expectedPropertyId) throw new Error("Invalid booking selection");

        const propertyResult = await db.select().from(properties).where(eq(properties.id, input.propertyId)).limit(1);
        const cottage = propertyResult[0];
        if (!cottage) throw new Error("Cottage not found");

        const minimumGuests = minimumGuestsForSelection(input.bookingSelection);
        const maximumGuests = maximumGuestsForSelection(input.bookingSelection);
        if (input.guestCount < minimumGuests || input.guestCount > maximumGuests) {
          throw new Error(`Guest count must be between ${minimumGuests} and ${maximumGuests}`);
        }

        const checkIn = new Date(input.checkIn);
        const checkOut = new Date(input.checkOut);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        if (nights < cottage.minimumStayNights) {
          throw new Error(`Minimum stay is ${cottage.minimumStayNights} nights`);
        }

        const cleaningFee = parseFloat(cottage.cleaningFee);
        const season = (await db.select().from(seasonalRates).where(and(eq(seasonalRates.propertyId, cottage.id), eq(seasonalRates.isActive, true), lte(seasonalRates.startDate, new Date(input.checkIn)), gte(seasonalRates.endDate, new Date(input.checkIn)))).limit(1))[0];
        const activeFees = await db.select().from(extraFees).where(and(eq(extraFees.propertyId, cottage.id), eq(extraFees.isActive, true)));
        const rateConfig = {
          cottageNightlyBase: season ? parseFloat(season.nightlyRate) : parseFloat(cottage.basePriceWeeknight),
          extraGuestNightly: season ? parseFloat(season.extraGuestRate) : parseFloat(cottage.extraGuestRate),
          extraFees: activeFees.map((fee) => ({ feeType: fee.feeType, amount: parseFloat(fee.amount) })),
        } as const;
        const nightsTotal = bookingTotal(input.bookingSelection, input.guestCount, nights, rateConfig);
        const promotionResult = input.promoCode ? await validatePromotion(db, { propertyId: input.propertyId, code: input.promoCode, nights, guestCount: input.guestCount, guestEmail: input.guestEmail, baseAmount: nightsTotal }) : null;
        if (promotionResult && !promotionResult.valid) throw new Error(promotionResult.message);
        const promotionDiscount = promotionResult?.valid ? Number(promotionResult.discount) : 0;
        const discountedNightsTotal = Math.max(0, nightsTotal - promotionDiscount);
        const totalAmount = discountedNightsTotal + cleaningFee;

        const [result] = await (db.insert(bookings).values as any)([{
          propertyId: input.propertyId,
          bookingSelection: input.bookingSelection,
          guestName: `${input.guestFirstName} ${input.guestSurname}`,
          guestFirstName: input.guestFirstName,
          guestSurname: input.guestSurname,
          guestEmail: input.guestEmail,
          guestPhone: input.guestPhone,
          guestCount: input.guestCount,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          totalAmount: totalAmount.toFixed(2),
          cleaningFee: cleaningFee.toFixed(2),
          promotionCode: promotionResult?.valid ? promotionResult.code : null,
          promotionDiscount: promotionDiscount.toFixed(2),
          paymentStatus: "unpaid" as const,
          specialRequests: input.specialRequests,
          gdprConsent: input.gdprConsent,
          status: "pending" as const,
        }]);

        const bookingId = (result as any).insertId;

        const stripe = getStripe();
        if (!stripe) {
          return { bookingId, checkoutUrl: null, totalAmount };
        }

        const origin = ctx.req.headers.origin || "https://sevebois.be";
        const cottageName = input.bookingSelection === "both"
          ? "Sève & Bois Escapes — both cottages"
          : cottage.nameFr;

        const session = await stripe.checkout.sessions.create({
          managed_payments: { enabled: false },
          after_expiration: { recovery: { enabled: true, allow_promotion_codes: false } },
          line_items: [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: `${cottageName} — ${nights} nuit${nights > 1 ? "s" : ""}`,
                  description: `${input.guestFirstName} ${input.guestSurname} · ${input.checkIn} → ${input.checkOut} · ${input.guestCount} personne${input.guestCount > 1 ? "s" : ""}`,
                },
                unit_amount: Math.round(discountedNightsTotal * 100),
              },
              quantity: 1,
            },
            {
              price_data: {
                currency: "eur",
                product_data: { name: "Frais de ménage / Cleaning fee" },
                unit_amount: Math.round(cleaningFee * 100),
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          customer_email: input.guestEmail,
          client_reference_id: bookingId.toString(),
          metadata: {
            booking_id: bookingId.toString(),
            guest_name: `${input.guestFirstName} ${input.guestSurname}`,
            cottage_name: cottageName,
            check_in: input.checkIn,
            check_out: input.checkOut,
            promotion_code: promotionResult?.valid ? promotionResult.code : "",
            promotion_discount: promotionDiscount.toFixed(2),
          },
          success_url: `${origin}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
          cancel_url: `${origin}/booking?cancelled=1`,
          allow_promotion_codes: false,
        });

        await db.update(bookings)
          .set({ stripeSessionId: session.id })
          .where(eq(bookings.id, bookingId));

        return { bookingId, checkoutUrl: session.url, totalAmount };
      }),

    getBySessionId: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db.select().from(bookings)
          .where(eq(bookings.stripeSessionId, input.sessionId)).limit(1);
        return result[0] ?? null;
      }),
  }),

  // ─── Newsletter ─────────────────────────────────────────────────────────────
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        try {
          await db.insert(newsletterSubscribers).values({
            email: input.email,
            name: input.name,
            source: input.source || "footer",
            gdprConsent: true,
          });
        } catch (err: any) {
          if (err?.message?.includes("Duplicate")) {
            throw new Error("already subscribed");
          }
          throw err;
        }
        await sendEmail(
          "support@sevebois.be",
          "Nouvel abonné newsletter — Sève & Bois",
          `<p>Nouvel abonné : <strong>${input.email}</strong> (${input.name || "—"}) via ${input.source || "footer"}</p>`
        );
        return { success: true };
      }),
    requestGuide: publicProcedure
      .input(z.object({
        firstName: z.string().trim().min(1).max(128),
        lastName: z.string().trim().min(1).max(128),
        email: z.string().email(),
        marketingConsent: z.literal(true),
        source: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const existing = (await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, input.email)).limit(1))[0];
        const source = input.source || "guide_cta";
        if (existing) {
          await db.update(newsletterSubscribers).set({ firstName: input.firstName, lastName: input.lastName, name: `${input.firstName} ${input.lastName}`, gdprConsent: true, marketingConsent: true, guideRequested: true, source }).where(eq(newsletterSubscribers.id, existing.id));
        } else {
          await db.insert(newsletterSubscribers).values({ email: input.email, name: `${input.firstName} ${input.lastName}`, firstName: input.firstName, lastName: input.lastName, gdprConsent: true, marketingConsent: true, guideRequested: true, source });
        }
        const crm = await syncGuideLeadToHighLevel(input);
        if (!crm.synced) {
          throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "We saved your request, but could not connect to the guide delivery service. Please try again in a moment." });
        }
        await db.update(newsletterSubscribers).set({ crmSyncedAt: new Date() }).where(eq(newsletterSubscribers.email, input.email));
        const origin = ctx.req.headers.origin || "https://www.sevebois.be";
        const guideUrl = `${origin}/api/guide/download?token=${createGuideToken(input.email)}`;
        await sendEmail(input.email, "Votre guide Green Cottages de Laforêt", `<p>Bonjour ${input.firstName},</p><p>Merci pour votre intérêt pour Green Cottages de Laforêt. Votre guide est prêt :</p><p><a href="${guideUrl}">Télécharger le guide des Ardennes</a></p><p>Vous recevrez également nos informations et inspirations concernant nos hébergements. Vous pouvez vous désabonner à tout moment.</p>`);
        return { success: true, crmSynced: crm.synced };
      }),
  }),

  // ─── Enquiries ──────────────────────────────────────────────────────────────
  enquiries: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        propertyId: z.number().optional(),
        checkIn: z.string().optional(),
        checkOut: z.string().optional(),
        guestCount: z.number().optional(),
        message: z.string().optional(),
        gdprConsent: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await (db.insert(enquiries).values as any)([{
          name: input.name,
          email: input.email,
          phone: input.phone ?? null,
          propertyId: input.propertyId ?? null,
          checkIn: input.checkIn ?? null,
          checkOut: input.checkOut ?? null,
          guestCount: input.guestCount ?? null,
          message: input.message ?? null,
          gdprConsent: input.gdprConsent,
        }]);
        await sendEmail(
          "support@sevebois.be",
          `Nouvelle demande de ${input.name} — Sève & Bois`,
          `<h2>Nouvelle demande</h2><p><strong>Nom:</strong> ${input.name}</p><p><strong>Email:</strong> ${input.email}</p><p><strong>Message:</strong> ${input.message || "—"}</p>`
        );
        return { success: true };
      }),
  }),

  // ─── iCal feeds ─────────────────────────────────────────────────────────────
  ical: router({
    getFeeds: protectedProcedure
      .input(z.object({ propertyId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(icalFeeds).where(eq(icalFeeds.propertyId, input.propertyId));
      }),

    addFeed: adminProcedure
      .input(z.object({
        propertyId: z.number(),
        name: z.string(),
        url: z.string().url(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(icalFeeds).values(input);
        return { success: true };
      }),

    syncFeed: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const feed = (await db.select().from(icalFeeds).where(eq(icalFeeds.id, input.id)).limit(1))[0];
        if (!feed) throw new Error("iCal feed not found");
        return syncExternalCalendar(feed);
      }),

    deleteFeed: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(icalFeeds).where(eq(icalFeeds.id, input.id));
        return { success: true };
      }),
  }),

  admin: router({
    getProperties: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(properties);
    }),

    updateProperty: adminProcedure
      .input(z.object({
        id: z.number(),
        slug: z.string().trim().min(1).max(64).optional(),
        nameFr: z.string().trim().min(1).max(128).optional(),
        nameEn: z.string().trim().min(1).max(128).optional(),
        nameNl: z.string().trim().min(1).max(128).optional(),
        maxGuests: z.number().int().min(1).max(50).optional(),
        bedrooms: z.number().int().min(0).max(50).optional(),
        bathrooms: z.number().int().min(0).max(50).optional(),
        isActive: z.boolean().optional(),
        basePriceWeeknight: z.number().nonnegative().optional(),
        basePriceWeekend: z.number().nonnegative().optional(),
        basePriceWeek: z.number().nonnegative().optional(),
        extraGuestRate: z.number().nonnegative().optional(),
        cleaningFee: z.number().nonnegative().optional(),
        minimumStayNights: z.number().int().min(1).optional(),
        propertyAreaM2: z.number().nonnegative().optional(),
        annualCouncilTax: z.number().nonnegative().optional(),
        councilTaxRatePerM2: z.number().nonnegative().optional(),
        zapierWebhookUrl: z.string().url().or(z.literal("")).optional(),
        gohighlevelWebhookUrl: z.string().url().or(z.literal("")).optional(),
        descriptionFr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionNl: z.string().optional(),
        houseRulesFr: z.string().optional(),
        houseRulesEn: z.string().optional(),
        houseRulesNl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const { id, ...updates } = input;
        await db.update(properties).set(updates as any).where(eq(properties.id, id));
        return { success: true };
      }),

    createProperty: adminProcedure
      .input(z.object({ slug: z.string().min(1), nameFr: z.string().min(1), nameEn: z.string().min(1), nameNl: z.string().min(1), descriptionFr: z.string().optional(), descriptionEn: z.string().optional(), descriptionNl: z.string().optional(), maxGuests: z.number().int().min(1).max(50), bedrooms: z.number().int().min(0).max(50), bathrooms: z.number().int().min(0).max(50), basePriceWeeknight: z.number().nonnegative(), basePriceWeekend: z.number().nonnegative(), basePriceWeek: z.number().nonnegative(), extraGuestRate: z.number().nonnegative(), cleaningFee: z.number().nonnegative(), minimumStayNights: z.number().int().min(1).max(30) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(properties).values(input as any);
        return { success: true };
      }),

    getBookings: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(bookings);
    }),

    getBookingProfile: adminProcedure
      .input(z.object({ bookingId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const booking = (await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1))[0];
        if (!booking) return null;
        const [guestBookings, communications, property] = await Promise.all([
          db.select().from(bookings).where(eq(bookings.guestEmail, booking.guestEmail)),
          db.select().from(guestCommunications).where(eq(guestCommunications.guestEmail, booking.guestEmail)),
          db.select().from(properties).where(eq(properties.id, booking.propertyId)).limit(1),
        ]);
        return { booking, guestBookings, communications, property: property[0] ?? null };
      }),

    updateBookingStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(["pending", "confirmed", "abandoned", "cancelled", "refunded"]) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const booking = (await db.select({ paymentStatus: bookings.paymentStatus }).from(bookings).where(eq(bookings.id, input.id)).limit(1))[0];
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found." });
        if (input.status === "confirmed" && booking.paymentStatus !== "paid") throw new TRPCError({ code: "PRECONDITION_FAILED", message: "A booking can only be confirmed after Stripe reports a successful payment." });
        await db.update(bookings).set({ status: input.status, ...(input.status === "refunded" ? { paymentStatus: "refunded" as const } : input.status === "pending" ? { paymentStatus: "requires_payment" as const } : {}) }).where(eq(bookings.id, input.id));
        return { success: true };
      }),

    updateBooking: adminProcedure
      .input(z.object({ id: z.number(), bookingSelection: z.enum(["la-seve", "le-bois", "both"]).optional(), guestFirstName: z.string().trim().min(1).optional(), guestSurname: z.string().trim().min(1).optional(), guestName: z.string().min(2), guestEmail: z.string().email(), guestPhone: z.string().trim().refine((value) => value.length === 0 || value.length >= 5, "Phone number is too short.").optional(), guestCount: z.number().int().min(1).max(12), checkIn: z.string(), checkOut: z.string(), totalAmount: z.number().nonnegative().optional(), cleaningFee: z.number().nonnegative().optional(), specialRequests: z.string().optional(), requiresPayment: z.boolean().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        if (new Date(input.checkOut).getTime() <= new Date(input.checkIn).getTime()) throw new TRPCError({ code: "BAD_REQUEST", message: "Check-out must be after check-in." });
        if (input.bookingSelection === "both" && input.guestCount < minimumGuestsForSelection("both")) throw new TRPCError({ code: "BAD_REQUEST", message: "Both cottages require at least 4 guests." });
        if (input.bookingSelection && input.guestCount > maximumGuestsForSelection(input.bookingSelection)) throw new TRPCError({ code: "BAD_REQUEST", message: "Guest count exceeds the selected cottage capacity." });
        const { id, guestFirstName, guestSurname, requiresPayment, ...updates } = input;
        const normalizedUpdates = {
          ...updates,
          guestPhone: updates.guestPhone ?? "",
          ...(guestFirstName && guestSurname ? { guestFirstName, guestSurname, guestName: `${guestFirstName} ${guestSurname}` } : {}),
          ...(requiresPayment ? { paymentStatus: "requires_payment" as const, status: "pending" as const } : {}),
        };
        await db.update(bookings).set(normalizedUpdates as any).where(eq(bookings.id, id));
        return { success: true };
      }),
    createPaymentLink: adminProcedure
      .input(z.object({ bookingId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const booking = (await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1))[0];
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found." });
        const stripe = getStripe();
        if (!stripe) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Stripe live payments are not configured." });
        const property = (await db.select().from(properties).where(eq(properties.id, booking.propertyId)).limit(1))[0];
        const origin = ctx.req.headers.origin || "https://sevebois.be";
        const session = await stripe.checkout.sessions.create({
          managed_payments: { enabled: false },
          line_items: [{
            price_data: {
              currency: "eur",
              product_data: { name: `${property?.nameEn ?? "Green Cottages"} — booking balance`, description: `${booking.checkIn} → ${booking.checkOut} · ${booking.guestCount} guests` },
              unit_amount: Math.round(Number(booking.totalAmount) * 100),
            },
            quantity: 1,
          }],
          mode: "payment",
          customer_email: booking.guestEmail,
          client_reference_id: booking.id.toString(),
          metadata: { booking_id: booking.id.toString(), payment_link_for: "booking_amendment" },
          success_url: `${origin}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
          cancel_url: `${origin}/booking/confirmation?booking_id=${booking.id}&payment_cancelled=1`,
        });
        await db.update(bookings).set({ paymentLinkUrl: session.url, paymentStatus: "requires_payment", status: "pending", stripeSessionId: session.id }).where(eq(bookings.id, booking.id));
        return { url: session.url, bookingId: booking.id };
      }),

    retryAbandonedWebhook: adminProcedure
      .input(z.object({ bookingId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const booking = (await db.select({ id: bookings.id, status: bookings.status, stripeSessionId: bookings.stripeSessionId }).from(bookings).where(eq(bookings.id, input.bookingId)).limit(1))[0];
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found." });
        if (booking.status !== "abandoned") throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Only abandoned checkouts can be retried." });
        if (!booking.stripeSessionId) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "This booking has no Stripe Checkout Session." });
        return dispatchAbandonedCheckout({ bookingId: booking.id, stripeSessionId: booking.stripeSessionId, stripeEventId: `manual_retry_${booking.id}_${Date.now()}` });
      }),

    retryConfirmedWebhook: adminProcedure
      .input(z.object({ bookingId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const booking = (await db.select({ id: bookings.id, status: bookings.status, paymentStatus: bookings.paymentStatus, stripeSessionId: bookings.stripeSessionId }).from(bookings).where(eq(bookings.id, input.bookingId)).limit(1))[0];
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found." });
        if (booking.status !== "confirmed" || booking.paymentStatus !== "paid") throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Only paid and confirmed bookings can be sent." });
        return dispatchConfirmedBooking({ bookingId: booking.id, stripeEventId: `manual_retry_${booking.id}_${Date.now()}`, stripeSessionId: booking.stripeSessionId ?? undefined });
      }),

    getGuestCommunications: adminProcedure
      .input(z.object({ guestEmail: z.string().email() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(guestCommunications).where(eq(guestCommunications.guestEmail, input.guestEmail));
      }),

    addGuestCommunication: adminProcedure
      .input(z.object({ guestEmail: z.string().email(), bookingId: z.number().optional(), channel: z.enum(["email", "phone", "note"]), summary: z.string().min(2) }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(guestCommunications).values({ ...input, createdBy: ctx.user.name ?? "Admin" });
        return { success: true };
      }),

    getGuestSummary: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select({ guestName: bookings.guestName, guestEmail: bookings.guestEmail, guestPhone: bookings.guestPhone, bookingCount: bookings.id, lastCheckIn: bookings.checkIn }).from(bookings);
    }),

    getAnalytics: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { totalBookings: 0, confirmedBookings: 0, cancelledBookings: 0, pendingBookings: 0, abandonedCheckouts: 0, revenue: 0, paidRevenue: 0, nightsBooked: 0, occupancyEstimate: 0 };
      const rows = await db.select().from(bookings);
      const paid = rows.filter((booking) => booking.paymentStatus === "paid" && booking.status === "confirmed");
      const abandonedCutoff = Date.now() - 24 * 60 * 60 * 1000;
      const pending = rows.filter((booking) => booking.paymentStatus !== "paid" && booking.status === "pending" && new Date(booking.createdAt).getTime() >= abandonedCutoff);
      const abandoned = rows.filter((booking) => booking.status === "abandoned" || (booking.paymentStatus !== "paid" && booking.status === "pending" && new Date(booking.createdAt).getTime() < abandonedCutoff));
      const nightsBooked = paid.reduce((total, booking) => total + Math.max(0, Math.ceil((new Date(String(booking.checkOut)).getTime() - new Date(String(booking.checkIn)).getTime()) / 86400000)), 0);
      const paidRevenue = paid.reduce((total, booking) => total + Number(booking.totalAmount), 0);
      return { totalBookings: paid.length, confirmedBookings: paid.length, cancelledBookings: rows.filter((booking) => booking.status === "cancelled" || booking.status === "refunded").length, pendingBookings: pending.length, abandonedCheckouts: abandoned.length, revenue: paidRevenue, paidRevenue, nightsBooked, occupancyEstimate: Math.min(100, Math.round((nightsBooked / 365) * 100)) };
    }),

    getPropertyPhotos: adminProcedure
      .input(z.object({ propertyId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(propertyPhotos).where(eq(propertyPhotos.propertyId, input.propertyId)).orderBy(asc(propertyPhotos.displayOrder), asc(propertyPhotos.id));
      }),

    reorderPropertyPhoto: adminProcedure
      .input(z.object({ propertyId: z.number(), photoId: z.number(), direction: z.enum(["up", "down"]) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const rows = await db.select().from(propertyPhotos).where(eq(propertyPhotos.propertyId, input.propertyId)).orderBy(asc(propertyPhotos.displayOrder), asc(propertyPhotos.id));
        const index = rows.findIndex((row) => row.id === input.photoId);
        const targetIndex = input.direction === "up" ? index - 1 : index + 1;
        if (index < 0 || targetIndex < 0 || targetIndex >= rows.length) return { success: true, moved: false };
        const current = rows[index];
        const target = rows[targetIndex];
        await db.update(propertyPhotos).set({ displayOrder: target.displayOrder }).where(eq(propertyPhotos.id, current.id));
        await db.update(propertyPhotos).set({ displayOrder: current.displayOrder }).where(eq(propertyPhotos.id, target.id));
        return { success: true, moved: true };
      }),

    reorderPropertyPhotos: adminProcedure
      .input(z.object({ propertyId: z.number(), photoIds: z.array(z.number()).min(1) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const rows = await db.select({ id: propertyPhotos.id }).from(propertyPhotos).where(eq(propertyPhotos.propertyId, input.propertyId));
        const validIds = new Set(rows.map((row) => row.id));
        const requestedIds = new Set(input.photoIds);
        if (requestedIds.size !== input.photoIds.length || requestedIds.size !== validIds.size || input.photoIds.some((id) => !validIds.has(id))) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "The gallery order does not match this property." });
        }
        for (let displayOrder = 0; displayOrder < input.photoIds.length; displayOrder += 1) {
          const id = input.photoIds[displayOrder];
          await db.update(propertyPhotos).set({ displayOrder }).where(and(eq(propertyPhotos.id, id), eq(propertyPhotos.propertyId, input.propertyId)));
        }
        return { success: true };
      }),

    addPropertyPhoto: adminProcedure
      .input(z.object({ propertyId: z.number(), url: z.string().trim().min(1).refine((value) => /^https?:\/\//i.test(value) || value.startsWith("/manus-storage/"), "Use an HTTPS image URL or a /manus-storage/ path."), caption: z.string().optional(), displayOrder: z.number().int().min(0).default(0), isHeroImage: z.boolean().default(false) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        if (input.isHeroImage) {
          await db.update(propertyPhotos).set({ isHeroImage: false }).where(eq(propertyPhotos.propertyId, input.propertyId));
        }
        await db.insert(propertyPhotos).values(input);
        return { success: true };
      }),

    updatePropertyPhoto: adminProcedure
      .input(z.object({ id: z.number(), propertyId: z.number(), url: z.string().trim().min(1).refine((value) => /^https?:\/\//i.test(value) || value.startsWith("/manus-storage/"), "Use an HTTPS image URL or a /manus-storage/ path."), caption: z.string().optional(), displayOrder: z.number().int().min(0), isHeroImage: z.boolean() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const { id, propertyId, ...values } = input;
        const photo = (await db.select({ id: propertyPhotos.id }).from(propertyPhotos).where(and(eq(propertyPhotos.id, id), eq(propertyPhotos.propertyId, propertyId))).limit(1))[0];
        if (!photo) throw new TRPCError({ code: "NOT_FOUND", message: "Photo not found for this property." });
        if (values.isHeroImage) {
          await db.update(propertyPhotos).set({ isHeroImage: false }).where(eq(propertyPhotos.propertyId, propertyId));
        }
        await db.update(propertyPhotos).set(values).where(and(eq(propertyPhotos.id, id), eq(propertyPhotos.propertyId, propertyId)));
        return { success: true };
      }),

    deletePropertyPhoto: adminProcedure
      .input(z.object({ id: z.number(), propertyId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const photo = (await db.select().from(propertyPhotos).where(and(eq(propertyPhotos.id, input.id), eq(propertyPhotos.propertyId, input.propertyId))).limit(1))[0];
        if (!photo) throw new TRPCError({ code: "NOT_FOUND", message: "Photo not found for this property." });
        await db.delete(propertyPhotos).where(and(eq(propertyPhotos.id, input.id), eq(propertyPhotos.propertyId, input.propertyId)));
        if (photo.isHeroImage) {
          const replacement = (await db.select({ id: propertyPhotos.id }).from(propertyPhotos).where(eq(propertyPhotos.propertyId, input.propertyId)).orderBy(asc(propertyPhotos.displayOrder), asc(propertyPhotos.id)).limit(1))[0];
          if (replacement) await db.update(propertyPhotos).set({ isHeroImage: true }).where(eq(propertyPhotos.id, replacement.id));
        }
        return { success: true };
      }),

    getAmenities: adminProcedure
      .input(z.object({ propertyId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(amenities).where(eq(amenities.propertyId, input.propertyId));
      }),

    createAmenity: adminProcedure
      .input(z.object({ propertyId: z.number(), categoryFr: z.string().min(1), categoryEn: z.string().min(1), categoryNl: z.string().min(1), items: z.any().default([]) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(amenities).values(input as any);
        return { success: true };
      }),

    deleteAmenity: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(amenities).where(eq(amenities.id, input.id));
        return { success: true };
      }),

    updateAmenity: adminProcedure
      .input(z.object({ id: z.number(), categoryFr: z.string().min(1), categoryEn: z.string().min(1), categoryNl: z.string().min(1), items: z.any() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.update(amenities).set(input as any).where(eq(amenities.id, input.id));
        return { success: true };
      }),

    getSeasonalRates: adminProcedure
      .input(z.object({ propertyId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(seasonalRates).where(eq(seasonalRates.propertyId, input.propertyId));
      }),

    createSeasonalRate: adminProcedure
      .input(z.object({ propertyId: z.number(), name: z.string().min(1), startDate: z.string(), endDate: z.string(), nightlyRate: z.number().nonnegative(), weekendRate: z.number().nonnegative(), extraGuestRate: z.number().nonnegative(), isActive: z.boolean().default(true) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(seasonalRates).values(input as any);
        return { success: true };
      }),

    deleteSeasonalRate: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(seasonalRates).where(eq(seasonalRates.id, input.id));
        return { success: true };
      }),

    getExtraFees: adminProcedure
      .input(z.object({ propertyId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(extraFees).where(eq(extraFees.propertyId, input.propertyId));
      }),

    createExtraFee: adminProcedure
      .input(z.object({ propertyId: z.number(), name: z.string().min(1), feeType: z.enum(["fixed", "percentage"]), amount: z.number().nonnegative(), isActive: z.boolean().default(true) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(extraFees).values(input as any);
        return { success: true };
      }),

    deleteExtraFee: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(extraFees).where(eq(extraFees.id, input.id));
        return { success: true };
      }),

    getPromotions: adminProcedure
      .input(z.object({ propertyId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(promotions).where(eq(promotions.propertyId, input.propertyId));
      }),

    createPromotion: adminProcedure
      .input(z.object({ propertyId: z.number(), name: z.string().min(1), code: z.string().trim().min(1).max(64).transform((value) => value.toUpperCase()), description: z.string().optional(), discountType: z.enum(["percentage", "fixed"]), value: z.number().nonnegative(), minimumNights: z.number().int().min(1), validFrom: z.string().optional(), validUntil: z.string().optional(), firstBookingOnly: z.boolean().default(false), maxUses: z.number().int().positive().optional(), maxUsesPerGuest: z.number().int().positive().default(1), eligibleEmail: z.string().email().optional().or(z.literal("")), minimumGuests: z.number().int().positive().optional(), maximumGuests: z.number().int().positive().optional(), isActive: z.boolean().default(true) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(promotions).values(input as any);
        return { success: true };
      }),

    updatePromotion: adminProcedure
      .input(z.object({ id: z.number(), name: z.string().min(1), code: z.string().trim().min(1).max(64).transform((value) => value.toUpperCase()), description: z.string().optional(), discountType: z.enum(["percentage", "fixed"]), value: z.number().nonnegative(), minimumNights: z.number().int().min(1), validFrom: z.string().optional(), validUntil: z.string().optional(), firstBookingOnly: z.boolean(), maxUses: z.number().int().positive().optional(), maxUsesPerGuest: z.number().int().positive(), eligibleEmail: z.string().email().optional().or(z.literal("")), minimumGuests: z.number().int().positive().optional(), maximumGuests: z.number().int().positive().optional(), isActive: z.boolean() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const { id, ...values } = input;
        await db.update(promotions).set(values as any).where(eq(promotions.id, id));
        return { success: true };
      }),

    deletePromotion: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(promotions).where(eq(promotions.id, input.id));
        return { success: true };
      }),
  }),

  blog: router({
    adminList: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(blogPosts);
    }),

    list: publicProcedure
      .input(z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(blogPosts)
          .where(eq(blogPosts.isPublished, true))
          .limit(input.limit)
          .offset(input.offset);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db.select().from(blogPosts)
          .where(and(eq(blogPosts.slug, input.slug), eq(blogPosts.isPublished, true)))
          .limit(1);
        return result[0] ?? null;
      }),

    create: protectedProcedure
      .input(z.object({
        slug: z.string(),
        titleFr: z.string(),
        titleEn: z.string(),
        descriptionFr: z.string().optional(),
        descriptionEn: z.string().optional(),
        contentFr: z.string(),
        contentEn: z.string(),
        categoryFr: z.string().optional(),
        categoryEn: z.string().optional(),
        featuredImageUrl: z.string().optional(),
        isPublished: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await (db.insert(blogPosts).values as any)([{
          ...input,
          authorName: ctx.user?.name || "Sève & Bois",
          publishedAt: input.isPublished ? new Date() : null,
        }]);
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        titleFr: z.string().optional(),
        titleEn: z.string().optional(),
        contentFr: z.string().optional(),
        contentEn: z.string().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const updates: any = { ...input };
        if (input.isPublished === true) {
          updates.publishedAt = new Date();
        }
        await db.update(blogPosts).set(updates).where(eq(blogPosts.id, input.id));
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(blogPosts).where(eq(blogPosts.id, input.id));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

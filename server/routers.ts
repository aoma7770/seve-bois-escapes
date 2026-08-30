import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { bookings, properties, enquiries, icalFeeds, icalBlocks, newsletterSubscribers, blogPosts, amenities, promotions, seasonalRates, extraFees, propertyPhotos, guestCommunications } from "../drizzle/schema";
import { eq, and, ne, or, lte, gte, asc } from "drizzle-orm";
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
        guestName: z.string().min(2),
        guestEmail: z.string().email(),
        guestPhone: z.string().optional(),
        guestCount: z.number().min(1).max(12),
        checkIn: z.string(),
        checkOut: z.string(),
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
        const totalAmount = nightsTotal + cleaningFee;

        const [result] = await (db.insert(bookings).values as any)([{
          propertyId: input.propertyId,
          bookingSelection: input.bookingSelection,
          guestName: input.guestName,
          guestEmail: input.guestEmail,
          guestPhone: input.guestPhone,
          guestCount: input.guestCount,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          totalAmount: totalAmount.toFixed(2),
          cleaningFee: cleaningFee.toFixed(2),
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
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: `${cottageName} — ${nights} nuit${nights > 1 ? "s" : ""}`,
                  description: `${input.checkIn} → ${input.checkOut} · ${input.guestCount} personne${input.guestCount > 1 ? "s" : ""}`,
                },
                unit_amount: Math.round(nightsTotal * 100),
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
            guest_name: input.guestName,
            cottage_name: cottageName,
            check_in: input.checkIn,
            check_out: input.checkOut,
          },
          success_url: `${origin}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
          cancel_url: `${origin}/booking?cancelled=1`,
          allow_promotion_codes: true,
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

    updateBookingStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(["pending", "confirmed", "cancelled", "refunded"]) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.update(bookings).set({ status: input.status }).where(eq(bookings.id, input.id));
        return { success: true };
      }),

    updateBooking: adminProcedure
      .input(z.object({ id: z.number(), guestName: z.string().min(2), guestEmail: z.string().email(), guestPhone: z.string().optional(), guestCount: z.number().int().min(1).max(12), checkIn: z.string(), checkOut: z.string(), specialRequests: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        if (new Date(input.checkOut).getTime() <= new Date(input.checkIn).getTime()) throw new TRPCError({ code: "BAD_REQUEST", message: "Check-out must be after check-in." });
        const { id, ...updates } = input;
        await db.update(bookings).set(updates as any).where(eq(bookings.id, id));
        return { success: true };
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
      if (!db) return { totalBookings: 0, confirmedBookings: 0, cancelledBookings: 0, revenue: 0, nightsBooked: 0, occupancyEstimate: 0 };
      const rows = await db.select().from(bookings);
      const active = rows.filter((booking) => booking.status !== "cancelled" && booking.status !== "refunded");
      const nightsBooked = active.reduce((total, booking) => total + Math.max(0, Math.ceil((new Date(String(booking.checkOut)).getTime() - new Date(String(booking.checkIn)).getTime()) / 86400000)), 0);
      return { totalBookings: rows.length, confirmedBookings: rows.filter((booking) => booking.status === "confirmed").length, cancelledBookings: rows.filter((booking) => booking.status === "cancelled").length, revenue: active.reduce((total, booking) => total + Number(booking.totalAmount), 0), nightsBooked, occupancyEstimate: Math.min(100, Math.round((nightsBooked / 365) * 100)) };
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

    addPropertyPhoto: adminProcedure
      .input(z.object({ propertyId: z.number(), url: z.string().url(), caption: z.string().optional(), displayOrder: z.number().int().min(0).default(0), isHeroImage: z.boolean().default(false) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(propertyPhotos).values(input);
        return { success: true };
      }),

    deletePropertyPhoto: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(propertyPhotos).where(eq(propertyPhotos.id, input.id));
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
      .input(z.object({ propertyId: z.number(), name: z.string().min(1), discountType: z.enum(["percentage", "fixed"]), value: z.number().nonnegative(), minimumNights: z.number().int().min(1), isActive: z.boolean().default(true) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(promotions).values(input as any);
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

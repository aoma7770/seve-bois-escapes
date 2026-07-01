import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { bookings, cottages, enquiries, icalFeeds, newsletterSubscribers, blogPosts } from "../drizzle/schema";
import { eq, and, ne } from "drizzle-orm";
import Stripe from "stripe";
import nodemailer from "nodemailer";

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
      return db.select().from(cottages).where(eq(cottages.isActive, true));
    }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db.select().from(cottages).where(eq(cottages.slug, input.slug)).limit(1);
        return result[0] ?? null;
      }),
  }),

  // ─── Availability ──────────────────────────────────────────────────────────
  availability: router({
    getBookedDates: publicProcedure
      .input(z.object({ cottageId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const results = await db
          .select({ checkIn: bookings.checkIn, checkOut: bookings.checkOut })
          .from(bookings)
          .where(
            and(
              eq(bookings.cottageId, input.cottageId),
              ne(bookings.status, "cancelled"),
              ne(bookings.status, "refunded")
            )
          );
        return results;
      }),
  }),

  // ─── Bookings ──────────────────────────────────────────────────────────────
  bookings: router({
    createCheckout: publicProcedure
      .input(z.object({
        cottageId: z.number(),
        guestName: z.string().min(2),
        guestEmail: z.string().email(),
        guestPhone: z.string().optional(),
        guestCount: z.number().min(1).max(10),
        checkIn: z.string(),
        checkOut: z.string(),
        specialRequests: z.string().optional(),
        gdprConsent: z.boolean(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        const cottageResult = await db.select().from(cottages).where(eq(cottages.id, input.cottageId)).limit(1);
        const cottage = cottageResult[0];
        if (!cottage) throw new Error("Cottage not found");

        const checkIn = new Date(input.checkIn);
        const checkOut = new Date(input.checkOut);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        if (nights < cottage.minimumStayNights) {
          throw new Error(`Minimum stay is ${cottage.minimumStayNights} nights`);
        }

        const isWeekend = (d: Date) => d.getDay() === 5 || d.getDay() === 6;
        let nightsTotal = 0;
        for (let i = 0; i < nights; i++) {
          const d = new Date(checkIn);
          d.setDate(d.getDate() + i);
          nightsTotal += isWeekend(d)
            ? parseFloat(cottage.basePriceWeekend)
            : parseFloat(cottage.basePriceWeeknight);
        }
        const cleaningFee = parseFloat(cottage.cleaningFee);
        const totalAmount = nightsTotal + cleaningFee;

        const [result] = await (db.insert(bookings).values as any)([{
          cottageId: input.cottageId,
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
        const cottageName = cottage.nameFr;

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
        cottageId: z.number().optional(),
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
          cottageId: input.cottageId ?? null,
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
      .input(z.object({ cottageId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(icalFeeds).where(eq(icalFeeds.cottageId, input.cottageId));
      }),

    addFeed: protectedProcedure
      .input(z.object({
        cottageId: z.number(),
        name: z.string(),
        url: z.string().url(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(icalFeeds).values(input);
        return { success: true };
      }),

    deleteFeed: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(icalFeeds).where(eq(icalFeeds.id, input.id));
        return { success: true };
      }),
  }),

  blog: router({
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

import { Router, Request, Response } from "express";
import { getDb } from "./db";
import { bookings, properties } from "../drizzle/schema";
import { eq, and, ne } from "drizzle-orm";
import ical from "ical-generator";

const router = Router();

// Export iCal feed per cottage
// GET /api/ical/:cottageId.ics
router.get("/:cottageId.ics", async (req: Request, res: Response) => {
  try {
    const propertyId = parseInt(req.params.propertyId);
    if (isNaN(propertyId)) {
      res.status(400).send("Invalid cottage ID");
      return;
    }

    const db = await getDb();
    if (!db) {
      res.status(500).send("Database unavailable");
      return;
    }

    // Get cottage info
    const propertyResult = await db.select().from(properties).where(eq(properties.id, propertyId)).limit(1);
    const cottage = propertyResult[0];
    if (!cottage) {
      res.status(404).send("Cottage not found");
      return;
    }

    // Get confirmed bookings
    const confirmedBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.propertyId, propertyId),
          ne(bookings.status, "cancelled"),
          ne(bookings.status, "refunded")
        )
      );

    // Generate iCal
    const cal = ical({
      name: `${cottage.nameEn} — Sève & Bois Escapes`,
      description: `Availability calendar for ${cottage.nameEn}`,
      timezone: "Europe/Brussels",
      prodId: {
        company: "Sève & Bois Escapes",
        product: "Booking Calendar",
        language: "EN",
      },
    });

    for (const booking of confirmedBookings) {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      checkIn.setHours(16, 0, 0, 0); // 4pm check-in
      checkOut.setHours(11, 0, 0, 0); // 11am check-out

      cal.createEvent({
        start: checkIn,
        end: checkOut,
        summary: "Réservé / Booked",
        description: `Booking #${booking.id} — ${booking.guestCount} guest(s)`,
        location: "Laforet, Wallonie, Belgique",
        allDay: false,
      });
    }

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${cottage.slug}.ics"`);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.send(cal.toString());
  } catch (err) {
    console.error("[iCal] Error generating feed:", err);
    res.status(500).send("Error generating iCal feed");
  }
});

export default router;

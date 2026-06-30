import {
  boolean,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  date,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Cottages
export const cottages = mysqlTable("cottages", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  nameFr: varchar("nameFr", { length: 128 }).notNull(),
  nameEn: varchar("nameEn", { length: 128 }).notNull(),
  descriptionFr: text("descriptionFr"),
  descriptionEn: text("descriptionEn"),
  capacity: int("capacity").notNull().default(4),
  bedrooms: int("bedrooms").notNull().default(2),
  bathrooms: int("bathrooms").notNull().default(1),
  basePriceWeeknight: decimal("basePriceWeeknight", { precision: 10, scale: 2 }).notNull().default("150.00"),
  basePriceWeekend: decimal("basePriceWeekend", { precision: 10, scale: 2 }).notNull().default("200.00"),
  basePriceWeek: decimal("basePriceWeek", { precision: 10, scale: 2 }).notNull().default("950.00"),
  cleaningFee: decimal("cleaningFee", { precision: 10, scale: 2 }).notNull().default("75.00"),
  minimumStayNights: int("minimumStayNights").notNull().default(2),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Cottage = typeof cottages.$inferSelect;
export type InsertCottage = typeof cottages.$inferInsert;

// Bookings
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  cottageId: int("cottageId").notNull(),
  guestName: varchar("guestName", { length: 256 }).notNull(),
  guestEmail: varchar("guestEmail", { length: 320 }).notNull(),
  guestPhone: varchar("guestPhone", { length: 64 }),
  guestCount: int("guestCount").notNull().default(2),
  checkIn: date("checkIn").notNull(),
  checkOut: date("checkOut").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  cleaningFee: decimal("cleaningFee", { precision: 10, scale: 2 }).notNull().default("75.00"),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "refunded"]).default("pending").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 256 }),
  stripeSessionId: varchar("stripeSessionId", { length: 256 }),
  specialRequests: text("specialRequests"),
  gdprConsent: boolean("gdprConsent").notNull().default(false),
  source: mysqlEnum("source", ["direct", "ical_import"]).default("direct").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// iCal feeds (external URLs to import and block dates)
export const icalFeeds = mysqlTable("ical_feeds", {
  id: int("id").autoincrement().primaryKey(),
  cottageId: int("cottageId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  url: text("url").notNull(),
  isActive: boolean("isActive").notNull().default(true),
  lastSyncedAt: timestamp("lastSyncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type IcalFeed = typeof icalFeeds.$inferSelect;
export type InsertIcalFeed = typeof icalFeeds.$inferInsert;

// Newsletter subscribers
export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 256 }),
  gdprConsent: boolean("gdprConsent").notNull().default(true),
  source: varchar("source", { length: 64 }).default("footer"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

// Enquiries / contact form
export const enquiries = mysqlTable("enquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  cottageId: int("cottageId"),
  checkIn: date("checkIn"),
  checkOut: date("checkOut"),
  guestCount: int("guestCount"),
  message: text("message"),
  gdprConsent: boolean("gdprConsent").notNull().default(false),
  status: mysqlEnum("status", ["new", "replied", "closed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type InsertEnquiry = typeof enquiries.$inferInsert;
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
  json,
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

// Properties (Sève & Bois Escapes as a single rental unit with 2 cottages)
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  nameFr: varchar("nameFr", { length: 128 }).notNull(),
  nameEn: varchar("nameEn", { length: 128 }).notNull(),
  nameNl: varchar("nameNl", { length: 128 }).notNull(),
  descriptionFr: text("descriptionFr"),
  descriptionEn: text("descriptionEn"),
  descriptionNl: text("descriptionNl"),
  maxGuests: int("maxGuests").notNull().default(12),
  bedrooms: int("bedrooms").notNull().default(4), // 2 per cottage
  bathrooms: int("bathrooms").notNull().default(2),
  basePriceWeeknight: decimal("basePriceWeeknight", { precision: 10, scale: 2 }).notNull().default("300.00"),
  basePriceWeekend: decimal("basePriceWeekend", { precision: 10, scale: 2 }).notNull().default("400.00"),
  basePriceWeek: decimal("basePriceWeek", { precision: 10, scale: 2 }).notNull().default("1900.00"),
  cleaningFee: decimal("cleaningFee", { precision: 10, scale: 2 }).notNull().default("150.00"),
  minimumStayNights: int("minimumStayNights").notNull().default(2),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

// Amenities (JSON array stored per property)
export const amenities = mysqlTable("amenities", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull(),
  categoryFr: varchar("categoryFr", { length: 128 }).notNull(), // e.g., "Équipements", "Enfants", "Bébé"
  categoryEn: varchar("categoryEn", { length: 128 }).notNull(),
  categoryNl: varchar("categoryNl", { length: 128 }).notNull(),
  items: json("items").notNull(), // Array of { nameFr, nameEn, nameNl, icon }
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Amenity = typeof amenities.$inferSelect;
export type InsertAmenity = typeof amenities.$inferInsert;

// Bookings (single unit: both cottages together)
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull(),
  guestName: varchar("guestName", { length: 256 }).notNull(),
  guestEmail: varchar("guestEmail", { length: 320 }).notNull(),
  guestPhone: varchar("guestPhone", { length: 64 }),
  guestCount: int("guestCount").notNull().default(6),
  checkIn: date("checkIn").notNull(),
  checkOut: date("checkOut").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  cleaningFee: decimal("cleaningFee", { precision: 10, scale: 2 }).notNull().default("150.00"),
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
  propertyId: int("propertyId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  url: text("url").notNull(),
  isActive: boolean("isActive").notNull().default(true),
  lastSyncedAt: timestamp("lastSyncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type IcalFeed = typeof icalFeeds.$inferSelect;
export type InsertIcalFeed = typeof icalFeeds.$inferInsert;

// Property photos/gallery
export const propertyPhotos = mysqlTable("property_photos", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull(),
  url: text("url").notNull(),
  caption: text("caption"),
  displayOrder: int("displayOrder").notNull().default(0),
  isHeroImage: boolean("isHeroImage").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PropertyPhoto = typeof propertyPhotos.$inferSelect;
export type InsertPropertyPhoto = typeof propertyPhotos.$inferInsert;

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
  propertyId: int("propertyId"),
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

// Blog posts
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  titleFr: varchar("titleFr", { length: 256 }).notNull(),
  titleEn: varchar("titleEn", { length: 256 }).notNull(),
  titleNl: varchar("titleNl", { length: 256 }).notNull(),
  descriptionFr: text("descriptionFr"),
  descriptionEn: text("descriptionEn"),
  descriptionNl: text("descriptionNl"),
  contentFr: text("contentFr").notNull(),
  contentEn: text("contentEn").notNull(),
  contentNl: text("contentNl").notNull(),
  categoryFr: varchar("categoryFr", { length: 64 }).default("Général"),
  categoryEn: varchar("categoryEn", { length: 64 }).default("General"),
  categoryNl: varchar("categoryNl", { length: 64 }).default("Algemeen"),
  authorName: varchar("authorName", { length: 256 }).default("Sève & Bois"),
  featuredImageUrl: text("featuredImageUrl"),
  isPublished: boolean("isPublished").notNull().default(false),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

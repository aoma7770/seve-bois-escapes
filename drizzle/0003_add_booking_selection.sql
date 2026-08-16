ALTER TABLE `bookings` RENAME COLUMN `cottageId` TO `propertyId`;
--> statement-breakpoint
ALTER TABLE `enquiries` RENAME COLUMN `cottageId` TO `propertyId`;
--> statement-breakpoint
ALTER TABLE `ical_feeds` RENAME COLUMN `cottageId` TO `propertyId`;
--> statement-breakpoint
ALTER TABLE `bookings` ADD `bookingSelection` varchar(16) NOT NULL DEFAULT 'both';

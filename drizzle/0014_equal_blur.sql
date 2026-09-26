ALTER TABLE `bookings` ADD `promotionCode` varchar(64);--> statement-breakpoint
ALTER TABLE `bookings` ADD `promotionDiscount` decimal(10,2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE `promotions` ADD `code` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `promotions` ADD `description` text;--> statement-breakpoint
ALTER TABLE `promotions` ADD `validFrom` date;--> statement-breakpoint
ALTER TABLE `promotions` ADD `validUntil` date;--> statement-breakpoint
ALTER TABLE `promotions` ADD `firstBookingOnly` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `promotions` ADD `maxUses` int;--> statement-breakpoint
ALTER TABLE `promotions` ADD `maxUsesPerGuest` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `promotions` ADD `eligibleEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `promotions` ADD `minimumGuests` int;--> statement-breakpoint
ALTER TABLE `promotions` ADD `maximumGuests` int;
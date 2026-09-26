ALTER TABLE `bookings` MODIFY COLUMN `guestPhone` varchar(64) NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `bookings` ADD `guestFirstName` varchar(128) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD `guestSurname` varchar(128) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD `paymentStatus` enum('unpaid','requires_payment','paid','refunded') DEFAULT 'unpaid' NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD `paymentLinkUrl` text;
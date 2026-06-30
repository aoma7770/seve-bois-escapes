CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cottageId` int NOT NULL,
	`guestName` varchar(256) NOT NULL,
	`guestEmail` varchar(320) NOT NULL,
	`guestPhone` varchar(64),
	`guestCount` int NOT NULL DEFAULT 2,
	`checkIn` date NOT NULL,
	`checkOut` date NOT NULL,
	`totalAmount` decimal(10,2) NOT NULL,
	`cleaningFee` decimal(10,2) NOT NULL DEFAULT '75.00',
	`status` enum('pending','confirmed','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`stripePaymentIntentId` varchar(256),
	`stripeSessionId` varchar(256),
	`specialRequests` text,
	`gdprConsent` boolean NOT NULL DEFAULT false,
	`source` enum('direct','ical_import') NOT NULL DEFAULT 'direct',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cottages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`nameFr` varchar(128) NOT NULL,
	`nameEn` varchar(128) NOT NULL,
	`descriptionFr` text,
	`descriptionEn` text,
	`capacity` int NOT NULL DEFAULT 4,
	`bedrooms` int NOT NULL DEFAULT 2,
	`bathrooms` int NOT NULL DEFAULT 1,
	`basePriceWeeknight` decimal(10,2) NOT NULL DEFAULT '150.00',
	`basePriceWeekend` decimal(10,2) NOT NULL DEFAULT '200.00',
	`basePriceWeek` decimal(10,2) NOT NULL DEFAULT '950.00',
	`cleaningFee` decimal(10,2) NOT NULL DEFAULT '75.00',
	`minimumStayNights` int NOT NULL DEFAULT 2,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cottages_id` PRIMARY KEY(`id`),
	CONSTRAINT `cottages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`cottageId` int,
	`checkIn` date,
	`checkOut` date,
	`guestCount` int,
	`message` text,
	`gdprConsent` boolean NOT NULL DEFAULT false,
	`status` enum('new','replied','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `enquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ical_feeds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cottageId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`url` text NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ical_feeds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(256),
	`gdprConsent` boolean NOT NULL DEFAULT true,
	`source` varchar(64) DEFAULT 'footer',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscribers_email_unique` UNIQUE(`email`)
);

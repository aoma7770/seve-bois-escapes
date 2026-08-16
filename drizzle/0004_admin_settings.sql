CREATE TABLE `promotions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`discountType` enum('percentage','fixed') NOT NULL DEFAULT 'percentage',
	`value` decimal(10,2) NOT NULL,
	`minimumNights` int NOT NULL DEFAULT 1,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `promotions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `properties` ADD `extraGuestRate` decimal(10,2) DEFAULT '40.00' NOT NULL;--> statement-breakpoint
ALTER TABLE `properties` ADD `zapierWebhookUrl` text;
CREATE TABLE `extra_fees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`feeType` enum('fixed','percentage') NOT NULL DEFAULT 'fixed',
	`amount` decimal(10,2) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `extra_fees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ical_blocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`feedId` int NOT NULL,
	`propertyId` int NOT NULL,
	`externalUid` varchar(256) NOT NULL,
	`checkIn` date NOT NULL,
	`checkOut` date NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ical_blocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seasonal_rates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`nightlyRate` decimal(10,2) NOT NULL,
	`weekendRate` decimal(10,2) NOT NULL,
	`extraGuestRate` decimal(10,2) NOT NULL DEFAULT '40.00',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seasonal_rates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `properties` ADD `propertyAreaM2` decimal(8,2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE `properties` ADD `annualCouncilTax` decimal(10,2) DEFAULT '0.00' NOT NULL;
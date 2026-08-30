CREATE TABLE `guest_communications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guestEmail` varchar(320) NOT NULL,
	`bookingId` int,
	`channel` enum('email','phone','note') NOT NULL DEFAULT 'note',
	`summary` text NOT NULL,
	`createdBy` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guest_communications_id` PRIMARY KEY(`id`)
);

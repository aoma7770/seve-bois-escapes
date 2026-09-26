CREATE TABLE `visitor_presence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionKey` varchar(128) NOT NULL,
	`path` varchar(255) NOT NULL DEFAULT '/',
	`bookingStage` varchar(64) NOT NULL DEFAULT 'browsing',
	`countryCode` varchar(8),
	`language` varchar(16),
	`lastSeenAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visitor_presence_id` PRIMARY KEY(`id`),
	CONSTRAINT `visitor_presence_sessionKey_unique` UNIQUE(`sessionKey`)
);

ALTER TABLE `bookings` ADD `confirmedWebhookStatus` enum('not_sent','sent','failed') DEFAULT 'not_sent' NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD `confirmedWebhookSentAt` timestamp;--> statement-breakpoint
ALTER TABLE `bookings` ADD `confirmedWebhookEventId` varchar(256);--> statement-breakpoint
ALTER TABLE `bookings` ADD `confirmedWebhookError` text;
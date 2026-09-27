ALTER TABLE `bookings` MODIFY COLUMN `status` enum('pending','confirmed','abandoned','cancelled','refunded') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `bookings` ADD `abandonedAt` timestamp;--> statement-breakpoint
ALTER TABLE `bookings` ADD `abandonedWebhookStatus` enum('not_sent','sent','failed') DEFAULT 'not_sent' NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD `abandonedWebhookSentAt` timestamp;--> statement-breakpoint
ALTER TABLE `bookings` ADD `abandonedWebhookError` text;--> statement-breakpoint
ALTER TABLE `bookings` ADD `stripeRecoveryUrl` text;
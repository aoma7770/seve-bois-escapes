ALTER TABLE `newsletter_subscribers` ADD `firstName` varchar(128);--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `lastName` varchar(128);--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `marketingConsent` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `guideRequested` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `crmSyncedAt` timestamp;
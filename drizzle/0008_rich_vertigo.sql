CREATE TABLE `home_page_cover` (
	`id` int AUTO_INCREMENT NOT NULL,
	`image_path` varchar(255) NOT NULL,
	`status` boolean NOT NULL DEFAULT false,
	CONSTRAINT `home_page_cover_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `home_page_faq` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` varchar(255) NOT NULL,
	`answer` text NOT NULL,
	CONSTRAINT `home_page_faq_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bookings` MODIFY COLUMN `createdAt` date DEFAULT '2025-07-23';--> statement-breakpoint
ALTER TABLE `email_verifications` MODIFY COLUMN `created_at` date DEFAULT '2025-07-23';--> statement-breakpoint
ALTER TABLE `manual_payment_method` MODIFY COLUMN `uploadedAt` date DEFAULT '2025-07-23';--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `createdAt` date DEFAULT '2025-07-23';--> statement-breakpoint
ALTER TABLE `user_tour` MODIFY COLUMN `date` date DEFAULT '2025-07-23';
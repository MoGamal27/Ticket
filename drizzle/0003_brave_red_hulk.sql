CREATE TABLE `email_verifications` (
	`user_id` int NOT NULL,
	`code` varchar(6) NOT NULL,
	`created_at` date DEFAULT '2025-07-22',
	CONSTRAINT `email_verifications_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `extras` (
	`id` int NOT NULL,
	`tour_id` int,
	`extra_id` int,
	`price_id` int,
	CONSTRAINT `extras_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `admins` ADD `image_path` varchar(255);--> statement-breakpoint
ALTER TABLE `admins` ADD `is_super_admin` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `admins` ADD CONSTRAINT `admins_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `extras` ADD CONSTRAINT `extras_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `extras` ADD CONSTRAINT `extras_extra_id_extras_id_fk` FOREIGN KEY (`extra_id`) REFERENCES `extras`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `extras` ADD CONSTRAINT `extras_price_id_tour_price_id_fk` FOREIGN KEY (`price_id`) REFERENCES `tour_price`(`id`) ON DELETE no action ON UPDATE no action;
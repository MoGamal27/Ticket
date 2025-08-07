CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`country_id` int,
	CONSTRAINT `cities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`image_path` varchar(255),
	CONSTRAINT `countries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `manual_payment_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`describtion` varchar(255),
	`logo_path` varchar(255),
	`status` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `manual_payment_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `user_tour`;--> statement-breakpoint
ALTER TABLE `tours` DROP FOREIGN KEY `tours_price_id_tour_price_id_fk`;
--> statement-breakpoint
ALTER TABLE `email_verifications` MODIFY COLUMN `created_at` date DEFAULT '2025-08-06';--> statement-breakpoint
ALTER TABLE `manual_payment_method` MODIFY COLUMN `uploadedAt` date DEFAULT '2025-08-06';--> statement-breakpoint
ALTER TABLE `tour_schedules` MODIFY COLUMN `start_date` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `tour_schedules` MODIFY COLUMN `end_date` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `tours` MODIFY COLUMN `startDate` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `tours` MODIFY COLUMN `endDate` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `tours` MODIFY COLUMN `country` int;--> statement-breakpoint
ALTER TABLE `tours` MODIFY COLUMN `city` int;--> statement-breakpoint
ALTER TABLE `bookings` ADD `created_at` timestamp DEFAULT '2025-08-06 13:21:18.348';--> statement-breakpoint
ALTER TABLE `home_page_faq` ADD `status` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `manual_payment_method` ADD `manual_payment_type_id` int;--> statement-breakpoint
ALTER TABLE `payments` ADD `created_at` date DEFAULT '2025-08-06';--> statement-breakpoint
ALTER TABLE `privileges` ADD `action` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `tour_itinerary` ADD `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `tour_price` ADD `tour_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `is_verified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `cities` ADD CONSTRAINT `cities_country_id_countries_id_fk` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `manual_payment_method` ADD CONSTRAINT `manual_payment_method_manual_payment_type_id_manual_payment_types_id_fk` FOREIGN KEY (`manual_payment_type_id`) REFERENCES `manual_payment_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_price` ADD CONSTRAINT `tour_price_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tours` ADD CONSTRAINT `tours_country_countries_id_fk` FOREIGN KEY (`country`) REFERENCES `countries`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tours` ADD CONSTRAINT `tours_city_cities_id_fk` FOREIGN KEY (`city`) REFERENCES `cities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `payments` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `tour_itinerary` DROP COLUMN `content`;--> statement-breakpoint
ALTER TABLE `tours` DROP COLUMN `price_id`;
CREATE TABLE `admin_privileges` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`admin_id` int,
	`privilege_id` int,
	CONSTRAINT `admin_privileges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `admins` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`phone_number` varchar(255) NOT NULL,
	CONSTRAINT `admins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`imagePath` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` boolean DEFAULT false,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `currencies` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`code` varchar(3) NOT NULL,
	`name` varchar(50),
	`symbol` varchar(5),
	CONSTRAINT `currencies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `privileges` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `privileges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promo_code` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`code` varchar(20) NOT NULL,
	`discount_type` enum('percentage','amount') NOT NULL,
	`discount_value` int NOT NULL,
	`usade_limit` int NOT NULL,
	`status` boolean DEFAULT false,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	CONSTRAINT `promo_code_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promo_code_users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`promo_code_id` int,
	`user_id` int,
	CONSTRAINT `promo_code_users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tour_days_of_week` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`tour_id` int NOT NULL,
	`day_of_week` enum('sunday','monday','tuesday','wednesday','thursday','friday','saturday') NOT NULL,
	CONSTRAINT `tour_days_of_week_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tour_discounts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`tour_id` int NOT NULL,
	`target_group` enum('adult','child','infant') NOT NULL,
	`type` enum('percent','fixed') NOT NULL,
	`value` decimal(5,2) NOT NULL,
	`start_date` date,
	`end_date` date,
	`min_people` int DEFAULT 0,
	`max_people` int,
	CONSTRAINT `tour_discounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tour_excludes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`tour_id` int,
	`content` varchar(255) NOT NULL,
	CONSTRAINT `tour_excludes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tour_faq` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`tour_id` int,
	`question` varchar(255),
	`answer` varchar(255),
	CONSTRAINT `tour_faq_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tour_highlight` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`tour_id` int,
	`content` varchar(255) NOT NULL,
	CONSTRAINT `tour_highlight_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tour_includes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`tour_id` int,
	`content` varchar(255) NOT NULL,
	CONSTRAINT `tour_includes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tour_itinerary` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`tour_id` int,
	`content` varchar(255) NOT NULL,
	`image_path` varchar(255),
	`describtion` text,
	CONSTRAINT `tour_itinerary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tour_price` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`adult` decimal NOT NULL,
	`child` decimal NOT NULL,
	`infant` decimal NOT NULL,
	`currency_id` int NOT NULL,
	CONSTRAINT `tour_price_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tour_schedules` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`tour_id` int NOT NULL,
	`date` date NOT NULL,
	`available_seats` int NOT NULL,
	CONSTRAINT `tour_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tours` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`category_id` int,
	`title` varchar(255) NOT NULL,
	`mainImage` varchar(255) NOT NULL,
	`status` boolean DEFAULT false,
	`featured` boolean DEFAULT false,
	`describtion` text,
	`meetingPoint` boolean DEFAULT false,
	`meetingPointLocation` text,
	`meetingPointAddress` text,
	`points` int DEFAULT 0,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`duration_days` int NOT NULL,
	`duration_hours` int NOT NULL,
	`country` varchar(100) NOT NULL,
	`city` varchar(100) NOT NULL,
	`max_users` int NOT NULL,
	`price_id` int,
	CONSTRAINT `tours_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`phoneNumber` varchar(255) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `admin_privileges` ADD CONSTRAINT `admin_privileges_admin_id_admins_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admin_privileges` ADD CONSTRAINT `admin_privileges_privilege_id_privileges_id_fk` FOREIGN KEY (`privilege_id`) REFERENCES `privileges`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `promo_code_users` ADD CONSTRAINT `promo_code_users_promo_code_id_promo_code_id_fk` FOREIGN KEY (`promo_code_id`) REFERENCES `promo_code`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `promo_code_users` ADD CONSTRAINT `promo_code_users_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_days_of_week` ADD CONSTRAINT `tour_days_of_week_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_discounts` ADD CONSTRAINT `tour_discounts_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_excludes` ADD CONSTRAINT `tour_excludes_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_faq` ADD CONSTRAINT `tour_faq_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_highlight` ADD CONSTRAINT `tour_highlight_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_includes` ADD CONSTRAINT `tour_includes_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_itinerary` ADD CONSTRAINT `tour_itinerary_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_price` ADD CONSTRAINT `tour_price_currency_id_currencies_id_fk` FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_schedules` ADD CONSTRAINT `tour_schedules_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tours` ADD CONSTRAINT `tours_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tours` ADD CONSTRAINT `tours_price_id_tour_price_id_fk` FOREIGN KEY (`price_id`) REFERENCES `tour_price`(`id`) ON DELETE no action ON UPDATE no action;
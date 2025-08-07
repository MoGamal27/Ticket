CREATE TABLE `bookings` (
	`id` int NOT NULL,
	`user_id` int,
	`tour_id` int,
	`status` enum('pending','confirmed','cancelled'),
	`createdAt` date DEFAULT '2025-07-22',
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `manual_payment_method` (
	`id` int NOT NULL,
	`payment_id` int,
	`proof_image` varchar(255),
	`proof_text` varchar(255),
	`uploadedAt` date DEFAULT '2025-07-22',
	CONSTRAINT `manual_payment_method_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int NOT NULL,
	`booking_id` int,
	`method` enum('manual','auto'),
	`status` enum('pending','confirmed','cancelled'),
	`amount` decimal,
	`transaction_id` varchar(255),
	`createdAt` date DEFAULT '2025-07-22',
	`rejection_reason` varchar(255),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tour_extras` (
	`id` int NOT NULL,
	`tour_id` int,
	`extra_id` int,
	`price_id` int,
	CONSTRAINT `tour_extras_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_tour` (
	`id` int NOT NULL,
	`user_id` int,
	`tour_id` int,
	`date` date DEFAULT '2025-07-22',
	`status` enum('pending','cancelled','booked'),
	CONSTRAINT `user_tour_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `extras` DROP FOREIGN KEY `extras_tour_id_tours_id_fk`;
--> statement-breakpoint
ALTER TABLE `extras` DROP FOREIGN KEY `extras_extra_id_extras_id_fk`;
--> statement-breakpoint
ALTER TABLE `extras` DROP FOREIGN KEY `extras_price_id_tour_price_id_fk`;
--> statement-breakpoint
ALTER TABLE `extras` ADD `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_tour_id_tour_schedules_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tour_schedules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `manual_payment_method` ADD CONSTRAINT `manual_payment_method_payment_id_payments_id_fk` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_extras` ADD CONSTRAINT `tour_extras_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_extras` ADD CONSTRAINT `tour_extras_extra_id_extras_id_fk` FOREIGN KEY (`extra_id`) REFERENCES `extras`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_extras` ADD CONSTRAINT `tour_extras_price_id_tour_price_id_fk` FOREIGN KEY (`price_id`) REFERENCES `tour_price`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_tour` ADD CONSTRAINT `user_tour_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_tour` ADD CONSTRAINT `user_tour_tour_id_tour_schedules_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tour_schedules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `extras` DROP COLUMN `tour_id`;--> statement-breakpoint
ALTER TABLE `extras` DROP COLUMN `extra_id`;--> statement-breakpoint
ALTER TABLE `extras` DROP COLUMN `price_id`;
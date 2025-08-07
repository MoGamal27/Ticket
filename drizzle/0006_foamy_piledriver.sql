CREATE TABLE `tour_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tour_id` int,
	`image_path` varchar(255),
	CONSTRAINT `tour_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `tour_images` ADD CONSTRAINT `tour_images_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE no action ON UPDATE no action;
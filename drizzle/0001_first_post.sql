ALTER TABLE `admin_privileges` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `admins` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `categories` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `currencies` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `privileges` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `promo_code` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `promo_code_users` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tour_days_of_week` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tour_discounts` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tour_excludes` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tour_faq` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tour_highlight` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tour_includes` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tour_itinerary` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tour_price` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tour_schedules` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tours` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;
CREATE TABLE `article_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`article_id` text NOT NULL,
	`category_id` text NOT NULL,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unq_article_category` ON `article_categories` (`article_id`,`category_id`);--> statement-breakpoint
CREATE TABLE `article_services` (
	`id` text PRIMARY KEY NOT NULL,
	`article_id` text NOT NULL,
	`service_id` text NOT NULL,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unq_article_service` ON `article_services` (`article_id`,`service_id`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `navigation_items` (
	`id` text PRIMARY KEY NOT NULL,
	`menu_location` text NOT NULL,
	`label` text NOT NULL,
	`href` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`parent_id` text,
	`is_enabled` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`bio` text,
	`avatar_key` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`client_name` text NOT NULL,
	`client_role` text,
	`client_company` text,
	`quote` text NOT NULL,
	`avatar_key` text,
	`is_verified` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_invoice_items` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`description` text NOT NULL,
	`quantity` real DEFAULT 1 NOT NULL,
	`unit_price` integer DEFAULT 0 NOT NULL,
	`line_total` integer DEFAULT 0 NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_invoice_items`("id", "invoice_id", "description", "quantity", "unit_price", "line_total", "display_order", "created_at", "updated_at") SELECT "id", "invoice_id", "description", "quantity", "unit_price", "line_total", "display_order", "created_at", "updated_at" FROM `invoice_items`;--> statement-breakpoint
DROP TABLE `invoice_items`;--> statement-breakpoint
ALTER TABLE `__new_invoice_items` RENAME TO `invoice_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_quotation_items` (
	`id` text PRIMARY KEY NOT NULL,
	`quotation_id` text NOT NULL,
	`description` text NOT NULL,
	`quantity` real DEFAULT 1 NOT NULL,
	`unit_price` integer DEFAULT 0 NOT NULL,
	`line_total` integer DEFAULT 0 NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`quotation_id`) REFERENCES `quotations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_quotation_items`("id", "quotation_id", "description", "quantity", "unit_price", "line_total", "display_order", "created_at", "updated_at") SELECT "id", "quotation_id", "description", "quantity", "unit_price", "line_total", "display_order", "created_at", "updated_at" FROM `quotation_items`;--> statement-breakpoint
DROP TABLE `quotation_items`;--> statement-breakpoint
ALTER TABLE `__new_quotation_items` RENAME TO `quotation_items`;--> statement-breakpoint
ALTER TABLE `articles` DROP COLUMN `category`;
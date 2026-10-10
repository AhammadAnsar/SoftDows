PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_client_contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text,
	`email` text,
	`phone` text,
	`is_primary` integer DEFAULT false NOT NULL,
	`user_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_client_contacts`("id", "client_id", "first_name", "last_name", "email", "phone", "is_primary", "user_id", "created_at", "updated_at") SELECT "id", "client_id", "first_name", "last_name", "email", "phone", "is_primary", "user_id", "created_at", "updated_at" FROM `client_contacts`;--> statement-breakpoint
DROP TABLE `client_contacts`;--> statement-breakpoint
ALTER TABLE `__new_client_contacts` RENAME TO `client_contacts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
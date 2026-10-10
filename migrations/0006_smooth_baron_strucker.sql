ALTER TABLE `invoices` ADD `quotation_id` text REFERENCES quotations(id);--> statement-breakpoint
ALTER TABLE `quotations` ADD `lead_id` text REFERENCES leads(id);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_payments` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`client_id` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`payment_date` integer NOT NULL,
	`payment_method` text NOT NULL,
	`reference` text,
	`notes` text,
	`status` text DEFAULT 'completed' NOT NULL,
	`recorded_by_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`recorded_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_payments`("id", "invoice_id", "client_id", "amount", "currency", "payment_date", "payment_method", "reference", "notes", "status", "recorded_by_id", "created_at", "updated_at") 
SELECT 
    p."id", p."invoice_id", i."client_id", p."amount", p."currency", p."payment_date", p."payment_method", p."reference", p."notes", p."status", NULL, p."created_at", p."updated_at" 
FROM `payments` p 
JOIN `invoices` i ON p."invoice_id" = i."id";--> statement-breakpoint
DROP TABLE `payments`;--> statement-breakpoint
ALTER TABLE `__new_payments` RENAME TO `payments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
ALTER TABLE `support_messages` ADD `visibility` text DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE `support_messages` ADD `attachment_id` text;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_support_tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_number` text NOT NULL,
	`client_id` text NOT NULL,
	`project_id` text,
	`service_id` text,
	`category` text DEFAULT 'general' NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`subject` text NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`assigned_to_id` text,
	`created_by_id` text,
	`resolved_at` integer,
	`closed_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`assigned_to_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_support_tickets`("id", "ticket_number", "client_id", "project_id", "service_id", "category", "priority", "subject", "description", "status", "assigned_to_id", "created_by_id", "resolved_at", "closed_at", "created_at", "updated_at") 
SELECT 
    t."id", 
    'TK-' || strftime('%Y', datetime(t.created_at, 'unixepoch')) || '-' || substr(hex(t.id), 1, 6), 
    t."client_id", 
    t."project_id", 
    t."service_id", 
    'general', 
    t."priority", 
    t."subject", 
    (SELECT m.message FROM support_messages m WHERE m.ticket_id = t.id ORDER BY m.created_at ASC LIMIT 1), 
    t."status", 
    NULL, 
    NULL, 
    NULL, 
    t."closed_at", 
    t."created_at", 
    t."updated_at"
FROM `support_tickets` t;--> statement-breakpoint
DROP TABLE `support_tickets`;--> statement-breakpoint
ALTER TABLE `__new_support_tickets` RENAME TO `support_tickets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `support_tickets_ticket_number_unique` ON `support_tickets` (`ticket_number`);
CREATE TABLE `project_members` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unq_project_member` ON `project_members` (`project_id`,`user_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`project_code` text,
	`client_id` text NOT NULL,
	`lead_id` text,
	`name` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'planning' NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`start_date` integer,
	`target_completion_date` integer,
	`completion_date` integer,
	`progress_percentage` integer DEFAULT 0 NOT NULL,
	`project_manager_id` text,
	`budget` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`internal_notes` text,
	`client_visible_summary` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`archived_at` integer,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`project_manager_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "project_code", "client_id", "lead_id", "name", "description", "status", "priority", "start_date", "target_completion_date", "completion_date", "progress_percentage", "project_manager_id", "budget", "currency", "internal_notes", "client_visible_summary", "created_at", "updated_at", "archived_at") SELECT "id", "project_code", "client_id", "lead_id", "name", "description", "status", "priority", "start_date", "target_completion_date", "completion_date", "progress_percentage", "project_manager_id", "budget", "currency", "internal_notes", "client_visible_summary", "created_at", "updated_at", "archived_at" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `projects_project_code_unique` ON `projects` (`project_code`);--> statement-breakpoint
ALTER TABLE `project_milestones` ADD `progress_percentage` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `project_milestones` ADD `internal_note` text;--> statement-breakpoint
ALTER TABLE `project_milestones` ADD `client_visible_note` text;
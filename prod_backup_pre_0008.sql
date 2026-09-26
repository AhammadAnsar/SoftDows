PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS "d1_migrations"(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(1,'0000_last_mauler.sql','2026-09-26 10:51:32');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(2,'0001_outgoing_ultimates.sql','2026-09-26 10:51:32');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(3,'0002_futuristic_quasimodo.sql','2026-09-26 10:51:33');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(4,'0003_blushing_iron_man.sql','2026-09-26 10:51:33');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(5,'0004_closed_madelyne_pryor.sql','2026-09-26 10:51:33');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(6,'0005_complex_wrecking_crew.sql','2026-09-26 16:27:18');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(7,'0006_smooth_baron_strucker.sql','2026-09-26 16:27:18');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(8,'0007_smiling_hitman.sql','2026-09-26 16:27:18');
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`archived_at` integer
);
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`company` text,
	`email` text NOT NULL,
	`phone` text,
	`requested_service` text,
	`project_type` text,
	`description` text,
	`timeline` text,
	`budget_range` text,
	`currency` text,
	`source_url` text,
	`status` text DEFAULT 'new' NOT NULL,
	`internal_notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
, `converted_client_id` text REFERENCES clients(id));
INSERT INTO "leads" ("id","name","company","email","phone","requested_service","project_type","description","timeline","budget_range","currency","source_url","status","internal_notes","created_at","updated_at","converted_client_id") VALUES('2f1c8b77-e47d-4243-803d-70d3fe1ccaeb','SHAIFUL ISLAM','SoftDows','ahammadansar75@gmail.com',NULL,'SEO & Digital Visibility',NULL,'Hhj',NULL,'1,00,000 - 5,00,000 BDT',NULL,NULL,'new',NULL,1790423964,1790423964,NULL);
INSERT INTO "leads" ("id","name","company","email","phone","requested_service","project_type","description","timeline","budget_range","currency","source_url","status","internal_notes","created_at","updated_at","converted_client_id") VALUES('5428f303-4ad2-472a-9a6a-3ad4cd1651aa','SHAIFUL ISLAM','SoftDows','ahammadansar75@gmail.com',NULL,'eCommerce Development',NULL,'s',NULL,'$5,000 - $10,000 USD',NULL,NULL,'proposal_sent','',1790436632,1790441370,NULL);
CREATE TABLE `project_milestones` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`target_date` integer,
	`completion_date` integer,
	`is_visible_to_client` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL, `progress_percentage` integer DEFAULT 0 NOT NULL, `internal_note` text, `client_visible_note` text,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `project_services` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`service_id` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE restrict
);
CREATE TABLE `project_updates` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`is_visible_to_client` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL, `author_id` text REFERENCES user(id),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `services` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`short_description` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`is_visible` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_number` text NOT NULL,
	`client_id` text NOT NULL,
	`project_id` text,
	`currency` text DEFAULT 'USD' NOT NULL,
	`issue_date` integer NOT NULL,
	`due_date` integer NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`subtotal` integer DEFAULT 0 NOT NULL,
	`discount` integer DEFAULT 0 NOT NULL,
	`tax` integer DEFAULT 0 NOT NULL,
	`total` integer DEFAULT 0 NOT NULL,
	`amount_paid` integer DEFAULT 0 NOT NULL,
	`balance_due` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL, `quotation_id` text REFERENCES quotations(id),
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE `quotations` (
	`id` text PRIMARY KEY NOT NULL,
	`quotation_number` text NOT NULL,
	`client_id` text NOT NULL,
	`project_id` text,
	`currency` text DEFAULT 'USD' NOT NULL,
	`issue_date` integer NOT NULL,
	`expiry_date` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`subtotal` integer DEFAULT 0 NOT NULL,
	`discount` integer DEFAULT 0 NOT NULL,
	`tax` integer DEFAULT 0 NOT NULL,
	`total` integer DEFAULT 0 NOT NULL,
	`terms` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL, `lead_id` text REFERENCES leads(id),
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`storage_key` text NOT NULL,
	`original_file_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`visibility` text DEFAULT 'private' NOT NULL,
	`client_id` text,
	`project_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL, `uploaded_by_id` text REFERENCES user(id),
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE `support_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL, `sender_id` text REFERENCES user(id), `visibility` text DEFAULT 'public' NOT NULL, `attachment_id` text,
	FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`author_name` text DEFAULT 'Ansar Ahammad' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`publish_date` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
CREATE TABLE `case_studies` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`client_name` text,
	`industry` text,
	`project_summary` text NOT NULL,
	`challenge` text,
	`solution` text,
	`results` text,
	`deliverables` text,
	`project_url` text,
	`completion_date` integer,
	`thumbnail_key` text,
	`is_featured` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
CREATE TABLE `case_study_services` (
	`id` text PRIMARY KEY NOT NULL,
	`case_study_id` text NOT NULL,
	`service_id` text NOT NULL,
	FOREIGN KEY (`case_study_id`) REFERENCES `case_studies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `page_sections` (
	`id` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`section_identifier` text NOT NULL,
	`heading` text,
	`subheading` text,
	`content` text,
	`cta_text` text,
	`cta_link` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`structured_data` text,
	`is_enabled` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `site_pages`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `site_pages` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
CREATE TABLE `site_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`details` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
, `actor_id` text REFERENCES user(id));
INSERT INTO "audit_logs" ("id","action","entity_type","entity_id","details","created_at","updated_at","actor_id") VALUES('e6ea31cb-cbd2-497a-aee8-3169a5978a33','lead_status_changed','lead','5428f303-4ad2-472a-9a6a-3ad4cd1651aa','{"previous_status":"new","new_status":"proposal_sent"}',1790441370,1790441370,'ZGjoPLRlYhS71WbyL3TTcxcwgBNJjWBJ');
CREATE TABLE `article_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`article_id` text NOT NULL,
	`category_id` text NOT NULL,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `article_services` (
	`id` text PRIMARY KEY NOT NULL,
	`article_id` text NOT NULL,
	`service_id` text NOT NULL,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
CREATE TABLE `faqs` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
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
, `user_id` text REFERENCES user(id));
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
CREATE TABLE IF NOT EXISTS "invoice_items" (
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
CREATE TABLE IF NOT EXISTS "quotation_items" (
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
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "account" ("id","account_id","provider_id","user_id","access_token","refresh_token","id_token","access_token_expires_at","refresh_token_expires_at","scope","password","created_at","updated_at") VALUES('9RchlfaMHyZZUGBODAqqyoWJrSQ9waxT','ZGjoPLRlYhS71WbyL3TTcxcwgBNJjWBJ','credential','ZGjoPLRlYhS71WbyL3TTcxcwgBNJjWBJ',NULL,NULL,NULL,NULL,NULL,NULL,'fd7433e1351d204c8cb4eaf760e146c8:89156584c4a0c5a7425ada2454f7ce82a4a6d4eaa441e509d6bdb114ccc00b8bdc9b7357bb1879222f84d044dae100f3d055a68cefa95223be9fd8a2f8e072ed',1790430489,1790430489);
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	`impersonated_by` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session" ("id","expires_at","token","created_at","updated_at","ip_address","user_agent","user_id","impersonated_by") VALUES('Mw0HWDoRmaZudxbebjL7fYqr0v9DdMU2',1791037014,'BBAUpayXmUPNIG0j61VEM1mZ7A6vdydt',1790432214,1790432214,'','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','ZGjoPLRlYhS71WbyL3TTcxcwgBNJjWBJ',NULL);
INSERT INTO "session" ("id","expires_at","token","created_at","updated_at","ip_address","user_agent","user_id","impersonated_by") VALUES('CqPgC82fxa6Hv8d0tC9FCym7uFHxOdLB',1791037041,'01xULq1DC3R3Ukbkjl4vW4jAlNjmKWZA',1790432241,1790432241,'','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','ZGjoPLRlYhS71WbyL3TTcxcwgBNJjWBJ',NULL);
INSERT INTO "session" ("id","expires_at","token","created_at","updated_at","ip_address","user_agent","user_id","impersonated_by") VALUES('QBr3QPQQ0R6FMpgKzYTTZc9X4XWyqsV6',1791041441,'zrbiG3psnduw3cZFLnT9GEaoH1KYPKVD',1790436641,1790436641,'','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','ZGjoPLRlYhS71WbyL3TTcxcwgBNJjWBJ',NULL);
INSERT INTO "session" ("id","expires_at","token","created_at","updated_at","ip_address","user_agent","user_id","impersonated_by") VALUES('1JccJlIHTcKEpG53BK9ShULqPx01c582',1791045705,'qUKIyUXgAIcHW28XpaR5P0sdBYeG2hrK',1790440905,1790440905,'','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','ZGjoPLRlYhS71WbyL3TTcxcwgBNJjWBJ',NULL);
INSERT INTO "session" ("id","expires_at","token","created_at","updated_at","ip_address","user_agent","user_id","impersonated_by") VALUES('XuOtJKId9CDuSTj36E1v1676Twm1t5Jr',1791045786,'2QfvTwELeXyOD8WR3PfedDrp4ktQhnC9',1790440986,1790440986,'','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','ZGjoPLRlYhS71WbyL3TTcxcwgBNJjWBJ',NULL);
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`role` text,
	`banned` integer,
	`ban_reason` text,
	`ban_expires` integer
);
INSERT INTO "user" ("id","name","email","email_verified","image","created_at","updated_at","role","banned","ban_reason","ban_expires") VALUES('ZGjoPLRlYhS71WbyL3TTcxcwgBNJjWBJ','Ansar Ahammad','ahammadansar75@gmail.com',0,NULL,1790430489,1790430489,'super_admin',0,NULL,NULL);
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
CREATE TABLE IF NOT EXISTS "client_contacts" (
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
CREATE TABLE IF NOT EXISTS "projects" (
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
CREATE TABLE IF NOT EXISTS "payments" (
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
CREATE TABLE IF NOT EXISTS "support_tickets" (
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
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('d1_migrations',8);
CREATE UNIQUE INDEX `unq_project_service` ON `project_services` (`project_id`,`service_id`);
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);
CREATE UNIQUE INDEX `invoices_invoice_number_unique` ON `invoices` (`invoice_number`);
CREATE UNIQUE INDEX `quotations_quotation_number_unique` ON `quotations` (`quotation_number`);
CREATE UNIQUE INDEX `files_storage_key_unique` ON `files` (`storage_key`);
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);
CREATE UNIQUE INDEX `case_studies_slug_unique` ON `case_studies` (`slug`);
CREATE UNIQUE INDEX `unq_case_study_service` ON `case_study_services` (`case_study_id`,`service_id`);
CREATE UNIQUE INDEX `site_pages_slug_unique` ON `site_pages` (`slug`);
CREATE UNIQUE INDEX `site_settings_key_unique` ON `site_settings` (`key`);
CREATE UNIQUE INDEX `unq_article_category` ON `article_categories` (`article_id`,`category_id`);
CREATE UNIQUE INDEX `unq_article_service` ON `article_services` (`article_id`,`service_id`);
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);
CREATE UNIQUE INDEX `unq_project_member` ON `project_members` (`project_id`,`user_id`);
CREATE UNIQUE INDEX `projects_project_code_unique` ON `projects` (`project_code`);
CREATE UNIQUE INDEX `support_tickets_ticket_number_unique` ON `support_tickets` (`ticket_number`);

DROP TABLE `article_categories`;--> statement-breakpoint
DROP TABLE `article_services`;--> statement-breakpoint
DROP TABLE `articles`;--> statement-breakpoint
DROP TABLE `case_studies`;--> statement-breakpoint
DROP TABLE `case_study_services`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
DROP TABLE `faqs`;--> statement-breakpoint
DROP TABLE `navigation_items`;--> statement-breakpoint
DROP TABLE `page_sections`;--> statement-breakpoint
DROP TABLE `site_pages`;--> statement-breakpoint
DROP TABLE `site_settings`;--> statement-breakpoint
DROP TABLE `team_members`;--> statement-breakpoint
DROP TABLE `testimonials`;--> statement-breakpoint
ALTER TABLE `services` ADD `short_name` text;--> statement-breakpoint
ALTER TABLE `services` ADD `category` text DEFAULT 'digital';--> statement-breakpoint
ALTER TABLE `services` ADD `tagline` text;--> statement-breakpoint
ALTER TABLE `services` ADD `full_description` text;--> statement-breakpoint
ALTER TABLE `services` ADD `hero_heading` text;--> statement-breakpoint
ALTER TABLE `services` ADD `hero_copy` text;--> statement-breakpoint
ALTER TABLE `services` ADD `icon_key` text;--> statement-breakpoint
ALTER TABLE `services` ADD `visual_key` text;--> statement-breakpoint
ALTER TABLE `services` ADD `capabilities` text;--> statement-breakpoint
ALTER TABLE `services` ADD `deliverables` text;--> statement-breakpoint
ALTER TABLE `services` ADD `process` text;--> statement-breakpoint
ALTER TABLE `services` ADD `benefits` text;--> statement-breakpoint
ALTER TABLE `services` ADD `primary_cta` text;--> statement-breakpoint
ALTER TABLE `services` ADD `secondary_cta` text;--> statement-breakpoint
ALTER TABLE `services` ADD `featured` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `og_image` text;--> statement-breakpoint
ALTER TABLE `invoices` ADD `is_recurring` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `invoices` ADD `billing_cycle` text DEFAULT 'none';--> statement-breakpoint
ALTER TABLE `invoices` ADD `next_billing_date` integer;
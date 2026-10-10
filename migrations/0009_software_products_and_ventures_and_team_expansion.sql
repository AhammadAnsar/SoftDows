-- Add CMS fields to services
ALTER TABLE services ADD COLUMN `short_name` text;
ALTER TABLE services ADD COLUMN `category` text DEFAULT 'digital';
ALTER TABLE services ADD COLUMN `tagline` text;
ALTER TABLE services ADD COLUMN `full_description` text;
ALTER TABLE services ADD COLUMN `hero_heading` text;
ALTER TABLE services ADD COLUMN `hero_copy` text;
ALTER TABLE services ADD COLUMN `icon_key` text;
ALTER TABLE services ADD COLUMN `visual_key` text;
ALTER TABLE services ADD COLUMN `capabilities` text;
ALTER TABLE services ADD COLUMN `deliverables` text;
ALTER TABLE services ADD COLUMN `process` text;
ALTER TABLE services ADD COLUMN `benefits` text;
ALTER TABLE services ADD COLUMN `primary_cta` text;
ALTER TABLE services ADD COLUMN `secondary_cta` text;
ALTER TABLE services ADD COLUMN `featured` integer DEFAULT 0 NOT NULL;
ALTER TABLE services ADD COLUMN `og_image` text;

-- Add CMS fields to team_members
ALTER TABLE team_members ADD COLUMN `slug` text;
ALTER TABLE team_members ADD COLUMN `display_name` text;
ALTER TABLE team_members ADD COLUMN `short_bio` text;
ALTER TABLE team_members ADD COLUMN `full_bio` text;
ALTER TABLE team_members ADD COLUMN `monogram_fallback` text;
ALTER TABLE team_members ADD COLUMN `expertise` text;
ALTER TABLE team_members ADD COLUMN `skills` text;
ALTER TABLE team_members ADD COLUMN `experience` text;
ALTER TABLE team_members ADD COLUMN `education` text;
ALTER TABLE team_members ADD COLUMN `certifications` text;
ALTER TABLE team_members ADD COLUMN `languages` text;
ALTER TABLE team_members ADD COLUMN `email` text;
ALTER TABLE team_members ADD COLUMN `phone` text;
ALTER TABLE team_members ADD COLUMN `website` text;
ALTER TABLE team_members ADD COLUMN `linkedin` text;
ALTER TABLE team_members ADD COLUMN `github` text;
ALTER TABLE team_members ADD COLUMN `featured` integer DEFAULT 0 NOT NULL;
ALTER TABLE team_members ADD COLUMN `is_visible` integer DEFAULT 0 NOT NULL;
ALTER TABLE team_members ADD COLUMN `seo_title` text;
ALTER TABLE team_members ADD COLUMN `seo_description` text;

CREATE UNIQUE INDEX IF NOT EXISTS `team_members_slug_unique` ON `team_members` (`slug`);

-- Create software_products
CREATE TABLE `software_products` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`short_name` text,
	`tagline` text,
	`short_description` text,
	`full_description` text,
	`status` text DEFAULT 'active' NOT NULL,
	`featured` integer DEFAULT 0 NOT NULL,
	`is_visible` integer DEFAULT 0 NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`logo_key` text,
	`hero_media_key` text,
	`target_audience` text,
	`problem` text,
	`capabilities` text,
	`key_benefits` text,
	`workflow` text,
	`primary_cta` text,
	`secondary_cta` text,
	`external_url` text,
	`demo_url` text,
	`documentation_url` text,
	`pricing_data` text,
	`seo_title` text,
	`seo_description` text,
	`og_image` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `software_products_slug_unique` ON `software_products` (`slug`);

-- Create ventures
CREATE TABLE `ventures` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`brand_name` text NOT NULL,
	`local_name` text,
	`category` text,
	`short_description` text,
	`full_description` text,
	`status` text DEFAULT 'active' NOT NULL,
	`featured` integer DEFAULT 0 NOT NULL,
	`is_visible` integer DEFAULT 0 NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`logo_key` text,
	`cover_visual_key` text,
	`external_url` text,
	`audience` text,
	`softdows_role` text,
	`key_focus` text,
	`seo_title` text,
	`seo_description` text,
	`og_image` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `ventures_slug_unique` ON `ventures` (`slug`);

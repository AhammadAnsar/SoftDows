CREATE TABLE `media_library` (
  `id` text PRIMARY KEY NOT NULL,
  `object_key` text NOT NULL,
  `original_filename` text NOT NULL,
  `display_name` text,
  `mime_type` text NOT NULL,
  `file_size` integer NOT NULL,
  `width` integer,
  `height` integer,
  `alt_text` text,
  `caption` text,
  `uploaded_by` text,
  `status` text DEFAULT 'active' NOT NULL,
  `folder` text,
  `created_at` integer DEFAULT (unixepoch()) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch()) NOT NULL
);

CREATE UNIQUE INDEX `media_library_object_key_unique` ON `media_library` (`object_key`);

CREATE TABLE `case_study_products` (
  `id` text PRIMARY KEY NOT NULL,
  `case_study_id` text NOT NULL,
  `product_id` text NOT NULL,
  FOREIGN KEY (`case_study_id`) REFERENCES `case_studies`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`product_id`) REFERENCES `software_products`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX `unq_case_study_product` ON `case_study_products` (`case_study_id`, `product_id`);

CREATE TABLE `case_study_ventures` (
  `id` text PRIMARY KEY NOT NULL,
  `case_study_id` text NOT NULL,
  `venture_id` text NOT NULL,
  FOREIGN KEY (`case_study_id`) REFERENCES `case_studies`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`venture_id`) REFERENCES `ventures`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX `unq_case_study_venture` ON `case_study_ventures` (`case_study_id`, `venture_id`);

CREATE TABLE `article_products` (
  `id` text PRIMARY KEY NOT NULL,
  `article_id` text NOT NULL,
  `product_id` text NOT NULL,
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`product_id`) REFERENCES `software_products`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX `unq_article_product` ON `article_products` (`article_id`, `product_id`);

ALTER TABLE `case_studies` ADD COLUMN `hero_media_id` text;
ALTER TABLE `case_studies` ADD COLUMN `gallery_media_ids` text;
ALTER TABLE `case_studies` ADD COLUMN `technologies` text;
ALTER TABLE `case_studies` ADD COLUMN `og_image` text;

ALTER TABLE `articles` ADD COLUMN `excerpt` text;
ALTER TABLE `articles` ADD COLUMN `featured_image_id` text;
ALTER TABLE `articles` ADD COLUMN `author_id` text REFERENCES `team_members`(`id`) ON DELETE SET NULL;
ALTER TABLE `articles` ADD COLUMN `og_image` text;

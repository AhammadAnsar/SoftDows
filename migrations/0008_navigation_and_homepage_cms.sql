-- Migration 0008: Navigation & Homepage CMS

CREATE TABLE `__new_navigation_items` (
  `id` text PRIMARY KEY NOT NULL,
  `group_key` text NOT NULL,
  `label` text NOT NULL,
  `entity_type` text,
  `entity_id` text,
  `custom_url` text,
  `short_description` text,
  `icon_key` text,
  `display_order` integer DEFAULT 0 NOT NULL,
  `parent_id` text,
  `is_enabled` integer DEFAULT 1 NOT NULL,
  `created_at` integer DEFAULT (unixepoch()) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch()) NOT NULL
);

INSERT INTO `__new_navigation_items` (
  `id`, `group_key`, `label`, `custom_url`, `display_order`, `parent_id`, `is_enabled`, `created_at`, `updated_at`
)
SELECT 
  `id`, `menu_location`, `label`, `href`, `display_order`, `parent_id`, `is_enabled`, `created_at`, `updated_at` 
FROM `navigation_items`;

DROP TABLE `navigation_items`;

ALTER TABLE `__new_navigation_items` RENAME TO `navigation_items`;

-- Seed CMS default configuration

INSERT OR IGNORE INTO `site_settings` (`id`, `key`, `value`, `description`, `created_at`, `updated_at`) VALUES 
('s1', 'site_title', 'SoftDows | High-Performance Digital Solutions & Ventures', 'Default SEO Title', unixepoch(), unixepoch()),
('s2', 'site_description', 'SoftDows is a high-performance software development firm...', 'Default SEO Description', unixepoch(), unixepoch()),
('s3', 'contact_email', 'hello@softdows.com', 'Primary Contact Email', unixepoch(), unixepoch()),
('s4', 'contact_phone', '+8801700000000', 'Primary Contact Phone', unixepoch(), unixepoch()),
('s5', 'footer_copyright', '© 2026 SoftDows. All rights reserved.', 'Footer Copyright', unixepoch(), unixepoch());

INSERT OR IGNORE INTO `site_pages` (`id`, `slug`, `title`, `seo_title`, `status`, `created_at`, `updated_at`) VALUES 
('p_home', '/', 'Homepage', 'SoftDows | High-Performance Digital Solutions & Ventures', 'published', unixepoch(), unixepoch());

INSERT OR IGNORE INTO `page_sections` (`id`, `page_id`, `section_identifier`, `display_order`, `heading`, `created_at`, `updated_at`) VALUES 
('sec_hero', 'p_home', 'hero', 1, 'Engineering the Next Generation of Digital Ventures', unixepoch(), unixepoch()),
('sec_services', 'p_home', 'services', 2, 'Core Capabilities', unixepoch(), unixepoch()),
('sec_ecosystem', 'p_home', 'ecosystem', 3, 'The SoftDows Ecosystem', unixepoch(), unixepoch()),
('sec_products', 'p_home', 'products', 4, 'Products', unixepoch(), unixepoch()),
('sec_ventures', 'p_home', 'ventures', 5, 'Ventures', unixepoch(), unixepoch()),
('sec_process', 'p_home', 'process', 6, 'Our Process', unixepoch(), unixepoch()),
('sec_team', 'p_home', 'team', 7, 'The Team Behind SoftDows', unixepoch(), unixepoch()),
('sec_final_cta', 'p_home', 'final_cta', 8, 'Ready to Accelerate Your Digital Growth?', unixepoch(), unixepoch());

INSERT OR IGNORE INTO `navigation_items` (`id`, `group_key`, `label`, `custom_url`, `display_order`, `created_at`, `updated_at`) VALUES 
('nav1', 'header', 'Home', '/', 1, unixepoch(), unixepoch()),
('nav2', 'header', 'Services', '/services/', 2, unixepoch(), unixepoch()),
('nav3', 'header', 'Products', '/products/', 3, unixepoch(), unixepoch()),
('nav4', 'header', 'Ventures', '/ventures/', 4, unixepoch(), unixepoch()),
('nav5', 'header', 'Company', '/about/', 5, unixepoch(), unixepoch());

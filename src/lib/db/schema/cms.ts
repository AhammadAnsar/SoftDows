import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { id, timestamps } from './utils';
import { services } from './agency';
import { user } from './auth';

// --- CORE WEBSITE CMS ---

export const siteSettings = sqliteTable('site_settings', {
  id: id(),
  key: text('key').notNull().unique(), // e.g., 'contact_email', 'site_title'
  value: text('value').notNull(),
  description: text('description'),
  ...timestamps
});

export const sitePages = sqliteTable('site_pages', {
  id: id(),
  slug: text('slug').notNull().unique(), // e.g., '/', '/about'
  title: text('title').notNull(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  status: text('status', { enum: ['published', 'draft'] }).notNull().default('draft'),
  ...timestamps
});

export const pageSections = sqliteTable('page_sections', {
  id: id(),
  pageId: text('page_id').notNull().references(() => sitePages.id, { onDelete: 'cascade' }),
  sectionIdentifier: text('section_identifier').notNull(), // e.g., 'hero', 'about_intro'
  heading: text('heading'),
  subheading: text('subheading'),
  content: text('content'),
  ctaText: text('cta_text'),
  ctaLink: text('cta_link'),
  displayOrder: integer('display_order').notNull().default(0),
  // JSON field strictly for tightly controlled structured templates
  structuredData: text('structured_data', { mode: 'json' }), 
  isEnabled: integer('is_enabled', { mode: 'boolean' }).notNull().default(true),
  ...timestamps
});

// --- CASE STUDIES ---

export const caseStudies = sqliteTable('case_studies', {
  id: id(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  clientName: text('client_name'), // De-coupled from CRM Client table to allow anonymization if needed
  industry: text('industry'),
  projectSummary: text('project_summary').notNull(),
  challenge: text('challenge'),
  solution: text('solution'),
  results: text('results', { mode: 'json' }), // Stored as JSON array of strings
  deliverables: text('deliverables', { mode: 'json' }), // JSON array
  projectUrl: text('project_url'),
  completionDate: integer('completion_date', { mode: 'timestamp' }),
  thumbnailKey: text('thumbnail_key'), // Links to R2
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  status: text('status', { enum: ['published', 'draft', 'archived'] }).notNull().default('draft'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  ...timestamps
});

export const caseStudyServices = sqliteTable('case_study_services', {
  id: id(),
  caseStudyId: text('case_study_id').notNull().references(() => caseStudies.id, { onDelete: 'cascade' }),
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
}, (t) => ({
  unq: uniqueIndex('unq_case_study_service').on(t.caseStudyId, t.serviceId)
}));

// --- INSIGHTS / BLOG ---

export const articles = sqliteTable('articles', {
  id: id(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(), // Markdown or HTML
  authorName: text('author_name').notNull().default('Ansar Ahammad'), // Simple model; Team integration optional
  status: text('status', { enum: ['published', 'draft', 'archived'] }).notNull().default('draft'),
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  publishDate: integer('publish_date', { mode: 'timestamp' }),
  ...timestamps
});

export const categories = sqliteTable('categories', {
  id: id(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  ...timestamps
});

export const articleCategories = sqliteTable('article_categories', {
  id: id(),
  articleId: text('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  categoryId: text('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
}, (t) => ({
  unq: uniqueIndex('unq_article_category').on(t.articleId, t.categoryId)
}));

export const articleServices = sqliteTable('article_services', {
  id: id(),
  articleId: text('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
}, (t) => ({
  unq: uniqueIndex('unq_article_service').on(t.articleId, t.serviceId)
}));

// --- TESTIMONIALS & TEAM ---

export const testimonials = sqliteTable('testimonials', {
  id: id(),
  clientName: text('client_name').notNull(),
  clientRole: text('client_role'),
  clientCompany: text('client_company'),
  quote: text('quote').notNull(),
  avatarKey: text('avatar_key'), // Link to R2
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
  status: text('status', { enum: ['published', 'draft', 'archived'] }).notNull().default('draft'),
  ...timestamps
});

export const teamMembers = sqliteTable('team_members', {
  id: id(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  bio: text('bio'),
  avatarKey: text('avatar_key'), // Link to R2
  displayOrder: integer('display_order').notNull().default(0),
  status: text('status', { enum: ['active', 'inactive'] }).notNull().default('active'),
  userId: text('user_id').references(() => user.id, { onDelete: 'set null' }), // Staff user identity
  ...timestamps
});

// --- NAVIGATION & FAQS ---

export const navigationItems = sqliteTable('navigation_items', {
  id: id(),
  menuLocation: text('menu_location').notNull(), // e.g. 'header', 'footer'
  label: text('label').notNull(),
  href: text('href').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  parentId: text('parent_id'), // For nested menus
  isEnabled: integer('is_enabled', { mode: 'boolean' }).notNull().default(true),
  ...timestamps
});

export const faqs = sqliteTable('faqs', {
  id: id(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  status: text('status', { enum: ['published', 'draft'] }).notNull().default('draft'),
  ...timestamps
});

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
  heroMediaId: text('hero_media_id'),
  galleryMediaIds: text('gallery_media_ids'),
  technologies: text('technologies'),
  ogImage: text('og_image'),
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
  authorId: text('author_id').references(() => teamMembers.id, { onDelete: 'set null' }),
  excerpt: text('excerpt'),
  featuredImageId: text('featured_image_id'),
  ogImage: text('og_image'),
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
  slug: text('slug').notNull().unique(),
  displayName: text('display_name'),
  shortBio: text('short_bio'),
  fullBio: text('full_bio'),
  monogramFallback: text('monogram_fallback'),
  expertise: text('expertise', { mode: 'json' }),
  skills: text('skills', { mode: 'json' }),
  experience: text('experience', { mode: 'json' }),
  education: text('education', { mode: 'json' }),
  certifications: text('certifications', { mode: 'json' }),
  languages: text('languages', { mode: 'json' }),
  email: text('email'),
  phone: text('phone'),
  website: text('website'),
  linkedin: text('linkedin'),
  github: text('github'),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  isVisible: integer('is_visible', { mode: 'boolean' }).notNull().default(false),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  ...timestamps
});

// --- NAVIGATION & FAQS ---

export const navigationItems = sqliteTable('navigation_items', {
  id: id(),
  groupKey: text('group_key').notNull(), // e.g. 'header', 'footer'
  label: text('label').notNull(),
  entityType: text('entity_type'), // e.g., 'service', 'product', 'venture', 'page'
  entityId: text('entity_id'), // Reference to the canonical entity
  customUrl: text('custom_url'), // Fallback if no entity is used
  shortDescription: text('short_description'), // For mega menus
  iconKey: text('icon_key'), // For mega menus
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

export const softwareProducts = sqliteTable('software_products', {
  id: id(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  shortName: text('short_name'),
  tagline: text('tagline'),
  shortDescription: text('short_description'),
  fullDescription: text('full_description'),
  status: text('status', { enum: ['active', 'beta', 'upcoming', 'retired', 'hidden'] }).notNull().default('active'),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  isVisible: integer('is_visible', { mode: 'boolean' }).notNull().default(false),
  displayOrder: integer('display_order').notNull().default(0),
  logoKey: text('logo_key'),
  heroMediaKey: text('hero_media_key'),
  targetAudience: text('target_audience'),
  problem: text('problem'),
  capabilities: text('capabilities', { mode: 'json' }),
  keyBenefits: text('key_benefits', { mode: 'json' }),
  workflow: text('workflow', { mode: 'json' }),
  primaryCta: text('primary_cta', { mode: 'json' }),
  secondaryCta: text('secondary_cta', { mode: 'json' }),
  externalUrl: text('external_url'),
  demoUrl: text('demo_url'),
  documentationUrl: text('documentation_url'),
  pricingData: text('pricing_data', { mode: 'json' }),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  ogImage: text('og_image'),
  ...timestamps
});

export const ventures = sqliteTable('ventures', {
  id: id(),
  slug: text('slug').notNull().unique(),
  brandName: text('brand_name').notNull(),
  localName: text('local_name'),
  category: text('category'),
  shortDescription: text('short_description'),
  fullDescription: text('full_description'),
  status: text('status', { enum: ['active', 'upcoming', 'hidden'] }).notNull().default('active'),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  isVisible: integer('is_visible', { mode: 'boolean' }).notNull().default(false),
  displayOrder: integer('display_order').notNull().default(0),
  logoKey: text('logo_key'),
  coverVisualKey: text('cover_visual_key'),
  externalUrl: text('external_url'),
  audience: text('audience'),
  softdowsRole: text('softdows_role'),
  keyFocus: text('key_focus', { mode: 'json' }),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  ogImage: text('og_image'),
  ...timestamps
});



export const mediaLibrary = sqliteTable('media_library', {
  id: id(),
  objectKey: text('object_key').notNull().unique(),
  originalFilename: text('original_filename').notNull(),
  displayName: text('display_name'),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size').notNull(),
  width: integer('width'),
  height: integer('height'),
  altText: text('alt_text'),
  caption: text('caption'),
  uploadedBy: text('uploaded_by'),
  status: text('status', { enum: ['active', 'archived', 'deleted'] }).notNull().default('active'),
  folder: text('folder'),
  ...timestamps
});

export const caseStudyProducts = sqliteTable('case_study_products', {
  id: id(),
  caseStudyId: text('case_study_id').notNull().references(() => caseStudies.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => softwareProducts.id, { onDelete: 'cascade' }),
}, (t) => ({
  unq: uniqueIndex('unq_case_study_product').on(t.caseStudyId, t.productId)
}));

export const caseStudyVentures = sqliteTable('case_study_ventures', {
  id: id(),
  caseStudyId: text('case_study_id').notNull().references(() => caseStudies.id, { onDelete: 'cascade' }),
  ventureId: text('venture_id').notNull().references(() => ventures.id, { onDelete: 'cascade' }),
}, (t) => ({
  unq: uniqueIndex('unq_case_study_venture').on(t.caseStudyId, t.ventureId)
}));

export const articleProducts = sqliteTable('article_products', {
  id: id(),
  articleId: text('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => softwareProducts.id, { onDelete: 'cascade' }),
}, (t) => ({
  unq: uniqueIndex('unq_article_product').on(t.articleId, t.productId)
}));

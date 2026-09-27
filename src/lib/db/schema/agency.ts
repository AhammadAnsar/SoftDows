import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { id, timestamps, archive } from './utils';
import { clients, leads } from './crm';
import { user } from './auth';

export const services = sqliteTable('services', {
  id: id(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  shortDescription: text('short_description'),
  status: text('status', { enum: ['active', 'inactive', 'draft'] }).notNull().default('draft'),
  displayOrder: integer('display_order').notNull().default(0),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  isVisible: integer('is_visible', { mode: 'boolean' }).notNull().default(false),
  shortName: text('short_name'),
  category: text('category').default('digital'),
  tagline: text('tagline'),
  fullDescription: text('full_description'),
  heroHeading: text('hero_heading'),
  heroCopy: text('hero_copy'),
  iconKey: text('icon_key'),
  visualKey: text('visual_key'),
  capabilities: text('capabilities', { mode: 'json' }),
  deliverables: text('deliverables', { mode: 'json' }),
  process: text('process', { mode: 'json' }),
  benefits: text('benefits', { mode: 'json' }),
  primaryCta: text('primary_cta', { mode: 'json' }),
  secondaryCta: text('secondary_cta', { mode: 'json' }),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  ogImage: text('og_image'),
  ...timestamps
});

export const projects = sqliteTable('projects', {
  id: id(),
  projectCode: text('project_code').unique(),
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'restrict' }),
  leadId: text('lead_id').references(() => leads.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status', { enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled'] }).notNull().default('planning'),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).notNull().default('medium'),
  startDate: integer('start_date', { mode: 'timestamp' }), // Business Date
  targetCompletionDate: integer('target_completion_date', { mode: 'timestamp' }), // Business Date
  completionDate: integer('completion_date', { mode: 'timestamp' }), // Business Date
  progressPercentage: integer('progress_percentage').notNull().default(0),
  projectManagerId: text('project_manager_id').references(() => user.id, { onDelete: 'set null' }),
  budget: integer('budget').notNull().default(0), // Minor units
  currency: text('currency').notNull().default('USD'),
  internalNotes: text('internal_notes'),
  clientVisibleSummary: text('client_visible_summary'),
  ...timestamps,
  ...archive
});

export const projectMembers = sqliteTable('project_members', {
  id: id(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  ...timestamps
}, (t) => ({
  unq: uniqueIndex('unq_project_member').on(t.projectId, t.userId)
}));

export const projectServices = sqliteTable('project_services', {
  id: id(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'restrict' }),
}, (t) => ({
  unq: uniqueIndex('unq_project_service').on(t.projectId, t.serviceId)
}));

export const projectMilestones = sqliteTable('project_milestones', {
  id: id(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { enum: ['pending', 'active', 'completed', 'cancelled'] }).notNull().default('pending'),
  progressPercentage: integer('progress_percentage').notNull().default(0),
  displayOrder: integer('display_order').notNull().default(0),
  targetDate: integer('target_date', { mode: 'timestamp' }),
  completionDate: integer('completion_date', { mode: 'timestamp' }),
  internalNote: text('internal_note'),
  clientVisibleNote: text('client_visible_note'),
  isVisibleToClient: integer('is_visible_to_client', { mode: 'boolean' }).notNull().default(true),
  ...timestamps
});

export const projectUpdates = sqliteTable('project_updates', {
  id: id(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  isVisibleToClient: integer('is_visible_to_client', { mode: 'boolean' }).notNull().default(true),
  authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }), // Staff author
  ...timestamps
});

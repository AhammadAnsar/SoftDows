import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { id, timestamps, archive } from './utils';
import { clients } from './crm';
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
  ...timestamps
});

export const projects = sqliteTable('projects', {
  id: id(),
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'restrict' }),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status', { enum: ['planned', 'active', 'on_hold', 'completed', 'cancelled'] }).notNull().default('planned'),
  startDate: integer('start_date', { mode: 'timestamp' }), // Business Date
  targetCompletionDate: integer('target_completion_date', { mode: 'timestamp' }), // Business Date
  completionDate: integer('completion_date', { mode: 'timestamp' }), // Business Date
  progressPercentage: integer('progress_percentage').notNull().default(0),
  internalNotes: text('internal_notes'),
  clientVisibleSummary: text('client_visible_summary'),
  ...timestamps,
  ...archive
});

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
  displayOrder: integer('display_order').notNull().default(0),
  targetDate: integer('target_date', { mode: 'timestamp' }),
  completionDate: integer('completion_date', { mode: 'timestamp' }),
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

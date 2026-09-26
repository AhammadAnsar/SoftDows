import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { id, timestamps, archive } from './utils';
import { user } from './auth';

export const leads = sqliteTable('leads', {
  id: id(),
  name: text('name').notNull(),
  company: text('company'),
  email: text('email').notNull(),
  phone: text('phone'),
  requestedService: text('requested_service'),
  projectType: text('project_type'),
  description: text('description'),
  timeline: text('timeline'),
  budgetRange: text('budget_range'),
  currency: text('currency'),
  sourceUrl: text('source_url'),
  status: text('status', { enum: ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost', 'spam'] }).notNull().default('new'),
  internalNotes: text('internal_notes'),
  convertedClientId: text('converted_client_id').references(() => clients.id, { onDelete: 'set null' }),
  ...timestamps
});

export const clients = sqliteTable('clients', {
  id: id(),
  name: text('name').notNull(), // Business name or individual name
  status: text('status', { enum: ['active', 'inactive', 'archived'] }).notNull().default('active'),
  notes: text('notes'),
  ...timestamps,
  ...archive
});

export const clientContacts = sqliteTable('client_contacts', {
  id: id(),
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'restrict' }), // Restrict delete to prevent orphaned records
  firstName: text('first_name').notNull(),
  lastName: text('last_name'),
  email: text('email'),
  phone: text('phone'),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
  userId: text('user_id').references(() => user.id, { onDelete: 'set null' }), // Links portal account
  ...timestamps
});

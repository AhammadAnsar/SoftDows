import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { id, timestamps } from './utils';
import { clients } from './crm';
import { projects, services } from './agency';
import { user } from './auth';

export const supportTickets = sqliteTable('support_tickets', {
  id: id(),
  ticketNumber: text('ticket_number').notNull().unique(), // Human-readable e.g., TK-2026-001
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  serviceId: text('service_id').references(() => services.id, { onDelete: 'set null' }),
  category: text('category', { enum: ['general', 'technical', 'billing', 'feature_request', 'bug_report'] }).notNull().default('general'),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).notNull().default('medium'),
  subject: text('subject').notNull(),
  description: text('description').notNull(), // Initial message body
  status: text('status', { enum: ['open', 'in_progress', 'waiting_for_client', 'resolved', 'closed'] }).notNull().default('open'),
  assignedToId: text('assigned_to_id').references(() => user.id, { onDelete: 'set null' }),
  createdById: text('created_by_id').references(() => user.id, { onDelete: 'set null' }),
  resolvedAt: integer('resolved_at', { mode: 'timestamp' }),
  closedAt: integer('closed_at', { mode: 'timestamp' }),
  ...timestamps
});

export const supportMessages = sqliteTable('support_messages', {
  id: id(),
  ticketId: text('ticket_id').notNull().references(() => supportTickets.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  senderId: text('sender_id').references(() => user.id, { onDelete: 'set null' }),
  visibility: text('visibility', { enum: ['public', 'internal'] }).notNull().default('public'),
  attachmentId: text('attachment_id'), // References files.id when Phase 07 R2 is ready
  ...timestamps
});

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { id, timestamps } from './utils';
import { clients } from './crm';
import { projects, services } from './agency';
import { user } from './auth';

export const supportTickets = sqliteTable('support_tickets', {
  id: id(),
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  serviceId: text('service_id').references(() => services.id, { onDelete: 'set null' }),
  subject: text('subject').notNull(),
  status: text('status', { enum: ['open', 'in_progress', 'waiting_for_client', 'resolved', 'closed'] }).notNull().default('open'),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).notNull().default('medium'),
  closedAt: integer('closed_at', { mode: 'timestamp' }),
  ...timestamps
});

export const supportMessages = sqliteTable('support_messages', {
  id: id(),
  ticketId: text('ticket_id').notNull().references(() => supportTickets.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  senderId: text('sender_id').references(() => user.id, { onDelete: 'set null' }), // Client or Admin
  ...timestamps
});

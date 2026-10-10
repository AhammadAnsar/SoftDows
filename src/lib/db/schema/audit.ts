import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { id, timestamps } from './utils';
import { user } from './auth';

export const auditLogs = sqliteTable('audit_logs', {
  id: id(),
  action: text('action').notNull(), // e.g., 'invoice_issued', 'client_created'
  entityType: text('entity_type').notNull(), // e.g., 'invoice', 'client'
  entityId: text('entity_id').notNull(),
  details: text('details', { mode: 'json' }), // Before/After state or context
  
  actorId: text('actor_id').references(() => user.id, { onDelete: 'set null' }), // Staff/Client who performed the action
  ...timestamps
});

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { id, timestamps } from './utils';
import { clients } from './crm';
import { projects } from './agency';
import { user } from './auth';

export const files = sqliteTable('files', {
  id: id(),
  storageKey: text('storage_key').notNull().unique(), // The Cloudflare R2 object key
  originalFileName: text('original_file_name').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  visibility: text('visibility', { enum: ['private', 'public'] }).notNull().default('private'),
  
  // Optional relational links for scoping access
  clientId: text('client_id').references(() => clients.id, { onDelete: 'set null' }),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  
  uploadedById: text('uploaded_by_id').references(() => user.id, { onDelete: 'set null' }),
  ...timestamps
});

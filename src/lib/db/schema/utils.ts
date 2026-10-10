import { text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Common Utilities for Drizzle Schema
 * 
 * Timestamps use UTC via CURRENT_TIMESTAMP
 * IDs use standard text strings (intended for cryptographically secure random strings or UUIDs generated at application level)
 */

export const id = (name: string = 'id') => text(name).primaryKey();

export const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
};

export const archive = {
  archivedAt: integer('archived_at', { mode: 'timestamp' }),
};

export const money = (name: string) => integer(name); // Money stored in minor units

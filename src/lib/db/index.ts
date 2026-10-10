import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

/**
 * Creates and returns a Drizzle ORM instance bound to the provided Cloudflare D1 environment.
 * 
 * IMPORTANT: Never use this on the browser/client side.
 * This is meant to be called within Astro server contexts or API endpoints
 * passing the `locals.runtime.env.DB` binding.
 * 
 * @param d1Binding The D1Database binding provided by the Cloudflare environment
 */
export function getDb(d1Binding: D1Database) {
  return drizzle(d1Binding, { schema });
}

import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { clientContacts } from '../db/schema/crm';
import { user as userTable } from '../db/schema/auth';

export async function getAuthorizedClientContext(db: DrizzleD1Database<any>, userId: string) {
  // Query client_contacts to find the clientId associated with this userId
  const contact = await db.select()
    .from(clientContacts)
    .where(eq(clientContacts.userId, userId))
    .limit(1)
    .get();

  if (!contact) {
    return { authorized: false, clientId: null, contact: null };
  }

  return { authorized: true, clientId: contact.clientId, contact };
}

export async function requireClientResourceOwnership(
  db: DrizzleD1Database<any>, 
  userId: string, 
  resourceClientId: string | null | undefined
) {
  if (!resourceClientId) return false;
  const ctx = await getAuthorizedClientContext(db, userId);
  if (!ctx.authorized) return false;
  return ctx.clientId === resourceClientId;
}

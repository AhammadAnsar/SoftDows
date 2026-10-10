import { roles, type AppRole, ac } from './permissions';
import { getDb } from '../db';
import { clientContacts } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Ensures the user has the required permission statement.
 */
export function requirePermission(
  userRole: AppRole,
  resource: keyof typeof ac.statements,
  action: string
): boolean {
  if (!roles[userRole]) return false;
  const roleStatements = (roles[userRole] as any).statements as Record<string, string[]>;
  if (!roleStatements || !roleStatements[resource]) return false;
  return roleStatements[resource].includes('all') || roleStatements[resource].includes(action);
}

/**
 * Checks if the role is a recognized Staff role.
 */
export function isStaffRole(role: AppRole): boolean {
  return role !== 'client';
}

/**
 * Safely resolves a logged-in Better Auth User to their isolated business Client context.
 * Prevents clients from accessing data by passing arbitrary query parameters.
 */
export async function getAuthorizedClientContext(
  env: any,
  userId: string
): Promise<{ clientId: string } | null> {
  const db = getDb(env.DB);
  
  // A Better Auth user with the 'client' role is linked to business data via clientContacts
  const contactRecord = await db
    .select({ clientId: clientContacts.clientId })
    .from(clientContacts)
    .where(eq(clientContacts.userId, userId))
    .limit(1)
    .get();

  if (!contactRecord || !contactRecord.clientId) {
    return null;
  }

  return { clientId: contactRecord.clientId };
}

/**
 * Escalate Protection: Ensures safe role modification
 * Standard Admins cannot assign, modify, or delete a super_admin.
 */
export function canManageRole(actorRole: AppRole, targetRole: AppRole | undefined): boolean {
  if (actorRole === 'super_admin') return true;
  
  if (actorRole === 'admin') {
    // Standard admin cannot touch a super_admin or create a super_admin
    if (targetRole === 'super_admin') return false;
    return true; // Can manage other roles
  }

  // Other roles cannot manage roles at all
  return false;
}

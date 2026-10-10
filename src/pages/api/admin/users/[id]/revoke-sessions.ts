import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getAuth } from '../../../../../lib/auth';
import { requirePermission, canManageRole } from '../../../../../lib/auth/authorization';
import type { AppRole } from '../../../../../lib/auth/permissions';
import { getDb } from '../../../../../lib/db';
import { auditLogs } from '../../../../../lib/db/schema/audit';
import { user } from '../../../../../lib/db/schema/auth';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
  const _env = env as any;
  const auth = getAuth(_env);
  const db = getDb(_env.DB);
  
  const authSession = await auth.api.getSession({ headers: request.headers });
  if (!authSession) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const actorRole = (authSession.user.role as AppRole) || 'client';
  
  if (!requirePermission(actorRole, 'session', 'revoke')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const userId = params.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing user ID' }), { status: 400 });
  }

  const targetUser = await db.select().from(user).where(eq(user.id, userId)).get();
  if (!targetUser) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }

  const targetRole = targetUser.role as AppRole;

  if (!canManageRole(actorRole, targetRole)) {
    return new Response(JSON.stringify({ error: 'Cannot revoke sessions for this user' }), { status: 403 });
  }

  try {
    await auth.api.revokeUserSessions({
      body: { userId },
      headers: request.headers
    });

    await db.insert(auditLogs).values({
      id: crypto.randomUUID().replace(/-/g, ''),
      action: 'sessions_revoked',
      entityType: 'user',
      entityId: userId,
      actorId: authSession.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return new Response(JSON.stringify({ 
      ok: true, 
      userId 
    }), { status: 200 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
}

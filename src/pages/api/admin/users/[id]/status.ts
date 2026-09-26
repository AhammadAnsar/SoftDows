import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getAuth } from '../../../../../lib/auth';
import { requirePermission, canManageRole } from '../../../../../lib/auth/authorization';
import type { AppRole } from '../../../../../lib/auth/permissions';
import { getDb } from '../../../../../lib/db';
import { auditLogs } from '../../../../../lib/db/schema/audit';
import { user } from '../../../../../lib/db/schema/auth';
import { eq, and, ne, sql } from 'drizzle-orm';

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
  
  if (!requirePermission(actorRole, 'user', 'update')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const userId = params.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing user ID' }), { status: 400 });
  }

  const body = await request.json().catch(() => ({})) as any;
  const { status, banReason } = body;

  if (status !== 'active' && status !== 'inactive') {
    return new Response(JSON.stringify({ error: 'Invalid status, must be active or inactive' }), { status: 400 });
  }

  const targetUser = await db.select().from(user).where(eq(user.id, userId)).get();
  if (!targetUser) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }

  const targetRole = targetUser.role as AppRole;

  if (!canManageRole(actorRole, targetRole)) {
    return new Response(JSON.stringify({ error: 'Cannot modify this user\'s status' }), { status: 403 });
  }

  if (authSession.user.id === userId && status === 'inactive') {
    return new Response(JSON.stringify({ error: 'Cannot deactivate yourself' }), { status: 403 });
  }

  if (targetRole === 'super_admin' && status === 'inactive') {
    const superAdminsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(and(eq(user.role, 'super_admin'), ne(user.banned, true)))
      .get();
      
    if (superAdminsCount && superAdminsCount.count <= 1) {
      return new Response(JSON.stringify({ error: 'Cannot deactivate the last active super_admin' }), { status: 400 });
    }
  }

  try {
    if (status === 'inactive') {
      await auth.api.banUser({
        body: { userId, banReason: banReason || 'Admin deactivated' },
        headers: request.headers
      });

      // Revoke all sessions on ban
      await auth.api.revokeUserSessions({
        body: { userId },
        headers: request.headers
      });
    } else {
      await auth.api.unbanUser({
        body: { userId },
        headers: request.headers
      });
    }

    await db.insert(auditLogs).values({
      id: crypto.randomUUID().replace(/-/g, ''),
      action: 'user_status_changed',
      entityType: 'user',
      entityId: userId,
      actorId: authSession.user.id,
      details: { status, banReason },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return new Response(JSON.stringify({ 
      ok: true, 
      userId, 
      status 
    }), { status: 200 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
}

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
  
  if (!requirePermission(actorRole, 'user', 'setRole')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const userId = params.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing user ID' }), { status: 400 });
  }

  const body = await request.json().catch(() => ({})) as any;
  const { role: newRole } = body;

  if (!newRole) {
    return new Response(JSON.stringify({ error: 'Missing new role' }), { status: 400 });
  }

  if (!canManageRole(actorRole, newRole)) {
    return new Response(JSON.stringify({ error: 'Cannot assign this role' }), { status: 403 });
  }

  const targetUser = await db.select().from(user).where(eq(user.id, userId)).get();
  if (!targetUser) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }

  const currentRole = targetUser.role as AppRole;

  if (!canManageRole(actorRole, currentRole)) {
    return new Response(JSON.stringify({ error: 'Cannot modify this user\'s role' }), { status: 403 });
  }

  if (authSession.user.id === userId && currentRole !== newRole) {
    return new Response(JSON.stringify({ error: 'Cannot change your own role' }), { status: 403 });
  }

  if (currentRole === 'super_admin' && newRole !== 'super_admin') {
    const superAdminsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(and(eq(user.role, 'super_admin'), ne(user.banned, true)))
      .get();
      
    if (superAdminsCount && superAdminsCount.count <= 1) {
      return new Response(JSON.stringify({ error: 'Cannot demote the last active super_admin' }), { status: 400 });
    }
  }

  try {
    await auth.api.setRole({
      body: {
        userId,
        role: newRole
      },
      headers: request.headers
    });

    await db.insert(auditLogs).values({
      id: crypto.randomUUID().replace(/-/g, ''),
      action: 'role_changed',
      entityType: 'user',
      entityId: userId,
      actorId: authSession.user.id,
      details: { oldRole: currentRole, newRole },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return new Response(JSON.stringify({ 
      ok: true, 
      userId, 
      oldRole: currentRole, 
      newRole 
    }), { status: 200 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
}

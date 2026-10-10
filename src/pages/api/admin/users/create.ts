import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getAuth } from '../../../../lib/auth';
import { requirePermission, canManageRole } from '../../../../lib/auth/authorization';
import type { AppRole } from '../../../../lib/auth/permissions';
import { getDb } from '../../../../lib/db';
import { auditLogs } from '../../../../lib/db/schema/audit';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const _env = env as any;
  const auth = getAuth(_env);
  const db = getDb(_env.DB);
  
  const authSession = await auth.api.getSession({ headers: request.headers });
  if (!authSession) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const actorRole = (authSession.user.role as AppRole) || 'client';
  
  if (!requirePermission(actorRole, 'user', 'create')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const body = await request.json().catch(() => ({})) as any;
  const { name, email, role } = body;

  if (!name || !email || !role) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const validRoles: AppRole[] = ['super_admin', 'admin', 'content_editor', 'finance', 'support'];
  if (!validRoles.includes(role)) {
    return new Response(JSON.stringify({ error: 'Invalid role' }), { status: 400 });
  }

  if (!canManageRole(actorRole, role)) {
    return new Response(JSON.stringify({ error: 'Cannot assign this role' }), { status: 403 });
  }

  try {
    const randomPassword = crypto.randomUUID();
    
    // Create user via Better Auth
    const res = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password: randomPassword
      }
    });
    
    if (!res || !res.user) {
      throw new Error('Failed to create user');
    }

    const newUserId = res.user.id;

    // Set role via admin plugin
    await auth.api.setRole({
      body: {
        userId: newUserId,
        role: role
      },
      headers: request.headers
    });

    // Audit log
    await db.insert(auditLogs).values({
      id: crypto.randomUUID().replace(/-/g, ''),
      action: 'user_created',
      entityType: 'user',
      entityId: newUserId,
      actorId: authSession.user.id,
      details: { email, role },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return new Response(JSON.stringify({ 
      ok: true, 
      userId: newUserId, 
      email, 
      role, 
      invitePending: true 
    }), { status: 201 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
}

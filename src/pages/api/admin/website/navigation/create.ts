import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getAuth } from '../../../../../lib/auth';
import { requirePermission } from '../../../../../lib/auth/authorization';
import type { AppRole } from '../../../../../lib/auth/permissions';
import { getDb } from '../../../../../lib/db';
import { navigationItems } from '../../../../../lib/db/schema/cms';
import { auditLogs } from '../../../../../lib/db/schema/audit';

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
  
  if (!requirePermission(actorRole, 'content', 'create')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const body = await request.json().catch(() => ({})) as any;
  const { label, customUrl, groupKey, displayOrder, isEnabled, parentId } = body;

  if (!label || !groupKey) {
    return new Response(JSON.stringify({ error: 'Missing required fields (label, groupKey)' }), { status: 400 });
  }

  try {
    const newItem = await db.insert(navigationItems).values({ id: crypto.randomUUID().replace(/-/g, ''),
      label,
      customUrl: customUrl || null,
      groupKey,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
      isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : true,
      parentId: parentId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Audit log
    await db.insert(auditLogs).values({
      id: crypto.randomUUID().replace(/-/g, ''),
      action: 'navigation_item_created',
      entityType: 'navigation',
      entityId: newItem[0].id,
      actorId: authSession.user.id,
      details: { label, groupKey },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return new Response(JSON.stringify({ ok: true, item: newItem[0] }), { status: 201 });

  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
}

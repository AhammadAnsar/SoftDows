import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getAuth } from '../../../../../lib/auth';
import { requirePermission } from '../../../../../lib/auth/authorization';
import type { AppRole } from '../../../../../lib/auth/permissions';
import { getDb } from '../../../../../lib/db';
import { navigationItems } from '../../../../../lib/db/schema/cms';
import { auditLogs } from '../../../../../lib/db/schema/audit';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
  const _env = env as any;
  const auth = getAuth(_env);
  const db = getDb(_env.DB);
  
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400 });
  }

  const authSession = await auth.api.getSession({ headers: request.headers });
  if (!authSession) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const actorRole = (authSession.user.role as AppRole) || 'client';
  
  const body = await request.json().catch(() => ({})) as any;
  const action = body.action;

  if (action === 'delete') {
    if (!requirePermission(actorRole, 'content', 'delete')) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    try {
      await db.delete(navigationItems).where(eq(navigationItems.id, id));

      await db.insert(auditLogs).values({
        id: crypto.randomUUID().replace(/-/g, ''),
        action: 'navigation_item_deleted',
        entityType: 'navigation',
        entityId: id,
        actorId: authSession.user.id,
        details: { id },
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (error: any) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
  } else if (action === 'update') {
    if (!requirePermission(actorRole, 'content', 'update')) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const { label, customUrl, groupKey, displayOrder, isEnabled, parentId } = body;

    try {
      const updatedItem = await db.update(navigationItems).set({
        label: label !== undefined ? label : undefined,
        customUrl: customUrl !== undefined ? customUrl : undefined,
        groupKey: groupKey !== undefined ? groupKey : undefined,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
        isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : undefined,
        parentId: parentId !== undefined ? parentId : undefined,
        updatedAt: new Date()
      }).where(eq(navigationItems.id, id)).returning();

      if (!updatedItem.length) {
        return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });
      }

      await db.insert(auditLogs).values({
        id: crypto.randomUUID().replace(/-/g, ''),
        action: 'navigation_item_updated',
        entityType: 'navigation',
        entityId: id,
        actorId: authSession.user.id,
        details: { updatedFields: Object.keys(body).filter(k => k !== 'action') },
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return new Response(JSON.stringify({ ok: true, item: updatedItem[0] }), { status: 200 });
    } catch (error: any) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
}

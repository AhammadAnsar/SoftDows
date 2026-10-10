import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getAuth } from '../../../../lib/auth';
import { requirePermission, isStaffRole } from '../../../../lib/auth/authorization';
import { getDb } from '../../../../lib/db';
import { supportTickets, supportMessages } from '../../../../lib/db/schema/support';
import { auditLogs } from '../../../../lib/db/schema/audit';
import { eq } from 'drizzle-orm';
import type { AppRole } from '../../../../lib/auth/permissions';

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const _env = env as any;
    const auth = getAuth(_env);
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: 'Ticket ID is required' }), { status: 400 });
    }

    const body = (await request.json()) as any;
    const { message, visibility = 'public' } = body;

    if (!message?.trim()) {
      return new Response(JSON.stringify({ ok: false, error: 'Message is required' }), { status: 400 });
    }

    if (visibility !== 'public' && visibility !== 'internal') {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid visibility' }), { status: 400 });
    }

    const role = session.user.role as AppRole;
    
    // Auth + RBAC check
    if (visibility === 'internal') {
      const canUpdate = requirePermission(role, 'support', 'update');
      if (!canUpdate || !isStaffRole(role)) {
        return new Response(JSON.stringify({ ok: false, error: 'Forbidden: internal notes require staff role' }), { status: 403 });
      }
    } else {
      const canCreate = requirePermission(role, 'support', 'create');
      const canUpdate = requirePermission(role, 'support', 'update');
      if (!canCreate && !canUpdate) {
        return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), { status: 403 });
      }
    }

    const db = getDb(_env.DB);
    
    // Validate ticket exists
    const ticket = await db.query.supportTickets.findFirst({
      where: eq(supportTickets.id, id)
    });
    if (!ticket) {
      return new Response(JSON.stringify({ ok: false, error: 'Ticket not found' }), { status: 404 });
    }

    const messageId = crypto.randomUUID().replace(/-/g, '');
    const now = new Date();

    const insertMessage = db.insert(supportMessages).values({
      id: messageId,
      ticketId: id,
      message,
      senderId: session.user.id,
      visibility,
      createdAt: now,
      updatedAt: now
    });

    const updateTicket = db.update(supportTickets)
      .set({ updatedAt: now })
      .where(eq(supportTickets.id, id));

    const batchOps: any[] = [insertMessage, updateTicket];

    if (visibility === 'internal') {
      const logId = crypto.randomUUID().replace(/-/g, '');
      const insertAudit = db.insert(auditLogs).values({
        id: logId,
        actorId: session.user.id,
        action: 'add_internal_note',
        entityType: 'support_ticket',
        entityId: id,
        details: JSON.stringify({ messageId }),
        createdAt: now
      });
      batchOps.push(insertAudit);
    }

    await db.batch(batchOps as any);

    return new Response(JSON.stringify({ ok: true, messageId }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error adding ticket reply:', error);
    return new Response(JSON.stringify({ ok: false, error: error.message || 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

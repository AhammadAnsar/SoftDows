import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getAuth } from '../../../../lib/auth';
import { requirePermission } from '../../../../lib/auth/authorization';
import { getDb } from '../../../../lib/db';
import { supportTickets } from '../../../../lib/db/schema/support';
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

    const hasPermission = requirePermission(session.user.role as AppRole, 'support', 'update');
    if (!hasPermission) {
      return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: 'Ticket ID is required' }), { status: 400 });
    }

    const body = (await request.json()) as any;
    const { status } = body;

    const validStatuses = ['open', 'in_progress', 'waiting_for_client', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid status' }), { status: 400 });
    }

    const db = getDb(_env.DB);
    
    // Validate ticket exists
    const ticket = await db.query.supportTickets.findFirst({
      where: eq(supportTickets.id, id)
    });
    if (!ticket) {
      return new Response(JSON.stringify({ ok: false, error: 'Ticket not found' }), { status: 404 });
    }

    const logId = crypto.randomUUID().replace(/-/g, '');
    const now = new Date();
    
    const updateData: any = {
      status,
      updatedAt: now
    };

    if (status === 'resolved') {
      updateData.resolvedAt = now;
    } else if (status === 'closed') {
      updateData.closedAt = now;
    }

    const updateTicket = db.update(supportTickets)
      .set(updateData)
      .where(eq(supportTickets.id, id));

    const insertAudit = db.insert(auditLogs).values({
      id: logId,
      actorId: session.user.id,
      action: 'update_ticket_status',
      entityType: 'support_ticket',
      entityId: id,
      details: JSON.stringify({ 
        previousStatus: ticket.status,
        newStatus: status 
      }),
      createdAt: now
    });

    await db.batch([updateTicket, insertAudit]);

    return new Response(JSON.stringify({ ok: true, status }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error updating ticket status:', error);
    return new Response(JSON.stringify({ ok: false, error: error.message || 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

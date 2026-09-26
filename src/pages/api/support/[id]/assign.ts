import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getAuth } from '../../../../lib/auth';
import { requirePermission, isStaffRole } from '../../../../lib/auth/authorization';
import { getDb } from '../../../../lib/db';
import { supportTickets } from '../../../../lib/db/schema/support';
import { auditLogs } from '../../../../lib/db/schema/audit';
import { user } from '../../../../lib/db/schema/auth';
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
    const { assignedToId } = body;

    const db = getDb(_env.DB);
    
    // Validate ticket exists
    const ticket = await db.query.supportTickets.findFirst({
      where: eq(supportTickets.id, id)
    });
    if (!ticket) {
      return new Response(JSON.stringify({ ok: false, error: 'Ticket not found' }), { status: 404 });
    }

    let assignedToUser = null;
    if (assignedToId) {
      assignedToUser = await db.query.user.findFirst({
        where: eq(user.id, assignedToId)
      });
      if (!assignedToUser) {
        return new Response(JSON.stringify({ ok: false, error: 'Assigned user not found' }), { status: 404 });
      }
      if (!isStaffRole(assignedToUser.role as AppRole)) {
        return new Response(JSON.stringify({ ok: false, error: 'Can only assign tickets to staff' }), { status: 400 });
      }
    }

    const logId = crypto.randomUUID().replace(/-/g, '');

    const updateTicket = db.update(supportTickets)
      .set({ 
        assignedToId: assignedToId || null,
        updatedAt: new Date()
      })
      .where(eq(supportTickets.id, id));

    const insertAudit = db.insert(auditLogs).values({
      id: logId,
      actorId: session.user.id,
      action: 'assign_ticket',
      entityType: 'support_ticket',
      entityId: id,
      details: JSON.stringify({ 
        previousAssignedToId: ticket.assignedToId,
        newAssignedToId: assignedToId || null 
      }),
      createdAt: new Date()
    });

    await db.batch([updateTicket, insertAudit]);

    return new Response(JSON.stringify({ ok: true, assignedToId: assignedToId || null }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error assigning ticket:', error);
    return new Response(JSON.stringify({ ok: false, error: error.message || 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

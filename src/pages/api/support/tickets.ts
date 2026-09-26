import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getAuth } from '../../../lib/auth';
import { requirePermission } from '../../../lib/auth/authorization';
import { getDb } from '../../../lib/db';
import { supportTickets } from '../../../lib/db/schema/support';
import { clients } from '../../../lib/db/schema/crm';
import { projects } from '../../../lib/db/schema/agency';
import { auditLogs } from '../../../lib/db/schema/audit';
import { eq } from 'drizzle-orm';
import type { AppRole } from '../../../lib/auth/permissions';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const _env = env as any;
  const auth = getAuth(_env);
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (!requirePermission(session.user.role as AppRole, 'support', 'create')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  let body: any;
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 }); }

  const { clientId, projectId, subject, description, category = 'general', priority = 'medium' } = body;

  if (!clientId) return new Response(JSON.stringify({ error: 'clientId is required' }), { status: 400 });
  if (!subject?.trim()) return new Response(JSON.stringify({ error: 'subject is required' }), { status: 400 });
  if (!description?.trim()) return new Response(JSON.stringify({ error: 'description is required' }), { status: 400 });

  const validCategories = ['general', 'technical', 'billing', 'feature_request', 'bug_report'];
  if (!validCategories.includes(category)) return new Response(JSON.stringify({ error: 'Invalid category' }), { status: 400 });

  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!validPriorities.includes(priority)) return new Response(JSON.stringify({ error: 'Invalid priority' }), { status: 400 });

  const db = getDb(_env.DB);

  const client = await db.select().from(clients).where(eq(clients.id, clientId)).get();
  if (!client) return new Response(JSON.stringify({ error: 'Client not found' }), { status: 404 });

  if (projectId) {
    const project = await db.select().from(projects).where(eq(projects.id, projectId)).get();
    if (!project) return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 });
  }

  const ticketId = crypto.randomUUID().replace(/-/g, '');
  const auditId = crypto.randomUUID().replace(/-/g, '');
  const now = new Date();
  const ticketNumber = `TK-${now.getFullYear()}-${String(Date.now()).slice(-6)}`;

  await db.batch([
    db.insert(supportTickets).values({
      id: ticketId,
      ticketNumber,
      clientId,
      projectId: projectId || null,
      subject: subject.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'open',
      createdById: session.user.id,
    }),
    db.insert(auditLogs).values({
      id: auditId,
      action: 'ticket_created',
      entityType: 'support_ticket',
      entityId: ticketId,
      details: JSON.stringify({ ticketNumber, subject }) as any,
      actorId: session.user.id,
    }),
  ] as any);

  return new Response(JSON.stringify({ ok: true, ticketId, ticketNumber }), { status: 201 });
};

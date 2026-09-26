import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getAuth } from '../../../../lib/auth';
import { getAuthorizedClientContext } from '../../../../lib/portal/auth';
import { getDb } from '../../../../lib/db';
import { supportTickets } from '../../../../lib/db/schema/support';
import { projects } from '../../../../lib/db/schema/agency';
import { auditLogs } from '../../../../lib/db/schema/audit';
import { eq, and } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const _env = (locals as any).runtime?.env || (globalThis as any).process?.env || env as any;
  const auth = getAuth(_env);
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const db = getDb(_env.DB);
  const ctx = await getAuthorizedClientContext(db, session.user.id);
  if (!ctx.authorized) {
    return new Response(JSON.stringify({ error: 'Forbidden - No linked client' }), { status: 403 });
  }

  let body: any;
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 }); }

  const { projectId, subject, description, category = 'general' } = body;
  const clientId = ctx.clientId; // HARD ENFORCED FROM AUTH CONTEXT

  if (!subject?.trim()) return new Response(JSON.stringify({ error: 'subject is required' }), { status: 400 });
  if (!description?.trim()) return new Response(JSON.stringify({ error: 'description is required' }), { status: 400 });

  const validCategories = ['general', 'technical', 'billing', 'feature_request', 'bug_report'];
  if (!validCategories.includes(category)) return new Response(JSON.stringify({ error: 'Invalid category' }), { status: 400 });

  if (projectId) {
    const project = await db.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.clientId, clientId as string))).get();
    if (!project) return new Response(JSON.stringify({ error: 'Project not found or not owned' }), { status: 404 });
  }

  const ticketId = crypto.randomUUID().replace(/-/g, '');
  const auditId = crypto.randomUUID().replace(/-/g, '');
  const now = new Date();
  const ticketNumber = `TK-${now.getFullYear()}-${String(Date.now()).slice(-6)}`;

  await db.batch([
    db.insert(supportTickets).values({ // @ts-ignore

      id: ticketId,
      ticketNumber,
      clientId: clientId as string,
      projectId: projectId || null,
      subject: subject.trim(),
      description: description.trim(),
      category,
      priority: 'medium', // Client cannot set priority
      status: 'open',
      createdById: session.user.id,
    }),
    db.insert(auditLogs).values({
      id: auditId,
      action: 'ticket_created_portal',
      entityType: 'support_ticket',
      entityId: ticketId,
      details: JSON.stringify({ ticketNumber, subject }) as any,
      actorId: session.user.id,
    }),
  ] as any);

  return new Response(JSON.stringify({ ok: true, ticketId, ticketNumber }), { status: 201 });
};

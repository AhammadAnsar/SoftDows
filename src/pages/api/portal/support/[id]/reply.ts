import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getAuth } from '../../../../../lib/auth';
import { getAuthorizedClientContext } from '../../../../../lib/portal/auth';
import { getDb } from '../../../../../lib/db';
import { supportTickets, supportMessages } from '../../../../../lib/db/schema/support';
import { auditLogs } from '../../../../../lib/db/schema/audit';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request, params, locals }) => {
  const _env = (locals as any).runtime?.env || (globalThis as any).process?.env || env as any;
  const auth = getAuth(_env);
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id: ticketId } = params;
  if (!ticketId) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  const db = getDb(_env.DB);
  const ctx = await getAuthorizedClientContext(db, session.user.id);
  if (!ctx.authorized) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const ticket = await db.select().from(supportTickets).where(eq(supportTickets.id, ticketId)).get();
  if (!ticket || ticket.clientId !== ctx.clientId) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  let body: any;
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 }); }

  const { message } = body;
  if (!message?.trim()) return new Response(JSON.stringify({ error: 'message is required' }), { status: 400 });

  const messageId = crypto.randomUUID().replace(/-/g, '');
  const auditId = crypto.randomUUID().replace(/-/g, '');

  await db.batch([
    db.insert(supportMessages).values({
      id: messageId,
      ticketId,
      message: message.trim(),
      senderId: session.user.id,
      visibility: 'public', // Hardcoded for clients - they cannot create internal notes
    }),
    db.insert(auditLogs).values({
      id: auditId,
      action: 'ticket_replied_portal',
      entityType: 'support_ticket',
      entityId: ticketId,
      details: JSON.stringify({ messageId }) as any,
      actorId: session.user.id,
    }),
  ] as any);

  return new Response(JSON.stringify({ ok: true, messageId }), { status: 201 });
};

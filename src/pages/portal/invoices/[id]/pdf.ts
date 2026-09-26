import type { APIRoute } from 'astro';
import { getAuth } from '../../../../lib/auth';
import { getAuthorizedClientContext } from '../../../../lib/portal/auth';
import { getDb } from '../../../../lib/db';
import { invoices, invoiceItems } from '../../../../lib/db/schema/billing';
import { clients } from '../../../../lib/db/schema/crm';
import { eq } from 'drizzle-orm';
import { generateDocumentPdf } from '../../../../lib/pdf/generator';

export const GET: APIRoute = async ({ request, params, locals }) => {
  const env = (locals as any).runtime?.env || (globalThis as any).process?.env || {};
  const auth = getAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  
  if (!session) return new Response('Unauthorized', { status: 401 });
  
  const db = getDb(env.DB);
  const ctx = await getAuthorizedClientContext(db, session.user.id);
  if (!ctx.authorized) return new Response('Forbidden', { status: 403 });

  const { id } = params;
  if (!id) return new Response('Not found', { status: 404 });

  const invoice = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1).then(r => r[0]);
  if (!invoice) return new Response('Not found', { status: 404 });

  if (invoice.clientId !== ctx.clientId) {
    return new Response('Not found', { status: 404 }); // Do not leak existence
  }

  const client = await db.select().from(clients).where(eq(clients.id, invoice.clientId)).limit(1).then(r => r[0]);
  const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id));

  const pdfBytes = await generateDocumentPdf({
    number: invoice.invoiceNumber,
    issueDate: invoice.issueDate,
    clientName: client?.name || 'Unknown',
    subtotal: invoice.subtotal,
    tax: invoice.tax,
    total: invoice.total,
    items
  }, 'Invoice');

  return new Response(pdfBytes as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Invoice-${invoice.invoiceNumber}.pdf"`
    }
  });
};

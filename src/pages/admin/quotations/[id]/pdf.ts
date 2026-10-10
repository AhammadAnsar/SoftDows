
import type { APIRoute } from 'astro';
import { getAuth } from '../../../../lib/auth';
import { requirePermission } from '../../../../lib/auth/authorization';
import { getDb } from '../../../../lib/db';
import { quotations, quotationItems } from '../../../../lib/db/schema/billing';
import { clients } from '../../../../lib/db/schema/crm';
import { eq } from 'drizzle-orm';
import { generateDocumentPdf } from '../../../../lib/pdf/generator';

export const GET: APIRoute = async ({ request, params, locals }) => {
  const env = (locals as any).runtime?.env || (globalThis as any).process?.env || {};
  const auth = getAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  
  if (!session) return new Response('Unauthorized', { status: 401 });
  requirePermission(session.user.role as any, 'quotations', 'read');

  const { id } = params;
  if (!id) return new Response('Not found', { status: 404 });

  const db = getDb(env.DB);
  const quotation = await db.select().from(quotations).where(eq(quotations.id, id)).limit(1).then(r => r[0]);
  if (!quotation) return new Response('Not found', { status: 404 });

  const client = await db.select().from(clients).where(eq(clients.id, quotation.clientId)).limit(1).then(r => r[0]);
  const items = await db.select().from(quotationItems).where(eq(quotationItems.quotationId, id));

  const pdfBytes = await generateDocumentPdf({
    number: quotation.quotationNumber,
    issueDate: quotation.issueDate,
    clientName: client?.name || 'Unknown',
    subtotal: quotation.subtotal,
    tax: quotation.tax,
    total: quotation.total,
    notes: quotation.notes,
    terms: quotation.terms,
    items
  }, 'Quotation');

  return new Response(pdfBytes as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Quotation-${quotation.quotationNumber}.pdf"`
    }
  });
};

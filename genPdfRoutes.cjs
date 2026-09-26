const fs = require('fs');
const path = require('path');

const qDir = './src/pages/admin/quotations/[id]';
const iDir = './src/pages/admin/invoices/[id]';
[qDir, iDir].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

fs.writeFileSync(path.join(qDir, 'pdf.ts'), `
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
    items
  }, 'Quotation');

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': \`attachment; filename="Quotation-\${quotation.quotationNumber}.pdf"\`
    }
  });
};
`);

fs.writeFileSync(path.join(iDir, 'pdf.ts'), `
import type { APIRoute } from 'astro';
import { getAuth } from '../../../../lib/auth';
import { requirePermission } from '../../../../lib/auth/authorization';
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
  requirePermission(session.user.role as any, 'invoices', 'read');

  const { id } = params;
  if (!id) return new Response('Not found', { status: 404 });

  const db = getDb(env.DB);
  const invoice = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1).then(r => r[0]);
  if (!invoice) return new Response('Not found', { status: 404 });

  const client = await db.select().from(clients).where(eq(clients.id, invoice.clientId)).limit(1).then(r => r[0]);
  const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id));

  const pdfBytes = await generateDocumentPdf({
    number: invoice.invoiceNumber,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    clientName: client?.name || 'Unknown',
    subtotal: invoice.subtotal,
    tax: invoice.tax,
    total: invoice.total,
    amountPaid: invoice.amountPaid,
    balanceDue: invoice.balanceDue,
    items
  }, 'Invoice');

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': \`attachment; filename="Invoice-\${invoice.invoiceNumber}.pdf"\`
    }
  });
};
`);
console.log('PDF routes created.');

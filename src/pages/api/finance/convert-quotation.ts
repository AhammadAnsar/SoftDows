import type { APIRoute } from 'astro';
import { getAuth } from '../../../lib/auth';
import { requirePermission } from '../../../lib/auth/authorization';
import { getDb } from '../../../lib/db';
import { quotations, quotationItems, invoices, invoiceItems } from '../../../lib/db/schema/billing';
import { auditLogs } from '../../../lib/db/schema/audit';
import { eq } from 'drizzle-orm';
import { isQuotationConvertible, generateId } from '../../../lib/finance/calculations';
import { env } from 'cloudflare:workers';

/**
 * POST /api/finance/convert-quotation
 *
 * Converts an accepted quotation into a new invoice.
 * Uses db.batch() for D1-safe atomicity — all statements succeed or none do.
 * Duplicate conversion is blocked by the UNIQUE constraint on invoices.quotation_id
 * plus a pre-check for idempotency.
 */
export const POST: APIRoute = async ({ request }) => {
  const _env = env as any;

  // 1. Auth
  const auth = getAuth(_env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // 2. RBAC — must have invoices:create
  const role = session.user.role as any;
  if (!requirePermission(role, 'invoices', 'create')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  // 3. Parse body
  let body: { quotationId: string; dueDate?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const { quotationId } = body;
  if (!quotationId) {
    return new Response(JSON.stringify({ error: 'quotationId is required' }), { status: 400 });
  }

  const db = getDb(_env.DB);

  // 4. Fetch quotation
  const quotation = await db.select().from(quotations).where(eq(quotations.id, quotationId)).get();
  if (!quotation) {
    return new Response(JSON.stringify({ error: 'Quotation not found' }), { status: 404 });
  }

  // 5. Must be accepted
  if (!isQuotationConvertible(quotation.status)) {
    return new Response(
      JSON.stringify({ error: `Quotation status '${quotation.status}' is not eligible for conversion. Must be 'accepted'.` }),
      { status: 422 }
    );
  }

  // 6. Check duplicate conversion — if an invoice already references this quotation, return idempotent success
  const existingInvoice = await db.select({ id: invoices.id, num: invoices.invoiceNumber })
    .from(invoices)
    .where(eq(invoices.quotationId, quotationId))
    .get();

  if (existingInvoice) {
    return new Response(
      JSON.stringify({ ok: true, invoiceId: existingInvoice.id, invoiceNumber: existingInvoice.num, duplicate: true }),
      { status: 200 }
    );
  }

  // 7. Fetch line items
  const items = await db.select().from(quotationItems).where(eq(quotationItems.quotationId, quotationId));

  // 8. Generate invoice
  const invoiceId = generateId();
  const now = new Date();
  const invoiceNumber = `INV-${now.getFullYear()}-${String(Date.now()).slice(-6)}`;
  const dueDate = body.dueDate ? new Date(body.dueDate) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default

  // Build batch statements
  const invoiceItemStatements = items.map((item: any) =>
    db.insert(invoiceItems).values({
      id: generateId(),
      invoiceId,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
      displayOrder: item.displayOrder,
    })
  );

  const auditId = generateId();

  // 9. Atomic batch — insert invoice + items + audit in one round-trip
  await db.batch([
    db.insert(invoices).values({
      id: invoiceId,
      invoiceNumber,
      clientId: quotation.clientId,
      projectId: quotation.projectId,
      quotationId: quotation.id,
      currency: quotation.currency,
      issueDate: now,
      dueDate,
      status: 'issued',
      subtotal: quotation.subtotal,
      discount: quotation.discount,
      tax: quotation.tax,
      total: quotation.total,
      amountPaid: 0,
      balanceDue: quotation.total,
    }),
    ...invoiceItemStatements,
    db.insert(auditLogs).values({
      id: auditId,
      action: 'quotation_converted_to_invoice',
      entityType: 'quotation',
      entityId: quotation.id,
      details: JSON.stringify({ invoiceId, invoiceNumber, quotationNumber: quotation.quotationNumber }) as any,
      actorId: session.user.id,
    }),
  ] as any);

  return new Response(
    JSON.stringify({ ok: true, invoiceId, invoiceNumber, duplicate: false }),
    { status: 201 }
  );
};

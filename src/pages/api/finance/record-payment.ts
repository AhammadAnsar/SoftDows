import type { APIRoute } from 'astro';
import { getAuth } from '../../../lib/auth';
import { requirePermission } from '../../../lib/auth/authorization';
import { getDb } from '../../../lib/db';
import { invoices, payments } from '../../../lib/db/schema/billing';
import { auditLogs } from '../../../lib/db/schema/audit';
import { eq, sql } from 'drizzle-orm';
import { validatePaymentAmount, isInvoicePayable, deriveInvoiceStatus, generateId } from '../../../lib/finance/calculations';
import { env } from 'cloudflare:workers';

/**
 * POST /api/finance/record-payment
 *
 * Records a payment against an invoice.
 * Uses a conditional UPDATE + INSERT inside db.batch() for atomicity.
 * The UPDATE uses a WHERE clause that re-checks balance_due >= amount,
 * so a concurrent request that would cause overpayment simply updates 0 rows.
 */
export const POST: APIRoute = async ({ request }) => {
  const _env = env as any;

  // 1. Auth
  const auth = getAuth(_env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // 2. RBAC — must have payments:record
  const role = session.user.role as any;
  if (!requirePermission(role, 'payments', 'record')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  // 3. Parse body
  let body: {
    invoiceId: string;
    clientId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    reference?: string;
    notes?: string;
    paymentDate?: string;
  };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  if (!body.invoiceId || !body.clientId || !body.amount || !body.currency || !body.paymentMethod) {
    return new Response(
      JSON.stringify({ error: 'invoiceId, clientId, amount, currency, paymentMethod are required' }),
      { status: 400 }
    );
  }

  const db = getDb(_env.DB);

  // 4. Fetch invoice — server-side source of truth
  const invoice = await db.select().from(invoices).where(eq(invoices.id, body.invoiceId)).get();
  if (!invoice) {
    return new Response(JSON.stringify({ error: 'Invoice not found' }), { status: 404 });
  }

  // 5. Client must match
  if (invoice.clientId !== body.clientId) {
    return new Response(JSON.stringify({ error: 'Client does not match invoice' }), { status: 422 });
  }

  // 6. Currency must match
  if (invoice.currency !== body.currency) {
    return new Response(
      JSON.stringify({ error: `Currency mismatch: payment '${body.currency}' vs invoice '${invoice.currency}'` }),
      { status: 422 }
    );
  }

  // 7. Invoice must be payable
  if (!isInvoicePayable(invoice.status)) {
    return new Response(
      JSON.stringify({ error: `Invoice status '${invoice.status}' is not eligible for payment` }),
      { status: 422 }
    );
  }

  // 8. Validate amount server-side (never trust browser)
  const serverBalanceDue = (invoice.total ?? 0) - (invoice.amountPaid ?? 0);
  const validation = validatePaymentAmount(body.amount, serverBalanceDue);
  if (!validation.valid) {
    return new Response(JSON.stringify({ error: validation.error }), { status: 422 });
  }

  const paymentId = generateId();
  const paymentDate = body.paymentDate ? new Date(body.paymentDate) : new Date();
  const newAmountPaid = (invoice.amountPaid ?? 0) + body.amount;
  const newBalanceDue = (invoice.total ?? 0) - newAmountPaid;
  const newStatus = deriveInvoiceStatus(invoice.total ?? 0, newAmountPaid);
  const auditId = generateId();

  // 9. Atomic batch: conditional invoice update + payment insert + audit
  //    The UPDATE WHERE balance_due >= amount is the concurrency guard.
  //    If a concurrent payment already reduced balance_due, this UPDATE
  //    affects 0 rows, and we detect the race below.
  await db.batch([
    db.update(invoices)
      .set({
        amountPaid: newAmountPaid,
        balanceDue: newBalanceDue,
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(
        sql`${invoices.id} = ${body.invoiceId} AND ${invoices.balanceDue} >= ${body.amount}`
      ),
    db.insert(payments).values({
      id: paymentId,
      invoiceId: body.invoiceId,
      clientId: body.clientId,
      amount: body.amount,
      currency: body.currency,
      paymentDate,
      paymentMethod: body.paymentMethod,
      reference: body.reference || null,
      notes: body.notes || null,
      status: 'completed',
      recordedById: session.user.id,
    }),
    db.insert(auditLogs).values({
      id: auditId,
      action: 'payment_recorded',
      entityType: 'invoice',
      entityId: body.invoiceId,
      details: JSON.stringify({
        paymentId,
        amount: body.amount,
        method: body.paymentMethod,
        newAmountPaid,
        newBalanceDue,
        newStatus,
      }) as any,
      actorId: session.user.id,
    }),
  ] as any);

  // 10. Verify the conditional update actually applied (concurrency check)
  const updatedInvoice = await db.select({ amountPaid: invoices.amountPaid }).from(invoices).where(eq(invoices.id, body.invoiceId)).get();
  if (updatedInvoice && updatedInvoice.amountPaid !== newAmountPaid) {
    // The conditional UPDATE didn't apply — concurrent race.
    // The payment was inserted but the invoice wasn't updated.
    // Roll back the orphaned payment.
    await db.delete(payments).where(eq(payments.id, paymentId));
    return new Response(
      JSON.stringify({ error: 'Concurrent payment detected. Please retry.' }),
      { status: 409 }
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      paymentId,
      amountPaid: newAmountPaid,
      balanceDue: newBalanceDue,
      invoiceStatus: newStatus,
    }),
    { status: 201 }
  );
};

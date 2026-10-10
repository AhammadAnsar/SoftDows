import type { APIRoute } from 'astro';
import { getAuth } from '../../../../lib/auth';
import { requirePermission } from '../../../../lib/auth/authorization';
import { getDb } from '../../../../lib/db';
import { payments, invoices } from '../../../../lib/db/schema/billing';
import { clients } from '../../../../lib/db/schema/crm';
import { eq } from 'drizzle-orm';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const GET: APIRoute = async ({ request, params, locals }) => {
  const env = (locals as any).runtime?.env || (globalThis as any).process?.env || {};
  const auth = getAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  
  if (!session) return new Response('Unauthorized', { status: 401 });
  requirePermission(session.user.role as any, 'payments', 'read');

  const { id } = params;
  if (!id) return new Response('Not found', { status: 404 });

  const db = getDb(env.DB);
  const payment = await db.select().from(payments).where(eq(payments.id, id)).limit(1).then(r => r[0]);
  if (!payment) return new Response('Not found', { status: 404 });

  const client = await db.select().from(clients).where(eq(clients.id, payment.clientId)).limit(1).then(r => r[0]);
  const invoice = payment.invoiceId ? await db.select().from(invoices).where(eq(invoices.id, payment.invoiceId)).limit(1).then(r => r[0]) : null;

  // Generate Payment Receipt PDF
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();
  
  const margin = 50;
  let y = height - margin;

  page.drawText('SoftDows', { x: margin, y, size: 24, font: boldFont, color: rgb(0.14, 0.16, 0.34) });
  page.drawText('PAYMENT RECEIPT', { x: width - margin - 150, y, size: 16, font: boldFont, color: rgb(0.4, 0.4, 0.4) });
  
  y -= 40;
  page.drawText(`Receipt ID: ${payment.id.substring(0,8)}`, { x: width - margin - 150, y, size: 10, font });
  y -= 15;
  page.drawText(`Date: ${new Date(payment.paymentDate).toLocaleDateString()}`, { x: width - margin - 150, y, size: 10, font });
  
  y -= 20;
  page.drawText('Received From:', { x: margin, y, size: 12, font: boldFont });
  y -= 15;
  page.drawText(client?.name || 'Unknown', { x: margin, y, size: 10, font });
  
  y -= 40;
  
  page.drawText('Payment Details', { x: margin, y, size: 12, font: boldFont });
  y -= 20;
  page.drawText(`Amount: ${(payment.amount / 100).toFixed(2)} ${payment.currency}`, { x: margin, y, size: 10, font });
  y -= 15;
  page.drawText(`Method: ${payment.paymentMethod}`, { x: margin, y, size: 10, font });
  y -= 15;
  page.drawText(`Reference: ${payment.reference || 'N/A'}`, { x: margin, y, size: 10, font });
  if (invoice) {
    y -= 15;
    page.drawText(`Applied to Invoice: ${invoice.invoiceNumber}`, { x: margin, y, size: 10, font });
  }

  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Receipt-${payment.id.substring(0,8)}.pdf"`
    }
  });
};

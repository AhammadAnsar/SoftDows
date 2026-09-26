/**
 * Financial Calculation Helpers — Single Source of Truth
 *
 * All monetary values are integer minor units (cents).
 * Quantities may be fractional (e.g., 2.5 hours).
 * Rounding uses Math.round (banker-friendly for half-cent splits).
 */

/** Calculate line total from fractional quantity × unit price (minor units). */
export function calculateLineTotal(quantity: number, unitPriceMinor: number): number {
  return Math.round(quantity * unitPriceMinor);
}

/** Sum line totals to compute subtotal. */
export function calculateSubtotal(items: { quantity: number; unitPriceMinor: number }[]): number {
  let subtotal = 0;
  for (const item of items) {
    subtotal += calculateLineTotal(item.quantity, item.unitPriceMinor);
  }
  return subtotal;
}

/** Calculate tax from a taxable base (subtotal − discount). */
export function calculateTax(subtotal: number, discountMinor: number, taxRate: number): number {
  const taxableBase = Math.max(0, subtotal - discountMinor);
  return Math.round(taxableBase * taxRate);
}

/** Full document totals. */
export function calculateDocumentTotals(
  items: { quantity: number; unitPriceMinor: number }[],
  discountMinor: number = 0,
  taxRate: number = 0
): { subtotal: number; discount: number; tax: number; total: number } {
  const subtotal = calculateSubtotal(items);
  const discount = Math.max(0, discountMinor);
  const tax = calculateTax(subtotal, discount, taxRate);
  const total = Math.max(0, subtotal - discount) + tax;
  return { subtotal, discount, tax, total };
}

// ──────────────────────────────────────────────────
// Validation helpers
// ──────────────────────────────────────────────────

const VALID_QUOTATION_STATUSES = ['draft', 'sent', 'accepted', 'rejected', 'expired', 'cancelled'] as const;
const VALID_INVOICE_STATUSES = ['draft', 'issued', 'partially_paid', 'paid', 'overdue', 'cancelled'] as const;
const VALID_PAYMENT_STATUSES = ['pending', 'completed', 'failed', 'refunded'] as const;

export type QuotationStatus = (typeof VALID_QUOTATION_STATUSES)[number];
export type InvoiceStatus = (typeof VALID_INVOICE_STATUSES)[number];
export type PaymentStatus = (typeof VALID_PAYMENT_STATUSES)[number];

/** A quotation can be converted to an invoice only if it has been accepted. */
export function isQuotationConvertible(status: string): boolean {
  return status === 'accepted';
}

/** An invoice can receive payments when it is issued or partially_paid. */
export function isInvoicePayable(status: string): boolean {
  return status === 'issued' || status === 'partially_paid';
}

/** Derive invoice status from payment amounts. */
export function deriveInvoiceStatus(total: number, amountPaid: number): InvoiceStatus {
  if (amountPaid <= 0) return 'issued';
  if (amountPaid >= total) return 'paid';
  return 'partially_paid';
}

/** Validate a payment amount is positive and does not exceed balance. */
export function validatePaymentAmount(
  amountMinor: number,
  balanceDueMinor: number
): { valid: boolean; error?: string } {
  if (!Number.isFinite(amountMinor) || amountMinor <= 0) {
    return { valid: false, error: 'Payment amount must be a positive number' };
  }
  if (!Number.isInteger(amountMinor)) {
    return { valid: false, error: 'Payment amount must be in minor units (integer)' };
  }
  if (amountMinor > balanceDueMinor) {
    return { valid: false, error: `Payment amount (${amountMinor}) exceeds outstanding balance (${balanceDueMinor})` };
  }
  return { valid: true };
}

/** Generate a unique ID (crypto-safe, no external deps). */
export function generateId(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

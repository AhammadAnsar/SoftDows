import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { id, timestamps, money } from './utils';
import { clients } from './crm';
import { projects } from './agency';

export const quotations = sqliteTable('quotations', {
  id: id(),
  quotationNumber: text('quotation_number').notNull().unique(), // Human-readable e.g., Q-2026-001
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'restrict' }),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  currency: text('currency').notNull().default('USD'), // E.g., 'USD', 'BDT'
  issueDate: integer('issue_date', { mode: 'timestamp' }).notNull(), // Business Date
  expiryDate: integer('expiry_date', { mode: 'timestamp' }), // Business Date
  status: text('status', { enum: ['draft', 'issued', 'accepted', 'declined', 'expired', 'cancelled'] }).notNull().default('draft'),
  subtotal: money('subtotal').notNull().default(0), // Minor units
  discount: money('discount').notNull().default(0), // Minor units
  tax: money('tax').notNull().default(0), // Minor units
  total: money('total').notNull().default(0), // Minor units
  terms: text('terms'),
  notes: text('notes'),
  ...timestamps
});

export const quotationItems = sqliteTable('quotation_items', {
  id: id(),
  quotationId: text('quotation_id').notNull().references(() => quotations.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  quantity: real('quantity').notNull().default(1), // Changed to REAL to support 1.5 hours
  unitPrice: money('unit_price').notNull().default(0),
  lineTotal: money('line_total').notNull().default(0),
  displayOrder: integer('display_order').notNull().default(0),
  ...timestamps
});

export const invoices = sqliteTable('invoices', {
  id: id(),
  invoiceNumber: text('invoice_number').notNull().unique(), // Human-readable e.g., INV-2026-001
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'restrict' }),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  currency: text('currency').notNull().default('USD'),
  issueDate: integer('issue_date', { mode: 'timestamp' }).notNull(),
  dueDate: integer('due_date', { mode: 'timestamp' }).notNull(),
  status: text('status', { enum: ['draft', 'issued', 'partially_paid', 'paid', 'overdue', 'cancelled'] }).notNull().default('draft'),
  subtotal: money('subtotal').notNull().default(0),
  discount: money('discount').notNull().default(0),
  tax: money('tax').notNull().default(0),
  total: money('total').notNull().default(0),
  amountPaid: money('amount_paid').notNull().default(0),
  balanceDue: money('balance_due').notNull().default(0),
  notes: text('notes'),
  ...timestamps
});

export const invoiceItems = sqliteTable('invoice_items', {
  id: id(),
  invoiceId: text('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  quantity: real('quantity').notNull().default(1),
  unitPrice: money('unit_price').notNull().default(0),
  lineTotal: money('line_total').notNull().default(0),
  displayOrder: integer('display_order').notNull().default(0),
  ...timestamps
});

export const payments = sqliteTable('payments', {
  id: id(),
  invoiceId: text('invoice_id').notNull().references(() => invoices.id, { onDelete: 'restrict' }),
  amount: money('amount').notNull().default(0),
  currency: text('currency').notNull().default('USD'),
  paymentDate: integer('payment_date', { mode: 'timestamp' }).notNull(),
  paymentMethod: text('payment_method').notNull(), // E.g., 'Bank Transfer', 'Stripe'
  reference: text('reference'), // Transaction ID or receipt number
  notes: text('notes'),
  status: text('status', { enum: ['pending', 'completed', 'failed', 'refunded'] }).notNull().default('completed'),
  ...timestamps
});

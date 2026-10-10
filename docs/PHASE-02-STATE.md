# PHASE 02 STATE

**Status**: COMPLETE

## Completed Tasks

### Phase 02A — Schema & Index UIs
- Modified `quotations` to include `leadId`
- Modified `payments` to include `clientId` and `recordedById`
- `quotationItems` / `invoiceItems` support fractional quantities via `real()`
- Money stored as integer minor units via custom `money()` alias
- Generated migration `0006_smooth_baron_strucker.sql`
- Built index UIs for Quotations, Invoices, Payments

### Phase 02B — PDF & Authorization
- Installed `pdf-lib` for Cloudflare Workers-compatible PDF generation
- Created shared PDF generator (`src/lib/pdf/generator.ts`) using StandardFonts
- Created authorized PDF download endpoints:
  - `/admin/quotations/[id]/pdf.ts`
  - `/admin/invoices/[id]/pdf.ts`
- Server-side RBAC enforced on all PDF routes

### Phase 02C — Transaction Workflows & Tests
- Created canonical financial calculation module (`src/lib/finance/calculations.ts`):
  - `calculateLineTotal()` — fractional quantity × unit price with `Math.round`
  - `calculateSubtotal()` / `calculateTax()` / `calculateDocumentTotals()`
  - `validatePaymentAmount()` — rejects zero, negative, NaN, Infinity, non-integer, overpayment
  - `isQuotationConvertible()` / `isInvoicePayable()` / `deriveInvoiceStatus()`
  - `generateId()` — crypto.randomUUID
- Created Quotation→Invoice conversion endpoint (`/api/finance/convert-quotation.ts`):
  - Auth + RBAC (invoices:create)
  - Only `accepted` quotations eligible
  - Duplicate conversion returns idempotent success
  - Uses `db.batch()` for D1-safe atomicity (invoice + items + audit)
  - Preserves all financial values verbatim from quotation
- Created Payment recording endpoint (`/api/finance/record-payment.ts`):
  - Auth + RBAC (payments:record)
  - Server-side validation: client match, currency match, amount bounds
  - Conditional UPDATE WHERE balance_due >= amount as concurrency guard
  - `db.batch()` for atomic payment insert + invoice update + audit
  - Race detection with orphaned payment cleanup
- Comprehensive test suite (`tests/phase02c-financial.mjs`):
  - 49 tests, 11 suites, 0 failures
  - Covers: quantities (1, 2.5, 0.5, 0.333, 0, negative), money rounding,
    discounts (none, fixed, negative clamped, exceeding subtotal),
    tax (none, 10%, after-discount order, rounding), multi-item totals,
    quotation conversion (eligible statuses, value preservation, duplicate idempotency),
    payments (3-step partial→final, zero/negative/overpay/NaN/Infinity rejection),
    client/currency mismatch, transactional integrity (conditional UPDATE simulation),
    authorization (super_admin, admin, finance, support, content_editor, client, unauthenticated),
    PDF authorization, invoice payability states

## Migration
- `0006_smooth_baron_strucker.sql` — adds `quotation_id` to invoices, `client_id` + `recorded_by_id` to payments, `lead_id` to quotations
- No additional migration required (no new schema constraints needed)

## Verification
- `npm run check`: 0 errors, 0 warnings, 49 hints
- `npx wrangler deploy --dry-run`: PASS
- Test suite: 49/49 PASS
- Production migration: NOT applied (pending manual review)

## Next
- Phase 03

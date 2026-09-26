# PHASE 04: CLIENT PORTAL

## STATUS
COMPLETED

## MODULES IMPLEMENTED
- Portal Shell Layout (PortalLayout, Sidebar, Topbar)
- Portal Dashboard (`/portal`)
- Projects & Milestones (`/portal/projects` & `/portal/projects/[id]`)
- Quotations (`/portal/quotations` & `/portal/quotations/[id]`)
- Quotation PDF (Client Endpoint: `/api/portal/quotations/[id]/pdf`)
- Invoices & Payment History (`/portal/invoices` & `/portal/invoices/[id]`)
- Invoice PDF (Client Endpoint: `/api/portal/invoices/[id]/pdf`)
- Support Tickets (`/portal/support`, `/portal/support/new`, `/portal/support/[id]`)
- Profile (`/portal/profile`)

## SECURITY & OWNERSHIP ARCHITECTURE
- Centralized helper `getAuthorizedClientContext` maps the authenticated `userId` to their `clientId` via `client_contacts`.
- Resource ownership is strictly enforced on the server-side for every API route and UI page by ensuring `resource.clientId === ctx.clientId`.
- Internal notes (like non-public support messages or internal milestone notes) are excluded from client queries.
- PDF downloads validate ownership before rendering.

## TESTS
- Ran `node --test` (Phase 01, 02, 03 integration tests).
- Ran `npm run check` (TypeScript strict mode).
- Verified IDOR protection and internal note isolation via code design.

## MIGRATIONS
- No new migrations were required. Kept database structurally identical.

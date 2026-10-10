# SoftDows Database Schema

This document outlines the foundation of the Cloudflare D1 relational database architecture, powered by Drizzle ORM. 

## 1. Main Data Areas
The schema is partitioned into logical domains:
- **CRM (`crm.ts`)**: `leads`, `clients`, `client_contacts`. Manages inbound inquiries and active business relationships.
- **Agency Operations (`agency.ts`)**: `services`, `projects`, `project_services`, `project_milestones`, `project_updates`. Manages the core service delivery, tracking timelines and milestones.
- **Billing (`billing.ts`)**: `quotations`, `quotation_items`, `invoices`, `invoice_items`, `payments`. Tracks financial documents and manual/gateway payment records.
- **Files (`files.ts`)**: `files`. Stores relational metadata for deliverables securely hosted in Cloudflare R2.
- **Support (`support.ts`)**: `support_tickets`, `support_messages`. Facilitates Client-to-Admin helpdesk operations.
- **CMS (`cms.ts`)**: `site_settings`, `site_pages`, `page_sections`, `case_studies`, `case_study_services`, `articles`. Replaces the static markdown system with a strongly typed, relational content model.
- **Audit (`audit.ts`)**: `audit_logs`. Tracks critical system and data changes.

## 2. Key Relationships
- **Clients**: The central hub. Projects, Invoices, Quotations, and Support Tickets are directly tied to a Client.
- **Projects**: Optionally linkable to Invoices and Quotations. A Project links to multiple Services via the `project_services` junction table.
- **Invoices & Quotations**: Enforce cascading deletes for their line items (`invoice_items`, `quotation_items`), meaning if an invoice is deleted, its items are safely cleaned up.

## 3. Financial Data Safety
- **Minor Units:** ALL financial values (`amount`, `subtotal`, `tax`, `total`, `lineTotal`) are stored as safe **integers** (minor units, e.g. 125000 for $1,250.00). This strictly avoids dangerous floating-point math errors.
- **Currency Isolation:** Currency is stored explicitly (e.g., `'USD'`, `'BDT'`) on Invoices, Quotations, and Payments.

## 4. Archive & Delete Policy
- **Strict Foreign Keys**: Foreign keys explicitly dictate delete behaviors. 
- **Business Data Preservation**: We use `onDelete: 'restrict'` (or `set null` where optional) to prevent accidental cascading deletion of critical business history. For instance, if a `Service` is deleted from the CMS, it will NOT destroy historical Invoices that referenced it, and it cannot be deleted if a Project actively depends on it. 
- **Soft Deletes**: Entities like `clients` and `projects` utilize an `archived_at` timestamp and status enums (`'archived'`, `'cancelled'`) rather than hard deletion to ensure financial and audit continuity.

## 5. Auth-Dependent Items Deferred
Because Authentication (Better Auth) has not yet been implemented, the following relationships have been intentionally prepared but deferred:
- `client_contacts.userId`: Linking a portal user to a CRM contact.
- `project_updates.authorId`: Identifying which staff member posted an update.
- `files.uploadedById`: Tracking who uploaded a deliverable.
- `support_messages.senderId`: Knowing if a message came from a client or staff.
- `audit_logs.actorId`: Tracking exactly who performed a destructive/critical action.

## 6. Migrations Approach
- Migrations are generated securely via Drizzle Kit (`npx drizzle-kit generate`) based purely on schema definitions. 
- No fake production Cloudflare DB IDs are configured. Developers apply migrations locally using Wrangler's D1 local emulator during development.

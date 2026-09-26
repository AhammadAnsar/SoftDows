# SoftDows Full-Stack Digital Agency Architecture

This document defines the architecture for transforming SoftDows from a static marketing website into a complete digital agency platform.

## 1. System Overview
The platform consists of three integrated areas:
1.  **Public Website:** Extremely fast, SEO-friendly, and conversion-focused marketing frontend.
2.  **Admin Backend (`/admin/`):** Secure operational hub for staff to manage content, leads, clients, projects, billing, and support.
3.  **Client Portal (`/portal/`):** Minimal, secure dashboard for clients to view project progress, access files, pay invoices, and request support.

## 2. Technology Stack
The architecture is Cloudflare-native, combining zero-cost-first scalability with high performance.

*   **Framework:** Astro (Hybrid Rendering: Static for public pages, On-demand for Admin/Portal).
*   **Language:** TypeScript.
*   **Styling:** Tailwind CSS v4.
*   **Database:** Cloudflare D1 (Serverless SQLite).
*   **File Storage:** Cloudflare R2 (Object storage for private media and deliverables).
*   **Authentication:** Better Auth (Database-backed, session-based auth).
*   **Security:** Cloudflare Turnstile (Abuse protection on public forms and auth).
*   **Deployment:** Cloudflare Pages (with Workers for server-side logic).

## 3. Database Architecture (D1)
The data model uses a clean relational structure. Proposed core entities:
*   **Auth & Users:** `users`, `sessions`, `roles`, `permissions`.
*   **CRM:** `leads`, `clients`, `client_contacts`.
*   **Agency Operations:** `projects`, `services`, `project_services`, `project_milestones`, `project_updates`.
*   **Billing (PDF-first):** `quotations`, `quotation_items`, `invoices`, `invoice_items`, `payments`.
*   **Communication:** `support_tickets`, `ticket_messages`, `notifications`.
*   **CMS / Content:** `pages`, `case_studies`, `articles`, `site_settings`.
*   **Files:** `files` (metadata mapping to R2 objects), `project_files`.
*   **Auditing:** `audit_logs`.

## 4. Authentication & Authorization
*   **Clients:** Invite-only portal. Admin sends an invite, client sets a password and signs in. No public self-registration initially.
*   **Staff (RBAC):** Role-Based Access Control enforcing permissions server-side (Super Admin, Admin, Content Editor, Finance, Support).
*   **Security:** Session management via secure, HTTP-only cookies. Strict data isolation ensuring clients can only query their own relational records.

## 5. CMS & Content Strategy
*   **Public Content Management:** Admin will use structured database forms to update Homepage text, Services, About copy, Case Studies, and Insights.
*   **Performance Strategy:** Public pages will remain highly performant. We will use Astro's build-time fetching with caching/invalidation, or fast edge-rendered SSR for CMS pages, ensuring core marketing content doesn't require a heavy SPA payload.
*   **Restrictions:** No visual page builder. Content editors fill out structured fields; the pre-approved design system strictly handles rendering.

## 6. Agency Workflows
### A. Lead to Client Flow
Public Form (`/start-a-project/`) -> Creates a `Lead` -> Admin qualifies Lead -> Converts to `Client` -> Invites Client to Portal.
### B. Project Management
Admin defines a `Project`, assigns `Services`, and creates `Milestones` (e.g., Planning, Design, Launch). Admin posts `Updates`. Clients view real-time progress securely in their portal.
### C. Billing (Quotations & Invoices)
Admin generates structured quotes and invoices (BDT or USD). System generates a professional, downloadable PDF using database information. Clients can view status and download PDFs. Future-proofed for online payment integration.
### D. File Delivery
Admin uploads deliverables to Cloudflare R2 via the backend. The system maps the file to the specific project. Clients access a secure, authenticated download link (Workers proxy or presigned URL).

## 7. Security & Privacy
*   **Data Isolation:** All D1 queries in the Client Portal must include `WHERE client_id = ?` based on the authenticated session.
*   **Private Files:** R2 buckets will remain private. No predictable public URLs for client documents.
*   **Audit Trail:** Important administrative actions (issuing invoices, altering permissions, deleting records) are logged to `audit_logs`.

## 8. UX, DESIGN, & MOBILE DOCTRINE
*   **Canonical Guidelines:** All platform modules (Public, Admin, Portal) must strictly adhere to the guidelines set in `docs/DESIGN-UX-PRINCIPLES.md`.
*   **Mobile-First:** Both the Admin Backend and Client Portal will be fully mobile-responsive.
*   **Patterns:** Utilize off-canvas menus, responsive tables (or card-based list views), and large touch targets to ensure non-technical clients and on-the-go staff have a premium, friction-free experience. Horizontal scrolling of large desktop tables on mobile is forbidden.

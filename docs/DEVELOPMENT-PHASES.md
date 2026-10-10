# SoftDows Full-Stack Platform - Development Roadmap

This roadmap defines the step-by-step implementation of the SoftDows full-stack agency platform.

**CRITICAL RULES:** 
1. **Pacing:** Each phase must be completed, tested, and verified before starting the next. Do not attempt to build the entire full-stack platform in one phase.
2. **Quality:** Every phase must strictly adhere to the `docs/DESIGN-UX-PRINCIPLES.md` doctrine. Code must not be marked complete simply because it builds; visual self-reviews and UX checks are mandatory.

---

## PART 1: COMPLETED STATIC FOUNDATION
The following phases are completed and must be preserved:
- Phase 01: Project Foundation (Astro, Tailwind, TS)
- Phase 02: Design System (Colors, Typography, Components)
- Phase 03: Global Layout (Header, Footer, Navigation)
- Phase 04: Homepage Experience
- Phase 05: Services System & Service Pages
- Phase 06: About, Founder, Process & Trust
- Phase 07: Work / Case Study Static Architecture

---

## PART 2: FULL-STACK IMPLEMENTATION

### Phase 08: Full-Stack Foundation
*   **Objective:** Prepare Astro for dynamic execution and install core backend dependencies.
*   **Scope:** Switch Astro to `output: 'hybrid'`. Add the Cloudflare adapter (`@astrojs/cloudflare`). Set up the environment variable structure.
*   **Do NOT:** Start building database schemas or routes yet.

### Phase 09: Database Schema & Migrations
*   **Objective:** Design and initialize the Cloudflare D1 relational database.
*   **Scope:** Define the full Drizzle ORM (or similar) schema for users, leads, clients, projects, invoices, and CMS content. Create the initial migration script.
*   **Do NOT:** Build any UI.

### Phase 10: Authentication
*   **Objective:** Implement a robust, secure authentication system.
*   **Scope:** Integrate Better Auth. Configure session-based auth, password hashing, and cookie management. Test login/logout flows via API endpoints.
*   **Do NOT:** Build the full Admin UI yet.

### Phase 11: Roles & Permissions
*   **Objective:** Establish strict Role-Based Access Control (RBAC).
*   **Scope:** Create middleware/guards to protect routes based on role (Super Admin, Content Editor, Client). Ensure unauthorized access redirects safely.

### Phase 12: Admin Shell
*   **Objective:** Create the secure `/admin/` layout and dashboard.
*   **Scope:** Build the Admin UI shell (sidebar, topbar, mobile drawer). Ensure it only renders for authenticated staff. Add basic dashboard metrics UI (mock data for now).

### Phase 13: CMS / Website Content Management
*   **Objective:** Allow Admin to edit public website content without editing code.
*   **Scope:** Build Admin forms for Homepage text, Services, and About page. Update public Astro pages to fetch from D1 (using build-time static generation or edge caching where appropriate).
*   **Do NOT:** Build an unrestricted visual page builder. Use structured fields.

### Phase 14: Leads
*   **Objective:** Connect the public "Start a Project" form to the backend CRM.
*   **Scope:** Implement Cloudflare Turnstile. Save submissions to D1 `leads` table. Build Admin UI to view, qualify, and manage leads.

### Phase 15: Clients
*   **Objective:** Manage client profiles and authentication.
*   **Scope:** Build Admin UI to convert Leads to Clients, manage contact info, and trigger portal invitations (allowing clients to set passwords).

### Phase 16: Projects
*   **Objective:** Agency project management.
*   **Scope:** Admin UI to create projects, link to clients, assign services, and set milestones.

### Phase 17: Quotations
*   **Objective:** Structured quotation generation.
*   **Scope:** Admin UI to draft quotations with line items, tax, and discounts (BDT/USD). Generate professional downloadable PDFs.

### Phase 18: Invoices + PDF
*   **Objective:** Agency billing system.
*   **Scope:** Admin UI to issue invoices and track payment status (Draft, Issued, Paid, Overdue). Generate PDF invoices.
*   **Do NOT:** Implement a payment gateway yet.

### Phase 19: Files / R2
*   **Objective:** Secure file management for deliverables and documents.
*   **Scope:** Configure Cloudflare R2. Build Admin upload interface. Ensure strict server-side authorization so clients can only download their own files.

### Phase 20: Client Portal
*   **Objective:** Build the secure `/portal/` experience for clients.
*   **Scope:** Minimal client dashboard. Views for My Projects, Milestones, Invoices, Quotations, and authorized Files. 

### Phase 21: Support Tickets
*   **Objective:** Client support system.
*   **Scope:** Client UI to open tickets. Admin UI to reply and manage statuses (Open, In Progress, Resolved).

### Phase 22: Notifications
*   **Objective:** In-app notification system.
*   **Scope:** Alert Admin of new leads/tickets. Alert Clients of new invoices/milestones. Prepare architecture for future email notifications.

### Phase 23: Insights CMS
*   **Objective:** Manage blog/insights content.
*   **Scope:** Admin UI to write articles, assign authors, categories, and SEO metadata. Render dynamically on the public `/insights/` route.

### Phase 24: Case Study CMS Migration
*   **Objective:** Move Phase 07 static Work content into the database.
*   **Scope:** Admin UI for managing portfolio case studies. Update `/work/` routes to fetch from D1.

### Phase 25: Security Audit
*   **Objective:** Harden the platform.
*   **Scope:** Audit all endpoints for proper authorization checks, SQL injection prevention, CSRF protection, and rate limiting.

### Phase 26: Full QA
*   **Objective:** End-to-end testing.
*   **Scope:** Test mobile responsiveness of Admin/Portal, verify PDF generation, and ensure public pages maintain 95+ Lighthouse scores.

### Phase 27: Production Deployment
*   **Objective:** Launch the full-stack platform.
*   **Scope:** Final Cloudflare Pages deployment, D1 production bindings, R2 production buckets, and DNS configuration.

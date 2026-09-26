# SoftDows Full-Stack Platform - Master Specification

## 1. PROJECT OVERVIEW
**Project Name:** SoftDows Digital Agency Platform
**Type:** Full-Stack Agency Platform (Public Website + Admin Backend + Client Portal)
**Core Goal:** To provide a blazingly fast, SEO-friendly public marketing frontend integrated with a secure, zero-cost-first Cloudflare-native backend for agency operations (projects, billing, content management, support).

## 2. THE THREE PILLARS
1.  **Public Website:** Extremely fast, zero-JS by default frontend for marketing, lead generation, case studies, and insights.
2.  **Admin Backend (`/admin/`):** Secure operational hub for staff to manage CMS content, leads, clients, projects, quotations, invoices, and support tickets.
3.  **Client Portal (`/portal/`):** Invite-only, secure dashboard for clients to view project milestones, download deliverables, access invoices, and request support.

## 3. TECHNOLOGY STACK
- **Frontend Framework:** Astro (Hybrid: Static/On-demand rendering).
- **Language:** TypeScript (strict mode enforced).
- **Styling:** Tailwind CSS v4.
- **Database:** Cloudflare D1 (Relational serverless SQLite).
- **File Storage:** Cloudflare R2 (Private media & deliverables).
- **Authentication:** Better Auth (Secure, session-based auth).
- **Security:** Cloudflare Turnstile (Spam/Abuse protection).
- **Deployment:** Cloudflare Pages & Workers (Zero-cost-first strategy).

## 4. DESIGN & UX DOCTRINE
*   **Canonical Reference:** All frontend, backend, and portal interfaces must strictly adhere to the guidelines established in `docs/DESIGN-UX-PRINCIPLES.md`.
*   **Core Philosophy:** Premium, human-centered, conversion-aware, and accessible.
*   **Anti-Patterns:** No generic AI-generated templates, no fake social proof, no dark patterns, and no unnecessary UI bloat.
*   **Responsive:** Mobile-first, no horizontal overflow. Touch targets minimum 44x44px.
*   **SEO Strategy:** Perfect Core Web Vitals, canonicals, JSON-LD schema, Open Graph, dynamic meta tags.

## 5. ADMIN BACKEND CAPABILITIES
- **Dashboard:** Operational overview of leads, active clients, unpaid invoices, open tickets.
- **CMS:** Manage structured content for Homepage, Services, About, Case Studies, Insights, Testimonials, and Site Settings. *No visual page builder; structured database fields only.*
- **CRM / Leads:** Qualify incoming form leads, convert to clients, manage profiles.
- **Project Management:** Define projects, set milestones (e.g., Planning, Design, Launch), post updates, and securely assign files.
- **Billing:** Generate professional PDF quotations and invoices (BDT/USD). Track payment status.
- **Support:** Reply to client tickets and track status.
- **RBAC:** Role-Based Access Control (Super Admin, Manager, Content Editor, Finance, Support).

## 6. CLIENT PORTAL CAPABILITIES
- **Authentication:** Invite-based only (no public self-registration). Secure login, password reset, and session management.
- **Dashboard:** Overview of active services, recent project updates, and pending invoices.
- **Projects & Files:** Track milestone progress. Securely download authorized R2-hosted deliverables.
- **Billing:** View and download professional PDF invoices and quotations.
- **Support:** Open and manage support tickets.

## 7. SECURITY & DATA OWNERSHIP
- **Strict Authorization:** All database queries must verify user identity and roles. Clients can *only* access their explicitly linked relational data.
- **Private Files:** R2 assets linked to projects/clients must never be exposed via predictable public URLs. Authenticated proxy or signed URLs required.
- **Audit Logs:** Critical administrative actions must be logged.
- **Data Integrity:** Normalize D1 tables cleanly, use foreign key constraints, and avoid duplicate data.

## 8. DEPLOYMENT & COST STRATEGY
- **Zero-Cost-First:** Architected to run efficiently within Cloudflare's generous free tiers (Pages, Workers, D1 limits, R2 limits).
- **No Compromises:** Cost-saving must never sacrifice security, data integrity, or password safety. Future scaling paths must be documented in code comments.

## 9. PROJECT STRUCTURE
```text
/
├── public/                 # Static public assets, favicon, robots.txt
├── src/
│   ├── components/         # UI components (Public, Admin, Portal)
│   ├── layouts/            # Base layouts (MainLayout, AdminLayout)
│   ├── pages/              # Routing (/, /admin/*, /portal/*)
│   ├── lib/                # Database schemas, Auth config, Queries
│   ├── config/             # Site configuration, navigation
│   ├── styles/             # global.css
│   └── utils/              # Helper functions, formatters
├── docs/                   # Specifications and Roadmaps
├── astro.config.mjs        # Astro configuration (Cloudflare adapter)
└── tailwind.config.cjs     # Tailwind theme
```

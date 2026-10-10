# SoftDows Roles, Permissions, & Authorization (RBAC)

This document defines the Role-Based Access Control (RBAC) and Client Data Isolation mechanisms used throughout the SoftDows full-stack application.

## 1. Configured Roles
The application uses 6 explicitly configured, centralized roles managed natively by Better Auth's `admin()` plugin (`src/lib/auth/permissions.ts`):

1. `super_admin`
2. `admin`
3. `content_editor`
4. `finance`
5. `support`
6. `client` (Default role for external users)

## 2. Server-Side Enforcement Rule
Every protected route, API endpoint, and database operation **must** be enforced server-side.
*   **Hiding UI elements is strictly a UX convenience, not security.**
*   Middleware (`src/middleware.ts`) protects high-level route segments (`/admin/*` and `/portal/*`).
*   The `requirePermission(userRole, resource, action)` helper protects granular data mutations.

## 3. RBAC vs Client Ownership
*   **RBAC (Role-Based Access Control):** Determines *what type of action* a user may perform. (e.g., "The `client` role can `read` invoices").
*   **Client Ownership:** Determines *which specific records* a user may access. (e.g., "This user can only read invoices where `invoice.clientId === authUser.clientId`").
*   A user possessing a `read` permission does **not** grant them global read access to all records. Data-fetching logic must intersect the RBAC permission with the user's resolved Client Context (using `getAuthorizedClientContext`).

## 4. Permission Matrix

| Role | Allowed Areas (Permissions) | Important Restrictions |
| :--- | :--- | :--- |
| **`super_admin`** | **All modules:** Full staff-level authority, system settings, audit logs, all content, all financial records, all client data. | Cannot bypass Client ownership rules by faking IDs. Cannot be modified or deleted by standard `admin`. |
| **`admin`** | **General CRM:** Leads, clients, projects, support, general content, finance records. | **Cannot create, promote, or modify a `super_admin`.** No access to core system settings or audit logs. |
| **`content_editor`** | **CMS Only:** Read/Write access to Case Studies, Insights, Services, general pages, media. | **No access** to financial records, client operational data, or staff user-management. |
| **`finance`** | **Finance Only:** Read/Write access to Quotations, Invoices, Payments. Read-only context for Clients/Projects. | **No access** to website content CMS or staff user-management. |
| **`support`** | **Support Only:** Read/Write access to Support Tickets. Read-only context for Clients/Projects. | **No access** to financial records, website content CMS, or staff user-management. |
| **`client`** | **Portal Only:** Read access to their own isolated Projects, Quotations, Invoices. Read/Write for their Support tickets. | **No access** to Admin Dashboard (`/admin/*`). Absolutely no user-management capability. |

## 5. Super Admin Protections
To prevent privilege escalation:
*   The `canManageRole(actor, target)` helper explicitly denies `admin` users from mutating `super_admin` accounts.
*   Only a `super_admin` can create or modify another `super_admin`.

## 6. Privilege Escalation Prevention
*   Staff roles (`content_editor`, `finance`, `support`) have strictly defined statements that omit the Better Auth `user` and `session` resource permissions. They cannot call API routes to change their own role or promote others.
*   Clients are confined entirely outside the staff namespace.

## 7. Role Change & Session Revocation
*   When an administrator modifies a user's role (e.g., demoting an `admin` to `content_editor`), Better Auth natively supports revoking the user's active sessions.
*   Future user-management UI **must** trigger session revocation to ensure the demoted user immediately loses access and must re-authenticate to receive their new, restricted session claims.

## 8. No Impersonation Policy
*   To preserve strict audit trails and prevent Super Admins from bypassing security logs, the Better Auth `impersonation` feature is explicitly **not** enabled or granted to any role. Administrators must act under their own authenticated identities.

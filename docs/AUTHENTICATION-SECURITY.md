# SoftDows Authentication & Security Architecture

## 1. Authentication Technology
SoftDows uses **Better Auth v1.x** (currently `1.7.6`) as the core authentication framework, utilizing the `better-auth` packages. 
It uses the official **Drizzle adapter** configured for **Cloudflare D1** (SQLite). 

## 2. Public Signup Policy
**Public self-registration is strictly disabled server-side.** 
Normal visitors cannot create an account. The `disableSignup: true` flag is enforced in the Better Auth configuration.
Accounts will only be created through authorized Admin/Staff interfaces via a secure invitation flow.

## 3. Staff vs Client Identity Separation
Authentication identity (Better Auth User) is strictly decoupled from business records.
*   **Staff:** A Better Auth user with a role of `super_admin` or `admin`.
*   **Client:** A Better Auth user with a role of `client`. This identity is relationally linked to a `ClientContact` record (which maps to a `Client` business entity). 
A user is either a Staff member or a Client, never both simultaneously.

## 4. Role Foundation
Roles are natively managed via the Better Auth `admin()` plugin. Currently, they are string constants, checked securely in middleware (strict permissions will be implemented in Phase 04):
*   `super_admin`: Full system access, can manage other admins.
*   `admin`: Standard staff/agency manager.
*   `client`: Set as the `defaultRole`. Limited to the Client Portal, strictly scoped to their linked business Client ID.

## 5. Route Protection
Global route protection is enforced securely via `src/middleware.ts` (Server-Side):
*   `/admin/*` is strictly restricted to authenticated users with `super_admin` or `admin` roles. Clients are hard-blocked.
*   `/portal/*` is strictly restricted to authenticated users with the `client` role. Admins are blocked to prevent mixed data contexts.
*   Public marketing pages (`/`, `/about/`, `/services/`, etc.) remain fully unauthenticated.

## 6. Client Data Isolation Rule
A logged-in Client must **NEVER** be able to select another Client ID and access their data.
All future portal queries MUST derive the permitted Client ID from the authenticated user's server-side session (via the `client_contacts` relational link), **not** from URL parameters like `?clientId=123`. This logic must be server-enforced.

## 7. Password & Email Flows
*   **Passwords:** Securely hashed and managed entirely by Better Auth using its native strong algorithm (scrypt/bcrypt via Cloudflare compat). Plaintext passwords are never stored.
*   **Forgot/Reset Password:** Prepared structurally in Better Auth, but **disabled in the UI** until a real transactional email provider (e.g., Resend, Postmark) is configured. A calm tooltip advises users to contact support.
*   **Account Invitation:** The architecture requires Admins to send secure invitation tokens (deferred until email is ready).

## 8. Session Security
Better Auth manages secure session cookies natively.
*   Sessions expire after 7 days.
*   CSRF and trusted origins are enforced natively by Better Auth via the environment configuration.

## 9. First Super Admin Bootstrap
Because public signup is disabled, the first `super_admin` cannot be created via the web UI. Raw SQL insertion is prohibited to ensure passwords are properly hashed and hooks are fired.
**To securely bootstrap the first admin in production:**
1. Do **NOT** expose a persistent HTTP endpoint (like `/api/auth/bootstrap`).
2. The official method for Cloudflare D1 architectures is to create a one-time, non-routable Cloudflare Worker script that imports your `getAuth(env)` instance and calls `auth.api.signUpEmail()` securely server-side.
3. Deploy the worker, trigger it via a direct Cloudflare Workers cron event or queue execution, verify the account is created with the `super_admin` role, and then immediately delete the Worker.
4. Default credentials are NEVER committed to source control.

## 10. Known Deferred Items
*   Transactional email provider integration (blocks password resets and invite emails).
*   Admin UI for managing (banning/inviting) users.
*   Client Portal UI for viewing isolated data.

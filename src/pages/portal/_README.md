# Client Portal Routes

This directory is strictly for authenticated Client screens.

## Security Boundary
- All routes inside `/portal/` must be protected by server-side middleware (e.g. `src/middleware.ts`).
- Ensure no screen in this directory can be accessed without a valid client session.
- **Data Isolation:** All database queries executed within these routes MUST filter by the authenticated `client_id`. Never trust URL parameters (like `?project_id=123`) without verifying the client owns that project.

# Admin Routes

This directory is strictly for authenticated Admin/Staff screens.

## Security Boundary
- All routes inside `/admin/` must be protected by server-side middleware (e.g. `src/middleware.ts`).
- Ensure no screen in this directory can be accessed without a valid, verified session and appropriate RBAC role (e.g., `Admin` or `Content Editor`).
- Data mutations should only happen via secure API endpoints or validated form actions.

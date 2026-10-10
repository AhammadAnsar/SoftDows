# SOFTDOWS — MASTER EXECUTION RULES
## FOR ALL REMAINING DEVELOPMENT PHASES

CURRENT STACK:

- Astro
- TypeScript
- Tailwind CSS v4
- Cloudflare Workers
- Cloudflare D1
- Drizzle ORM
- Better Auth 1.7.6
- Cloudflare KV
- GitHub private repository
- GitHub -> Cloudflare Workers automatic deployment
- Production Super Admin working

CURRENT VERIFIED FOUNDATION:

- Admin shell
- Leads
- Client management
- Client integrity = PASS
- Authentication
- RBAC
- D1
- Production deployment
- GitHub auto-deploy
- Public website architecture

GLOBAL RULES:

1. Inspect existing implementation before changing anything.
2. Reuse current architecture/components/helpers.
3. Do NOT rebuild completed modules.
4. Do NOT create parallel databases, auth systems or duplicated content sources.
5. Do NOT rewrite already-applied migrations.
6. Use forward-only migrations.
7. Preserve existing production data.
8. Runtime validation is mandatory.
9. Server-side authorization is mandatory.
10. Client-owned data requires ownership validation in addition to RBAC.
11. No fake/dummy production data.
12. No fake metrics, testimonials, users, projects, reviews or statistics.
13. Never call code inspection or mathematical simulation a test.
14. Tests must execute real logic wherever practical.
15. Money uses integer minor units. Never floating-point monetary storage.
16. UI must be professional, responsive, minimal and usable by non-technical users.
17. Avoid unnecessary scrolling, card soup and dead controls.
18. Do not redesign already-good UI without a reason.
19. Public frontend content must eventually be manageable through Admin + D1.
20. Admin controls content/media/publication/order, not arbitrary layout destruction.
21. No public signup.
22. No insecure bootstrap endpoint.
23. No hardcoded secrets.
24. Do not expose private/internal data to Client Portal.
25. Do not automatically apply destructive production database operations.
26. Before any new production migration:
    - verify locally
    - verify forward compatibility
    - preserve data
27. GitHub main is production source.
28. Do NOT manually deploy normal code changes; GitHub -> Cloudflare auto deploy handles them.
29. If database migration is required, do NOT push incompatible code before migration readiness is verified.
30. Keep final reports short.

CONTINUATION RULE:

For every phase maintain:

docs/PHASE-XX-STATE.md

If runtime/context limit occurs:

- finish current safe atomic operation
- update state file
- record completed tasks
- migrations
- changed files
- tests
- exact next task
- stop

Do NOT restart/re-audit the phase later.

VERIFICATION STANDARD:

Every applicable phase must run:

npm run check

and:

npx wrangler deploy --dry-run

Use appropriate real tests.

Do not declare a phase complete if its core workflow is incomplete.

/// <reference path="../.astro/types.d.ts" />
/// <reference types="@cloudflare/workers-types" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    user: (import('better-auth').User & { role?: import('./lib/auth/permissions').AppRole }) | null;
    session: import('better-auth').Session | null;
  }
}

interface Env {
  DB: D1Database;
}
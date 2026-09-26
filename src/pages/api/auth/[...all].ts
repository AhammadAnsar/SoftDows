import type { APIRoute } from 'astro';
import { getAuth } from '../../../lib/auth';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const ALL: APIRoute = async (ctx) => {
  const safeEnv = env as any;
  if (!safeEnv || !safeEnv.DB) {
    return new Response('Database environment not found', { status: 500 });
  }

  const auth = getAuth(safeEnv);
  
  return auth.handler(ctx.request);
};

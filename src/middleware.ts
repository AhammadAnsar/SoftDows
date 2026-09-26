import { defineMiddleware } from 'astro:middleware';
import { handleServerError } from './lib/errors';
import { getAuth } from './lib/auth';
// According to Astro v6 Cloudflare adapter:
import { env } from 'cloudflare:workers';

/**
 * Global Middleware Foundation
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  const isAdmin = path.startsWith('/admin');
  const isPortal = path.startsWith('/portal');

  if (isAdmin || isPortal) {
    const safeEnv = env as any;
    if (!safeEnv || !safeEnv.DB) {
      return new Response('Database environment not found', { status: 500 });
    }

    const auth = getAuth(safeEnv);
    
    // Check session using Better Auth API
    const sessionResponse = await auth.api.getSession({
      headers: context.request.headers
    });

    if (!sessionResponse?.session) {
      const redirectUrl = new URL('/login', url.origin);
      redirectUrl.searchParams.set('redirectTo', path);
      return context.redirect(redirectUrl.toString());
    }

    const userRole = (sessionResponse.user as any).role as import('./lib/auth/permissions').AppRole;

    if (isAdmin) {
      const { isStaffRole } = await import('./lib/auth/authorization');
      if (!isStaffRole(userRole)) {
        if (userRole === 'client') return context.redirect('/portal');
        return new Response('Forbidden: Staff access required', { status: 403 });
      }
    }

    if (isPortal) {
      if (userRole !== 'client') {
        return new Response('Forbidden: Client access required', { status: 403 });
      }
    }
    
    // Locals typing now recognizes .role automatically
    context.locals.user = sessionResponse.user as any;
    context.locals.session = sessionResponse.session;
  }

  try {
    const response = await next();
    return response;
  } catch (error) {
    return handleServerError(error, context.request);
  }
});

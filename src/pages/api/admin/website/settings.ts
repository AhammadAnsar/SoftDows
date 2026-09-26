export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/db';
import { siteSettings } from '../../../../lib/db/schema/cms';
import { requirePermission } from '../../../../lib/auth/authorization';

import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const hasPermission = requirePermission(user.role as any, 'settings', 'update');
    if (!hasPermission) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const data = await request.json();
    const _env = env as any;
    const db = getDb(_env.DB);

    // Filter valid keys to prevent arbitrary inserts
    const validKeys = ['site_title', 'seo_description', 'contact_email', 'contact_phone', 'footer_copyright'];
    
    const upserts = [];
    
    for (const key of validKeys) {
      if ((data as any)[key] !== undefined) {
        upserts.push(
          db.insert(siteSettings)
            .values({
              id: crypto.randomUUID().replace(/-/g, ''),
              key,
              value: String((data as any)[key]),
              updatedAt: new Date()
            })
            .onConflictDoUpdate({
              target: siteSettings.key,
              set: {
                value: String((data as any)[key]),
                updatedAt: new Date()
              }
            })
        );
      }
    }

    if (upserts.length > 0) {
      await db.batch(upserts as any);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: any) {
    console.error('API Error updating settings:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

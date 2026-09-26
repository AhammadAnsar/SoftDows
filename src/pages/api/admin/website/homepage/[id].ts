import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getDb } from '../../../../../lib/db';
import { pageSections } from '../../../../../lib/db/schema/cms';
import { eq } from 'drizzle-orm';
import { requirePermission } from '../../../../../lib/auth/authorization';
import type { AppRole } from '../../../../../lib/auth/permissions';

export const POST: APIRoute = async ({ params, request, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const role = user.role as AppRole;
  if (!requirePermission(role as any, 'content', 'update')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing section ID' }), { status: 400 });
  }

  try {
    const data = await request.json();
    const db = getDb((env as any).DB);

    await db.update(pageSections)
      .set({
        heading: (data as any).heading || null,
        subheading: (data as any).subheading || null,
        content: (data as any).content || null,
        ctaText: (data as any).ctaText || null,
        ctaLink: (data as any).ctaLink || null,
        displayOrder: (data as any).displayOrder ?? 0,
        isEnabled: (data as any).isEnabled ?? true,
        updatedAt: new Date()
      })
      .where(eq(pageSections.id, id));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error('Error updating section:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
};

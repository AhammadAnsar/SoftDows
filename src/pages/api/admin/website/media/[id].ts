import type { APIRoute } from 'astro';
import { getDb } from '../../../../../lib/db';
import { mediaLibrary } from '../../../../../lib/db/schema/cms';
import { eq } from 'drizzle-orm';
import { getAuth } from '../../../../../lib/auth';

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime.env;
  const auth = getAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !['super_admin', 'admin', 'content_editor'].includes(session.user.role as string)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) return new Response('Not found', { status: 404 });

  const db = getDb(env.DB);
  const item = await db.select().from(mediaLibrary).where(eq(mediaLibrary.id, id)).get();
  
  if (!item) return new Response('Not found', { status: 404 });

  try {
    if (env.MEDIA) {
      await env.MEDIA.delete(item.objectKey);
    }
    await db.delete(mediaLibrary).where(eq(mediaLibrary.id, id));
    return new Response(null, { status: 204 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Delete failed', details: err.message }), { status: 500 });
  }
};

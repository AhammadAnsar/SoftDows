import type { APIRoute } from 'astro';
import { getDb } from '../../lib/db';
import { mediaLibrary } from '../../lib/db/schema/cms';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ params, locals }) => {
  const env = (locals as any).runtime.env;
  const path = params.path;
  
  if (!path) {
    return new Response('Not found', { status: 404 });
  }

  const objectKey = `media/${path}`;

  // If running locally without R2, return a mock image or 404
  if (!env.MEDIA) {
    return new Response('Local development: R2 MEDIA binding is missing', { status: 404 });
  }

  const object = await env.MEDIA.get(objectKey);
  
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable'); // Cache for 1 year

  return new Response(object.body, {
    headers,
    status: 200
  });
};

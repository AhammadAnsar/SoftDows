import type { APIRoute } from 'astro';
import { getDb } from '../../../../../lib/db';
import { mediaLibrary } from '../../../../../lib/db/schema/cms';
import { eq } from 'drizzle-orm';
import { requireClientResourceOwnership } from '../../../../../lib/portal/auth';
import { getAuth } from '../../../../../lib/auth';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime.env;
  const auth = getAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !['super_admin', 'admin', 'content_editor'].includes(session.user.role as string)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const db = getDb(env.DB);
  const items = await db.select().from(mediaLibrary).orderBy(mediaLibrary.createdAt);
  return new Response(JSON.stringify(items), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime.env;
  const auth = getAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !['super_admin', 'admin', 'content_editor'].includes(session.user.role as string)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return new Response(JSON.stringify({ error: 'Invalid MIME type' }), { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return new Response(JSON.stringify({ error: 'File too large' }), { status: 400 });
  }

  const extension = file.name.split('.').pop() || '';
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const uuid = crypto.randomUUID();
  const objectKey = `media/${year}/${month}/${uuid}-${safeName}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Check if R2 is configured in the environment
    if (!env.MEDIA) {
      console.warn('R2 bucket env.MEDIA is not configured. Saving metadata only for local development.');
    } else {
      await env.MEDIA.put(objectKey, arrayBuffer, {
        httpMetadata: { contentType: file.type }
      });
    }

    const db = getDb(env.DB);
    const media = {
      id: crypto.randomUUID(),
      objectKey,
      originalFilename: file.name,
      displayName: formData.get('displayName')?.toString() || file.name,
      mimeType: file.type,
      fileSize: file.size,
      uploadedBy: session.user.id,
      altText: formData.get('altText')?.toString() || '',
      caption: formData.get('caption')?.toString() || '',
      status: 'active' as const
    };

    await db.insert(mediaLibrary).values(media);

    return new Response(JSON.stringify(media), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Upload failed', details: err.message }), { status: 500 });
  }
};

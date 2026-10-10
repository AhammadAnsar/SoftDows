import { getAuth } from '../src/lib/auth';

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/bootstrap') {
      return new Response('Not Found', { status: 404 });
    }

    const token = request.headers.get('X-Bootstrap-Token');
    if (!env.BOOTSTRAP_TOKEN || token !== env.BOOTSTRAP_TOKEN) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (!env.DB) return new Response('Missing DB binding', { status: 500 });

    try {
      const auth = getAuth(env);

      // Check if ANY user exists (permanent refusal after first user)
      const countRes = await env.DB.prepare('SELECT count(*) as c FROM user').first();
      if (countRes && countRes.c > 0) {
        return new Response(JSON.stringify({ error: 'Bootstrap disabled. A production user already exists.' }), { status: 403 });
      }

      // Parse input
      let body: any;
      try {
        body = await request.json();
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
      }

      const { email, password } = body;
      if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        return new Response(JSON.stringify({ error: 'Missing or invalid email/password' }), { status: 400 });
      }

      // Check if target email exists (redundant given count=0, but required by prompt)
      const existingUser = await env.DB.prepare('SELECT * FROM user WHERE email = ?').bind(email).first();
      if (existingUser) {
        return new Response(JSON.stringify({ error: 'Target email already exists' }), { status: 400 });
      }

      // Call auth.api.createUser enforcing role and name
      const res = await auth.api.createUser({
        body: {
          email,
          password,
          name: 'Ansar Ahammad',
          role: 'super_admin'
        }
      });

      return new Response(JSON.stringify({ success: true, message: 'Super admin created successfully.' }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Server Error', message: err.message }), { status: 500 });
    }
  }
};

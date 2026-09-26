import { createAuthClient } from 'better-auth/client';
import { adminClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  // Omitting baseURL allows Better Auth to infer it from window.location.origin
  // in the browser, enforcing same-origin requests naturally.
  plugins: [
    adminClient()
  ]
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Test Cloudflare automatic deployment

// Test Cloudflare automatic deployment round 2

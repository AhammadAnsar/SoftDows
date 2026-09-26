import { createAuthClient } from 'better-auth/client';
import { adminClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321', // Configurable base URL
  plugins: [
    adminClient()
  ]
});

export const { signIn, signUp, signOut, useSession } = authClient;

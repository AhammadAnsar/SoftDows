import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { getDb } from '../db';
import * as schema from '../db/schema';
import { roles } from './permissions';

// Helper to instantiate Better Auth with the current environment's D1 binding
export function getAuth(env: any) {
  const db = getDb(env.DB);
  
  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: ['https://softdows.ansarahammad369.workers.dev', 'https://softdows.com'],
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification
      }
    }),
    emailAndPassword: {
      enabled: true,
      // Disable public sign up explicitly to enforce Staff/Client controlled creation
      disableSignup: true,
    },
    plugins: [
      // Provide foundational role support
      admin({
        defaultRole: 'client',
        adminRoles: ['super_admin', 'admin', 'content_editor', 'finance', 'support'],
        roles: roles,
      })
    ],
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    }
  });
}


// @ts-ignore
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema/index.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  // Note: We are not defining dbCredentials.
  // We don't have a production DB or fake DB ID yet,
  // and we generate migrations strictly via schema diffing.
});

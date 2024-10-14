import type { Config } from 'drizzle-kit';

export default {
  schema: './src/app/db/schema.ts',
  out: './drizzle',
  // driver: 'better-sqlite',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DB_FILE_NAME!,
  },
} satisfies Config;

import type { Config } from 'drizzle-kit';

import { config } from 'dotenv';

config({ path: '.env.local' });

export default {
  schema: './src/app/db/schema.ts',
  out: './drizzle',
  // driver: 'better-sqlite',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
} satisfies Config;

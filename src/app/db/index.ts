import Database from 'better-sqlite3';

import { config } from 'dotenv';

import { drizzle } from 'drizzle-orm/better-sqlite3';
config({ path: '.env.local' });

const sqlite = new Database('local.db');
export const db = drizzle(sqlite);

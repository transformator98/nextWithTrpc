import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey(),
  content: text('content'),
  done: integer({ mode: 'boolean' }),
});

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('content'),
});

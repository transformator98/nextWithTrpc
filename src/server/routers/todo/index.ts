import { publicProcedure, router } from '@/server/trpc';
import { todos } from '@/app/db/schema';
import { db } from '@/app/db';

import { z } from 'zod';

import { eq } from 'drizzle-orm';

export const todoRouter = router({
  getTodos: publicProcedure.query(async () => {
    return (await db.select().from(todos).all()) || [];
  }),
  addTodo: publicProcedure.input(z.string()).mutation(async (opts) => {
    await db.insert(todos).values({ content: opts.input, done: false }).run();
    return true;
  }),
  updateTodo: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .mutation(async ({ input }) => {
      const { id, completed } = input;
      const updateCompleted = await db
        .update(todos)
        .set({ done: completed })
        .where(eq(todos.id, id))
        .returning({ done: todos.done });

      return updateCompleted;
    }),
  deleteTodo: publicProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => {
      await db.delete(todos).where(eq(todos.id, id));
    }),

  editTodo: publicProcedure
    .input(z.object({ id: z.number(), content: z.string() }))
    .mutation(async ({ input }) => {
      const { id, content } = input;
      await db.update(todos).set({ content }).where(eq(todos.id, id));

      return true;
    }),
});

export type TodoRouter = typeof todoRouter;

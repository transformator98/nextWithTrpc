import { User } from '@/server/types/users';
import { router, publicProcedure } from '@/server/trpc';
import { users } from '@/app/db/schema';

import { TRPCError } from '@trpc/server';

import { z } from 'zod';

import Database from 'better-sqlite3';

import { drizzle } from 'drizzle-orm/better-sqlite3';

const sqlite = new Database('local.db');
const db = drizzle(sqlite);

export const userRouter = router({
  // обработка запроса на получение всех пользователей
  // выполняем запрос (query)
  getUsers: publicProcedure.query(async () => {
    return await db.select().from(users).all();
  }),
  getUserById: publicProcedure
    // валидация тела запроса
    // ID должен быть строкой
    .input((val: unknown) => {
      if (typeof val === 'string') return val;

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid input: ${typeof val}`,
      });
    })
    .query(async (req) => {
      const { input } = req;
      const userTabe = await db.select().from(users).all();
      // ищем пользователя
      const user = userTabe.find((u) => u.id === Number(input));

      // если не нашли, выбрасываем исключение
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `User with ID ${input} not found`,
        });
      }

      // если нашли, возвращаем его
      return user;
    }),
  // обработка создания нового пользователя
  createUser: publicProcedure
    .input(z.object({ name: z.string() }))
    // выполняем мутацию
    .mutation(async (req) => {
      const { input } = req;
      db.insert(users).values({ name: input.name }).run();

      return true;
    }),
});

export type UserRouter = typeof userRouter;

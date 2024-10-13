import { todoRouter } from '@/server/routers/todo';
import { userRouter } from '@/server/routers/users';

import { router } from './trpc';

export const appRouter = router({
  todo: todoRouter,
  users: userRouter,
});

export type AppRouter = typeof appRouter;

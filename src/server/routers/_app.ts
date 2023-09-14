import { router } from '../trpc';
import { authRouter } from './auth';
import { postRouter } from './post';

const appRouter = router({
  post: postRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;

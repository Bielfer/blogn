import { router } from '../trpc';
import { authRouter } from './auth';
import { postRouter } from './post';
import { blogRouter } from './blog';

const appRouter = router({
  post: postRouter,
  auth: authRouter,
  blog: blogRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;

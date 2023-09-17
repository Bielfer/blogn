import { router } from '../trpc';
import { authRouter } from './auth';
import { postRouter } from './post';
import { blogRouter } from './blog';
import { categoryRouter } from './category';

const appRouter = router({
  post: postRouter,
  auth: authRouter,
  blog: blogRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;

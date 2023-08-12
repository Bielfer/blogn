import { router } from '../trpc';
import { postRouter } from './post';

const appRouter = router({
  post: postRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;

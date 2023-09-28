import { router } from '../trpc';
import { authRouter } from './auth';
import { postRouter } from './post';
import { blogRouter } from './blog';
import { categoryRouter } from './category';
import { userRouter } from './user';
import { vercelRouter } from './vercel';
import { cloudflareRouter } from './cloudflare';

const appRouter = router({
  post: postRouter,
  auth: authRouter,
  blog: blogRouter,
  category: categoryRouter,
  user: userRouter,
  vercel: vercelRouter,
  cloudflare: cloudflareRouter,
});

export type AppRouter = typeof appRouter;

export const caller = appRouter.createCaller({ decodedIdToken: null });

export default appRouter;

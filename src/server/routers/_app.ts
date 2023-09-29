import { router } from '../trpc';
import { authRouter } from './auth';
import { postRouter } from './post';
import { blogRouter } from './blog';
import { categoryRouter } from './category';
import { userRouter } from './user';
import { vercelRouter } from './vercel';
import { cloudflareRouter } from './cloudflare';
import { fileRouter } from './file';

const appRouter = router({
  post: postRouter,
  auth: authRouter,
  blog: blogRouter,
  category: categoryRouter,
  user: userRouter,
  vercel: vercelRouter,
  cloudflare: cloudflareRouter,
  file: fileRouter,
});

export type AppRouter = typeof appRouter;

export const caller = appRouter.createCaller({ decodedIdToken: null });

export default appRouter;

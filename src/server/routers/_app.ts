import { publicProcedure, router } from '../trpc';

const appRouter = router({
  temp: publicProcedure.query(() => {
    return 'cu';
  }),
});

export type AppRouter = typeof appRouter;

export default appRouter;

import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { type Context } from './context';
import { isAuthenticated as isAuthenticatedHelper } from '~/lib/fetchers/auth';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const { router, middleware } = t;

const logger = middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;

  if (result.ok) console.log('OK request timing:', { path, type, durationMs });
  else console.error('Error request timing', { path, type, durationMs });

  return result;
});

const isAuthenticated = middleware(async ({ next }) => {
  const decodedIdToken = await isAuthenticatedHelper();

  if (!decodedIdToken)
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' });

  return next({
    ctx: {
      decodedIdToken,
    },
  });
});

export const publicProcedure = t.procedure.use(logger);

export const privateProcedure = t.procedure.use(logger).use(isAuthenticated);

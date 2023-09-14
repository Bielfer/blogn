import { router, privateProcedure, publicProcedure } from '~/server/trpc';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { TRPCError } from '@trpc/server';
import { auth } from '~/services/firebase/admin';
import { tryCatch } from '~/lib/helpers/try-catch';
import { cookiesKeys } from '~/lib/constants/cookies';
import { env } from '~/env.mjs';

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ idToken: z.string() }))
    .mutation(async ({ input }) => {
      const { idToken } = input;
      const cookieStore = cookies();

      const [decodedIdToken, error] = await tryCatch(
        auth.verifyIdToken(idToken)
      );

      if (
        !decodedIdToken ||
        error ||
        !(new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60)
      ) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Recent sign in required!',
        });
      }

      const expiresIn = 10 * 60 * 60 * 24 * 1000;

      const [sessionCookie, errorCookie] = await tryCatch(
        auth.createSessionCookie(idToken, { expiresIn })
      );

      if (errorCookie || !sessionCookie)
        throw new TRPCError({ code: 'UNAUTHORIZED' });

      const options = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: env.NODE_ENV === 'development' ? false : true,
      };

      cookieStore.set(cookiesKeys.session, sessionCookie, options);

      return { status: 'success' };
    }),
  logout: privateProcedure.mutation(async () => {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(cookiesKeys.session)?.value;

    if (!sessionCookie) return { status: 'success' };

    const [decodedClaims, error] = await tryCatch(
      auth.verifySessionCookie(sessionCookie)
    );

    if (!decodedClaims || error) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    const [, errorRevoking] = await tryCatch(
      auth.revokeRefreshTokens(decodedClaims.sub)
    );

    if (errorRevoking) throw new TRPCError({ code: 'BAD_REQUEST' });

    cookieStore.delete(cookiesKeys.session);

    return { status: 'success' };
  }),
});

export type LoginRouter = typeof authRouter;

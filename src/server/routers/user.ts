import { router, privateProcedure } from '~/server/trpc';
import { z } from 'zod';
import { tryCatch } from '~/lib/helpers/try-catch';
import { auth } from '~/services/firebase/admin';
import { TRPCError } from '@trpc/server';

export const userRouter = router({
  update: privateProcedure
    .input(
      z.object({
        uid: z.string(),
        displayName: z.string().optional(),
        photoURL: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { uid, ...inputWithoutUid } = input;

      const [user, error] = await tryCatch(
        auth.updateUser(uid, inputWithoutUid)
      );

      if (error || !user)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      return user;
    }),
});

export type UserRouter = typeof userRouter;

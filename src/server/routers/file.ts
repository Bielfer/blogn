import { router, privateProcedure } from '~/server/trpc';
import { z } from 'zod';
import { tryCatch } from '~/lib/helpers/try-catch';
import { storage } from '~/services/firebase/admin';
import { addMinutes } from 'date-fns';
import { TRPCError } from '@trpc/server';
import { bucketPathsValues } from '~/lib/constants/firebase';
import { v4 as uuidv4 } from 'uuid';
import { env } from '~/env.mjs';

export const fileRouter = router({
  image: privateProcedure
    .input(
      z.object({
        bucketPath: z.enum(bucketPathsValues),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { bucketPath, contentType } = input;
      const minutes = 10;
      const fileName = `${bucketPath}/${uuidv4()}`;

      await storage.setCorsConfiguration([
        {
          maxAgeSeconds: minutes * 60,
          method: ['PUT'],
          origin: [env.NEXT_PUBLIC_APP_URL],
          responseHeader: ['Content-Type'],
        },
      ]);

      const [res, error] = await tryCatch(
        storage.file(fileName).getSignedUrl({
          action: 'write',
          expires: addMinutes(new Date(), minutes),
          contentType,
          version: 'v4',
        })
      );

      if (error || !res)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      return { signedUrl: res[0], fileName };
    }),
});

export type FileRouter = typeof fileRouter;

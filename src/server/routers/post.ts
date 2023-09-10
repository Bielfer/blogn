import { router, privateProcedure } from '~/server/trpc';
import { z } from 'zod';
import { tryCatch } from '~/lib/helpers/try-catch';
import { TRPCError } from '@trpc/server';

export const postRouter = router({
  create: privateProcedure
    .input(
      z.object({
        content: z.object({
          version: z.string().optional(),
          blocks: z.object({}).array(),
          time: z.number().optional(),
        }),
        title: z.string(),
        urlTitle: z.string(),
        SEOTitle: z.string(),
        SEODescription: z.string(),
        publishedAt: z.date(),
      })
    )
    .mutation(({ input, ctx }) => {
      return 'temp';
    }),
});

export type PostRouter = typeof postRouter;

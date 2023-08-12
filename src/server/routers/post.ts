import { router, privateProcedure } from '~/server/trpc';
import { z } from 'zod';
import { tryCatch } from '~/helpers/try-catch';
import { prisma } from '~/prisma/client';
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
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.auth;

      const [post, error] = await tryCatch(
        prisma.post.create({
          data: { ...input, userId },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      return post;
    }),
});

export type PostRouter = typeof postRouter;

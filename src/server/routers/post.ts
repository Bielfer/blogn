import { router, privateProcedure } from '~/server/trpc';
import { z } from 'zod';
import { tryCatch } from '~/lib/helpers/try-catch';
import { TRPCError } from '@trpc/server';
import { db } from '~/services/firebase/admin';
import { collections } from '~/lib/constants/firebase';
import {
  conditionalWheres,
  formatDocument,
  snapshotToArray,
} from '~/lib/helpers/firebase';
import { createSchema, updateSchema } from '~/lib/helpers/zod';

const postSchema = z.object({
  id: z.string(),
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
  createdAt: z.date(),
  updatedAt: z.date(),
});

const createPostSchema = createSchema(postSchema);
const updatePostSchema = updateSchema(postSchema);

export const postRouter = router({
  getMany: privateProcedure
    .input(
      z.object({
        uid: z.string().optional(),
        organizationId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { organizationId, uid } = input;

      const [postsSnapshot, error] = await tryCatch(
        conditionalWheres(db.collection(collections.posts), [
          ['organizationId', '==', organizationId],
          ['uid', '==', uid],
        ]).get()
      );

      if (error || !postsSnapshot)
        throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      const posts = snapshotToArray<z.infer<typeof postSchema>>(postsSnapshot);

      return posts;
    }),
  create: privateProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      const { uid } = ctx.decodedIdToken;

      const [postRef, error] = await tryCatch(
        db.collection(collections.posts).add({
          ...input,
          uid,
        })
      );

      if (!postRef || error)
        throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      const [postSnapshot, errorGettingPost] = await tryCatch(postRef.get());

      if (!postSnapshot || errorGettingPost)
        throw new TRPCError({ code: 'BAD_REQUEST', message: errorGettingPost });

      return formatDocument<z.infer<typeof postSchema>>(postSnapshot);
    }),
});

export type PostRouter = typeof postRouter;

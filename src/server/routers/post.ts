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
import { postStatusValues } from '~/lib/constants/posts';
import { getPostById } from '~/lib/fetchers/post';

const postSchema = z.object({
  id: z.string(),
  content: z.object({
    version: z.string().optional(),
    blocks: z.any().array(),
    time: z.number().optional(),
  }),
  title: z.string(),
  urlTitle: z.string(),
  SEOTitle: z.string(),
  SEODescription: z.string(),
  status: z.enum(postStatusValues),
  publishedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const setPostSchema = postSchema
  .omit({ createdAt: true, updatedAt: true })
  .extend({ id: z.string().optional() });

export type Post = z.infer<typeof postSchema>;

export const postRouter = router({
  get: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;

      const [postSnapshot, error] = await tryCatch(getPostById(id));

      if (error || !postSnapshot)
        throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return formatDocument<Post>(postSnapshot);
    }),
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
        ])
          .orderBy('publishedAt', 'desc')
          .get()
      );

      if (error || !postsSnapshot)
        throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      const posts = snapshotToArray<Post>(postsSnapshot);

      return posts;
    }),
  set: privateProcedure
    .input(setPostSchema)
    .mutation(async ({ input, ctx }) => {
      const { uid } = ctx.decodedIdToken;
      const { id, ...filteredInput } = input;

      const postRef = !!id
        ? db.collection(collections.posts).doc(id)
        : db.collection(collections.posts).doc();

      const [, error] = await tryCatch(
        postRef.set({
          ...filteredInput,
          uid,
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      const [postSnapshot, errorGettingPost] = await tryCatch(postRef.get());

      if (!postSnapshot || errorGettingPost)
        throw new TRPCError({ code: 'BAD_REQUEST', message: errorGettingPost });

      return formatDocument<Post>(postSnapshot);
    }),
  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id } = input;

      const [, error] = await tryCatch(
        db.collection(collections.posts).doc(id).delete()
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return `Post ${id} deleted`;
    }),
});

export type PostRouter = typeof postRouter;

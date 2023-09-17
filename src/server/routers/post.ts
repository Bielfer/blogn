import { router, privateProcedure } from '~/server/trpc';
import { z } from 'zod';
import { tryCatch } from '~/lib/helpers/try-catch';
import { TRPCError } from '@trpc/server';
import { auth, db } from '~/services/firebase/admin';
import { collections } from '~/lib/constants/firebase';
import { formatDocument, snapshotToArray } from '~/lib/helpers/firebase';
import { postStatus, postStatusValues } from '~/lib/constants/posts';
import { getPostById } from '~/lib/fetchers/post';
import { getCreateSchema, getUpdateSchema } from '~/lib/helpers/zod';

const postSchema = z.object({
  id: z.string(),
  blogId: z.string(),
  content: z.object({
    version: z.string().optional(),
    blocks: z.any().array(),
    time: z.number().optional(),
  }),
  title: z.string(),
  urlTitle: z.string(),
  SEOTitle: z.string(),
  SEODescription: z.string().default(''),
  status: z.enum(postStatusValues).default(postStatus.draft),
  authorUid: z.string(),
  publishedAt: z.date().default(new Date()),
  categories: z.string().array().default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Post = z.infer<typeof postSchema>;

export const createPostSchema = getCreateSchema(postSchema);
export const updatePostSchema = getUpdateSchema(postSchema);

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

      const post = formatDocument<Post>(postSnapshot);

      const [author, errorGettingAuthor] = await tryCatch(
        auth.getUser(post.authorUid)
      );

      if (errorGettingAuthor || !author)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: errorGettingAuthor });

      return { ...post, author };
    }),
  getMany: privateProcedure
    .input(
      z.object({
        blogId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { blogId } = input;

      const [postsSnapshot, error] = await tryCatch(
        db
          .collection(collections.posts)
          .where('blogId', '==', blogId)
          .orderBy('publishedAt', 'desc')
          .get()
      );

      if (error || !postsSnapshot)
        throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      const posts = snapshotToArray<Post>(postsSnapshot);

      const authorsUid = [...new Set(posts.map((post) => post.authorUid))].map(
        (uid) => ({ uid })
      );

      const [authors, errorGettingAuthors] = await tryCatch(
        auth.getUsers(authorsUid)
      );

      if (errorGettingAuthors || !authors)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          cause: errorGettingAuthors,
        });

      return posts.map((post) => ({
        ...post,
        author: authors.users.find((user) => user.uid === post.authorUid),
      }));
    }),
  create: privateProcedure
    .input(createPostSchema)
    .mutation(async ({ input }) => {
      const [postRef, error] = await tryCatch(
        db.collection(collections.posts).add(input)
      );

      if (error || !postRef)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      const [post, errorGettingPost] = await tryCatch(postRef.get());

      if (errorGettingPost || !post)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: errorGettingPost });

      return formatDocument<Post>(post);
    }),

  update: privateProcedure
    .input(updatePostSchema)
    .mutation(async ({ input }) => {
      const { id, ...inputWithoutId } = input;

      const [, error] = await tryCatch(
        db.collection(collections.posts).doc(id).update(inputWithoutId)
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      return { message: 'Post updated!' };
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

import { router, privateProcedure } from '~/server/trpc';
import { z } from 'zod';
import { getCreateSchema, getUpdateSchema } from '~/lib/helpers/zod';
import { tryCatch } from '~/lib/helpers/try-catch';
import { db } from '~/services/firebase/admin';
import { collections } from '~/lib/constants/firebase';
import { TRPCError } from '@trpc/server';
import {
  conditionalWheres,
  formatDocument,
  snapshotToArray,
} from '~/lib/helpers/firebase';
import { isBlogOwner } from '../middlewares';

const blogSchema = z.object({
  id: z.string(),
  name: z.string(),
  photoUrl: z.string().optional(),
  subdomain: z.string(),
  domain: z.string().optional().default(''),
  ownerUid: z.string(),
  editors: z.string().array(),
  links: z.record(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Blog = z.infer<typeof blogSchema>;

const createBlogSchema = getCreateSchema(blogSchema).omit({ ownerUid: true });

const updateBlogSchema = getUpdateSchema(blogSchema);

export const blogRouter = router({
  get: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;

      const [blogSnapshot, error] = await tryCatch(
        db.collection(collections.blogs).doc(id).get()
      );

      if (error || !blogSnapshot)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      return formatDocument<Blog>(blogSnapshot);
    }),
  getMany: privateProcedure
    .input(
      z.object({
        ownerUid: z.string().optional(),
        subdomain: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { ownerUid, subdomain } = input;

      const [blogSnapshot, error] = await tryCatch(
        conditionalWheres(db.collection(collections.blogs), [
          ['ownerUid', '==', ownerUid],
          ['subdomain', '==', subdomain],
        ]).get()
      );

      if (error || !blogSnapshot)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      return snapshotToArray<Blog>(blogSnapshot);
    }),
  create: privateProcedure
    .input(createBlogSchema)
    .mutation(async ({ input, ctx }) => {
      const { uid } = ctx.decodedIdToken;

      const [blogsSnapshot, errorFindingBlogs] = await tryCatch(
        db
          .collection(collections.blogs)
          .where('subdomain', '==', input.subdomain)
          .count()
          .get()
      );

      if (errorFindingBlogs || !blogsSnapshot || blogsSnapshot.data().count > 0)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Subdomain not available',
        });

      const [blogRef, error] = await tryCatch(
        db.collection(collections.blogs).add({ ...input, ownerUid: uid })
      );

      if (error || !blogRef)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      const [blogSnapshot, errorGettingBlog] = await tryCatch(blogRef.get());

      if (errorGettingBlog || !blogSnapshot)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: errorGettingBlog });

      return formatDocument<Blog>(blogSnapshot);
    }),
  update: privateProcedure
    .input(updateBlogSchema)
    .use(isBlogOwner({ idKey: 'id' }))
    .mutation(async ({ input }) => {
      const { id, ...inputWithoutId } = input;

      const blogRef = db.collection(collections.blogs).doc(id);

      const [, error] = await tryCatch(blogRef.update(inputWithoutId));

      if (error || !blogRef)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      const [blogSnapshot, errorGettingBlog] = await tryCatch(blogRef.get());

      if (errorGettingBlog || !blogSnapshot)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: errorGettingBlog });

      return formatDocument<Blog>(blogSnapshot);
    }),
  delete: privateProcedure
    .use(isBlogOwner({ idKey: 'id' }))
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id } = input;

      const [, error] = await tryCatch(
        db.collection(collections.blogs).doc(id).delete()
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      return { message: 'Blog deleted' };
    }),
});

export type BlogRouter = typeof blogRouter;

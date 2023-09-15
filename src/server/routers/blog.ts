import { router, privateProcedure } from '~/server/trpc';
import { z } from 'zod';
import { getCreateSchema, getUpdateSchema } from '~/lib/helpers/zod';
import { tryCatch } from '~/lib/helpers/try-catch';
import { db } from '~/services/firebase/admin';
import { collections } from '~/lib/constants/firebase';
import { TRPCError } from '@trpc/server';
import { formatDocument } from '~/lib/helpers/firebase';
import { isBlogOwner } from '../middlewares';

const blogSchema = z.object({
  id: z.string(),
  name: z.string(),
  ownerUid: z.string(),
  editors: z.string().array(),
  linkTwitter: z.string().optional(),
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
  create: privateProcedure
    .input(createBlogSchema)
    .mutation(async ({ input, ctx }) => {
      const { uid } = ctx.decodedIdToken;

      const [, error] = await tryCatch(
        db.collection(collections.blogs).add({ ...input, ownerUid: uid })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      return { message: 'Blog created' };
    }),
  update: privateProcedure
    .use(isBlogOwner({ idKey: 'id' }))
    .input(updateBlogSchema)
    .mutation(async ({ input }) => {
      const { id, ...inputWithoutId } = input;

      const [, error] = await tryCatch(
        db.collection(collections.blogs).doc(id).update(inputWithoutId)
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      return { message: 'Blog updated' };
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

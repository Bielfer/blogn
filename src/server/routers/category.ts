import { router, privateProcedure, publicProcedure } from '~/server/trpc';
import { z } from 'zod';
import { db } from '~/services/firebase/admin';
import { collections } from '~/lib/constants/firebase';
import { TRPCError } from '@trpc/server';
import { formatDocument, snapshotToArray } from '~/lib/helpers/firebase';
import { tryCatch } from '~/lib/helpers/try-catch';
import { getCreateSchema, getUpdateSchema } from '~/lib/helpers/zod';
import { toUrlFormat } from '~/lib/helpers/string';

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().default(''),
  description: z.string().optional(),
  blogId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Category = z.infer<typeof categorySchema>;

const createCategorySchema = getCreateSchema(categorySchema);

const updateCategorySchema = getUpdateSchema(categorySchema);

export const categoryRouter = router({
  get: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;

      const [categorySnapshot, error] = await tryCatch(
        db.collection(collections.categories).doc(id).get()
      );

      if (error || !categorySnapshot)
        throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return formatDocument<Category>(categorySnapshot);
    }),
  getMany: publicProcedure
    .input(z.object({ blogId: z.string() }))
    .query(async ({ input }) => {
      const { blogId } = input;

      const [categoriesSnapshot, error] = await tryCatch(
        db
          .collection(collections.categories)
          .where('blogId', '==', blogId)
          .orderBy('name', 'asc')
          .get()
      );

      if (error || !categoriesSnapshot)
        throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      const categories = snapshotToArray<Category>(categoriesSnapshot);

      return categories;
    }),
  create: privateProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      const [, error] = await tryCatch(
        db
          .collection(collections.categories)
          .add({ ...input, url: toUrlFormat(input.name) })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return { message: 'Category created' };
    }),
  update: privateProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }) => {
      const { id, ...inputWithoutId } = input;

      const [, error] = await tryCatch(
        db
          .collection(collections.categories)
          .doc(id)
          .update({
            ...inputWithoutId,
            url: toUrlFormat(inputWithoutId.name ?? ''),
          })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return { message: 'Category updated' };
    }),
  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id } = input;

      const [, error] = await tryCatch(
        db.collection(collections.categories).doc(id).delete()
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return { message: 'Category deleted' };
    }),
});

export type UserCategoryRouter = typeof categoryRouter;

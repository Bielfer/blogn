import { TRPCError } from '@trpc/server';
import { middleware } from './trpc';
import { tryCatch } from '~/lib/helpers/try-catch';
import { db } from '~/services/firebase/admin';
import { collections } from '~/lib/constants/firebase';
import { formatDocument } from '~/lib/helpers/firebase';
import { type Blog } from './routers/blog';

export const isBlogOwner = ({ idKey }: { idKey: string }) =>
  middleware(async ({ next, ctx, input }) => {
    const { decodedIdToken } = ctx;
    const blogId = (input as any)?.[idKey];

    if (!decodedIdToken)
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' });

    if (!blogId)
      throw new TRPCError({ code: 'NOT_FOUND', cause: 'Blog id not provided' });

    const [blogSnapshot, error] = await tryCatch(
      db.collection(collections.blogs).doc(blogId).get()
    );

    if (error || !blogSnapshot)
      throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

    const blog = formatDocument<Blog>(blogSnapshot);

    if (blog.ownerUid !== decodedIdToken.uid)
      throw new TRPCError({
        code: 'FORBIDDEN',
        cause: 'You have no permission to modify this blog',
      });

    return next({
      ctx: {
        blog,
      },
    });
  });

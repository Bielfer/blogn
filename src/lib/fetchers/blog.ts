import { type User } from '~/store/user';
import { tryCatch } from '../helpers/try-catch';
import { db } from '~/services/firebase/admin';
import { collections } from '../constants/firebase';
import { notFound } from 'next/navigation';
import { routes } from '../constants/routes';
import { headers } from 'next/headers';
import { getDomains } from '../helpers/metadata';
import { caller } from '~/server/routers/_app';

export const userHasBlogs = async (user: User) => {
  const pathname = headers().get('pathname');

  if (!user) return false;

  const [countSnapshot, error] = await tryCatch(
    db
      .collection(collections.blogs)
      .where('ownerUid', '==', user.uid)
      .count()
      .get()
  );

  if (
    (error || !countSnapshot || countSnapshot.data().count === 0) &&
    pathname !== routes.appBlogsNewFirst
  )
    return false;

  return true;
};

export const getBlogByDomain = async (params: { domain: string }) => {
  const { domain, subdomain } = getDomains(params.domain);

  const [blogs, error] = await tryCatch(
    caller.blog.getMany({
      ...(!!subdomain ? { subdomain } : { domain }),
    })
  );

  if (error || !blogs || blogs.length === 0) notFound();

  return blogs[0]!;
};

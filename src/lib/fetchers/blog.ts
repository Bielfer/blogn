import { type User } from '~/store/user';
import { tryCatch } from '../helpers/try-catch';
import { db } from '~/services/firebase/admin';
import { collections } from '../constants/firebase';
import { redirect } from 'next/navigation';
import { routes } from '../constants/routes';
import { headers } from 'next/headers';

export const userHasBlogs = async (user: User) => {
  const pathname = headers().get('pathname');

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
    redirect(routes.appBlogsNewFirst);
};

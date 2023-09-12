/* eslint @typescript-eslint/no-unused-vars:off */
import { db } from '~/services/firebase/admin';
import { collections } from '../constants/firebase';
import { initialValues } from '~/components/forms/form-post/form-post';
import { setPostSchema } from '~/server/routers/post';

export const getPostById = (id: string) =>
  db.collection(collections.posts).doc(id).get();

export const createEmptyPost = () => {
  const emptyPost = setPostSchema.omit({ id: true }).default({}).parse({});

  return db.collection(collections.posts).add(emptyPost);
};

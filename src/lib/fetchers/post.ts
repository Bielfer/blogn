/* eslint @typescript-eslint/no-unused-vars:off */
import { db } from '~/services/firebase/admin';
import { collections } from '../constants/firebase';
import { tryCatch } from '../helpers/try-catch';
import { caller } from '~/server/routers/_app';
import { type GetPosts } from '~/server/routers/post';
import { notFound } from 'next/navigation';

export const getPostById = (id: string) =>
  db.collection(collections.posts).doc(id).get();

export const getPosts = async (query: GetPosts) => {
  const [data, errorPosts] = await tryCatch(caller.post.getMany(query));

  if (errorPosts || !data) notFound();

  return data;
};

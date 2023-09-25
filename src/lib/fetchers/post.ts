/* eslint @typescript-eslint/no-unused-vars:off */
import { db } from '~/services/firebase/admin';
import { collections } from '../constants/firebase';
import { tryCatch } from '../helpers/try-catch';
import { caller } from '~/server/routers/_app';
import { type GetPosts } from '~/server/routers/post';
import { notFound } from 'next/navigation';
import { postStatus } from '../constants/posts';

export const getPostById = (id: string) =>
  db.collection(collections.posts).doc(id).get();

export const getPosts = async (query: GetPosts) => {
  const [data, errorPosts] = await tryCatch(caller.post.getMany(query));

  if (errorPosts || !data) notFound();

  return data;
};

export const getPostByUrl = async ({
  postUrl,
  blogId,
}: {
  postUrl: string;
  blogId: string;
}) => {
  const [data, errorPosts] = await tryCatch(
    caller.post.getMany({ urlTitle: postUrl, blogId })
  );

  if (errorPosts || !data || data.posts.length === 0) notFound();

  return data.posts[0]!;
};

export const getPreviousAndNext = async ({
  blogId,
  postId,
}: {
  blogId: string;
  postId: string;
}) => {
  const [data, error] = await tryCatch(
    caller.post.getPreviousAndNext({
      blogId,
      status: postStatus.published,
      postId,
    })
  );

  if (error || !data) notFound();

  return data;
};

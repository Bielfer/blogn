import { type ObjectValues } from '~/types/core';

export const collections = {
  posts: 'posts',
  categories: 'categories',
  blogs: 'blogs',
} as const;

export const bucketPaths = {
  blogs: 'blogs',
  posts: 'posts',
  users: 'users',
} as const;

export type BucketPath = ObjectValues<typeof bucketPaths>;

export const bucketPathsValues = Object.values(
  bucketPaths
) as unknown as readonly [BucketPath, ...BucketPath[]];

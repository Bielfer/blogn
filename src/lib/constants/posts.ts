import { type ObjectValues } from '~/types/core';

export const postStatus = {
  draft: 'DRAFT',
  published: 'PUBLISHED',
} as const;

export type PostStatus = ObjectValues<typeof postStatus>;

export const postStatusValues = Object.values(
  postStatus
) as unknown as readonly [PostStatus, ...PostStatus[]];

export const postStatusNames = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
} as const;

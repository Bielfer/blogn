import { caller } from '~/server/routers/_app';
import { tryCatch } from '../helpers/try-catch';
import { notFound } from 'next/navigation';

export const getCategoryByUrl = async ({
  blogId,
  url,
}: {
  blogId: string;
  url: string;
}) => {
  const [categories, error] = await tryCatch(
    caller.category.getMany({ blogId, url })
  );

  if (error || !categories || categories.length === 0) notFound();

  return categories[0]!;
};

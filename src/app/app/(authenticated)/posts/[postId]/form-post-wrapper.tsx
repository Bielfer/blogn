'use client';
import type { FC } from 'react';
import FormPost from '~/components/forms/form-post';
import LoadingWrapper from '~/components/loading-wrapper';
import { trpc } from '~/lib/trpc';

type Props = {
  postId: string;
};

const FormPostWrapper: FC<Props> = ({ postId }) => {
  const { data, isLoading } = trpc.post.get.useQuery(
    { id: postId },
    {
      staleTime: 0,
      cacheTime: 0,
    }
  );

  return (
    <LoadingWrapper isLoading={isLoading} page>
      <FormPost post={data} />
    </LoadingWrapper>
  );
};

export default FormPostWrapper;

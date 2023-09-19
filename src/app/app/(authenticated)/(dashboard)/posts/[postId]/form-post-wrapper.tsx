'use client';
import type { FC } from 'react';
import FormPost from '~/components/forms/form-post';
import LoadingWrapper from '~/components/loading-wrapper';
import Spinner from '~/components/spinner';
import { trpc } from '~/lib/trpc';

type Props = {
  postId: string;
};

const FormPostWrapper: FC<Props> = ({ postId }) => {
  const { data: post, isLoading } = trpc.post.get.useQuery(
    { id: postId },
    {
      staleTime: 0,
      cacheTime: 0,
    }
  );

  if (!post) return <Spinner page size="lg" />;

  return (
    <LoadingWrapper isLoading={isLoading} page>
      <FormPost post={post} />
    </LoadingWrapper>
  );
};

export default FormPostWrapper;

'use client';
import type { FC } from 'react';
import FormDomains from '~/components/forms/form-domains';
import LoadingWrapper from '~/components/loading-wrapper';
import { trpc } from '~/lib/trpc';
import { useBlog } from '~/store';

const FormDomainsWrapper: FC = () => {
  const { selectedBlog } = useBlog();
  const { data: blog, isLoading } = trpc.blog.get.useQuery(
    { id: selectedBlog?.id ?? '' },
    { enabled: !!selectedBlog }
  );

  return (
    <LoadingWrapper isLoading={isLoading}>
      <FormDomains blog={blog} className="mx-auto max-w-md" />
    </LoadingWrapper>
  );
};

export default FormDomainsWrapper;

'use client';

import type { FC } from 'react';
import FormBlog from '~/components/forms/form-blog';
import LoadingWrapper from '~/components/loading-wrapper';
import { tryCatch } from '~/lib/helpers/try-catch';
import { trpc } from '~/lib/trpc';
import { useBlog, useToast } from '~/store';

const FormBlogWrapper: FC = () => {
  const { addToast } = useToast();
  const { selectedBlog } = useBlog();
  const context = trpc.useContext();
  const { data: blog, isFetching } = trpc.blog.get.useQuery(
    { id: selectedBlog?.id ?? '' },
    { enabled: !!selectedBlog }
  );

  return (
    <LoadingWrapper isLoading={isFetching}>
      <FormBlog
        className="mx-auto max-w-md pb-20 pt-6"
        title="Update your blog"
        afterSubmit={async () => {
          addToast({ type: 'success', content: 'Blog updated' });
          const [, error] = await tryCatch(context.blog.getMany.refetch());
          if (error)
            addToast({
              type: 'warning',
              content:
                'Your blog was updated, but to update the blog switcher you need to refresh the page',
              duration: 3000,
            });
        }}
        blog={blog}
      />
    </LoadingWrapper>
  );
};

export default FormBlogWrapper;

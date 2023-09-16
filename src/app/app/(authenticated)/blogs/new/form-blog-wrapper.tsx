'use client';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import FormBlog from '~/components/forms/form-blog';
import { routes } from '~/lib/constants/routes';

const FormBlogWrapper: FC = () => {
  const router = useRouter();

  return (
    <FormBlog
      className="mx-auto max-w-md pb-20 pt-6"
      title="Create a new blog"
      afterSubmit={() => router.push(routes.appPosts)}
    />
  );
};

export default FormBlogWrapper;

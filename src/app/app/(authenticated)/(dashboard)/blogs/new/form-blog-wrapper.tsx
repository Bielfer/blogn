'use client';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import FormBlog from '~/components/forms/form-blog';
import { routes } from '~/lib/constants/routes';

const FormBlogWrapper: FC = () => {
  const router = useRouter();
  return (
    <div className="flex justify-center pb-10">
      <FormBlog
        className="max-w-md rounded-lg border p-6 shadow"
        title="Create your blog"
        afterSubmit={() => router.push(routes.appPosts)}
      />
    </div>
  );
};

export default FormBlogWrapper;

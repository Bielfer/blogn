'use client';

import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import FormBlog from '~/components/forms/form-blog';

const FormBlogWrapper: FC = () => {
  const router = useRouter();
  return (
    <div className="flex h-screen items-center justify-center">
      <FormBlog
        className="max-w-md rounded-lg border p-6 shadow"
        title="Create your blog"
        firstBlog
        afterSubmit={() => router.refresh()}
      />
    </div>
  );
};

export default FormBlogWrapper;

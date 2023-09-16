import { type Metadata } from 'next';
import { type FC } from 'react';
import FormBlogWrapper from './form-blog-wrapper';

export const metadata: Metadata = {
  title: 'Create your first blog',
  description: '',
};

const NewFirstBlog: FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <FormBlogWrapper />
    </div>
  );
};

export default NewFirstBlog;

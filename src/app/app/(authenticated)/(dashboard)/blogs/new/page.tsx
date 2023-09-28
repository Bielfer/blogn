import { type Metadata } from 'next';
import { type FC } from 'react';
import FormBlogWrapper from './form-blog-wrapper';

export const metadata: Metadata = {
  title: 'Create another blog',
};

const NewBlog: FC = () => {
  return (
    <div>
      <FormBlogWrapper />
    </div>
  );
};

export default NewBlog;

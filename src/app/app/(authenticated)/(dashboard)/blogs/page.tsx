import { type Metadata } from 'next';
import { type FC } from 'react';
import FormBlogWrapper from './form-blog-wrapper';

export const metadata: Metadata = {
  title: 'Create a new blog',
};

const NewBlog: FC = () => {
  return <FormBlogWrapper />;
};

export default NewBlog;

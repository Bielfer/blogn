import { type Metadata } from 'next';
import { type FC } from 'react';
import FormBlogWrapper from './form-blog-wrapper';

export const metadata: Metadata = {
  title: 'Blog settings',
};

const BlogSettings: FC = () => {
  return <FormBlogWrapper />;
};

export default BlogSettings;

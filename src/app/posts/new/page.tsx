import { type Metadata } from 'next';
import { type FC } from 'react';
import FormPost from '~/components/forms/form-post';

export const metadata: Metadata = {
  title: 'Create your blog post | Blogn',
  description: 'The easiest way to create your blog post',
};

const NewPost: FC = () => {
  return (
    <>
      <FormPost />
    </>
  );
};

export default NewPost;

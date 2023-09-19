import { type Metadata } from 'next';
import { type FC } from 'react';
import FormPostWrapper from './form-post-wrapper';

export const metadata: Metadata = {
  title: 'Edit your post',
};

type Props = {
  params: {
    postId: string;
  };
};

const PostEdit: FC<Props> = ({ params }) => {
  const { postId } = params;

  return <FormPostWrapper postId={postId} />;
};

export default PostEdit;

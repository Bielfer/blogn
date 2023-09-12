'use client';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { HiMiniPlus } from 'react-icons/hi2';
import Button from '~/components/button';
import { initialValues } from '~/components/forms/form-post/form-post';
import { postStatus } from '~/lib/constants/posts';
import { routes } from '~/lib/constants/routes';
import { tryCatch } from '~/lib/helpers/try-catch';
import { trpc } from '~/lib/trpc';
import { useToast } from '~/store';

const ButtonNewPost: FC = () => {
  const { addToast } = useToast();
  const router = useRouter();
  const { mutateAsync: createPost, isLoading } = trpc.post.set.useMutation();

  const handleClick = async () => {
    const emptyPost = { ...initialValues, status: postStatus.draft };

    const [post, error] = await tryCatch(createPost(emptyPost));

    if (error || !post) {
      addToast({
        type: 'error',
        content: 'Failed to start a new post, refresh the page and try again',
        duration: 5000,
      });
      return;
    }

    router.push(routes.appPostEdit(post.id));
  };

  return (
    <Button
      iconRight={HiMiniPlus}
      variant="primary"
      onClick={handleClick}
      loading={isLoading}
    >
      New Post
    </Button>
  );
};

export default ButtonNewPost;

'use client';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { HiMiniPlus } from 'react-icons/hi2';
import Button from '~/components/button';
import { postStatus } from '~/lib/constants/posts';
import { routes } from '~/lib/constants/routes';
import { tryCatch } from '~/lib/helpers/try-catch';
import { trpc } from '~/lib/trpc';
import { useBlog, useToast, useUser } from '~/store';

const ButtonNewPost: FC = () => {
  const { addToast } = useToast();
  const router = useRouter();
  const { selectedBlog } = useBlog();
  const { user } = useUser();
  const { mutateAsync: createPost, isLoading } = trpc.post.create.useMutation();

  const handleClick = async () => {
    if (!user) {
      addToast({
        type: 'error',
        content: 'A weird bug happened, please refresh the page',
      });
      return;
    }
    if (!selectedBlog) {
      addToast({
        type: 'error',
        content: 'Please select a blog before creating a post',
      });
      return;
    }

    const [post, error] = await tryCatch(
      createPost({
        blogId: selectedBlog.id,
        content: { blocks: [] },
        publishedAt: new Date(),
        SEODescription: '',
        SEOTitle: '',
        status: postStatus.draft,
        title: '',
        urlTitle: '',
        authorUid: user.uid,
      })
    );

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

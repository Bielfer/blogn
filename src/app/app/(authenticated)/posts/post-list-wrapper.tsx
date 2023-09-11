'use client';
import { format } from 'date-fns';
import type { FC } from 'react';
import LoadingWrapper from '~/components/loading-wrapper';
import PostsList from '~/components/posts-list';
import { publicImagesHref } from '~/lib/constants/public';
import { routes } from '~/lib/constants/routes';
import { trpc } from '~/lib/trpc';
import { useUser } from '~/store';

const PostListWrapper: FC = () => {
  const { user } = useUser();
  const { data: posts, isLoading } = trpc.post.getMany.useQuery(
    { uid: user?.uid },
    { enabled: !!user?.uid }
  );

  const formattedPosts =
    posts?.map((post) => ({
      id: post.id,
      title: post.title,
      href: { pathname: routes.appPostEditor, query: { postId: post.id } },
      description: post.SEODescription || 'No description provided',
      date: format(post.updatedAt, 'MMM d, yyyy'),
      datetime: format(post.updatedAt, 'yyyy-MM-dd'),
      category: { title: 'Test', href: '/' },
      author: {
        name: user?.displayName ?? 'No name provided',
        role: '',
        imageUrl: user?.photoURL ?? publicImagesHref.userIcon,
      },
    })) ?? [];

  return (
    <LoadingWrapper isLoading={isLoading}>
      <PostsList posts={formattedPosts} columns={3} />
    </LoadingWrapper>
  );
};

export default PostListWrapper;

'use client';
import { format } from 'date-fns';
import type { FC } from 'react';
import PostsList from '~/components/posts-list';
import { publicImagesHref } from '~/lib/constants/public';
import { routes } from '~/lib/constants/routes';
import { trpc } from '~/lib/trpc';
import { useUser } from '~/store';

const PostListWrapper: FC = () => {
  const { user } = useUser();
  const { data: posts } = trpc.post.getMany.useQuery(
    { uid: user?.uid },
    { enabled: !!user?.uid }
  );

  const formattedPosts =
    posts?.map((post) => ({
      id: post.id,
      title: post.title,
      href: { pathname: routes.appNewPost, query: { postId: post.id } },
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

  return <PostsList posts={formattedPosts} columns={3} />;
};

export default PostListWrapper;

'use client';
import { format } from 'date-fns';
import type { FC } from 'react';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import EmptyState from '~/components/empty-state';
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
      href: routes.appPostEdit(post.id),
      description: post.SEODescription || 'No description provided',
      date: format(post.publishedAt, 'MMM d, yyyy'),
      datetime: format(post.publishedAt, 'yyyy-MM-dd'),
      category: { title: 'Test', href: '/' },
      author: {
        name: user?.displayName ?? 'No name provided',
        role: '',
        imageUrl: user?.photoURL ?? publicImagesHref.userIcon,
      },
    })) ?? [];

  return (
    <div className="py-10 sm:py-16">
      <LoadingWrapper isLoading={isLoading}>
        {!!posts && posts.length > 0 ? (
          <PostsList posts={formattedPosts} columns={3} />
        ) : (
          <EmptyState
            className="mx-auto max-w-md"
            title="No posts created"
            subtitle="To create a new post you just have to click on the new post button"
            icon={HiOutlinePencilSquare}
          />
        )}
      </LoadingWrapper>
    </div>
  );
};

export default PostListWrapper;

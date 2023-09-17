'use client';
import { format } from 'date-fns';
import type { FC } from 'react';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import EmptyState from '~/components/empty-state';
import LoadingWrapper from '~/components/loading-wrapper';
import PostsList from '~/components/posts-list';
import { postStatus, postStatusNames } from '~/lib/constants/posts';
import { publicImagesHref } from '~/lib/constants/public';
import { routes } from '~/lib/constants/routes';
import { trpc } from '~/lib/trpc';
import { useBlog } from '~/store';

const PostListWrapper: FC = () => {
  const { selectedBlog } = useBlog();
  const { data: posts, isLoading } = trpc.post.getMany.useQuery(
    { blogId: selectedBlog?.id ?? '' },
    { enabled: !!selectedBlog }
  );

  const formattedPosts =
    posts?.map((post) => ({
      id: post.id,
      title: post.title || 'No title created',
      href: routes.appPostEdit(post.id),
      description: post.SEODescription || 'No description created',
      date: format(post.publishedAt, 'MMM d, yyyy'),
      datetime: format(post.publishedAt, 'yyyy-MM-dd'),
      author: {
        name: post.author?.displayName ?? 'No name provided',
        role: '',
        imageUrl: post.author?.photoURL ?? publicImagesHref.userIcon,
      },
      badges: [
        {
          text: postStatusNames[post.status],
          color:
            post.status === postStatus.published
              ? ('green' as const)
              : ('yellow' as const),
          pill: true,
        },
      ],
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

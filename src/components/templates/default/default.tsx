import type { FC, ReactNode } from 'react';
import TemplateDefaultHeading from './heading';
import { type Blog } from '~/server/routers/blog';
import Container from '~/components/container';
import TemplateDefaultFooter from './footer';
import { env } from '~/env.mjs';
import Logo from '~/components/logo';
import { type Post } from '~/server/routers/post';
import PostsList from '~/components/posts-list';
import { routes } from '~/lib/constants/routes';
import { format } from 'date-fns';
import { type UserRecord } from 'firebase-admin/auth';
import { publicImagesHref } from '~/lib/constants/public';
import Pagination from '~/components/pagination';
import { type PaginationProps } from '~/components/pagination/pagination';
import EmptyState from '~/components/empty-state';
import { type IconType } from 'react-icons';

type Props = {
  blog: Blog;
  children?: ReactNode;
  posts?: (Post & { author: UserRecord | undefined })[];
  emptyState?: { title: string; icon?: IconType; subtitle?: string };
  pagination?: PaginationProps;
  heading?: boolean;
};

const TemplateDefault: FC<Props> = ({
  blog,
  children,
  posts,
  pagination,
  emptyState,
  heading,
}) => {
  return (
    <>
      {heading && <TemplateDefaultHeading blog={blog} />}
      <Container
        className="pt-6 sm:pt-12"
        smallerContainerSize="max-w-2xl"
        smallerContainer
      >
        {children}
        {!!posts &&
          (posts.length > 0 ? (
            <PostsList
              posts={posts.map((post) => ({
                id: post.id,
                title: post.title || 'No title created',
                href: routes.blogPost(post.urlTitle),
                description: post.SEODescription || '',
                date: format(post.publishedAt, 'MMM d, yyyy'),
                datetime: format(post.publishedAt, 'yyyy-MM-dd'),
                author: {
                  name: post.author?.displayName ?? '',
                  role: '',
                  imageUrl: post.author?.photoURL ?? publicImagesHref.userIcon,
                },
                badges: post.categories.map((category) => ({
                  text: category,
                  color: 'gray',
                  pill: true,
                })),
              }))}
            />
          ) : (
            <EmptyState
              className="mb-32 mt-20"
              title={emptyState?.title ?? ''}
              icon={emptyState?.icon}
              subtitle={emptyState?.subtitle}
            />
          ))}
        {!!pagination && <Pagination className="mb-10 mt-16" {...pagination} />}
      </Container>
      <Container smallerContainerSize="max-w-5xl" smallerContainer>
        <TemplateDefaultFooter blog={blog} />
      </Container>
      <div className="flex items-center justify-center gap-x-3 py-6">
        <p className="text-sm text-gray-500">Created with</p>
        <Logo href={env.NEXT_PUBLIC_APP_URL} height={50} />
      </div>
    </>
  );
};

export default TemplateDefault;

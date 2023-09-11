import { type Metadata } from 'next';
import { type FC } from 'react';
import MyLink from '~/components/my-link';
import DashboardNavbar from '~/components/dashboard-navbar';
import { dashboardRoutes, routes } from '~/lib/constants/routes';
import { HiMiniPlus } from 'react-icons/hi2';
import PostListWrapper from './post-list-wrapper';

export const metadata: Metadata = {
  title: 'Your Posts',
  description: 'Create and edit your blog posts',
};

const Posts: FC = () => {
  return (
    <DashboardNavbar items={dashboardRoutes}>
      <header className="flex items-center justify-between">
        <h1>Posts</h1>
        <MyLink
          href={routes.newPost}
          iconRight={HiMiniPlus}
          variant="button-primary"
        >
          New Post
        </MyLink>
      </header>
      <PostListWrapper />
    </DashboardNavbar>
  );
};

export default Posts;

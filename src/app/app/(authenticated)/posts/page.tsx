import { type Metadata } from 'next';
import { type FC } from 'react';
import DashboardNavbar from '~/components/dashboard-navbar';
import { dashboardRoutes } from '~/lib/constants/routes';
import PostListWrapper from './post-list-wrapper';
import ButtonNewPost from './button-new-post';

export const metadata: Metadata = {
  title: 'Your Posts',
  description: 'Create and edit your blog posts',
};

const Posts: FC = () => {
  return (
    <DashboardNavbar items={dashboardRoutes}>
      <header className="flex items-center justify-between">
        <h1>Posts</h1>
        <ButtonNewPost />
      </header>
      <PostListWrapper />
    </DashboardNavbar>
  );
};

export default Posts;

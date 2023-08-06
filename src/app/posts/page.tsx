import { PlusIcon } from '@heroicons/react/20/solid';
import { type Metadata } from 'next';
import { type FC } from 'react';
import MyLink from '~/components/my-link';
import DashboardNavbar from '~/components/dashboard-navbar';
import BasicTemplate from '~/components/templates/basic';
import { dashboardPaths, paths } from '~/constants/paths';

export const metadata: Metadata = {
  title: 'Your Posts | Blogn',
  description: 'Create and edit your blog posts',
};

const Posts: FC = () => {
  return (
    <DashboardNavbar items={dashboardPaths}>
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Posts
        </h1>
        <MyLink
          href={paths.newPost}
          iconRight={PlusIcon}
          variant="button-primary"
        >
          New Post
        </MyLink>
      </header>
      <BasicTemplate columns={3} />
    </DashboardNavbar>
  );
};

export default Posts;

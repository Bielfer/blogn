import { type Metadata } from 'next';
import { type FC } from 'react';
import DashboardNavbar from '~/components/dashboard-navbar';
import { dashboardRoutes } from '~/lib/constants/routes';
import FormBlogWrapper from './form-blog-wrapper';

export const metadata: Metadata = {
  title: 'Create a new blog',
};

const NewBlog: FC = () => {
  return (
    <DashboardNavbar items={dashboardRoutes}>
      <FormBlogWrapper />
    </DashboardNavbar>
  );
};

export default NewBlog;

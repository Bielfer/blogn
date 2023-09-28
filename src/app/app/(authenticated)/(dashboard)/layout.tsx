import type { FC, ReactNode } from 'react';
import DashboardNavbar from '~/components/dashboard-navbar';
import { dashboardRoutes } from '~/lib/constants/routes';
import SelectedBlog from './selected-blog';

type Props = {
  children: ReactNode;
};

const DashboardLayout: FC<Props> = ({ children }) => {
  return (
    <DashboardNavbar items={dashboardRoutes}>
      <SelectedBlog>{children}</SelectedBlog>
    </DashboardNavbar>
  );
};

export default DashboardLayout;

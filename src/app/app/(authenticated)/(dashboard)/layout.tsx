import type { FC, ReactNode } from 'react';
import DashboardNavbar from '~/components/dashboard-navbar';
import { dashboardRoutes } from '~/lib/constants/routes';

type Props = {
  children: ReactNode;
};

const DashboardLayout: FC<Props> = ({ children }) => {
  return <DashboardNavbar items={dashboardRoutes}>{children}</DashboardNavbar>;
};

export default DashboardLayout;

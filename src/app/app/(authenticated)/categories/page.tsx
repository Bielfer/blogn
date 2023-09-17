import { type Metadata } from 'next';
import { type FC } from 'react';
import DashboardNavbar from '~/components/dashboard-navbar';
import { dashboardRoutes, routes } from '~/lib/constants/routes';
import StackedListWrapper from './stacked-list-wrapper';
import MyLink from '~/components/my-link';
import { HiMiniPlus } from 'react-icons/hi2';

export const metadata: Metadata = {
  title: 'Your categories',
  description: '',
};

const CategoriesPage: FC = () => {
  return (
    <DashboardNavbar items={dashboardRoutes}>
      <header className="flex items-center justify-between">
        <h1>Categories</h1>
        <MyLink
          href={routes.appCategoriesNew}
          variant="button-primary"
          iconLeft={HiMiniPlus}
        >
          Category
        </MyLink>
      </header>
      <StackedListWrapper />
    </DashboardNavbar>
  );
};

export default CategoriesPage;

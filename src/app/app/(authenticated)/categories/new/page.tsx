import { type Metadata } from 'next';
import { type FC } from 'react';
import DashboardNavbar from '~/components/dashboard-navbar';
import FormCategory from '~/components/forms/form-category';
import { dashboardRoutes } from '~/lib/constants/routes';

export const metadata: Metadata = {
  title: 'Create a new category',
  description: '',
};

const NewCategoryPage: FC = () => {
  return (
    <DashboardNavbar items={dashboardRoutes}>
      <FormCategory className="mx-auto max-w-md py-12" />
    </DashboardNavbar>
  );
};

export default NewCategoryPage;

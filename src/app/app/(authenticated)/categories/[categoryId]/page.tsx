import { type Metadata } from 'next';
import { type FC } from 'react';
import DashboardNavbar from '~/components/dashboard-navbar';
import { dashboardRoutes } from '~/lib/constants/routes';
import FormCategoryWrapper from './form-category-wrapper';

export const metadata: Metadata = {
  title: 'Edit your category',
};

type Props = {
  params: {
    categoryId: string;
  };
};

const CategoryByIdPage: FC<Props> = ({ params }) => {
  const { categoryId } = params;

  return (
    <DashboardNavbar items={dashboardRoutes}>
      <FormCategoryWrapper categoryId={categoryId} />
    </DashboardNavbar>
  );
};

export default CategoryByIdPage;

import { type Metadata } from 'next';
import { type FC } from 'react';
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

  return <FormCategoryWrapper categoryId={categoryId} />;
};

export default CategoryByIdPage;

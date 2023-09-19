import { type Metadata } from 'next';
import { type FC } from 'react';
import FormCategory from '~/components/forms/form-category';

export const metadata: Metadata = {
  title: 'Create a new category',
  description: '',
};

const NewCategoryPage: FC = () => {
  return <FormCategory className="mx-auto max-w-md py-12" />;
};

export default NewCategoryPage;

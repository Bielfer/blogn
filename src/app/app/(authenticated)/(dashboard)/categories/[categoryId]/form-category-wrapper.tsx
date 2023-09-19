'use client';

import type { FC } from 'react';
import FormCategory from '~/components/forms/form-category';
import LoadingWrapper from '~/components/loading-wrapper';
import { trpc } from '~/lib/trpc';

type Props = {
  categoryId: string;
};

const FormCategoryWrapper: FC<Props> = ({ categoryId }) => {
  const { data: category, isLoading } = trpc.category.get.useQuery({
    id: categoryId,
  });

  return (
    <LoadingWrapper isLoading={isLoading}>
      <FormCategory className="mx-auto max-w-md py-12" category={category} />
    </LoadingWrapper>
  );
};

export default FormCategoryWrapper;

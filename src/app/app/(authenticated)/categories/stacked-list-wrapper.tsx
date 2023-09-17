'use client';
import type { FC } from 'react';
import LoadingWrapper from '~/components/loading-wrapper';
import StackedList from '~/components/stacked-list';
import { routes } from '~/lib/constants/routes';
import { trpc } from '~/lib/trpc';
import { useBlog } from '~/store';

const StackedListWrapper: FC = () => {
  const { selectedBlog } = useBlog();
  const {
    data: categories,
    isLoading,
    refetch,
  } = trpc.category.getMany.useQuery(
    { blogId: selectedBlog?.id ?? '' },
    { enabled: !!selectedBlog }
  );
  const { mutateAsync: deleteCategory } = trpc.category.delete.useMutation();

  return (
    <LoadingWrapper isLoading={isLoading}>
      <StackedList
        className="mx-auto max-w-2xl px-6 py-16"
        items={
          categories?.map((category) => ({
            title: category.name,
            subtitle: category.description,
            options: [
              { name: 'Edit', href: routes.appCategoriesEdit(category.id) },
              {
                name: 'Delete',
                action: async () => {
                  await deleteCategory({ id: category.id });
                  await refetch();
                },
              },
            ],
          })) ?? []
        }
      />
    </LoadingWrapper>
  );
};

export default StackedListWrapper;

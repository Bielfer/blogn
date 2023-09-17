'use client';
import type { FC } from 'react';
import { HiOutlineTag } from 'react-icons/hi2';
import EmptyState from '~/components/empty-state';
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
      {!!categories && categories.length > 0 ? (
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
      ) : (
        <EmptyState
          className="py-16"
          icon={HiOutlineTag}
          title="You don't have any categories yet"
          subtitle="To create a new one you just have to click on the button above"
        />
      )}
    </LoadingWrapper>
  );
};

export default StackedListWrapper;

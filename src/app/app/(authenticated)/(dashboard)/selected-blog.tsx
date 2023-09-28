'use client';
import type { FC, ReactNode } from 'react';
import Button from '~/components/button';
import DescriptionList from '~/components/description-list';
import { trpc } from '~/lib/trpc';
import { useBlog, useUser } from '~/store';

type Props = {
  children: ReactNode;
};

const SelectedBlog: FC<Props> = ({ children }) => {
  const { user } = useUser();
  const { setSelectedBlog } = useBlog();
  const { data: blogs } = trpc.blog.getMany.useQuery(
    { ownerUid: user?.uid },
    { enabled: !!user }
  );
  const { selectedBlog } = useBlog();

  if (!selectedBlog)
    return (
      <DescriptionList
        className="mx-auto max-w-md py-10"
        title="Select a blog"
        items={
          blogs?.map((blog) => ({
            name: blog.name,
            content: '',
            onRight: (
              <Button
                variant="link-primary"
                onClick={() => setSelectedBlog(blog)}
              >
                Select
              </Button>
            ),
          })) ?? []
        }
      />
    );

  return <>{children}</>;
};

export default SelectedBlog;

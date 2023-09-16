'use client';
import type { FC } from 'react';
import { trpc } from '~/lib/trpc';
import { useBlog, useUser } from '~/store';
import MyPopover from '../my-popover';
import { HiChevronUpDown, HiPlus } from 'react-icons/hi2';
import Spinner from '../spinner';
import { useRouter } from 'next/navigation';
import { routes } from '~/lib/constants/routes';
import cn from '~/lib/helpers/cn';
import { GiFountainPen } from 'react-icons/gi';

type Props = {
  className?: string;
};

const BlogSwitcher: FC<Props> = ({ className }) => {
  const router = useRouter();
  const { user } = useUser();
  const { setSelectedBlog, selectedBlog } = useBlog();
  const { data: blogs } = trpc.blog.getMany.useQuery(
    { ownerUid: user?.uid ?? '' },
    { enabled: !!user }
  );

  if (!blogs)
    return (
      <div className="flex items-center">
        <Spinner size="sm" />
      </div>
    );

  return (
    <div className={cn('flex items-center gap-x-3', className)}>
      <div className="hidden px-5 text-2xl font-light text-gray-200 sm:block">
        /
      </div>
      <MyPopover
        placement="bottom"
        className="flex items-center"
        button={
          <div className="flex items-center gap-x-2 rounded-lg px-3 py-1 text-sm font-medium transition duration-150 hover:bg-gray-100">
            {selectedBlog?.name ?? 'Select Blog'} <HiChevronUpDown />
          </div>
        }
        items={[
          ...(blogs?.map((blog) => ({
            text: blog.name,
            onClick: () => setSelectedBlog(blog),
            onLeft: (
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg'
                )}
              >
                {blog.photoUrl && blog.photoUrl.length > 0 ? (
                  <img
                    src={blog.photoUrl}
                    alt={`${blog.name} photo`}
                    className="object-contain"
                  />
                ) : (
                  <GiFountainPen className="h-5 w-5 text-gray-800" />
                )}
              </div>
            ),
          })) ?? []),
          {
            text: 'New Blog',
            onLeft: <HiPlus />,
            onClick: () => router.push(routes.appBlogsNew),
          },
        ]}
      />
      <div className="hidden px-5 text-2xl font-light text-gray-200 sm:block">
        /
      </div>
    </div>
  );
};

export default BlogSwitcher;

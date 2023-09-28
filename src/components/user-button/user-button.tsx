'use client';
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineCog8Tooth,
} from 'react-icons/hi2';
import { useBlog, useUser } from '~/store';
import { useState, type FC } from 'react';
import Modal from '../modal';
import { publicImagesHref } from '~/lib/constants/public';
import { trpc } from '~/lib/trpc';
import { useRouter } from 'next/navigation';
import { routes } from '~/lib/constants/routes';
import MyPopover from '../my-popover';
import FormUser from '../forms/form-user';

type Props = {
  displayName?: boolean;
};

const UserButton: FC<Props> = ({ displayName = false }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { setSelectedBlog } = useBlog();
  const { mutateAsync } = trpc.auth.logout.useMutation();

  return (
    <div className="shrink-0">
      <MyPopover
        placement="bottom-end"
        button={
          <div className="flex h-8 w-8 items-center justify-center gap-x-2 overflow-hidden rounded-full">
            <img
              src={user?.photoURL ?? publicImagesHref.userIcon}
              alt="User profile photo"
              className="object-contain"
            />
            {displayName && (
              <span className="text-sm font-medium">
                {user?.displayName ?? ''}
              </span>
            )}
          </div>
        }
        items={[
          {
            text: 'Manage Account',
            onClick: () => setIsOpen(true),
            onLeft: <HiOutlineCog8Tooth className="h-4 w-4" />,
          },
          {
            text: 'Sign Out',
            onClick: async () => {
              await mutateAsync();
              setSelectedBlog(null);
              router.replace(routes.appHome);
            },
            onLeft: <HiOutlineArrowRightOnRectangle className="h-4 w-4" />,
          },
        ]}
      />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="w-full max-w-md"
      >
        <FormUser />
      </Modal>
    </div>
  );
};

export default UserButton;

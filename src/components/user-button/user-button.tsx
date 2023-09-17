'use client';
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineCog8Tooth,
} from 'react-icons/hi2';
import { useUser } from '~/store';
import { useState, type FC } from 'react';
import Modal from '../modal';
import { publicImagesHref } from '~/lib/constants/public';
import { trpc } from '~/lib/trpc';
import { useRouter } from 'next/navigation';
import { routes } from '~/lib/constants/routes';
import MyPopover from '../my-popover';

type Props = {
  displayName?: boolean;
};

const UserButton: FC<Props> = ({ displayName = false }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { mutateAsync } = trpc.auth.logout.useMutation();

  return (
    <div className="shrink-0">
      <MyPopover
        placement="bottom-end"
        button={
          <div className="flex items-center gap-x-2">
            <img
              src={user?.photoURL ?? publicImagesHref.userIcon}
              alt="User profile photo"
              className="h-8 w-8 rounded-full"
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
              router.replace(routes.appHome);
            },
            onLeft: <HiOutlineArrowRightOnRectangle className="h-4 w-4" />,
          },
        ]}
      />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        Cu
      </Modal>
    </div>
  );
};

export default UserButton;

'use client';
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineCog8Tooth,
} from 'react-icons/hi2';
import { useUser } from '~/store';
import { Popover } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import { useState, type FC } from 'react';
import { auth } from '~/services/firebase/client';
import Modal from '../modal';
import { publicImagesHref } from '~/lib/constants/public';

const UserButton: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  return (
    <>
      <Popover className="relative">
        {({ close }) => (
          <Float
            placement="bottom-end"
            offset={10}
            shift
            enter="transition duration-200 ease-out"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition duration-150 ease-in"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
            tailwindcssOriginClass
          >
            <Popover.Button className="flex h-8 w-8 flex-shrink-0 items-center justify-center outline-none">
              <img
                src={user?.photoURL ?? publicImagesHref.userIcon}
                alt="User profile photo"
                className="rounded-full"
              />
            </Popover.Button>

            <Popover.Panel className="flex flex-col divide-y whitespace-nowrap rounded-lg bg-white font-medium shadow-lg">
              <button
                type="button"
                className="flex items-center gap-x-3 px-6 py-3 text-left text-sm text-gray-600 transition duration-150 hover:bg-gray-50"
                onClick={() => {
                  setIsOpen(true);
                  close();
                }}
              >
                <HiOutlineCog8Tooth className="h-4 w-4" />
                Manage Account
              </button>
              <button
                type="button"
                className="flex items-center gap-x-3 px-6 py-3 text-left text-sm text-gray-600 transition duration-150 hover:bg-gray-50"
                onClick={() => auth.signOut()}
              >
                <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                Sign Out
              </button>
            </Popover.Panel>
          </Float>
        )}
      </Popover>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        Cu
      </Modal>
    </>
  );
};

export default UserButton;

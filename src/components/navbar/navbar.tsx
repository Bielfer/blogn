'use client';
import { type FC, useState, type ReactNode } from 'react';
import { Dialog } from '@headlessui/react';
import ButtonOrLink from './button-or-link';
import Logo from '../logo';
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';
import cn from '~/lib/helpers/cn';

export type Item = {
  name: string;
  href?: string;
  icon?: JSX.Element;
  action?: () => void;
  buttonType?: 'submit' | 'button';
};

type Props = {
  items?: Item[];
  onRight?: JSX.Element;
  submitForm: () => void;
  onMiddle?: ReactNode;
  className?: string;
};

const Navbar: FC<Props> = ({
  items,
  onRight,
  submitForm,
  onMiddle,
  className,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={cn('bg-white', className)}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Blogn Logo</span>
            <Logo />
          </a>
        </div>
        {onMiddle}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <HiOutlineBars3 className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden items-center lg:flex lg:gap-x-12">
          {items?.map((item) => (
            <ButtonOrLink
              key={item.name}
              {...item}
              className="flex flex-col items-center rounded p-1 text-xs font-semibold leading-6 text-gray-900 hover:bg-gray-100"
            />
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">{onRight}</div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Blogn</span>
              <Logo />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <HiOutlineXMark className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {items?.map((item) => (
                  <ButtonOrLink
                    key={item.name}
                    {...item}
                    submitForm={submitForm}
                    className="-mx-3 flex w-full items-center gap-x-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  />
                ))}
              </div>
              <div className="py-6">{onRight}</div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Navbar;

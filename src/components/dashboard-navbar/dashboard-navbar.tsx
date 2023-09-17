'use client';
import { type FC, type ReactNode } from 'react';
import { Disclosure } from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '../logo';
import Container from '../container';
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';
import UserButton from '../user-button';
import BlogSwitcher from '../blog-switcher';

export type Item = {
  name: string;
  href: string;
};

type Props = {
  children: ReactNode;
  items?: readonly Item[];
};

const DashboardNavbar: FC<Props> = ({ children, items }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Disclosure as="nav" className="border-b border-gray-200 bg-white">
        {({ open }) => (
          <>
            <Container>
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Logo />
                  </div>
                  <BlogSwitcher className="hidden sm:flex" />
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {items?.map((item) => {
                      const current = pathname.includes(item.href);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={clsx(
                            current
                              ? 'border-primary-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                          )}
                          aria-current={current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <UserButton />
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <HiOutlineXMark
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    ) : (
                      <HiOutlineBars3
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </Container>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {items?.map((item) => {
                  const current = pathname.includes(item.href);
                  return (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={clsx(
                        current
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                      )}
                      aria-current={current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  );
                })}
              </div>
              <div className="flex flex-col justify-center gap-x-2 gap-y-3 border-t border-gray-200 p-4">
                <BlogSwitcher />
                <UserButton displayName />
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="overflow-y-auto pt-10">
        <main className="max-h-full">
          <Container>{children}</Container>
        </main>
      </div>
    </div>
  );
};

export default DashboardNavbar;

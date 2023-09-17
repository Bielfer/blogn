'use client';
import { type FC, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { HiMiniEllipsisVertical } from 'react-icons/hi2';
import cn from '~/lib/helpers/cn';
import Link from 'next/link';

type Option = {
  name: string;
  href?: string;
  action?: () => void;
};

type Item = {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  rightTitle?: string;
  rightSubtitle?: string;
  options?: Option[];
};

type Props = {
  className?: string;
  items: Item[];
};

const StackedList: FC<Props> = ({ items, className }) => {
  return (
    <ul role="list" className={cn('divide-y divide-gray-100', className)}>
      {items.map((item) => (
        <li
          key={`${item.title} ${item.subtitle}`}
          className="flex justify-between gap-x-6 py-5"
        >
          <div className="flex min-w-0 gap-x-4">
            {!!item.imageUrl && (
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={item.imageUrl}
                alt=""
              />
            )}
            <div className="flex min-w-0 flex-auto flex-col justify-center">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {item.title}
              </p>
              {!!item.subtitle && (
                <p className="mt-1 flex text-xs leading-5 text-gray-500">
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-6">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">
                {item.rightTitle}
              </p>
              {!!item.rightSubtitle && (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {item.rightSubtitle}
                </p>
              )}
            </div>
            {!!item.options && (
              <Menu as="div" className="relative flex-none">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <HiMiniEllipsisVertical
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {item.options.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) =>
                          !!option.href ? (
                            <Link
                              href={option.href}
                              className={cn(
                                active ? 'bg-gray-50' : '',
                                'block px-3 py-1 text-sm leading-6 text-gray-900'
                              )}
                            >
                              {option.name}
                            </Link>
                          ) : (
                            <button
                              onClick={option.action}
                              className={cn(
                                active ? 'bg-gray-50' : '',
                                'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900'
                              )}
                            >
                              {option.name}
                            </button>
                          )
                        }
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default StackedList;

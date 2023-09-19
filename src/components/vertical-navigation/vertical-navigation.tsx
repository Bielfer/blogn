'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type FC } from 'react';
import cn from '~/lib/helpers/cn';
import Select from '../select';

type Props = {
  className?: string;
  items: { name: string; href: string }[];
};

const VerticalNavigation: FC<Props> = ({ items, className }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-col', className)} aria-label="Sidebar">
      <Select
        className="block sm:hidden"
        selected={pathname}
        setSelected={(val) => router.push(val)}
        options={items.map((item) => ({ text: item.name, value: item.href }))}
      />
      <ul role="list" className="-mx-2 hidden space-y-1 sm:block">
        {items.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={cn(
                pathname === item.href
                  ? 'bg-gray-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600',
                'group flex gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6 transition duration-150'
              )}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default VerticalNavigation;

import Link from 'next/link';
import { type FC } from 'react';
import { HiMiniArrowLongLeft, HiMiniArrowLongRight } from 'react-icons/hi2';
import { generateIntegerArray } from '~/lib/helpers/arrays';
import cn from '~/lib/helpers/cn';

export type PaginationProps = {
  count: number;
  limit: number;
  page: number;
  className?: string;
};

const Pagination: FC<PaginationProps> = ({ count, limit, page, className }) => {
  const pageAmount = Math.ceil(count / limit);
  const pages = generateIntegerArray(1, pageAmount);
  const firstPages = pages.slice(0, 3);
  const lastPages =
    pages.length > 3 && pages.length <= 6
      ? pages.slice(3)
      : pages.length > 6
      ? pages.slice(-3)
      : [];

  if (count <= limit) return null;

  return (
    <nav
      className={cn(
        'flex items-center justify-between border-t border-gray-200 px-4 sm:px-0',
        className
      )}
    >
      <div className="-mt-px flex w-0 flex-1">
        {page > 1 && (
          <Link
            href={{
              query: {
                page: page - 1,
              },
            }}
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            <HiMiniArrowLongLeft
              className="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Previous
          </Link>
        )}
      </div>
      <div className="hidden md:-mt-px md:flex">
        {firstPages.map((pageNumber) => (
          <Link
            key={pageNumber}
            href={{
              query: {
                page: pageNumber,
              },
            }}
            className={cn(
              'inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700',
              page === pageNumber && 'border-primary-500 text-primary-600'
            )}
          >
            {pageNumber}
          </Link>
        ))}
        {pages.length > 6 && (
          <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
            ...
          </span>
        )}
        {lastPages.map((pageNumber) => (
          <Link
            key={pageNumber}
            href={{
              query: {
                page: pageNumber,
              },
            }}
            className={cn(
              'inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700',
              page === pageNumber && 'border-primary-500 text-primary-600'
            )}
          >
            {pageNumber}
          </Link>
        ))}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        {page < pageAmount && (
          <Link
            href={{
              query: {
                page: page + 1,
              },
            }}
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Next
            <HiMiniArrowLongRight
              className="ml-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Pagination;

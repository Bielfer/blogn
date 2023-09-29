import Link from 'next/link';
import { type FC } from 'react';
import { type Url } from 'url';
import cn from '~/lib/helpers/cn';
import Badge from '../badge';
import { type BadgeProps } from '../badge/badge';

type Post = {
  id: string;
  date: string;
  datetime: string;
  href: Partial<Url> | string;
  title: string;
  description: string;
  badges?: ({ text: string } & Partial<BadgeProps>)[];
  author: {
    imageUrl: string;
    name: string;
    role: string;
  };
};

type Props = {
  columns?: keyof typeof columnsStyles;
  className?: string;
  posts: Post[];
};

const columnsStyles = {
  1: '',
  2: 'lg:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
};

const PostsList: FC<Props> = ({ columns = 1, className, posts }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 place-items-center gap-x-8 gap-y-16',
        className,
        columnsStyles[columns]
      )}
    >
      {posts.map((post) => (
        <Link key={post.id} href={post.href} className="w-full">
          <article className="flex flex-col items-start justify-between rounded-xl p-4 transition duration-150 hover:bg-gray-50">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <time dateTime={post.datetime} className="text-gray-500">
                {post.date}
              </time>
              {post.badges?.map(({ text, ...rest }) => (
                <Badge key={text} {...rest}>
                  {text}
                </Badge>
              ))}
            </div>
            <div className="relative">
              <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900">
                <span className="absolute inset-0" />
                {post.title}
              </h3>
              <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                {post.description}
              </p>
            </div>
            <div className="relative mt-8 flex items-center gap-x-4">
              <img
                src={post.author.imageUrl}
                alt=""
                className="h-10 w-10 rounded-full bg-gray-50"
              />
              <div className="text-sm leading-6">
                <p className="font-semibold text-gray-900">
                  <span className="absolute inset-0" />
                  {post.author.name}
                </p>
                <p className="text-gray-600">{post.author.role}</p>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
};
export default PostsList;

import Link from 'next/link';
import { type FC } from 'react';
import { socialLinks } from '~/lib/constants/socials';
import { type Blog } from '~/server/routers/blog';

type Props = {
  blog: Blog;
};

const TemplateDefaultFooter: FC<Props> = ({ blog }) => {
  const { links } = blog;

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl py-12 md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
          {!!links &&
            Object.entries(links).map(([key, href]) => {
              const isSocial = key in socialLinks;
              const linkData = isSocial
                ? socialLinks[key as keyof typeof socialLinks]
                : undefined;

              return (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{linkData?.name}</span>
                  {linkData?.icon && (
                    <linkData.icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} {blog.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default TemplateDefaultFooter;

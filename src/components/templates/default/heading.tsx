import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import Badge from '~/components/badge';
import Container from '~/components/container';
import IconLink from '~/components/icon-link';
import { routes } from '~/lib/constants/routes';
import { socialLinks } from '~/lib/constants/socials';
import cn from '~/lib/helpers/cn';
import { tryCatch } from '~/lib/helpers/try-catch';
import { caller } from '~/server/routers/_app';
import { type Blog } from '~/server/routers/blog';

type Props = {
  blog: Blog;
};

const TemplateDefaultHeading: FC<Props> = async ({ blog }) => {
  const { name, photoUrl, bannerUrl, links } = blog;

  const [categories, error] = await tryCatch(
    caller.category.getMany({ blogId: blog.id })
  );

  if (error || !categories) notFound();

  return (
    <div>
      {!!bannerUrl && (
        <div>
          <img
            className="h-32 w-full object-cover lg:h-48"
            src={bannerUrl}
            alt=""
          />
        </div>
      )}
      <Container smallerContainerSize="max-w-5xl" smallerContainer>
        <div
          className={cn(
            'sm:flex sm:items-end sm:space-x-5',
            !!bannerUrl && '-mt-12 sm:-mt-16'
          )}
        >
          {!!photoUrl && (
            <div
              className={
                'h-24 w-24 overflow-hidden rounded-full ring-4 ring-white sm:h-32 sm:w-32'
              }
            >
              <img
                className="h-full w-full object-contain"
                src={photoUrl}
                alt={`${name} logo`}
              />
            </div>
          )}
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
              <h1>{name}</h1>
            </div>
            {!!links && (
              <div className="mt-6 flex gap-x-4">
                {Object.entries(links).map(([key, href]) => {
                  const isSocial = key in socialLinks;
                  const linkData = isSocial
                    ? socialLinks[key as keyof typeof socialLinks]
                    : undefined;

                  return linkData ? (
                    <IconLink
                      target="_blank"
                      href={href}
                      key={href}
                      icon={linkData?.icon}
                      variant="button-default"
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
          <h1>{name}</h1>
        </div>
      </Container>
      <Container smallerContainer smallerContainerSize="max-w-2xl">
        <nav className="flex flex-wrap space-x-4 pt-10" aria-label="Tabs">
          {categories.length > 0 && (
            <Link href={routes.blogHome}>
              <Badge pill>All</Badge>
            </Link>
          )}
          {categories.map((category) => (
            <Link href={routes.blogCategories(category.url)} key={category.id}>
              <Badge pill>{category.name}</Badge>
            </Link>
          ))}
        </nav>
      </Container>
    </div>
  );
};

export default TemplateDefaultHeading;

'use client';
import { differenceInSeconds } from 'date-fns';
import { useState, type FC } from 'react';
import Button from '~/components/button';
import DescriptionList from '~/components/description-list';
import LoadingWrapper from '~/components/loading-wrapper';
import MyLink from '~/components/my-link';
import { blogPosts, routes } from '~/lib/constants/routes';
import { tryCatch } from '~/lib/helpers/try-catch';
import { trpc } from '~/lib/trpc';
import { useBlog, useToast } from '~/store';

const DescriptionListWrapper: FC = () => {
  const { addToast } = useToast();
  const { selectedBlog } = useBlog();
  const [timeSinceLastCheck, setTimeSinceLastCheck] = useState<
    Date | undefined
  >();
  const { data: blog, isLoading: isLoadingBlog } = trpc.blog.get.useQuery(
    { id: selectedBlog?.id ?? '' },
    { enabled: !!selectedBlog, cacheTime: 0, staleTime: 0 }
  );
  const { mutateAsync: checkDomain, isLoading: isLoadingCheck } =
    trpc.vercel.checkDomain.useMutation();

  const handleCheckDomain = async (domain?: string) => {
    if (!domain) {
      addToast({ type: 'error', content: 'You have not added any domain' });
      return;
    }

    if (
      !!timeSinceLastCheck &&
      differenceInSeconds(timeSinceLastCheck, new Date()) < 59
    ) {
      addToast({
        type: 'warning',
        content: 'You have to wait 60 seconds between the checks',
      });
      return;
    }

    setTimeSinceLastCheck(new Date());
    const [res, error] = await tryCatch(checkDomain({ domain }));

    if (error || !res) {
      addToast({
        type: 'error',
        content:
          'Failed to check if domain is active, refresh the page and try again',
      });
      return;
    }

    if (res.isConfigured) {
      addToast({
        type: 'success',
        content: 'Your blog is active, access your domain to check it',
      });
      return;
    }

    addToast({
      type: 'default',
      content:
        "Your domain is still not active, if you are having difficulties don't hesitate to contact us",
    });
  };

  return (
    <LoadingWrapper isLoading={isLoadingBlog}>
      <>
        <DescriptionList
          title="Domains"
          subtitle="There are 2 steps to setting up your domain, the first one is on our platform, by clicking on the update button. After saving your domain on our platform you just have to point your domain to us. If you don't know how to do it you can click on the link at the end of the page"
          items={[
            {
              name: 'Subdomain',
              content: !!blog?.subdomain
                ? `${blog.subdomain}.blogn.io`
                : 'No subdomain added',
              onRight: (
                <MyLink href={routes.appBlogsSettings} variant="primary">
                  Update
                </MyLink>
              ),
            },
            {
              name: 'Domain',
              content: !!blog?.domain ? blog.domain : 'No domain added',
              onRight: (
                <>
                  <div className="mr-3 inline border-r pr-3">
                    <Button
                      className="inline-flex items-center gap-x-1"
                      variant="link-primary"
                      onClick={() => handleCheckDomain(blog?.domain)}
                      loading={isLoadingCheck}
                    >
                      Check<span className="hidden sm:inline"> Domain</span>
                    </Button>
                  </div>
                  <MyLink
                    href={routes.appBlogsSettingsDomainsEdit}
                    variant="primary"
                  >
                    Update
                  </MyLink>
                </>
              ),
            },
          ]}
        />
        <p className="mt-6 flex items-center gap-x-3 text-sm text-gray-600">
          Don&apos;t know how to set up your domain?
          <MyLink
            href={blogPosts.domainSetup}
            variant="primary"
            target="_blank"
          >
            Click here
          </MyLink>
        </p>
      </>
    </LoadingWrapper>
  );
};

export default DescriptionListWrapper;

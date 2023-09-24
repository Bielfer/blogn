import { env } from '~/env.mjs';
import { caller } from '~/server/routers/_app';

export const getDomains = (domain: string) => {
  const [devSubdomain] = domain.split('.');

  const subdomain =
    env.NODE_ENV === 'development'
      ? devSubdomain
      : domain.endsWith(`.${env.NEXT_PUBLIC_APP_URL}`)
      ? domain.replace(`.${env.NEXT_PUBLIC_APP_URL}`, '')
      : null;

  return {
    domain,
    subdomain,
  };
};

export const getImageContentType = async (url: string) => {
  const response = await fetch(url, {
    method: 'HEAD',
  });

  return response.headers.get('Content-Type');
};

export const generateBlogMetadata = async (params: {
  domain: string;
  title: string;
}) => {
  const { title } = params;
  const { domain, subdomain } = getDomains(params.domain);

  const blogs = await caller.blog.getMany({
    ...(!!subdomain ? { subdomain } : { domain }),
  });

  const blog = blogs[0];
  const photoUrlContentType = await getImageContentType(blog?.photoUrl ?? '');
  const fileType = photoUrlContentType?.split('/')[1];

  return {
    title: {
      absolute: blog?.name ? `${title} | ${blog.name}` : title,
    },
    ...(blog?.photoUrl && {
      icons: {
        icon: `${blog.photoUrl}.${fileType}`,
        shortcut: {
          url: `${blog.photoUrl}`,
          type: photoUrlContentType ?? '',
        },
        apple: {
          url: `${blog.photoUrl}`,
          type: photoUrlContentType ?? '',
        },
        other: {
          rel: 'icon',
          url: `${blog.photoUrl}`,
          type: photoUrlContentType ?? '',
        },
      },
    }),
  };
};

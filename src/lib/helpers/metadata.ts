import { type Metadata } from 'next';
import { env } from '~/env.mjs';
import { type Blog } from '~/server/routers/blog';

export const getDomains = (domain: string) => {
  const [devSubdomain] = domain.split('.');

  const appUrl = env.NEXT_PUBLIC_APP_URL.replace('http://', '').replace(
    'https://',
    ''
  );

  const subdomain =
    env.NODE_ENV === 'development'
      ? devSubdomain
      : domain.endsWith(`.${appUrl}`)
      ? domain.replace(`.${appUrl}`, '')
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
  blog: Blog;
  title: string;
  description?: string;
}): Promise<Metadata> => {
  const { title, blog, description } = params;

  const photoUrlContentType = await getImageContentType(blog?.photoUrl ?? '');
  const fileType = photoUrlContentType?.split('/')[1];

  return {
    title: {
      absolute: blog?.name ? `${title} | ${blog.name}` : title,
    },
    description,
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

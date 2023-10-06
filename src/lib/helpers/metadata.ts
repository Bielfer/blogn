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

export const getImageContentType = async (url?: string) => {
  if (!url) return null;

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

  const photoUrlContentType = await getImageContentType(blog.photoUrl);

  return {
    title: {
      absolute: `${title} | ${blog.name}`,
    },
    description,
    ...(!!blog?.photoUrl && {
      icons: {
        icon: blog.photoUrl,
        shortcut: {
          url: blog.photoUrl,
          type: photoUrlContentType ?? '',
        },
        apple: {
          url: blog.photoUrl,
          type: photoUrlContentType ?? '',
        },
        other: {
          rel: 'icon',
          url: blog.photoUrl,
          type: photoUrlContentType ?? '',
        },
      },
    }),
    openGraph: {
      title: `${title} | ${blog.name}`,
      description,
      siteName: blog.name,
      ...(!!blog.photoUrl && { images: [{ url: blog.photoUrl }] }),
      type: 'website',
    },
    robots: {
      googleBot: {
        index: true,
      },
    },
  };
};

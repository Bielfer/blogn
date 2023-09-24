import { env } from '~/env.mjs';

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

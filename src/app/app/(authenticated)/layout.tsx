import type { ReactNode } from 'react';
import type { FC } from 'react';
import { getUser } from '~/lib/fetchers/auth';
import SetUser from './set-user';
import { userHasBlogs } from '~/lib/fetchers/blog';
import { redirect } from 'next/navigation';
import { routes } from '~/lib/constants/routes';

export type Props = {
  children: ReactNode;
};

export const AuthenticatedLayout: FC<Props> = async ({ children }) => {
  const user = await getUser();

  if (!user) redirect(routes.appSignIn);

  await userHasBlogs(user);

  return (
    <>
      {children}
      <SetUser user={user} />
    </>
  );
};

export default AuthenticatedLayout;

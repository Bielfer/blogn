import type { ReactNode } from 'react';
import type { FC } from 'react';
import { getUser } from '~/lib/fetchers/auth';
import SetUser from './set-user';
import { redirect } from 'next/navigation';
import { routes } from '~/lib/constants/routes';
import UserHasBlogs from './user-has-blogs';

export type Props = {
  children: ReactNode;
};

export const AuthenticatedLayout: FC<Props> = async ({ children }) => {
  const user = await getUser();

  if (!user) redirect(routes.appSignIn);

  return (
    <UserHasBlogs user={user}>
      {children}
      <SetUser user={user} />
    </UserHasBlogs>
  );
};

export default AuthenticatedLayout;

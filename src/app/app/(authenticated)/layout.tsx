import type { FC, ReactNode } from 'react';
import { getUser } from '~/lib/fetchers/auth';
import SetUser from './set-user';
import { userHasBlogs } from '~/lib/fetchers/blog';

type Props = {
  children: ReactNode;
};

const AuthenticatedLayout: FC<Props> = async ({ children }) => {
  const user = await getUser();

  await userHasBlogs(user);

  return (
    <>
      {children}
      <SetUser user={user} />
    </>
  );
};

export default AuthenticatedLayout;

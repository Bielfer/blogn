import { redirect } from 'next/navigation';
import type { FC, ReactNode } from 'react';
import { routes } from '~/lib/constants/routes';
import { getUser } from '~/lib/fetchers/auth';
import SetUser from './set-user';

type Props = {
  children: ReactNode;
};

const AuthenticatedLayout: FC<Props> = async ({ children }) => {
  const user = await getUser();

  if (!user) redirect(routes.appSignIn);

  return (
    <>
      {children}
      <SetUser user={user} />
    </>
  );
};

export default AuthenticatedLayout;

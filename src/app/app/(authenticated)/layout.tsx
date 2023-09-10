'use client';
import type { FC, ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { useUser } from '~/store';
import Spinner from '~/components/spinner';
import { routes } from '~/lib/constants/routes';

type Props = {
  children: ReactNode;
};

const AuthenticatedLayout: FC<Props> = ({ children }) => {
  const { status } = useUser();

  if (status === 'loading') return <Spinner page size="lg" />;

  if (status === 'unauthenticated') redirect(routes.signIn);

  return children;
};

export default AuthenticatedLayout;

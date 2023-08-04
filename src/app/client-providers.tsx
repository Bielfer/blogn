'use client';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { TrpcProvider } from './trpc-provider';
import { type FC } from 'react';

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

const ClientProviders: FC<Props> = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <TrpcProvider>{children}</TrpcProvider>
    </SessionProvider>
  );
};

export default ClientProviders;

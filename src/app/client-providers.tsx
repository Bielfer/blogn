'use client';
import { ToastContainer } from '~/components/toast';
import { TrpcProvider } from './trpc-provider';
import { type FC } from 'react';
import FirebaseAuth from './firebase-auth';

type Props = {
  children: React.ReactNode;
};

const ClientProviders: FC<Props> = ({ children }) => {
  return (
    <TrpcProvider>
      {children}
      <FirebaseAuth />
      <ToastContainer />
    </TrpcProvider>
  );
};

export default ClientProviders;

'use client';
import { TrpcProvider } from './trpc-provider';
import { type FC } from 'react';

type Props = {
  children: React.ReactNode;
};

const ClientProviders: FC<Props> = ({ children }) => {
  return <TrpcProvider>{children}</TrpcProvider>;
};

export default ClientProviders;

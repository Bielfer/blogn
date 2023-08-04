import '~/styles/globals.css';
import { getServerSession } from 'next-auth';
import { type FC } from 'react';
import ClientProviders from '~/app/client-providers';
import { authOptions } from '~/server/auth';

type Props = {
  children: React.ReactNode;
};

const RootLayout: FC<Props> = async ({ children }) => {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <ClientProviders session={session}>{children}</ClientProviders>
      </body>
    </html>
  );
};

export default RootLayout;

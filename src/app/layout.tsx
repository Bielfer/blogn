import '~/styles/globals.css';
import { type FC } from 'react';
import ClientProviders from '~/app/client-providers';
import { Inter } from 'next/font/google';
import { type Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: {
    template: '%s - Blogn',
    default: 'Blogn - The easiest way to create your blog',
  },
  description:
    'The easiest and fastest way to create your blog. No unnecessary steps, you can just focus on writing',
  icons: {
    icon: '/icon-black.png',
    shortcut: '/icon-black.png',
    apple: '/icon-black.png',
    other: {
      rel: 'icon',
      url: '/icon-black.png',
    },
  },
};

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
};

export default RootLayout;

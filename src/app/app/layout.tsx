import { type Metadata } from 'next';
import type { FC, ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Blogn',
    default: 'Blogn | The easiest way to create your blog',
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

type Props = {
  children: ReactNode;
};

const AppLayout: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default AppLayout;

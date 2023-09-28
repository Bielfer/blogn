import type { FC, ReactNode } from 'react';
import { userHasBlogs } from '~/lib/fetchers/blog';
import { type User } from '~/store/user';
import FormBlogWrapper from './form-blog-wrapper';

type Props = {
  user: User;
  children: ReactNode;
};

const UserHasBlogs: FC<Props> = async ({ user, children }) => {
  const hasBlogs = await userHasBlogs(user);

  if (!hasBlogs) {
    return <FormBlogWrapper />;
  }

  return <>{children}</>;
};

export default UserHasBlogs;

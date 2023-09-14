'use client';

import { type FC } from 'react';
import { useMount } from 'react-use';
import { useUser } from '~/store';
import { type User } from '~/store/user';

type Props = {
  user: User;
};

const SetUser: FC<Props> = ({ user }) => {
  const { setUser } = useUser();

  useMount(() => {
    setUser(user);
  });

  return null;
};

export default SetUser;

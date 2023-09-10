'use client';
import Cookies from 'js-cookie';
import { onIdTokenChanged } from 'firebase/auth';
import { type FC, type ReactNode } from 'react';
import { auth } from '~/services/firebase/client';

import { useMount } from 'react-use';
import { useUser } from '~/store';
import { cookiesKeys } from '~/lib/constants/cookies';

type Props = {
  children: ReactNode;
};

const FirebaseAuth: FC<Props> = ({ children }) => {
  const { setUser } = useUser();

  useMount(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        Cookies.remove(cookiesKeys.idToken);
        setUser(null);
        return;
      }

      const idToken = await user.getIdToken();
      Cookies.set(cookiesKeys.idToken, idToken);
      setUser(user);
    });

    return () => unsubscribe();
  });

  return children;
};

export default FirebaseAuth;

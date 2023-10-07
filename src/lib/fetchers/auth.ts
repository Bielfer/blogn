import { cookies } from 'next/headers';
import { cookiesKeys } from '../constants/cookies';
import { tryCatch } from '../helpers/try-catch';
import { auth } from '~/services/firebase/admin';
import { cache } from 'react';

export const isAuthenticated = async () => {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(cookiesKeys.session)?.value;

  if (!sessionToken) {
    return;
  }

  const [decodedSessionToken, error] = await tryCatch(
    auth.verifySessionCookie(sessionToken)
  );

  if (error || !decodedSessionToken) {
    return;
  }

  return decodedSessionToken;
};

export const getUser = cache(async () => {
  const decodedIdToken = await isAuthenticated();

  if (!decodedIdToken) return;

  const [user, error] = await tryCatch(auth.getUser(decodedIdToken.uid));

  if (!user || error) return;

  return {
    uid: user.uid,
    ...(!!user.displayName && { displayName: user.displayName }),
    ...(!!user.photoURL && { photoURL: user.photoURL }),
  };
});

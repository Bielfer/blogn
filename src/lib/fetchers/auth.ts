import { cookies } from 'next/headers';
import { cookiesKeys } from '../constants/cookies';
import { tryCatch } from '../helpers/try-catch';
import { auth } from '~/services/firebase/admin';

export const isAuthenticated = async () => {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(cookiesKeys.session)?.value;

  if (!sessionToken) {
    return null;
  }

  const [decodedSessionToken, error] = await tryCatch(
    auth.verifySessionCookie(sessionToken)
  );

  if (error || !decodedSessionToken) return null;

  return decodedSessionToken;
};

export const getUser = async () => {
  const decodedIdToken = await isAuthenticated();

  if (!decodedIdToken) return null;

  const [user, error] = await tryCatch(auth.getUser(decodedIdToken.uid));

  if (!user || error) return null;

  return {
    uid: user.uid,
    photoURL: user.photoURL,
    customClaims: user.customClaims,
    displayName: user.displayName,
  };
};

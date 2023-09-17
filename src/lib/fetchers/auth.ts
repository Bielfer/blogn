import { cookies } from 'next/headers';
import { cookiesKeys } from '../constants/cookies';
import { tryCatch } from '../helpers/try-catch';
import { auth } from '~/services/firebase/admin';
import { redirect } from 'next/navigation';
import { routes } from '../constants/routes';

export const isAuthenticated = async () => {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(cookiesKeys.session)?.value;

  if (!sessionToken) {
    redirect(routes.appSignIn);
  }

  const [decodedSessionToken, error] = await tryCatch(
    auth.verifySessionCookie(sessionToken)
  );

  if (error || !decodedSessionToken) redirect(routes.appSignIn);

  return decodedSessionToken;
};

export const getUser = async () => {
  const decodedIdToken = await isAuthenticated();

  if (!decodedIdToken) return redirect(routes.appSignIn);

  const [user, error] = await tryCatch(auth.getUser(decodedIdToken.uid));

  if (!user || error) return redirect(routes.appSignIn);

  return user;
};

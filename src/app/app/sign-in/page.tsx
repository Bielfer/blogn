import { type Metadata } from 'next';
import { type FC } from 'react';
import FormSignIn from '~/components/forms/form-sign-in';
import { routes } from '~/lib/constants/routes';

export const metadata: Metadata = {
  title: 'Sign In',
};

const SignInPage: FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <FormSignIn title="Sign In" afterLoginUrl={routes.appPosts} />
    </div>
  );
};

export default SignInPage;

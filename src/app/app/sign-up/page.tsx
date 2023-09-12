import { type Metadata } from 'next';
import { type FC } from 'react';
import FormSignIn from '~/components/forms/form-sign-in';
import { routes } from '~/lib/constants/routes';

export const metadata: Metadata = {
  title: 'Sign Up',
};

type Props = {
  searchParams?: {
    afterLoginUrl?: string;
  };
};

const SignInPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <FormSignIn
        title="Sign Up"
        afterLoginUrl={searchParams?.afterLoginUrl ?? routes.appPosts}
      />
    </div>
  );
};

export default SignInPage;

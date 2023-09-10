import { type Metadata } from 'next';
import { type FC } from 'react';
import FormSignIn from '~/components/forms/form-sign-in';
import { routes } from '~/lib/constants/routes';

export const metadata: Metadata = {
  title: 'Faça seu login',
};

const SignInPage: FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <FormSignIn title="Faça seu Login" afterLoginUrl={routes.posts} />
    </div>
  );
};

export default SignInPage;

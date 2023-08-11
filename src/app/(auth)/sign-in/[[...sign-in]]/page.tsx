import { SignIn } from '@clerk/nextjs';
import { type Metadata } from 'next';
import { type FC } from 'react';
import { paths } from '~/constants/paths';

export const metadata: Metadata = {
  title: 'Sign In | Blogn',
  description: 'Sign into Blogn and start your best blogging experience',
};

type Props = {
  searchParams: {
    afterSignUpUrl: string;
    afterSignInUrl: string;
  };
};

const SignInPage: FC<Props> = ({ searchParams }) => {
  const { afterSignInUrl, afterSignUpUrl } = searchParams;
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn
        afterSignInUrl={afterSignInUrl ?? paths.posts}
        afterSignUpUrl={afterSignUpUrl ?? paths.posts}
      />
    </div>
  );
};

export default SignInPage;

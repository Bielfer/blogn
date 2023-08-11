import { SignUp } from '@clerk/nextjs';
import { type Metadata } from 'next';
import { type FC } from 'react';
import { paths } from '~/constants/paths';

export const metadata: Metadata = {
  title: 'Sign Up | Blogn',
  description: 'Sign up into Blogn and start your best blogging experience',
};

type Props = {
  params: {
    afterSignUpUrl: string;
    afterSignInUrl: string;
  };
};

const SignUpPage: FC<Props> = ({ params }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp
        afterSignInUrl={params.afterSignInUrl ?? paths.posts}
        afterSignUpUrl={params.afterSignUpUrl ?? paths.posts}
      />
    </div>
  );
};

export default SignUpPage;

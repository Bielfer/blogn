'use client';
import { useState, type FC } from 'react';
import Button from '~/components/button';
import { FcGoogle } from 'react-icons/fc';
import FormikInput from '../formik-input';
import { Form, Formik } from 'formik';
import { z } from 'zod';
import {
  type UserCredential,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  isSignInWithEmailLink,
} from 'firebase/auth';
import { auth, googleProvider } from '~/services/firebase/client';
import { useRouter } from 'next/navigation';
import { env } from '~/env.mjs';
import { useLocalStorage, useMount } from 'react-use';
import Logo from '~/components/logo';
import { useToast } from '~/store';
import { tryCatch } from '~/lib/helpers/try-catch';
import { localStorageKeys } from '~/lib/constants/local-storage';
import { validations } from '~/lib/constants/validations';
import { routes } from '~/lib/constants/routes';
import { zodValidator } from '~/lib/helpers/zod';
import { trpc } from '~/lib/trpc';
import LoadingWrapper from '~/components/loading-wrapper';

type Props = {
  title: string;
  afterLoginUrl: string;
};

const FormSignIn: FC<Props> = ({ title, afterLoginUrl }) => {
  const { addToast } = useToast();
  const router = useRouter();
  const [emailForSignIn, setEmailForSignIn] = useLocalStorage(
    localStorageKeys.emailForSignIn,
    ''
  );
  const [isLoadingEmailRedirect, setIsLoadingEmailRedirect] = useState(false);
  const { mutateAsync: getSessionCookie } = trpc.auth.login.useMutation();

  const initialValues = { email: '' };

  const validationSchema = z.object({
    email: z
      .string({
        invalid_type_error: validations.string,
        required_error: validations.required,
      })
      .email({ message: validations.email }),
  });

  const handleGoogle = async () => {
    const [res, error] = await tryCatch(signInWithPopup(auth, googleProvider));

    const [success, errorSessionCookie] = await tryCatch(
      setSessionCookie({
        res,
        error,
        errorMessage: 'Failed to enter with google, try again',
      })
    );

    if (!success || errorSessionCookie) return;

    router.push(afterLoginUrl);
  };

  const setSessionCookie = async ({
    res,
    error,
    errorMessage,
  }: {
    res: UserCredential | null;
    error: any;
    errorMessage: string;
  }) => {
    if (error || !res?.user) {
      addToast({
        type: 'error',
        content: errorMessage,
      });
      return false;
    }

    const [idToken, errorIdToken] = await tryCatch(res.user.getIdToken());

    if (!idToken || errorIdToken) {
      addToast({
        type: 'error',
        content: errorMessage,
      });
      return false;
    }

    const [, errorSessionCookie] = await tryCatch(
      getSessionCookie({ idToken })
    );

    if (errorSessionCookie) {
      addToast({
        type: 'error',
        content: errorMessage,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (values: z.infer<typeof validationSchema>) => {
    const actionCodeSettings = {
      url: `${env.NEXT_PUBLIC_APP_URL}${routes.appSignIn}`,
      handleCodeInApp: true,
    };

    const [, error] = await tryCatch(
      sendSignInLinkToEmail(auth, values.email, actionCodeSettings)
    );

    if (error) {
      addToast({
        type: 'error',
        content: 'Failed to send magic link to your email, try again',
      });
      return;
    }

    addToast({
      type: 'success',
      content: 'Check your email to finish your login',
    });
    setEmailForSignIn(values.email);
  };

  useMount(() => {
    (async () => {
      if (!isSignInWithEmailLink(auth, window.location.href)) return;

      setIsLoadingEmailRedirect(true);

      let email: string | null | undefined = emailForSignIn;

      if (!email) {
        email = window.prompt('For your safety, confirm your email');
      }

      const [res, error] = await tryCatch(
        signInWithEmailLink(auth, email ?? '', window.location.href)
      );

      const [success, errorSessionCookie] = await tryCatch(
        setSessionCookie({
          res,
          error,
          errorMessage: 'Failed to enter with magic link, try again',
        })
      );

      if (!success || errorSessionCookie) return;

      setEmailForSignIn(undefined);
      router.push(afterLoginUrl);
    })();
  });

  return (
    <LoadingWrapper isLoading={isLoadingEmailRedirect} page>
      <Formik
        initialValues={initialValues}
        validate={zodValidator(validationSchema)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="w-full max-w-sm rounded-xl border p-6 shadow">
            <Logo className="-ml-3 mb-2" />
            <h2>{title}</h2>
            <div className="flex flex-col py-6">
              <Button
                className="border"
                iconLeft={FcGoogle}
                onClick={handleGoogle}
              >
                Continue with Google
              </Button>
            </div>
            <div className="flex items-center justify-between gap-x-4 pb-6">
              <div className="flex-grow border-b"></div>
              <div className="text-sm text-gray-600">ou</div>
              <div className="flex-grow border-b"></div>
            </div>
            <FormikInput
              label="Your email"
              name="email"
              placeholder="Ex: email@provider.com"
            />

            <div className="flex justify-end pt-6">
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Send
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </LoadingWrapper>
  );
};

export default FormSignIn;

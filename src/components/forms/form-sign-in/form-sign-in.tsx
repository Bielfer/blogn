'use client';
import { useState, type FC } from 'react';
import Button from '~/components/button';
import { FcGoogle } from 'react-icons/fc';
import FormikInput from '../formik-input';
import { Form, Formik } from 'formik';
import { z } from 'zod';
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '~/services/firebase/client';
import { useRouter } from 'next/navigation';
import { env } from '~/env.mjs';
import { useLocalStorage, useMount } from 'react-use';
import LoadingWrapper from '~/components/loading-wrapper';
import Logo from '~/components/logo';
import { useToast } from '~/store';
import { tryCatch } from '~/lib/helpers/try-catch';
import { localStorageKeys } from '~/lib/constants/local-storage';
import { validations } from '~/lib/constants/validations';
import { routes } from '~/lib/constants/routes';
import { zodValidator } from '~/lib/helpers/zod-validator';

type Props = {
  title: string;
  afterLoginUrl: string;
};

const FormSignIn: FC<Props> = ({ title, afterLoginUrl }) => {
  const { addToast } = useToast();
  const router = useRouter();
  const [isLoadingEmailLogin, setIsLoadingEmailLogin] = useState(false);
  const [emailForSignIn, setEmailForSignIn] = useLocalStorage(
    localStorageKeys.emailForSignIn,
    ''
  );

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

    if (error || !res?.user) {
      addToast({
        type: 'error',
        content: 'Falha ao entrar com Google, tente novamente',
      });
      return;
    }

    router.push(afterLoginUrl);
  };

  const handleSubmit = async (values: z.infer<typeof validationSchema>) => {
    const actionCodeSettings = {
      url: `${env.NEXT_PUBLIC_APP_URL}${routes.signIn}`,
      handleCodeInApp: true,
    };

    const [, error] = await tryCatch(
      sendSignInLinkToEmail(auth, values.email, actionCodeSettings)
    );

    if (error) {
      addToast({
        type: 'error',
        content: 'Falha ao enviar link para o email, tente novamente',
      });
      return;
    }

    addToast({
      type: 'success',
      content: 'Acesse o seu email e clique no link que foi enviado',
    });
    setEmailForSignIn(values.email);
  };

  useMount(() => {
    (async () => {
      if (!isSignInWithEmailLink(auth, window.location.href)) return;
      setIsLoadingEmailLogin(true);

      let email: string | null | undefined = emailForSignIn;

      if (!email) {
        email = window.prompt('Confirme seu email, por segurança');
      }

      const [res, error] = await tryCatch(
        signInWithEmailLink(auth, email ?? '', window.location.href)
      );

      if (error || !res?.user) {
        addToast({
          type: 'error',
          content: 'Falha ao fazer login com email, tente novamente',
        });
        return;
      }

      setEmailForSignIn(undefined);
      router.push(afterLoginUrl);
    })();
  });

  return (
    <LoadingWrapper isLoading={isLoadingEmailLogin}>
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
                Continue com Google
              </Button>
            </div>
            <div className="flex items-center justify-between gap-x-4 pb-6">
              <div className="flex-grow border-b"></div>
              <div className="text-sm text-gray-600">ou</div>
              <div className="flex-grow border-b"></div>
            </div>
            <FormikInput
              label="Seu email"
              name="email"
              placeholder="Ex: meuemail@meuprovedor.com"
            />

            <div className="flex justify-end pt-6">
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Enviar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </LoadingWrapper>
  );
};

export default FormSignIn;

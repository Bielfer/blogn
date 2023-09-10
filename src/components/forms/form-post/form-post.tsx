'use client';
import { Form, Formik, useFormikContext } from 'formik';
import dynamic from 'next/dynamic';
import { type FC, useState, useEffect } from 'react';
import Container from '~/components/container';
import Modal from '~/components/modal';
import Navbar from '~/components/navbar';
import PostPreview from './post-preview';
import PostSettings from './post-settings';
import Title from './title';
import Link from 'next/link';
import { paths } from '~/lib/constants/paths';
import { useLocalStorage } from 'react-use';
import { localStorageKeys } from '~/lib/constants/local-storage';
import { trpc } from '~/lib/trpc';
import { useRouter } from 'next/navigation';
import { tryCatch } from '~/lib/helpers/try-catch';

import { parseISO } from 'date-fns';
import Spinner from '~/components/spinner';
import {
  HiOutlineCog8Tooth,
  HiOutlineEye,
  HiOutlineHome,
  HiOutlineRocketLaunch,
} from 'react-icons/hi2';
import { useToast } from '~/store';

const Editor = dynamic(() => import('../../editor'), { ssr: false });

const FormPost: FC = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const { mutateAsync: createPost } = trpc.post.create.useMutation();
  const [localStorageValues, setLocalStorageValues] = useLocalStorage<
    typeof initialValues
  >(localStorageKeys.formPost);
  const [isPostPreviewOpen, setIsPostPreviewOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isSignedIn = true;

  const getNavbarItems = (isSubmitting: boolean) => [
    {
      name: 'Settings',
      icon: <HiOutlineCog8Tooth className="h-6" />,
      action: () => setIsSettingsOpen(true),
    },
    {
      name: 'Preview',
      icon: <HiOutlineEye className="h-6" />,
      action: () => setIsPostPreviewOpen(true),
    },
    {
      name: 'Publish',
      icon: isSubmitting ? (
        <Spinner size="sm" color="inherit" />
      ) : (
        <HiOutlineRocketLaunch className="h-6" />
      ),
      buttonType: 'submit' as const,
    },
  ];

  const initialValues = {
    title: '',
    content: { blocks: [] },
    urlTitle: '',
    SEOTitle: '',
    SEODescription: '',
    publishedAt: new Date(),
  };

  const handleSubmit = async (values: typeof initialValues) => {
    if (!isSignedIn) {
      router.push(paths.signIn);
      return;
    }

    const { publishedAt } = values;
    const [, error] = await tryCatch(
      createPost({
        ...values,
        publishedAt:
          typeof publishedAt === 'string' ? parseISO(publishedAt) : publishedAt,
      })
    );

    if (error) {
      addToast({
        type: 'error',
        content: 'Failed to publish blog post, try again in 5 seconds',
      });
      return;
    }

    setLocalStorageValues(initialValues);
    router.push(paths.posts);
  };

  return (
    <Formik
      initialValues={localStorageValues ?? initialValues}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <SaveFormToLocalStorage />
          <Modal
            className="w-full max-w-md"
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          >
            <PostSettings />
          </Modal>
          <Modal
            isOpen={isPostPreviewOpen}
            onClose={() => setIsPostPreviewOpen(false)}
            fakePage
          >
            <PostPreview handleClose={() => setIsPostPreviewOpen(false)} />
          </Modal>

          <Navbar
            items={getNavbarItems(isSubmitting)}
            onRight={
              isSignedIn ? (
                <div className="flex flex-col gap-y-3 lg:flex-row lg:items-center lg:gap-x-3 lg:gap-y-0">
                  <Link
                    href={paths.posts}
                    className="-mx-3 flex w-full items-center gap-x-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 lg:mr-3 lg:text-sm"
                  >
                    <HiOutlineHome className="h-6 lg:hidden" />
                    Dashboard
                  </Link>
                  User Button
                </div>
              ) : (
                <Link
                  className="text-sm font-semibold leading-6 text-gray-900"
                  href={{
                    pathname: paths.signIn,
                    query: {
                      afterSignUpUrl: paths.newPost,
                      afterSignInUrl: paths.newPost,
                    },
                  }}
                >
                  Log in <span aria-hidden="true">&rarr;</span>
                </Link>
              )
            }
          />
          <Container className="prose pt-8" smallerContainer>
            <Title />
            <Editor />
          </Container>
        </Form>
      )}
    </Formik>
  );
};

const SaveFormToLocalStorage: FC = () => {
  const [, setStorageValues] = useLocalStorage(localStorageKeys.formPost);
  const { values } = useFormikContext();

  useEffect(() => {
    setStorageValues(values);
  }, [values, setStorageValues]);

  return null;
};

export default FormPost;

'use client';
import {
  Cog8ToothIcon,
  EyeIcon,
  HomeIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { Form, Formik, useFormikContext } from 'formik';
import dynamic from 'next/dynamic';
import { type FC, useState, useEffect } from 'react';
import Container from '~/components/container';
import Modal from '~/components/modal';
import Navbar from '~/components/navbar';
import PostPreview from './post-preview';
import PostSettings from './post-settings';
import Title from './title';
import { UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { paths } from '~/constants/paths';
import { useLocalStorage } from 'react-use';
import { localStorageKeys } from '~/constants/local-storage';

const Editor = dynamic(() => import('../../editor'), { ssr: false });

const FormPost: FC = () => {
  const { isSignedIn } = useAuth();
  const [localStorageValues] = useLocalStorage<typeof initialValues>(
    localStorageKeys.formPost
  );
  const [isPostPreviewOpen, setIsPostPreviewOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const items = [
    {
      name: 'Settings',
      icon: Cog8ToothIcon,
      action: () => setIsSettingsOpen(true),
    },
    {
      name: 'Preview',
      icon: EyeIcon,
      action: () => setIsPostPreviewOpen(true),
    },
    {
      name: 'Publish',
      icon: RocketLaunchIcon,
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

  const handleSubmit = (values: typeof initialValues) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={localStorageValues ?? initialValues}
      onSubmit={handleSubmit}
    >
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
          items={items}
          onRight={
            isSignedIn ? (
              <div className="flex flex-col gap-y-3 lg:flex-row lg:items-center lg:gap-x-3 lg:gap-y-0">
                <Link
                  href={paths.posts}
                  className="-mx-3 flex w-full items-center gap-x-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 lg:mr-3 lg:text-sm"
                >
                  <HomeIcon className="h-6 lg:hidden" />
                  Dashboard
                </Link>

                <UserButton />
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

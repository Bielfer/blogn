'use client';
import {
  Cog8ToothIcon,
  EyeIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { Form, Formik } from 'formik';
import dynamic from 'next/dynamic';
import { type FC, useState } from 'react';
import Container from '~/components/container';
import Modal from '~/components/modal';
import Navbar from '~/components/navbar';
import PostPreview from './post-preview';
import PostSettings from './post-settings';
import Title from './title';

const Editor = dynamic(() => import('../../editor'), { ssr: false });

const FormPost: FC = () => {
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
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
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
        <Navbar items={items} />
        <Container className="prose pt-8" smallerContainer>
          <Title />
          <Editor />
        </Container>
      </Form>
    </Formik>
  );
};

export default FormPost;

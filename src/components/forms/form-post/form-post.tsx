'use client';
import { Form, Formik, useFormikContext } from 'formik';
import dynamic from 'next/dynamic';
import {
  type FC,
  useState,
  useCallback,
  type SetStateAction,
  type Dispatch,
} from 'react';
import Container from '~/components/container';
import Modal from '~/components/modal';
import Navbar from '~/components/navbar';
import PostPreview from './post-preview';
import PostSettings from './post-settings';
import Title from './title';
import Link from 'next/link';
import { routes } from '~/lib/constants/routes';
import { useTimeoutFn, useUpdateEffect } from 'react-use';
import { trpc } from '~/lib/trpc';
import { useRouter } from 'next/navigation';
import { tryCatch } from '~/lib/helpers/try-catch';
import Spinner from '~/components/spinner';
import {
  HiOutlineCloudArrowUp,
  HiOutlineCog8Tooth,
  HiOutlineEye,
  HiOutlineHome,
  HiOutlineRocketLaunch,
} from 'react-icons/hi2';
import { useBlog, useToast, useUser } from '~/store';
import UserButton from '~/components/user-button';
import { postStatus } from '~/lib/constants/posts';
import { type Post } from '~/server/routers/post';
import SavingIndicator from './saving-indicator';

const Editor = dynamic(() => import('../../editor'), { ssr: false });

type Props = {
  post: Post;
};

const FormPost: FC<Props> = ({ post }) => {
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useUser();
  const { selectedBlog } = useBlog();
  const { data: categories } = trpc.category.getMany.useQuery(
    { blogId: selectedBlog?.id ?? '' },
    { enabled: !!selectedBlog }
  );
  const { mutateAsync: updatePost } = trpc.post.update.useMutation();
  const [isPostPreviewOpen, setIsPostPreviewOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavingForm, setIsSavingForm] = useState<boolean>();
  const { mutateAsync: createCategory } = trpc.category.create.useMutation();

  const isUpdatingPost = post.status === postStatus.published;

  const getNavbarItems = ({ isSubmitting }: { isSubmitting: boolean }) => [
    {
      name: 'Settings',
      icon: <HiOutlineCog8Tooth className="h-5 w-5" />,
      action: () => setIsSettingsOpen(true),
    },
    {
      name: 'Preview',
      icon: <HiOutlineEye className="h-5 w-5" />,
      action: () => setIsPostPreviewOpen(true),
    },
    {
      name: isUpdatingPost ? 'Save' : 'Publish',
      icon: isSubmitting ? (
        <Spinner size="sm" color="inherit" />
      ) : isUpdatingPost ? (
        <HiOutlineCloudArrowUp className="h-5 w-5" />
      ) : (
        <HiOutlineRocketLaunch className="h-5 w-5" />
      ),
      buttonType: 'submit' as const,
    },
  ];

  const handleSubmit = async (values: Post) => {
    const toCreateCategories = values.categories
      .filter(
        (category) =>
          !categories?.find((blogCategory) => blogCategory.name === category)
      )
      .map((category) =>
        createCategory({ blogId: values.blogId ?? '', name: category })
      );

    const [, error] = await tryCatch(
      Promise.all([
        ...toCreateCategories,
        updatePost({
          ...values,
          SEOTitle: values.SEOTitle || values.title,
          urlTitle:
            values.urlTitle || values.title.toLowerCase().replaceAll(' ', '-'),
          status: postStatus.published,
          authorUid: user?.uid,
        }),
      ])
    );

    if (error) {
      addToast({
        type: 'error',
        content: 'Failed to publish blog post, try again in 5 seconds',
      });
      return;
    }

    router.push(routes.appPosts);
  };

  return (
    <Formik initialValues={post} onSubmit={handleSubmit}>
      {({ isSubmitting, submitForm }) => (
        <Form>
          <SaveForm setIsSavingForm={setIsSavingForm} post={post} />
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
            className="overflow-auto"
          >
            <PostPreview handleClose={() => setIsPostPreviewOpen(false)} />
          </Modal>

          <Navbar
            className="fixed z-20 w-screen bg-white"
            submitForm={submitForm}
            items={getNavbarItems({
              isSubmitting,
            })}
            onMiddle={
              <div className="flex w-full flex-grow justify-center lg:hidden">
                {isSavingForm !== undefined && (
                  <SavingIndicator isSavingForm={isSavingForm} />
                )}
              </div>
            }
            onRight={
              <div className="flex flex-col gap-y-3 lg:flex-row lg:items-center lg:gap-x-3 lg:gap-y-0">
                {isSavingForm !== undefined && (
                  <div className="hidden pr-6 lg:block">
                    <SavingIndicator isSavingForm={isSavingForm} />
                  </div>
                )}
                <Link
                  href={routes.appPosts}
                  className="-mx-3 flex w-full items-center gap-x-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 lg:mr-3 lg:text-sm"
                >
                  <HiOutlineHome className="h-6" />
                  Dashboard
                </Link>
                <UserButton />
              </div>
            }
          />
          <Container className="prose py-32" smallerContainer>
            <Title post={post} />
            <Editor />
          </Container>
        </Form>
      )}
    </Formik>
  );
};

const SaveForm: FC<{
  post: Post;
  setIsSavingForm: Dispatch<SetStateAction<boolean | undefined>>;
}> = ({ setIsSavingForm, post }) => {
  const { addToast } = useToast();
  const { user } = useUser();
  const { mutateAsync: updatePost } = trpc.post.update.useMutation();
  const { values } = useFormikContext<Post>();

  const updateForm = useCallback(async () => {
    if (post?.status === postStatus.published) return;

    setIsSavingForm(true);

    const [, error] = await tryCatch(
      updatePost({
        ...values,
        status: postStatus.draft,
        authorUid: user?.uid,
      })
    );

    if (error)
      addToast({
        type: 'warning',
        content:
          'Something failed when saving automatically, try typing something else',
        duration: 2000,
      });

    setIsSavingForm(false);
  }, [updatePost, values, addToast, setIsSavingForm, post, user]);

  const [, cancel, reset] = useTimeoutFn(updateForm, 1500);

  useUpdateEffect(() => {
    reset();

    return () => cancel();
  }, [reset, cancel, values]);

  return null;
};

export default FormPost;

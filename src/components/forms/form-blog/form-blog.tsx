'use client';
import { Form, Formik, useFormikContext } from 'formik';
import { useCallback, type FC } from 'react';
import { z } from 'zod';
import cn from '~/lib/helpers/cn';
import { zodValidator } from '~/lib/helpers/zod';
import { type Blog } from '~/server/routers/blog';
import FormikInput from '../formik-input';
import { hints, validations } from '~/lib/constants/validations';
import Button from '~/components/button';
import FormikImagePreview from '../formik-image-preview';
import { tryCatch } from '~/lib/helpers/try-catch';
import { uploadFile } from '~/lib/helpers/firebase';
import { bucketPaths } from '~/lib/constants/firebase';
import { trpc } from '~/lib/trpc';
import { useBlog, useToast } from '~/store';
import FormikFile from '../formik-file';
import { HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2';
import Spinner from '~/components/spinner';
import { useTimeoutFn, useUpdateEffect } from 'react-use';

type Props = {
  className?: string;
  blog?: Blog;
  firstBlog?: boolean;
  title: string;
  afterSubmit?: () => void;
};

type SubdomainStatus = 'loading' | 'available' | 'unavailable';

const FormBlog: FC<Props> = ({
  blog,
  className,
  firstBlog,
  title,
  afterSubmit,
}) => {
  const { addToast } = useToast();
  const { setSelectedBlog } = useBlog();
  const { mutateAsync: createBlog } = trpc.blog.create.useMutation();
  const { mutateAsync: updateBlog } = trpc.blog.update.useMutation();
  const { mutateAsync: addSubdomainToCloudflare } =
    trpc.cloudflare.addDomain.useMutation();
  const { mutateAsync: addSubdomainToVercel } =
    trpc.vercel.addDomain.useMutation();

  const initialValues = {
    name: blog?.name ?? '',
    photoUrl: blog?.photoUrl ?? '',
    photoFile: undefined,
    links: blog?.links ?? {},
    subdomain: blog?.subdomain ?? '',
    subdomainStatus: 'loading' as SubdomainStatus,
  };

  const validationSchema = z.object({
    name: z.string({
      required_error: validations.required,
      invalid_type_error: validations.string,
    }),
    photoUrl: z.string().optional(),
    photoFile: z.instanceof(Blob).optional(),
    links: z.record(z.string()),
    subdomain: z
      .string({
        required_error: validations.required,
        invalid_type_error: validations.string,
      })
      .min(1, validations.stringMinLength(1))
      .max(63, validations.stringMaxLength(63))
      .refine(
        (val) => val.match(/[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?/),
        { message: validations.subdomain }
      ),
    subdomainStatus: z.enum(['loading', 'available', 'unavailable']),
  });

  const handleSubmit = async (values: z.infer<typeof validationSchema>) => {
    const { photoFile, photoUrl, subdomainStatus, ...filteredValues } = values;

    if (
      subdomainStatus !== 'available' &&
      blog?.subdomain !== values.subdomain
    ) {
      addToast({
        type: 'error',
        content: "You can't use an unavailable subdomain",
      });
      return;
    }

    let url: string | undefined,
      error: any,
      res: { url: string } | null = null,
      createdBlog: Blog | null = null;

    if (!!photoFile) {
      [res, error] = await tryCatch(uploadFile(photoFile, bucketPaths.blogs));
      url = res?.url;
    }

    if (error) {
      addToast({
        type: 'error',
        content: 'Failed to upload blog image and save blog data',
      });
      return;
    }

    if (!!blog) {
      let res: any;
      [res, error] = await tryCatch(
        Promise.all([
          updateBlog({
            ...filteredValues,
            id: blog.id,
            photoUrl: url ?? photoUrl,
          }),
          addSubdomainToCloudflare({ subdomain: values.subdomain }),
          addSubdomainToVercel({ domain: `${values.subdomain}.blogn.io` }),
        ])
      );
      createdBlog = res[0];
    } else {
      let res: any;
      [res, error] = await tryCatch(
        Promise.all([
          createBlog({ ...filteredValues, editors: [], photoUrl: url ?? '' }),
          addSubdomainToCloudflare({ subdomain: values.subdomain }),
          addSubdomainToVercel({ domain: `${values.subdomain}.blogn.io` }),
        ])
      );
      createdBlog = res[0];
    }

    if (error) {
      addToast({ type: 'error', content: 'Failed to save blog' });
      return;
    }

    setSelectedBlog(createdBlog);

    if (afterSubmit) afterSubmit();
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={zodValidator(validationSchema)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form className={cn('flex w-full flex-col gap-6', className)}>
          <h3>{title}</h3>
          <div>
            <label className="mb-2">Blog Photo</label>

            <FormikImagePreview
              name="photoUrl"
              fileName="photoFile"
              className="mx-auto h-32 w-32 rounded-full"
              noImageChosen={
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-100 px-2 text-center text-xs text-gray-500">
                  You can pick the photo later
                </div>
              }
            />
            <FormikFile
              className="flex justify-center pt-6"
              variant="secondary"
              name="photoFile"
            >
              Pick Photo
            </FormikFile>
          </div>
          <FormikInput
            name="name"
            label="Blog name"
            hint={hints.required}
            placeholder="Ex: John Doe's Blog"
          />
          <div className="flex flex-col gap-y-2">
            <CheckSubdomainAvailability />
            <FormikInput
              className="w-full"
              name="subdomain"
              label="Your subdomain"
              hint={hints.required}
              placeholder="mysubdomain"
              rightAddOn=".blogn.io"
            />
            {values.subdomain.length > 0 &&
              blog?.subdomain !== values.subdomain && (
                <div className="flex-shrink-0">
                  {values.subdomainStatus === 'unavailable' ? (
                    <p className="flex items-center gap-x-2 text-xs text-red-500">
                      <HiOutlineXMark className="h-4 w-4" />
                      Subdomain not available
                    </p>
                  ) : values.subdomainStatus === 'available' ? (
                    <p className="flex items-center gap-x-2 text-xs text-green-500">
                      <HiOutlineCheck className="h-4 w-4" />
                      Subdomain available
                    </p>
                  ) : (
                    <p className="flex items-center gap-x-2 text-xs text-gray-500">
                      <Spinner size="sm" />
                      Checking availability
                    </p>
                  )}
                </div>
              )}

            {!!firstBlog && (
              <p className="text-sm text-gray-500">
                This is going to be your subdomain but don&apos;t worry, you can
                setup your own domain later
              </p>
            )}
          </div>
          {!firstBlog && (
            <>
              <FormikInput
                label="X Link"
                name="links.x"
                placeholder="Ex: https://x.com/myprofile"
              />
              <FormikInput
                label="Youtube Link"
                name="links.youtube"
                placeholder="Ex: https://www.youtube.com/channel/mychannel"
              />
              <FormikInput
                label="LinkedIn Link"
                name="links.linkedIn"
                placeholder="Ex: https://www.linkedin.com/in/myprofile"
              />
              <FormikInput
                label="Instagram Link"
                name="links.instagram"
                placeholder="Ex: https://www.instagram.com/myprofile"
              />
            </>
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {!blog ? 'Create' : 'Update'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const CheckSubdomainAvailability: FC = () => {
  const { addToast } = useToast();
  const trpcContext = trpc.useContext();
  const { values, setFieldValue } = useFormikContext<{
    subdomainStatus: SubdomainStatus;
    subdomain: string;
  }>();

  const updateSubdomainAvailability = useCallback(async () => {
    setFieldValue('subdomainStatus', 'loading');

    if (values.subdomain.length === 0) return;

    const [blogs, error] = await tryCatch(
      trpcContext.blog.getMany.fetch({ subdomain: values.subdomain })
    );

    if (error) {
      addToast({
        type: 'error',
        content: 'Failed to check domain availability, try refreshing the page',
      });
      return;
    }

    if (!blogs) return;

    if (blogs.length > 0) setFieldValue('subdomainStatus', 'unavailable');
    else setFieldValue('subdomainStatus', 'available');
  }, [setFieldValue, addToast, values.subdomain, trpcContext.blog.getMany]);

  const [, cancel, reset] = useTimeoutFn(updateSubdomainAvailability, 1000);

  useUpdateEffect(() => {
    reset();

    return () => cancel();
  }, [reset, cancel, values.subdomain]);

  return null;
};

export default FormBlog;

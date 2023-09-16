'use client';
import { Form, Formik } from 'formik';
import type { FC } from 'react';
import { z } from 'zod';
import cn from '~/lib/helpers/cn';
import { zodValidator } from '~/lib/helpers/zod';
import { type Blog } from '~/server/routers/blog';
import FormikInput from '../formik-input';
import { hints } from '~/lib/constants/validations';

import Button from '~/components/button';
import FormikImagePreview from '../formik-image-preview';
import { tryCatch } from '~/lib/helpers/try-catch';
import { uploadFile } from '~/lib/helpers/firebase';
import { bucketPaths } from '~/lib/constants/firebase';
import { trpc } from '~/lib/trpc';
import { useBlog, useToast } from '~/store';
import FormikFile from '../formik-file';

type Props = {
  className?: string;
  blog?: Blog;
  firstBlog?: boolean;
  title: string;
  afterSubmit?: () => void;
};

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

  const initialValues = {
    name: blog?.name ?? '',
    photoUrl: blog?.photoUrl ?? '',
    photoFile: undefined,
    links: blog?.links ?? {},
  };

  const validationSchema = z.object({
    name: z.string(),
    photoUrl: z.string().optional(),
    photoFile: z.instanceof(Blob).optional(),
    links: z.record(z.string()),
  });

  const handleSubmit = async (values: z.infer<typeof validationSchema>) => {
    const { photoFile, photoUrl, ...filteredValues } = values;

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
      [createdBlog, error] = await tryCatch(
        updateBlog({
          ...filteredValues,
          id: blog.id,
          photoUrl: url ?? photoUrl,
        })
      );
    } else {
      [createdBlog, error] = await tryCatch(
        createBlog({ ...filteredValues, editors: [], photoUrl: url ?? '' })
      );
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
      {({ isSubmitting }) => (
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

export default FormBlog;

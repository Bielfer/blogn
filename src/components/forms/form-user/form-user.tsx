'use client';
import { Form, Formik } from 'formik';
import type { FC } from 'react';
import { z } from 'zod';
import { zodValidator } from '~/lib/helpers/zod';
import { trpc } from '~/lib/trpc';
import { useToast, useUser } from '~/store';
import FormikImagePreview from '../formik-image-preview';
import FormikFile from '../formik-file';
import FormikInput from '../formik-input';
import { hints } from '~/lib/constants/validations';
import Button from '~/components/button';
import { tryCatch } from '~/lib/helpers/try-catch';
import { bucketPaths } from '~/lib/constants/firebase';
import { uploadFile } from '~/lib/helpers/firebase';
import { keyPicker } from '~/lib/helpers/object';

const FormUser: FC = () => {
  const { user, setUser } = useUser();
  const { addToast } = useToast();
  const { mutateAsync: updateUser } = trpc.user.update.useMutation();

  const initialValues = {
    displayName: user?.displayName ?? '',
    photoURL: user?.photoURL ?? '',
    photoFile: undefined,
  };

  const validationSchema = z.object({
    displayName: z.string(),
    photoURL: z.string().optional(),
    photoFile: z.instanceof(Blob).optional(),
  });

  const handleSubmit = async (values: z.infer<typeof validationSchema>) => {
    const { photoFile, photoURL, ...filteredValues } = values;
    let error: any,
      res: { url: string } | null = null;

    if (!!photoFile) {
      [res, error] = await tryCatch(uploadFile(photoFile, bucketPaths.users));
    }

    if (error) {
      addToast({
        type: 'error',
        content: 'Failed to upload profile image',
      });
      return;
    }

    const [updatedUser, errorUpdating] = await tryCatch(
      updateUser({
        ...filteredValues,
        photoURL: res?.url ?? photoURL,
        uid: user?.uid ?? '',
      })
    );

    if (errorUpdating || !updatedUser) {
      addToast({ type: 'error', content: 'Failed to save your data' });
      return;
    }

    setUser(keyPicker(updatedUser, ['displayName', 'uid', 'photoURL']));
    addToast({ type: 'success', content: 'Profile updated' });
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={zodValidator(validationSchema)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-5">
          <div>
            <label className="mb-2">Profile photo</label>

            <FormikImagePreview
              name="photoURL"
              fileName="photoFile"
              className="mx-auto flex h-32 w-32 items-center justify-center rounded-full"
              noImageChosen={
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-100 px-2 text-center text-xs text-gray-500">
                  This photo will appear on your posts
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
            label="Profile name"
            name="displayName"
            hint={hints.required}
          />
          <div className="flex justify-end">
            <Button loading={isSubmitting} type="submit" variant="primary">
              Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormUser;

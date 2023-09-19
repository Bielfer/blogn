'use client';
import { Form, Formik } from 'formik';
import { type FC } from 'react';
import { z } from 'zod';
import { zodValidator } from '~/lib/helpers/zod';
import FormikInput from '../formik-input';
import { hints } from '~/lib/constants/validations';
import cn from '~/lib/helpers/cn';
import Button from '~/components/button';
import { trpc } from '~/lib/trpc';
import { tryCatch } from '~/lib/helpers/try-catch';
import { useBlog, useToast } from '~/store';
import { useRouter } from 'next/navigation';
import { routes } from '~/lib/constants/routes';
import { type Blog } from '~/server/routers/blog';

type Props = {
  className?: string;
  blog?: Blog;
};

const FormDomains: FC<Props> = ({ className, blog }) => {
  const { addToast } = useToast();
  const router = useRouter();
  const { setSelectedBlog } = useBlog();
  const { mutateAsync: updateBlog } = trpc.blog.update.useMutation();

  const initialValues = {
    domain: blog?.domain ?? '',
  };

  const validationSchema = z.object({
    domain: z.string(),
  });

  const handleSubmit = async (values: z.infer<typeof validationSchema>) => {
    if (!blog) {
      addToast({
        type: 'error',
        content: 'Choose a blog to update the domain or refresh the page',
      });
      return;
    }

    const [updatedBlog, error] = await tryCatch(
      updateBlog({ id: blog.id, domain: values.domain })
    );

    if (error || !updatedBlog) {
      addToast({
        type: 'error',
        content: 'Failed to update domain, try refreshing the page',
      });
      return;
    }

    setSelectedBlog(updatedBlog);
    router.push(routes.appBlogsSettingsDomains);
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={zodValidator(validationSchema)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={cn('flex flex-col gap-6', className)}>
          <h3>Manage your domain</h3>
          <FormikInput
            label="Domain"
            name="domain"
            hint={hints.required}
            leftAddOn="https://"
            placeholder="yourdomain.com"
          />
          <p className="text-sm text-gray-500">
            We will save your domain in our database, but you have to go to your
            domain registrar to configure the DNS settings and point it to our
            platform.
          </p>
          <div className="flex justify-end">
            <Button variant="primary" type="submit" loading={isSubmitting}>
              Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormDomains;

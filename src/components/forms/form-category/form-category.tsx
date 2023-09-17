'use client';
import { Form, Formik } from 'formik';
import type { FC } from 'react';
import { z } from 'zod';
import cn from '~/lib/helpers/cn';
import { zodValidator } from '~/lib/helpers/zod';
import FormikInput from '../formik-input';
import { hints, validations } from '~/lib/constants/validations';
import FormikTextarea from '../formik-textarea';
import Button from '~/components/button';
import { type Category } from '~/server/routers/category';
import { trpc } from '~/lib/trpc';
import { tryCatch } from '~/lib/helpers/try-catch';
import { useBlog, useToast } from '~/store';
import { useRouter } from 'next/navigation';
import { routes } from '~/lib/constants/routes';

type Props = {
  className?: string;
  category?: Category;
};

const FormCategory: FC<Props> = ({ className, category }) => {
  const router = useRouter();
  const { addToast } = useToast();
  const { selectedBlog } = useBlog();
  const { mutateAsync: createCategory } = trpc.category.create.useMutation();
  const { mutateAsync: updateCategory } = trpc.category.update.useMutation();

  const initialValues = {
    name: category?.name ?? '',
    description: category?.description ?? '',
  };

  const validationSchema = z.object({
    name: z.string({
      required_error: validations.required,
      invalid_type_error: validations.string,
    }),
    description: z
      .string({ invalid_type_error: validations.string })
      .optional(),
  });

  const handleSubmit = async (values: z.infer<typeof validationSchema>) => {
    let error: any;

    if (!!category)
      [, error] = await tryCatch(
        updateCategory({ ...values, id: category.id })
      );
    else
      [, error] = await tryCatch(
        createCategory({ ...values, blogId: selectedBlog?.id ?? '' })
      );

    if (error) {
      addToast({ type: 'error', content: 'Failed to save category' });
      return;
    }

    router.push(routes.appCategories);
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={zodValidator(validationSchema)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={cn('flex flex-col gap-5', className)}>
          <h3>{!!category ? 'Edit your category' : 'Create a category'}</h3>
          <FormikInput
            label="Category name"
            name="name"
            hint={hints.required}
            placeholder="Ex: Europe Trip"
          />
          <FormikTextarea
            label="Category description"
            name="description"
            placeholder="Ex: This category was about my 20 days europe trip..."
          />
          <div className="flex justify-end">
            <Button variant="primary" loading={isSubmitting} type="submit">
              {!!category ? 'Save' : 'Create'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormCategory;

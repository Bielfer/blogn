import type { FC } from 'react';
import FormikInput from '../formik-input';
import FormikDate from '../formik-date';
import FormikTextarea from '../formik-textarea';
import { useField } from 'formik';

const PostSettings: FC = () => {
  const [{ value: title }] = useField<string>('title');
  return (
    <div className="flex w-full flex-col gap-y-4">
      <FormikInput
        name="urlTitle"
        label="Url Title"
        placeholder="my-url-title"
        leftAddOn="/"
        help={`If no URL title is provided we will use /${title
          .toLowerCase()
          .replaceAll(' ', '-')}`}
      />
      <FormikInput
        name="SEOTitle"
        label="SEO Title"
        placeholder="A Simple Title"
        help={`If no SEO title is provided we will use "${title}"`}
      />
      <FormikTextarea
        name="SEODescription"
        label="SEO Description"
        placeholder="Just a brief description of your blog post..."
        rows={4}
      />
      <FormikDate name="publishedAt" label="Publish Date" />
    </div>
  );
};

export default PostSettings;

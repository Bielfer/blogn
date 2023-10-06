import type { FC } from 'react';
import FormikInput from '../formik-input';
import FormikDate from '../formik-date';
import FormikTextarea from '../formik-textarea';
import { useField } from 'formik';
import FormikChoose from '../formik-choose';
import { trpc } from '~/lib/trpc';
import { useBlog } from '~/store';

const PostSettings: FC = () => {
  const [{ value: title }] = useField<string>('title');
  const { selectedBlog } = useBlog();
  const { data: categories } = trpc.category.getMany.useQuery(
    { blogId: selectedBlog?.id ?? '' },
    { enabled: !!selectedBlog }
  );

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
      <FormikChoose
        label="Categories"
        name="categories"
        options={categories?.map((category) => ({
          text: category.name,
          value: category.name,
        }))}
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
      <FormikChoose
        label="Keywords"
        name="keywords"
        help="You can set the keywords meta tag, but keep in mind that most search engines don't use it anymore"
        options={[]}
      />
    </div>
  );
};

export default PostSettings;

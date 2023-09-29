import { type Metadata } from 'next';
import { type FC } from 'react';
import { HiOutlineNewspaper } from 'react-icons/hi2';
import TemplateDefault from '~/components/templates/default';
import { postStatus } from '~/lib/constants/posts';
import { getBlogByDomain } from '~/lib/fetchers/blog';
import { getCategoryByUrl } from '~/lib/fetchers/category';
import { getPosts } from '~/lib/fetchers/post';
import { generateBlogMetadata } from '~/lib/helpers/metadata';

export type Props = {
  params: { domain: string; categoryUrl: string };
  searchParams: { page?: string };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { domain, categoryUrl } = params;
  const blog = await getBlogByDomain({ domain });

  if (!blog) return {};

  const category = await getCategoryByUrl({
    blogId: blog?.id,
    url: categoryUrl,
  });

  if (!category) return {};

  const metadata = await generateBlogMetadata({
    blog,
    title: category.name,
    description: category.description,
  });

  return metadata;
};

const BlogCategoriesPage: FC<Props> = async ({ searchParams, params }) => {
  const page = parseInt(searchParams.page ?? '1');

  const blog = await getBlogByDomain({ domain: params.domain });
  const category = await getCategoryByUrl({
    blogId: blog.id,
    url: params.categoryUrl,
  });
  const postsData = await getPosts({
    blogId: blog.id,
    cursor: page,
    limit: 10,
    status: postStatus.published,
    categories: [category.name],
  });

  return (
    <TemplateDefault
      blog={blog}
      posts={postsData.posts}
      emptyState={{
        title: 'There are no posts on this category',
        icon: HiOutlineNewspaper,
      }}
      pagination={{ count: postsData.count, limit: 10, page }}
      heading
    >
      <div className="pb-8">
        <h3>{category.name}</h3>
        {!!category.description && (
          <p className="pt-3 text-sm text-gray-500">{category.description}</p>
        )}
      </div>
    </TemplateDefault>
  );
};

export default BlogCategoriesPage;

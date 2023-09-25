import { type Metadata } from 'next';
import { type FC } from 'react';
import { HiOutlineNewspaper } from 'react-icons/hi2';
import TemplateDefault from '~/components/templates/default';
import { postStatus } from '~/lib/constants/posts';
import { getBlogByDomain } from '~/lib/fetchers/blog';
import { getPosts } from '~/lib/fetchers/post';
import { generateBlogMetadata } from '~/lib/helpers/metadata';

export type Props = {
  params: { domain: string };
  searchParams: { page?: string };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { domain } = params;
  const blog = await getBlogByDomain({ domain });

  if (!blog) return {};

  const metadata = await generateBlogMetadata({
    blog,
    title: 'Home',
  });

  return metadata;
};

const BlogHome: FC<Props> = async ({ searchParams, params }) => {
  const page = parseInt(searchParams.page ?? '1');

  const blog = await getBlogByDomain({ domain: params.domain });
  const postsData = await getPosts({
    blogId: blog.id,
    cursor: page,
    limit: 10,
    status: postStatus.published,
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
    />
  );
};

export default BlogHome;

import { format } from 'date-fns';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type FC } from 'react';
import Pagination from '~/components/pagination';
import PostsList from '~/components/posts-list';
import TemplateDefault from '~/components/templates/default';
import { postStatus } from '~/lib/constants/posts';
import { publicImagesHref } from '~/lib/constants/public';
import { routes } from '~/lib/constants/routes';
import { generateBlogMetadata, getDomains } from '~/lib/helpers/metadata';
import { tryCatch } from '~/lib/helpers/try-catch';
import { caller } from '~/server/routers/_app';

export type Props = {
  params: { domain: string };
  searchParams: { page?: string };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const metadata = await generateBlogMetadata({
    domain: params.domain,
    title: 'Home',
  });

  return metadata;
};

const BlogHome: FC<Props> = async ({ searchParams, params }) => {
  const page = parseInt(searchParams.page ?? '1');
  const { domain, subdomain } = getDomains(params.domain);

  const [blogs, error] = await tryCatch(
    caller.blog.getMany({
      ...(!!subdomain ? { subdomain } : { domain }),
    })
  );

  const blog = blogs?.[0];

  if (error ?? !blog) notFound();

  const [data, errorPosts] = await tryCatch(
    caller.post.getMany({
      blogId: blog.id,
      cursor: page,
      limit: 10,
      status: postStatus.published,
    })
  );

  if (errorPosts || !data) notFound();

  const posts = data.posts;

  return (
    <TemplateDefault blog={blog}>
      <PostsList
        posts={posts.map((post) => ({
          id: post.id,
          title: post.title || 'No title created',
          href: routes.blogPost(post.id),
          description: post.SEODescription || '',
          date: format(post.publishedAt, 'MMM d, yyyy'),
          datetime: format(post.publishedAt, 'yyyy-MM-dd'),
          author: {
            name: post.author?.displayName ?? '',
            role: '',
            imageUrl: post.author?.photoURL ?? publicImagesHref.userIcon,
          },
          badges: post.categories.map((category) => ({
            text: category,
            color: 'gray',
            pill: true,
          })),
        }))}
      />
      <Pagination
        className="mb-10 mt-16"
        count={data.count}
        limit={10}
        page={page}
      />
    </TemplateDefault>
  );
};

export default BlogHome;

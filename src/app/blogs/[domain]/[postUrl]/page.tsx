import { format } from 'date-fns';
import { type Metadata } from 'next';
import Link from 'next/link';
import { type FC } from 'react';
import { HiMiniArrowLongLeft, HiMiniArrowLongRight } from 'react-icons/hi2';
import TemplateDefault from '~/components/templates/default';
import { routes } from '~/lib/constants/routes';
import { getBlogByDomain } from '~/lib/fetchers/blog';
import { getPostByUrl, getPreviousAndNext } from '~/lib/fetchers/post';
import cn from '~/lib/helpers/cn';
import { editorJsToHtml } from '~/lib/helpers/editor';
import { generateBlogMetadata } from '~/lib/helpers/metadata';

export type Props = {
  params: { domain: string; postUrl: string };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { domain, postUrl } = params;
  const blog = await getBlogByDomain({ domain });
  const post = await getPostByUrl({ blogId: blog.id, postUrl });
  const metadata = await generateBlogMetadata({
    blog,
    title: post.SEOTitle,
    description: post.SEODescription,
  });

  return metadata;
};

const PostPage: FC<Props> = async ({ params }) => {
  const { domain, postUrl } = params;
  const blog = await getBlogByDomain({ domain });
  const post = await getPostByUrl({ blogId: blog.id, postUrl });
  const { previous, next } = await getPreviousAndNext({
    blogId: blog.id,
    postId: post.id,
  });

  let html: string[] | undefined;
  const postHasContent = post.content.blocks.length > 0;

  if (postHasContent) html = editorJsToHtml().parse(post.content);

  return (
    <TemplateDefault blog={blog}>
      <div>
        <div className="flex flex-col items-center">
          <div className="prose">
            <h1 className="my-10 text-center">{post.title}</h1>
          </div>
          <p className="text-xs text-gray-600">
            {format(post.publishedAt, 'MMM d, yyyy')}
          </p>
          <div className="my-3 flex items-center">
            {!!post.author?.photoURL && (
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full">
                <img
                  className="h-full w-full object-contain"
                  src={post.author.photoURL}
                  alt={`${post.author.displayName} photo`}
                />
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {post.author?.displayName}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs">
            Featured on{' '}
            <Link href={routes.blogHome} className="underline">
              {blog.name}
            </Link>
          </p>
        </div>
        <div id="blog-content" className="prose py-16 prose-img:rounded-lg">
          {html?.map((item, index) => {
            if (typeof item === 'string') {
              return (
                <div dangerouslySetInnerHTML={{ __html: item }} key={index} />
              );
            }
            return item;
          })}
        </div>
        <nav
          className={cn(
            'flex items-start justify-between border-t border-gray-200 px-4 sm:px-0'
          )}
        >
          <div className="-mt-px flex w-0 flex-1">
            {!!previous && (
              <Link
                href={routes.blogPost(previous.urlTitle)}
                className="inline-flex flex-col border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                <div className="flex items-center justify-start">
                  <HiMiniArrowLongLeft
                    className="mr-3 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  Previous
                </div>
                <span className="pt-2 font-normal">{previous.title}</span>
              </Link>
            )}
          </div>
          <div className="-mt-px flex w-0 flex-1 justify-end">
            {next?.urlTitle && (
              <Link
                href={routes.blogPost(next.urlTitle)}
                className="inline-flex flex-col border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                <div className="flex items-center justify-end">
                  Next
                  <HiMiniArrowLongRight
                    className="ml-3 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <span className="pt-2 font-normal">{next.title}</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </TemplateDefault>
  );
};

export default PostPage;

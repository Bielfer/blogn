import type { FC, ReactNode } from 'react';
import TemplateDefaultHeading from './heading';
import { type Blog } from '~/server/routers/blog';
import Container from '~/components/container';
import TemplateDefaultFooter from './footer';
import { env } from '~/env.mjs';
import Logo from '~/components/logo';

type Props = {
  blog: Blog;
  children: ReactNode;
};

const TemplateDefault: FC<Props> = ({ blog, children }) => {
  return (
    <>
      <TemplateDefaultHeading blog={blog} />
      <Container
        className="pt-6 sm:pt-12"
        smallerContainerSize="max-w-2xl"
        smallerContainer
      >
        {children}
      </Container>
      <Container smallerContainerSize="max-w-5xl" smallerContainer>
        <TemplateDefaultFooter blog={blog} />
      </Container>
      <div className="flex items-center justify-center gap-x-3 py-6">
        <p className="text-sm text-gray-500">Created with</p>
        <Logo href={env.NEXT_PUBLIC_APP_URL} height={50} />
      </div>
    </>
  );
};

export default TemplateDefault;

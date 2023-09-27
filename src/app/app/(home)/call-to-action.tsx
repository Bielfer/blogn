import { type FC } from 'react';
import MyLink from '~/components/my-link';
import { routes } from '~/lib/constants/routes';

const CallToAction: FC = () => (
  <section className="bg-white">
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 ">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Improve your content production by focusing on what really matter
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          Building your blog was never this easy, and cheap
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <MyLink href={routes.appSignUp} variant="button-primary">
            Start for free
          </MyLink>
        </div>
      </div>
    </div>
  </section>
);

export default CallToAction;

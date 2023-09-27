import { type FC } from 'react';
import Header from './header';
import { isAuthenticated } from '~/lib/fetchers/auth';
import { redirect } from 'next/navigation';
import { routes } from '~/lib/constants/routes';
import Hero from './hero';
import PrimaryFeatures from './primary-features';
import Pricing from './pricing';
import CallToAction from './call-to-action';
import Footer from './footer';

const Home: FC = async () => {
  const token = await isAuthenticated();

  if (token) redirect(routes.appPosts);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <Pricing />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};

export default Home;

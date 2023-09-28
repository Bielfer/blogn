import type { FC } from 'react';
import Spinner from '~/components/spinner';

const Loading: FC = () => {
  return (
    <>
      <Spinner page />
    </>
  );
};

export default Loading;

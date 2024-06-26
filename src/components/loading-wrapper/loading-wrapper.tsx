import clsx from 'clsx';
import { type FC } from 'react';
import Spinner from '../spinner';

interface Props {
  isLoading: boolean;
  children: JSX.Element;
  className?: string;
  hiddenChildren?: boolean;
  page?: boolean;
}

const LoadingWrapper: FC<Props> = ({
  isLoading,
  children,
  className,
  hiddenChildren = false,
  page = false,
}) => {
  if (isLoading)
    return (
      <>
        <div className={clsx('flex justify-center', className)}>
          <Spinner size="md" page={page} />
        </div>
        {hiddenChildren && <div className="hidden">{children}</div>}
      </>
    );

  return children;
};

export default LoadingWrapper;

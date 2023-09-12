import type { FC } from 'react';
import logoWhiteBlack from 'public/logo-black.png';
import Image from 'next/image';
import cn from '~/lib/helpers/cn';

type Props = {
  className?: string;
};

const Logo: FC<Props> = ({ className }) => {
  return (
    <Image
      className={cn('h-16 w-auto', className)}
      src={logoWhiteBlack}
      alt="Blogn logo"
    />
  );
};

export default Logo;

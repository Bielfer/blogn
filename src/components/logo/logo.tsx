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
      className={cn(className)}
      src={logoWhiteBlack}
      height={71}
      alt="Blogn logo"
    />
  );
};

export default Logo;

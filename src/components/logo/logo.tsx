import type { FC } from 'react';
import logoWhiteBlack from 'public/logo-black.png';
import Image from 'next/image';
import cn from '~/lib/helpers/cn';
import Link from 'next/link';
import { routes } from '~/lib/constants/routes';

type Props = {
  className?: string;
  href?: string;
  height?: number;
  width?: number;
};

const Logo: FC<Props> = ({ className, href, height, width }) => {
  return (
    <Link href={href ?? routes.appHome}>
      <Image
        className={cn(className)}
        src={logoWhiteBlack}
        height={height ?? 71}
        width={width}
        alt="Blogn logo"
      />
    </Link>
  );
};

export default Logo;

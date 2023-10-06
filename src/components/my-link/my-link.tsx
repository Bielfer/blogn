import type { FC, ReactNode } from 'react';
import Link from 'next/link';
import { type Concat } from '~/types/core';
import { type Url } from 'url';
import Spinner from '../spinner';
import {
  buttonAndLinkSizes,
  buttonAndLinkStyles,
} from '~/lib/constants/styles';
import { type IconType } from 'react-icons';
import cn from '~/lib/helpers/cn';

export type MyLinkProps = {
  className?: string;
  variant?:
    | Concat<['button-', keyof (typeof buttonAndLinkStyles)['button' | 'link']]>
    | keyof (typeof buttonAndLinkStyles)['button' | 'link'];
  size?: keyof typeof buttonAndLinkSizes;
  iconLeft?: IconType;
  iconRight?: IconType;
  href: string | Partial<Url>;
  children: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  target?: string;
};

const MyLink: FC<MyLinkProps> = ({
  className,
  children,
  variant = 'default',
  href,
  size = 'md',
  iconLeft: IconLeft,
  iconRight: IconRight,
  isLoading,
  disabled,
  ...props
}) => {
  const isButton = variant.includes('button');
  const linkStyles = !isButton ? '' : 'rounded-lg shadow-sm';
  const [buttonOrLink, variantStyle] = variant.split('-');

  return (
    <Link
      href={href}
      passHref
      className={cn(
        'inline-flex items-center whitespace-nowrap font-medium transition duration-200',
        linkStyles,
        buttonAndLinkStyles[isButton ? 'button' : 'link'][
          (variantStyle ?? buttonOrLink) as keyof (typeof buttonAndLinkStyles)[
            | 'button'
            | 'link']
        ],
        buttonAndLinkSizes[size],
        disabled && 'pointer-events-none',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" color="inherit" />
      ) : (
        <>
          {IconLeft && (
            <IconLeft className="-ml-0.5 mr-2 h-5 w-5 flex-shrink-0" />
          )}
          {children}
          {IconRight && (
            <IconRight className="-mr-0.5 ml-2 h-5 w-5 flex-shrink-0" />
          )}
        </>
      )}
    </Link>
  );
};
export default MyLink;

import clsx from 'clsx';
import type { FC } from 'react';
import Spinner from '../spinner';
import { buttonAndLinkStyles } from '~/lib/constants/styles';
import { type IconType } from 'react-icons';
import { type Concat } from '~/types/core';
import Link from 'next/link';

type Props = {
  icon: IconType;
  className?: string;
  variant?:
    | Concat<['button-', keyof (typeof buttonAndLinkStyles)['button' | 'link']]>
    | keyof (typeof buttonAndLinkStyles)['button' | 'link'];
  size?: keyof typeof buttonPaddings;
  loading?: boolean;
  href: string;
  target?: string;
};

const iconSizes = {
  xs: 'h-5 w-5',
  sm: 'h-5 w-5',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-6 w-6',
};

const buttonPaddings = {
  xs: 'p-1',
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2',
  xl: 'p-3',
};

const IconLink: FC<Props> = ({
  icon: Icon,
  className,
  variant = 'default',
  size = 'md',
  loading,
  href,
  target,
}) => {
  const isButton = variant.includes('button');
  const linkStyles = !isButton ? '' : 'shadow-sm';
  const [buttonOrLink, variantStyle] = variant.split('-');

  return (
    <Link
      href={href}
      type="button"
      className={clsx(
        'inline-flex items-center rounded-full',
        linkStyles,
        buttonAndLinkStyles[isButton ? 'button' : 'link'][
          (variantStyle ?? buttonOrLink) as keyof (typeof buttonAndLinkStyles)[
            | 'button'
            | 'link']
        ],
        buttonPaddings[size],
        className
      )}
      target={target}
    >
      {loading ? (
        <Spinner size="sm" color="inherit" />
      ) : (
        <Icon className={iconSizes[size]} aria-hidden="true" />
      )}
    </Link>
  );
};

export default IconLink;

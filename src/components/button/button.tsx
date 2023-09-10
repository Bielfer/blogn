/* eslint @typescript-eslint/no-redundant-type-constituents:off */
import type { FC, ReactNode } from 'react';
import Spinner from '~/components/spinner';
import { type Concat } from '~/types/core';

import { type IconType } from 'react-icons';
import {
  buttonAndLinkSizes,
  buttonAndLinkStyles,
} from '~/lib/constants/styles';
import cn from '~/lib/helpers/cn';

export type ButtonProps = {
  className?: string;
  children: ReactNode;
  type?: 'submit' | 'button';
  iconLeft?: IconType;
  iconRight?: IconType;
  variant?:
    | Concat<['link-', keyof (typeof buttonAndLinkStyles)['button' | 'link']]>
    | keyof (typeof buttonAndLinkStyles)['button' | 'link'];
  size?: keyof typeof buttonAndLinkSizes;
  loading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

const Button: FC<ButtonProps> = ({
  type,
  className,
  iconLeft: IconLeft,
  iconRight: IconRight,
  children,
  variant = 'default',
  size = 'md',
  loading,
  disabled,
  ...props
}) => {
  const isButton = !variant.includes('link');
  const buttonStyles = isButton ? 'shadow-sm' : '';
  const [buttonOrLink, variantStyle] = variant.split('-');

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-lg font-medium transition duration-200',
        buttonStyles,
        disabled
          ? buttonAndLinkStyles.button.disabled
          : buttonAndLinkStyles[isButton ? 'button' : 'link'][
              (variantStyle ??
                buttonOrLink) as keyof (typeof buttonAndLinkStyles)[
                | 'button'
                | 'link']
            ],
        buttonAndLinkSizes[size],
        className
      )}
      disabled={loading ? loading : disabled}
      {...props}
    >
      {loading ? (
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
    </button>
  );
};

export default Button;

import type { FC, ReactNode } from 'react';
import cn from '~/lib/helpers/cn';

type Props = {
  children: ReactNode;
  size?: keyof typeof sizes;
  color?: keyof typeof colors;
  dot?: boolean;
  pill?: boolean;
  border?: boolean;
  onClick?: () => void;
};

const sizes = {
  sm: 'px-1.5 py-0.5',
  md: 'px-2 py-1',
};

const colors = {
  gray: {
    default: 'bg-gray-50 text-gray-600 ring-gray-500/10',
    dot: 'fill-gray-400',
    button: 'hover:bg-gray-500/20',
    buttonSvg: 'stroke-gray-700/50 group-hover:stroke-gray-700/75',
  },
  red: {
    default: 'bg-red-50 text-red-700 ring-red-600/10',
    dot: 'fill-red-500',
    button: 'hover:bg-red-600/20',
    buttonSvg: 'stroke-red-700/50 group-hover:stroke-red-700/75',
  },
  yellow: {
    default: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
    dot: 'fill-yellow-500',
    button: 'hover:bg-yellow-600/20',
    buttonSvg: 'stroke-yellow-800/50 group-hover:stroke-yellow-800/75',
  },
  green: {
    default: 'bg-green-50 text-green-700 ring-green-600/20',
    dot: 'fill-green-500',
    button: 'hover:bg-green-600/20',
    buttonSvg: 'stroke-green-800/50 group-hover:stroke-green-800/75',
  },
  blue: {
    default: 'bg-blue-50 text-blue-700 ring-blue-700/10',
    dot: 'fill-blue-500',
    button: 'hover:bg-blue-600/20',
    buttonSvg: 'stroke-blue-800/50 group-hover:stroke-blue-800/75',
  },
  indigo: {
    default: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10',
    dot: 'fill-indigo-500',
    button: 'hover:bg-indigo-600/20',
    buttonSvg: 'stroke-indigo-700/50 group-hover:stroke-indigo-700/75',
  },
  purple: {
    default: 'bg-purple-50 text-purple-700 ring-purple-700/10',
    dot: 'fill-purple-500',
    button: 'hover:bg-purple-600/20',
    buttonSvg: 'stroke-violet-700/50 group-hover:stroke-violet-700/75',
  },
  pink: {
    default: 'bg-pink-50 text-pink-700 ring-pink-700/10',
    dot: 'fill-pink-500',
    button: 'hover:bg-pink-600/20',
    buttonSvg: 'stroke-pink-800/50 group-hover:stroke-pink-800/75',
  },
};

const Badge: FC<Props> = ({
  children,
  size = 'md',
  color = 'gray',
  pill = false,
  border = false,
  dot = false,
  onClick,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-x-0.5 rounded-md text-xs font-medium',
        pill && 'rounded-full',
        border && 'ring-1 ring-inset',
        sizes[size],
        colors[color].default
      )}
    >
      {dot && (
        <svg
          className={cn('mr-1 h-1.5 w-1.5', dot && colors[color].dot)}
          viewBox="0 0 6 6"
          aria-hidden="true"
        >
          <circle cx={3} cy={3} r={3} />
        </svg>
      )}
      {children}
      {!!onClick && (
        <button
          type="button"
          className={cn(
            'group relative -mr-1 h-3.5 w-3.5 rounded-sm',
            colors[color].button
          )}
        >
          <span className="sr-only">Remove</span>
          <svg
            viewBox="0 0 14 14"
            className={cn('h-3.5 w-3.5', colors[color].buttonSvg)}
          >
            <path d="M4 4l6 6m0-6l-6 6" />
          </svg>
          <span className="absolute -inset-1" />
        </button>
      )}
    </span>
  );
};

export default Badge;

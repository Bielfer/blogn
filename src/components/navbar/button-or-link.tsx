import type { FC } from 'react';
import { type Item } from './navbar';

type Props = Item & {
  className?: string;
};

const ButtonOrLink: FC<Props> = ({
  href,
  icon: Icon,
  name,
  action,
  className,
}) =>
  !!href ? (
    <a href={href} className={className}>
      {!!Icon && <Icon className="h-6" />}
      <span>{name}</span>
    </a>
  ) : (
    <button className={className} onClick={action}>
      {!!Icon && <Icon className="h-6" />}
      <span>{name}</span>
    </button>
  );

export default ButtonOrLink;

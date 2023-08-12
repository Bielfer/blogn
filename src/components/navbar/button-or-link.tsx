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
  buttonType = 'button',
}) =>
  !!href ? (
    <a href={href} className={className}>
      {!!Icon && Icon}
      <span>{name}</span>
    </a>
  ) : (
    <button className={className} onClick={action} type={buttonType}>
      {!!Icon && Icon}
      <span>{name}</span>
    </button>
  );

export default ButtonOrLink;

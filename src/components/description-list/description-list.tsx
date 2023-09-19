import { type FC, type ReactNode } from 'react';

type Props = {
  className?: string;
  title?: string;
  subtitle?: string;
  onRight?: ReactNode;
  items: { name: string; content: ReactNode; onRight?: ReactNode }[];
};

const DescriptionList: FC<Props> = ({
  className,
  items,
  title,
  subtitle,
  onRight,
}) => {
  return (
    <div className={className}>
      {(!!title || !!subtitle) && (
        <div className="flex items-center justify-between">
          <div className="px-4 sm:px-0">
            {title && <h3>{title}</h3>}
            {!!subtitle && (
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
          {onRight}
        </div>
      )}
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {items.map((item) => (
            <div
              className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              key={item.name}
            >
              <dt className="text-sm font-medium leading-6 text-gray-900">
                {item.name}
              </dt>
              <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <span className="flex-grow">{item.content}</span>
                {!!item.onRight && (
                  <span className="ml-4 flex-shrink-0">{item.onRight}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default DescriptionList;

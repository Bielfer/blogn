import { type FC, type ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

const Divider: FC<Props> = ({ children }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      {!!children && (
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-sm text-gray-500">
            {children}
          </span>
        </div>
      )}
    </div>
  );
};

export default Divider;

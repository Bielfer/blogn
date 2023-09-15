import { Float } from '@headlessui-float/react';
import { Popover } from '@headlessui/react';
import type { FC, ReactNode } from 'react';

type Props = {
  button: ReactNode;
  items: {
    onClick: () => void;
    text: string;
    onLeft?: ReactNode;
  }[];
};

const MyPopover: FC<Props> = ({ button, items }) => {
  return (
    <Popover className="relative">
      {({ close }) => (
        <Float
          placement="bottom-end"
          offset={10}
          shift
          enter="transition duration-200 ease-out"
          enterFrom="scale-95 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="transition duration-150 ease-in"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-95 opacity-0"
          tailwindcssOriginClass
        >
          <Popover.Button className="flex flex-shrink-0 items-center justify-center outline-none">
            {button}
          </Popover.Button>

          <Popover.Panel className="flex flex-col divide-y whitespace-nowrap rounded-lg bg-white font-medium shadow-lg">
            {items.map(({ onClick, onLeft, text }) => (
              <button
                key={text}
                type="button"
                className="flex items-center gap-x-3 px-6 py-3 text-left text-sm text-gray-600 transition duration-150 hover:bg-gray-50"
                onClick={() => {
                  onClick();
                  close();
                }}
              >
                {onLeft}
                {text}
              </button>
            ))}
          </Popover.Panel>
        </Float>
      )}
    </Popover>
  );
};

export default MyPopover;

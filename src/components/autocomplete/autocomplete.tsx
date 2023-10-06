/* eslint @typescript-eslint/ban-ts-comment:off */
import { useState } from 'react';
import type { FC } from 'react';
import { Combobox } from '@headlessui/react';
import clsx from 'clsx';
import { HiMiniCheck, HiMiniChevronUpDown } from 'react-icons/hi2';
import InputLayout from '../input-layout';

type Option = { text: string; value: string };

type Props = {
  selected: string | string[];
  setSelected: (value: string | string[]) => void;
  options: Option[];
  className?: string;
  placeholder?: string;
  label?: string | null;
  name?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  multiple?: boolean;
  help?: string;
};

const Autocomplete: FC<Props> = ({
  selected,
  setSelected,
  options,
  disabled,
  error,
  hint,
  name,
  className,
  placeholder,
  label,
  multiple = false,
  help,
}) => {
  const [input, setInput] = useState(
    options.find((option) => option.value === selected)?.text ?? ''
  );

  const filteredOptions =
    input === ''
      ? options
      : options.filter((option) =>
          option.text.toLowerCase().includes(input.toLowerCase())
        );

  return (
    <InputLayout
      name={name}
      className={className}
      error={error}
      hint={hint}
      label={label}
      help={help}
    >
      <Combobox
        value={selected}
        onChange={setSelected}
        //@ts-ignore
        multiple={multiple}
      >
        {multiple ? (
          <Combobox.Input
            onChange={(event) => {
              setInput(event.target.value);
            }}
            placeholder={placeholder}
            className={clsx(
              'relative w-full cursor-text rounded-lg border py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-1 focus-visible:ring-offset-primary-500 sm:text-sm',
              disabled && 'bg-gray-200',
              !error
                ? 'border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500'
                : 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
            )}
            autoComplete="off"
          />
        ) : (
          <Combobox.Input
            onChange={(event) => {
              setInput(event.target.value);
              setSelected(event.target.value);
            }}
            displayValue={(value: string) =>
              options.find((option) => option.value === value)?.text ?? value
            }
            placeholder={placeholder}
            className={clsx(
              'relative w-full cursor-text rounded-lg border py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-1 focus-visible:ring-offset-primary-500 sm:text-sm',
              disabled && 'bg-gray-200',
              !error
                ? 'border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500'
                : 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
            )}
            autoComplete="off"
          />
        )}
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <HiMiniChevronUpDown
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {input.length > 0 &&
            input !==
              options.find((option) => option.text === selected)?.text && (
              <Combobox.Option
                value={input}
                className={({ active }) =>
                  clsx(
                    'relative cursor-pointer select-none py-2 pl-8 pr-4',
                    active ? 'bg-primary-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected: selectedOption }) => (
                  <>
                    <span
                      className={clsx(
                        'block truncate',
                        selectedOption && 'font-semibold'
                      )}
                    >
                      {input}
                    </span>

                    {selectedOption && (
                      <span
                        className={clsx(
                          'absolute inset-y-0 left-0 flex items-center pl-1.5',
                          active ? 'text-white' : 'text-primary-600'
                        )}
                      >
                        <HiMiniCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            )}
          {filteredOptions.map((option) => (
            <Combobox.Option
              key={option.value}
              value={option.value}
              className={({ active }) =>
                clsx(
                  'relative cursor-pointer select-none py-2 pl-8 pr-4',
                  active ? 'bg-primary-600 text-white' : 'text-gray-900'
                )
              }
            >
              {({ active, selected: selectedOption }) => (
                <>
                  <span
                    className={clsx(
                      'block truncate',
                      selectedOption && 'font-semibold'
                    )}
                  >
                    {option.text}
                  </span>

                  {selectedOption && (
                    <span
                      className={clsx(
                        'absolute inset-y-0 left-0 flex items-center pl-1.5',
                        active ? 'text-white' : 'text-primary-600'
                      )}
                    >
                      <HiMiniCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </InputLayout>
  );
};

export default Autocomplete;

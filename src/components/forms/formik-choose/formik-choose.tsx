import { useField } from 'formik';
import { type FC, useState } from 'react';
import Autocomplete from '~/components/autocomplete';
import Badge from '~/components/badge';

type Props = {
  name: string;
  label?: string | null;
  hint?: string;
  disabled?: boolean;
  options: { text: string; value: string }[] | undefined;
  help?: string;
};

const FormikChoose: FC<Props> = ({
  name,
  options,
  label,
  hint,
  disabled,
  help,
}) => {
  const [{ value }, { error, touched, initialValue }, { setValue }] =
    useField<string[]>(name);
  const [inputValue, setInputValue] = useState<string[]>(initialValue ?? []);

  const errorMessage = touched && error ? error : undefined;

  const handleChange = (e: string[]) => {
    setInputValue(e);
    setValue(e);
  };

  return (
    <div>
      <div className="flex items-end gap-x-3">
        <Autocomplete
          className="flex-grow"
          label={label}
          selected={inputValue}
          setSelected={(e) => handleChange(e as string[])}
          options={options ?? []}
          name={name}
          error={errorMessage}
          hint={hint}
          disabled={disabled}
          multiple
          help={help}
        />
      </div>
      <div className="px-2">
        {value?.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-1 pt-2">
            {value.map((insertedValue) => (
              <Badge
                key={insertedValue}
                pill
                border
                onClick={() =>
                  handleChange(value.filter((item) => item !== insertedValue))
                }
              >
                {insertedValue}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormikChoose;

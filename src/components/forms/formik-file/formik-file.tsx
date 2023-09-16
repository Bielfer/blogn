import { useField } from 'formik';
import { type FC, useRef } from 'react';
import Button, { type ButtonProps } from '~/components/button';
import InputLayout from '~/components/input-layout';

type Props = {
  name: string;
  hint?: string;
  label?: string;
} & ButtonProps;

const FormikFile: FC<Props> = ({
  className,
  name,
  children,
  label,
  hint,
  ...props
}) => {
  const [, { error, touched }, { setValue }] = useField<File | null>(name);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <InputLayout
        className={className}
        error={touched && error ? error : ''}
        hint={hint}
        label={label}
        name={name}
      >
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          onChange={(e) => {
            const firstFile = e.target.files?.[0];

            if (!firstFile) return;

            setValue(firstFile);
          }}
        />
        <Button onClick={() => inputRef.current?.click()} {...props}>
          {children}
        </Button>
      </InputLayout>
    </>
  );
};

export default FormikFile;

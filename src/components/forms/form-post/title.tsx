import { useField } from 'formik';
import { useEffect, type FC, useRef } from 'react';

const Title: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ value }, { initialValue }, { setValue }] = useField<string>('title');

  useEffect(() => {
    if (!ref.current) return;
    ref.current.textContent = initialValue ?? '';
  }, [initialValue]);

  return (
    <div className="relative text-4xl font-bold">
      {value.length < 1 && (
        <div className="absolute text-gray-500">Post title</div>
      )}
      <div
        ref={ref}
        className="mb-6 min-h-[5rem] w-full border-0 p-0 focus:outline-none focus:ring-0"
        contentEditable
        onInput={(e) => {
          setValue(e.currentTarget.textContent ?? '');
        }}
      />
    </div>
  );
};

export default Title;

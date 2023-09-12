import { useField } from 'formik';
import { useEffect, type FC, useRef } from 'react';
import { type Post } from '~/server/routers/post';

type Props = {
  post?: Post;
};

const Title: FC<Props> = ({ post }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, { initialValue }, { setValue }] = useField<string>('title');

  useEffect(() => {
    if (!ref.current) return;
    ref.current.textContent = initialValue ?? '';
  }, [initialValue]);

  return (
    <div className="relative text-4xl font-bold">
      {!ref.current?.textContent && !post?.title && (
        <div className="absolute -z-10 text-gray-500">Post title</div>
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

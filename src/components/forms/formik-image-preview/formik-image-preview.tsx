import { useField } from 'formik';
import { useEffect, type FC, type ReactNode } from 'react';
import cn from '~/lib/helpers/cn';

type Props = {
  name: string;
  fileName: string;
  className?: string;
  noImageChosen?: ReactNode;
};

const FormikImagePreview: FC<Props> = ({
  name,
  className,
  noImageChosen,
  fileName,
}) => {
  const [{ value: imageUrl }, , { setValue: setImageUrl }] =
    useField<string>(name);
  const [{ value: file }] = useField(fileName);

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    setImageUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, setImageUrl]);

  if (!imageUrl && !noImageChosen) return null;

  return !!imageUrl ? (
    <div className={cn('overflow-hidden', className)}>
      <img
        className="h-full w-full object-contain"
        src={imageUrl}
        alt="Image preview"
      />
    </div>
  ) : (
    noImageChosen
  );
};

export default FormikImagePreview;

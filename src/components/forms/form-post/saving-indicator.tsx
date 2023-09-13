import type { FC } from 'react';
import { HiOutlineCheckBadge } from 'react-icons/hi2';
import Spinner from '~/components/spinner';

type Props = {
  isSavingForm: boolean;
};

const SavingIndicator: FC<Props> = ({ isSavingForm }) => {
  return isSavingForm ? (
    <span className="flex items-center gap-x-2 text-sm text-gray-500">
      <Spinner size="sm" className="" />
      Saving
    </span>
  ) : (
    <span className="flex items-center gap-x-2 text-sm text-green-400">
      <HiOutlineCheckBadge className="h-5 w-5" />
      Saved
    </span>
  );
};

export default SavingIndicator;

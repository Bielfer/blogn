import type { FC, ReactNode } from 'react';
import VerticalNavigation from '~/components/vertical-navigation';
import { settingsRoutes } from '~/lib/constants/routes';

type Props = {
  children: ReactNode;
};

const SettingsLayout: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col gap-8 pb-20 sm:flex-row sm:pt-6">
      <VerticalNavigation
        className="w-full sm:w-1/4 sm:pt-10 md:w-1/5"
        items={settingsRoutes}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default SettingsLayout;

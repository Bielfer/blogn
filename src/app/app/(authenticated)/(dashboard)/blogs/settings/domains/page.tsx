import { type Metadata } from 'next';
import { type FC } from 'react';
import DescriptionListWrapper from './description-list-wrapper';

export const metadata: Metadata = {
  title: 'Domains settings',
};

const SettingsDomainsPage: FC = () => {
  return <DescriptionListWrapper />;
};

export default SettingsDomainsPage;

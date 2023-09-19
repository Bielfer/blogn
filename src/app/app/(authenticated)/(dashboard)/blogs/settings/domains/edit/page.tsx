import { type Metadata } from 'next';
import { type FC } from 'react';
import FormDomainsWrapper from './form-domains-wrapper';

export const metadata: Metadata = {
  title: 'Update your domains',
};

const EditDomainSettings: FC = () => {
  return <FormDomainsWrapper />;
};

export default EditDomainSettings;

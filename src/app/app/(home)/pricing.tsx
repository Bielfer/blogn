'use client';
import { type FC, useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { HiMiniCheck } from 'react-icons/hi2';
import cn from '~/lib/helpers/cn';
import Link from 'next/link';
import { routes } from '~/lib/constants/routes';

const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' },
];
const tiers = [
  {
    name: 'Individual',
    id: 'tier-individual',
    href: routes.appSignUp,
    price: { monthly: '$0', annually: '$0' },
    description: 'The essentials to start your blogging experience',
    features: [
      '1 Editor',
      'Unlimited Posts',
      'Basic Template',
      'SEO Tools',
      'Free subdomain',
      'Connect your own domain',
    ],
    mostPopular: true,
    buyMessage: 'Start for free',
  },
  {
    name: 'Team',
    id: 'tier-team',
    href: routes.appSignUp,
    price: { monthly: '$20', annually: '$200' },
    description: 'A plan for those that want everything we have to offer',
    features: [
      'Everything in the Individual plan',
      'Unlimited editors',
      'All Templates',
      'Optimized Images',
    ],
    mostPopular: false,
    buyMessage: 'Buy plan',
  },
];

const Pricing: FC = () => {
  const [frequency, setFrequency] = useState(frequencies[0]);

  return (
    <div className="bg-white py-24 sm:py-32" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Our plans
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          At Blogn we prioritize the blogger satisfaction and because of this,
          we have a free plan, so you can use our essential features and fall in
          love with our product
        </p>
        <div className="mt-16 flex justify-center">
          <RadioGroup
            value={frequency}
            defaultValue={frequencies[0]}
            onChange={setFrequency}
            className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
          >
            <RadioGroup.Label className="sr-only">
              Payment frequency
            </RadioGroup.Label>
            {frequencies.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option}
                className={({ checked }) =>
                  cn(
                    checked ? 'bg-primary-900 text-white' : 'text-gray-500',
                    'cursor-pointer rounded-full px-2.5 py-1'
                  )
                }
              >
                <span>{option.label}</span>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>
        <div className="mx-auto mt-10 flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:justify-center">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                tier.mostPopular
                  ? 'ring-2 ring-primary-600'
                  : 'ring-1 ring-gray-200',
                'max-w-md rounded-3xl p-8 xl:p-10'
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={cn(
                    tier.mostPopular ? 'text-primary-600' : 'text-gray-900',
                    'text-lg font-semibold leading-8'
                  )}
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-primary-900/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary-600">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  {tier.price[frequency?.value as keyof typeof tier.price]}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600">
                  {frequency?.priceSuffix}
                </span>
              </p>
              <Link
                href={tier.href}
                aria-describedby={tier.id}
                className={cn(
                  tier.mostPopular
                    ? 'bg-primary-900 text-white shadow-sm hover:bg-primary-800'
                    : 'text-primary-600 ring-1 ring-inset ring-primary-200 hover:ring-primary-300',
                  'mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                )}
              >
                {tier.buyMessage}
              </Link>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <HiMiniCheck
                      className="h-6 w-5 flex-none text-primary-600"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;

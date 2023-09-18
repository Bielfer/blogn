export const validations = {
  required: 'Required',
  number: 'You can only use numbers',
  calendar: 'Use the calendar to choose the date',
  valueGreaterThan: (num: number) => `Value must be greater than ${num}`,
  string: 'Please use valid characters',
  email: 'Use a valid email',
  subdomain: 'Use a valid subdomain',
  stringMinLength: (num: number) =>
    `Use at least ${num} character${num === 1 ? '' : 's'}`,
  stringMaxLength: (num: number) =>
    `Use at maximum ${num} character${num === 1 ? '' : 's'}`,
};

export const hints = {
  required: 'Required',
  optional: 'Optional',
};

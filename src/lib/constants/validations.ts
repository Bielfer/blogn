export const validations = {
  required: 'Required',
  number: 'You can only use numbers',
  calendar: 'Use the calendar to choose the date',
  valueGreaterThan: (num: number) => `Value must be greater than ${num}`,
  string: 'Please use valid characters',
  email: 'Insert a valid email',
};

export const hints = {
  required: 'Required',
  optional: 'Optional',
};

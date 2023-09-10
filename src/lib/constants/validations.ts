export const validations = {
  required: 'Campo Obrigatório',
  number: 'Insira apenas números',
  calendar: 'Use o calendário para escolher a data',
  valueGreaterThan: (num: number) => `Valor deve ser maior que ${num}`,
  string: 'Insira apenas caracteres válidos',
  email: 'Insira um email válido',
};

export const hints = {
  required: 'Campo Obrigatório',
};

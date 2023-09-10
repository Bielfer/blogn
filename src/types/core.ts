export type ObjectEntries<T> = [keyof T, T[keyof T]][];

export type ObjectValues<T> = T[keyof T];

export type ChangeTypeOfKeys<
  T extends object,
  Keys extends keyof T,
  NewType
> = {
  [key in keyof T]: key extends Keys ? NewType : T[key];
};

export type Concat<T extends string[]> = T extends [
  infer F extends string,
  ...infer R extends string[]
]
  ? `${F}${Concat<R>}`
  : '';

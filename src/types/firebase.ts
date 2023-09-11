export type BaseDocument<T> = {
  id: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
} & T;

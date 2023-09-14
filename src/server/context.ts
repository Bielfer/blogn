/* eslint @typescript-eslint/require-await:off */
import type * as trpc from '@trpc/server';

export const createContext = async () => {
  return {};
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

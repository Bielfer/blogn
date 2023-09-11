/* eslint @typescript-eslint/require-await:off */
import type * as trpc from '@trpc/server';
import type * as trpcNext from '@trpc/server/adapters/next';
import { cookiesKeys } from '~/lib/constants/cookies';

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const idToken = (
    opts.req.cookies._parsed as unknown as Map<
      string,
      { name: string; value: string }
    >
  ).get(cookiesKeys.idToken)?.value;

  return {
    idToken,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

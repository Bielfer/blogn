/* eslint @typescript-eslint/require-await:off */
import type * as trpc from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions,
) => {
  return {
    idToken: opts.req.cookies.idToken,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

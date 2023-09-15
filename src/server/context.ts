/* eslint @typescript-eslint/require-await:off */
import type * as trpc from '@trpc/server';
import { type DecodedIdToken } from 'firebase-admin/auth';

type CreateContextOptions = {
  decodedIdToken: DecodedIdToken | null;
};

export const createContextInner = async (opts: CreateContextOptions) => ({
  decodedIdToken: opts.decodedIdToken,
});

export const createContext = async () => {
  return createContextInner({ decodedIdToken: null });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

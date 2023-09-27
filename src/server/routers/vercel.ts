import { router, privateProcedure } from '~/server/trpc';
import { z } from 'zod';
import { tryCatch } from '~/lib/helpers/try-catch';
import { env } from '~/env.mjs';
import { TRPCError } from '@trpc/server';

type CheckDomain = {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string | null;
  redirectStatusCode?: (307 | 301 | 302 | 308) | null;
  gitBranch?: string | null;
  updatedAt?: number;
  createdAt?: number;
  verified: boolean;
  verification?: {
    type: string;
    domain: string;
    value: string;
    reason: string;
  }[];
};

export const vercelRouter = router({
  checkDomain: privateProcedure
    .input(z.object({ domain: z.string() }))
    .mutation(async ({ input }) => {
      const { domain } = input;

      const [resVerify, errorVerify] = await tryCatch(
        fetch(
          `https://api.vercel.com/v9/projects/${env.VERCEL_PROJECT_ID}/domains/${domain}/verify`,
          {
            headers: {
              Authorization: `Bearer ${env.VERCEL_TOKEN}`,
            },
            method: 'POST',
          }
        )
      );

      if (errorVerify || !resVerify)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: errorVerify });

      const [, errorParsingVerify]: [CheckDomain, any] = await tryCatch(
        resVerify.json()
      );

      if (errorParsingVerify)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: errorParsingVerify });

      const [res, error] = await tryCatch(
        fetch(`https://api.vercel.com/v6/domains/${domain}/config`, {
          headers: {
            Authorization: `Bearer ${env.VERCEL_TOKEN}`,
          },
          method: 'get',
        })
      );

      if (error || !res)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      const [data, errorParsing]: [
        {
          configuredBy?: ('CNAME' | 'A' | 'http') | null;
          acceptedChallenges?: ('dns-01' | 'http-01')[];
          misconfigured: boolean;
        },
        any
      ] = await tryCatch(res.json());

      if (errorParsing)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: errorParsing });

      return {
        ...data,
        isConfigured: !!data.configuredBy && !data.misconfigured,
      };
    }),
  addDomain: privateProcedure
    .input(z.object({ domain: z.string() }))
    .mutation(async ({ input }) => {
      const { domain } = input;

      const [res, error] = await tryCatch(
        fetch(
          `https://api.vercel.com/v10/projects/${env.VERCEL_PROJECT_ID}/domains`,
          {
            headers: {
              Authorization: `Bearer ${env.VERCEL_TOKEN}`,
            },
            body: `{\n  "name": "${domain}"\n}`,
            method: 'POST',
          }
        )
      );

      if (error || !res)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      return {
        message: 'Domain added',
      };
    }),
});

export type VercelRouter = typeof vercelRouter;
